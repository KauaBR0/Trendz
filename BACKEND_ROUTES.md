# Rotas de Backend necessárias para o frontend (Trendz)

Este documento lista as rotas que o frontend atual já precisa para funcionar sem mocks.

## Premissas

- Base URL sugerida: `/api/v1`
- Autenticação: `Authorization: Bearer <token>`
- Formato de resposta de erro (padrão):

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Mensagem amigável"
  }
}
```

---

## 1) Autenticação e usuário

### `POST /auth/register`
Cria conta via formulário de cadastro.

**Body**
```json
{
  "cpf": "00000000000",
  "phone": "5511999999999",
  "email": "user@email.com",
  "acceptTerms": true,
  "isAdult": true
}
```

**Response `201`**
```json
{
  "user": {
    "id": "u_123",
    "name": "João Silva",
    "email": "user@email.com",
    "avatar": "https://...",
    "balance": 150.0
  },
  "accessToken": "jwt",
  "refreshToken": "jwt"
}
```

---

### `POST /auth/login`
Login por email (ou provedor social, conforme estratégia).

**Body (email)**
```json
{
  "email": "user@email.com"
}
```

**Response `200`**
```json
{
  "user": {
    "id": "u_123",
    "name": "João Silva",
    "email": "user@email.com",
    "avatar": "https://...",
    "balance": 150.0
  },
  "accessToken": "jwt",
  "refreshToken": "jwt"
}
```

---

### `POST /auth/logout`
Encerra sessão (invalidar refresh token).

**Response `204`** sem body.

---

### `GET /users/me`
Retorna usuário logado e saldo atual.

**Response `200`**
```json
{
  "id": "u_123",
  "name": "João Silva",
  "email": "user@email.com",
  "avatar": "https://...",
  "balance": 137.5
}
```

---

## 2) Mercados

### `GET /markets`
Lista mercados para Home, Sidebar, busca e seções (Tendências/Celebridades).

**Query params sugeridos**
- `q` (busca por título/categoria)
- `category` (ex.: `Celebridades`, `Política`)
- `type` (`binary` | `multiple`)
- `featured=true` (opcional para banners/tendências)
- `page`, `pageSize`

**Response `200`**
```json
{
  "items": [
    {
      "id": "bbb26",
      "title": "Quem vencerá o BBB 26?",
      "image": "https://...",
      "type": "multiple",
      "category": "Entretenimento",
      "volume": 4243.78,
      "endDate": "2026-04-21T23:59:59Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 85
}
```

---

### `GET /markets/:marketId`
Detalhe do mercado para página `/market/:id`.

**Response `200` (mercado múltiplo)**
```json
{
  "id": "bbb26",
  "title": "Quem vencerá o BBB 26?",
  "image": "https://...",
  "type": "multiple",
  "category": "Entretenimento",
  "volume": 4243.78,
  "endDate": "2026-04-21T23:59:59Z",
  "rules": "...",
  "options": [
    {
      "id": "opt1",
      "name": "Milena",
      "image": "https://...",
      "chance": 50,
      "yesOdds": 1.07,
      "noOdds": 1.07
    }
  ]
}
```

**Response `200` (mercado binário)**
```json
{
  "id": "trump-iran",
  "title": "Trump declarará o fim das operações...",
  "image": "https://...",
  "type": "binary",
  "category": "Política",
  "volume": 218.42,
  "endDate": "2026-03-31T23:59:59Z",
  "rules": "...",
  "binaryData": {
    "yesChance": 22,
    "noChance": 78,
    "yesOdds": 1.38,
    "noOdds": 1.22
  }
}
```

---

### `GET /markets/:marketId/activity`
Histórico de atividade exibido na página de detalhe.

**Query params sugeridos**: `page`, `pageSize`

**Response `200`**
```json
{
  "items": [
    {
      "id": "act_1",
      "user": "HN7u...kD56q",
      "action": "comprou",
      "choice": "Sim",
      "amount": 9.89,
      "contracts": 2.29,
      "createdAt": "2026-03-14T12:00:00Z",
      "avatar": "https://..."
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 120
}
```

---

## 3) Apostas (RightSidebar)

### `POST /bets`
Cria aposta quando o usuário confirma previsão.

**Body**
```json
{
  "marketId": "bbb26",
  "optionId": "opt1",
  "choice": "Sim",
  "amount": 10.0
}
```

> `optionId` pode ser `null` para mercado binário.

**Response `201`**
```json
{
  "id": "bet_123",
  "marketId": "bbb26",
  "marketTitle": "Quem vencerá o BBB 26?",
  "optionName": "Milena",
  "choice": "Sim",
  "amount": 10.0,
  "odds": 1.07,
  "potentialReturn": 10.7,
  "status": "open",
  "createdAt": "2026-03-16T20:10:00Z",
  "userBalance": 140.0
}
```

---

### `GET /bets`
Lista apostas do usuário para aba "Abertas".

**Query params sugeridos**
- `status=open|resolved|canceled` (frontend atual usa `open`)
- `page`, `pageSize`

**Response `200`**
```json
{
  "items": [
    {
      "id": "bet_123",
      "marketId": "bbb26",
      "marketTitle": "Quem vencerá o BBB 26?",
      "optionName": "Milena",
      "choice": "Sim",
      "amount": 10.0,
      "odds": 1.07,
      "potentialReturn": 10.7,
      "status": "open",
      "createdAt": "2026-03-16T20:10:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 8
}
```

---

## 4) Endpoints opcionais (logo após MVP)

### `GET /categories`
Pode evitar cálculo de categorias no frontend e permitir ordenação/contadores no backend.

### `POST /markets/:marketId/favorite`
Suporta botão de favorito (ícone já existe na UI).

### `GET /wallet/transactions`
Histórico de saldo para auditoria financeira.

---

## 5) Checklist de cobertura do frontend atual

- [x] Login/cadastro/logout
- [x] Usuário logado + saldo
- [x] Lista de mercados com busca/categoria
- [x] Detalhe do mercado (`binary` e `multiple`)
- [x] Atividade do mercado
- [x] Criar aposta
- [x] Listar apostas abertas

Com essas rotas, o frontend atual pode sair de mocks e operar totalmente via backend.
