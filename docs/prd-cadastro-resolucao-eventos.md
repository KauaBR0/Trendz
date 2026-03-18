# PRD - Cadastro e Resolucao de Eventos

## Contexto

A Trendz precisa de um fluxo confiavel para criar, revisar, publicar e resolver eventos/mercados dentro da plataforma. O objetivo deste PRD e alinhar produto, operacao e tecnologia para que a publicacao de mercados aconteca com qualidade editorial, regras claras e baixa ambiguidade.

## Problema

Hoje, a principal duvida estrategica e como os eventos devem entrar na plataforma. Um modelo muito aberto tende a gerar mercados mal definidos, com criterio de resolucao fraco e alto risco operacional. Um modelo muito manual reduz escala. Precisamos de um processo que permita qualidade no MVP e automacao progressiva depois.

## Proposta

Adotar um modelo de curadoria editorial com suporte operacional no admin:

- `Evento` representa o fato real que sera acompanhado.
- `Mercado` representa a pergunta negociavel vinculada ao evento.
- A criacao comeca manual, com templates por categoria.
- A publicacao exige revisao antes de ir ao ar.
- A resolucao deve sempre apontar fonte oficial e manter trilha de auditoria.

## Objetivos

- Permitir cadastro estruturado de eventos e mercados.
- Reduzir ambiguidade na formulacao das perguntas.
- Garantir fluxo de revisao antes da publicacao.
- Padronizar resolucao com fonte, justificativa e historico.
- Criar base para futura automacao de sugestao/importacao.

## Nao objetivos

- Liberar criacao publica de mercados por usuarios no MVP.
- Construir automacao completa de descoberta e publicacao nesta fase.
- Implementar motor avancado de risco e exposicao nesta primeira versao.

## Usuarios envolvidos

- Operador editorial: cria rascunhos de eventos e mercados.
- Revisor: valida texto, datas, fontes e regras.
- Admin: publica, cancela, edita e resolve mercados.
- Usuario final: visualiza e opera apenas mercados publicados.

## Escopo funcional

### 1. Cadastro de evento

O admin deve conseguir criar um evento com:

- titulo do evento
- categoria
- subtipo
- descricao curta
- tags
- imagem/capa
- pais/regiao
- data principal do evento
- status do evento

### 2. Cadastro de mercado

Cada evento pode ter um ou mais mercados. O admin deve informar:

- titulo/pergunta do mercado
- tipo do mercado: `binario` ou `multipla escolha`
- opcoes do mercado
- data e hora de fechamento
- regras de resolucao
- criterios de cancelamento
- fontes oficiais aceitas
- observacoes operacionais

### 3. Templates por categoria

O sistema deve oferecer templates para acelerar criacao e manter padrao.

Exemplos:

- Politica: `X acontecera ate DD/MM/AAAA?`
- Reality/Entretenimento: `Quem vencera X?`
- Esportes: `Quem vencera a partida/torneio?`
- Economia: `Ativo fecha acima/abaixo de Y na data Z?`

### 4. Workflow operacional

Cada mercado deve passar pelos estados:

- `rascunho`
- `em_revisao`
- `aprovado`
- `publicado`
- `travado`
- `em_resolucao`
- `resolvido`
- `cancelado`

Regras:

- apenas mercados `publicados` aparecem para usuarios finais
- mercados `travados` nao aceitam novas operacoes
- mercados `em_resolucao` aguardam confirmacao oficial
- mercados `cancelados` exigem motivo registrado

### 5. Revisao e governanca

O sistema deve registrar:

- quem criou
- quem revisou
- quem publicou
- quem resolveu
- data/hora de cada acao
- motivo de alteracoes relevantes
- historico de versoes do mercado

### 6. Resolucao

Ao resolver um mercado, o admin deve informar:

- resultado final
- fonte usada
- link ou referencia da evidencia
- justificativa opcional/obrigatoria conforme categoria
- data/hora da resolucao

## Requisitos de produto

### Requisitos funcionais

- criar, editar, duplicar e arquivar eventos
- criar um ou varios mercados por evento
- salvar mercados como rascunho
- enviar mercado para revisao
- aprovar e publicar mercado
- travar mercado manualmente ou por horario
- resolver ou cancelar mercado
- listar mercados por status no admin
- pesquisar por categoria, titulo, tag e data

### Requisitos nao funcionais

- historico auditavel de alteracoes
- textos padronizados e objetivos
- interface simples para operacao rapida
- suporte a desktop e tablet no admin
- baixo risco de erro humano na resolucao

## Regras de negocio

- todo mercado precisa de pelo menos uma fonte oficial ou publica de referencia
- perguntas ambiguas nao podem ser publicadas
- mercados sem criterio de resolucao claro nao podem sair de `rascunho`
- mercados publicados nao devem ter a pergunta alterada sem gerar nova revisao
- apenas perfis autorizados podem publicar e resolver
- um admin nao deve resolver mercado sem evidenciar a fonte

## UX esperada no admin

### Tela 1. Lista de eventos

- tabela com filtros por status, categoria e periodo
- CTA para `Novo evento`
- acesso rapido aos mercados vinculados

### Tela 2. Wizard de criacao de mercado

Etapas sugeridas:

1. Dados do evento
2. Estrutura do mercado
3. Regras e fontes
4. Revisao final

### Tela 3. Fila de revisao

- mercados `em_revisao`
- checklist de validacao
- aprovar, devolver ou cancelar

### Tela 4. Painel de resolucao

- mercados proximos de fechamento
- mercados travados aguardando resolucao
- formulario de resultado com evidencia

## Modelo conceitual de dados

### Entidades principais

#### Event

- id
- title
- category
- subtype
- description
- image_url
- region
- event_date
- status
- created_by
- reviewed_by
- published_by
- created_at
- updated_at

#### Market

- id
- event_id
- question
- market_type
- close_at
- status
- resolution_rule
- cancellation_rule
- official_sources
- resolution_result
- resolution_source
- resolution_notes
- resolved_by
- resolved_at
- created_at
- updated_at

#### MarketOption

- id
- market_id
- label
- order
- status

#### MarketAuditLog

- id
- market_id
- action
- actor_id
- payload_snapshot
- reason
- created_at

## Sucesso e metricas

### Metricas operacionais

- tempo medio de criacao de mercado
- tempo medio entre rascunho e publicacao
- tempo medio entre fechamento e resolucao
- taxa de cancelamento de mercados
- taxa de retrabalho por revisao

### Metricas de qualidade

- percentual de mercados com revisao concluida antes de publicar
- numero de disputas/contestacoes por resolucao
- numero de correcoes pos-publicacao

## Riscos

- ambiguidade na formulacao do mercado
- resolucao sem fonte robusta
- gargalo operacional em revisao manual
- alta dependencia de poucos admins
- inconsistencias entre horario de fechamento e horario do evento

## Roadmap sugerido

### Fase 1 - MVP curado

- cadastro manual de eventos
- cadastro manual de mercados
- templates por categoria
- workflow de revisao
- resolucao manual com auditoria

### Fase 2 - Escala assistida

- duplicacao inteligente de mercados
- sugestao automatica de campos
- alertas de fechamento e resolucao
- importacao de agenda/eventos como rascunho

### Fase 3 - Inteligencia operacional

- sugestao de mercados com IA
- priorizacao por interesse/trafego
- score de risco editorial
- automacao parcial de monitoramento de fontes

## Criterios de aceite

- admin consegue criar um evento e ao menos um mercado vinculado
- mercado pode ser salvo como rascunho e enviado para revisao
- mercado aprovado pode ser publicado manualmente
- mercado publicado pode ser travado e depois resolvido
- toda resolucao salva fonte e responsavel
- sistema registra historico basico de alteracoes

## Decisao recomendada

Para o momento atual da Trendz, a melhor decisao e operar com curadoria editorial e workflow de aprovacao. Isso da mais controle, reduz erro operacional e cria a fundacao correta para automacao futura sem comprometer confianca da plataforma.
