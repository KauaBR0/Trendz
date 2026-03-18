import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Modal } from './Modal';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export function RegisterModal({ isOpen, onClose, onLoginClick }: RegisterModalProps) {
  const { signUpWithEmail } = useAuth();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!terms) {
      setErrorMsg('Voce precisa aceitar os termos.');
      return;
    }

    if (!name || !cpf || !phone || !email || !password) {
      setErrorMsg('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { error } = await signUpWithEmail(email, password, {
      name,
      cpf,
      phone,
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg('Conta criada com sucesso! Faca login para continuar.');
    setTimeout(() => {
      onLoginClick();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col">
        {/* Banner */}
        <div className="relative flex h-[127px] items-center justify-between overflow-hidden rounded-t-2xl bg-gradient-to-b from-[#1e1e1e] to-[#262930]/80 p-5 border-b border-[#2a2a2a]">
          <div className="flex flex-col z-10">
            <h2 className="text-2xl font-semibold leading-tight text-white">GANHE <span className="text-lime-500">CASHBACK</span></h2>
            <h2 className="text-2xl font-semibold leading-tight text-white">TODOS OS DIAS</h2>
          </div>
          
          <div className="mr-5 block w-[72px] h-[72px] z-10 text-lime-500 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 22H56L22 50H60" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 w-[250px] opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="z-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)">
                  <path d="M10 15H30L15 30H35" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#z-pattern)" />
            </svg>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-lime-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-white">Cadastro</h3>
          </div>

          {errorMsg ? <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-500">{errorMsg}</div> : null}
          {successMsg ? <div className="mb-4 rounded-xl border border-lime-500/20 bg-lime-500/10 p-3 text-sm font-medium text-lime-500">{successMsg}</div> : null}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome completo"
                className="w-full bg-[#1e1e1e] text-white text-sm rounded-xl px-4 py-3 border border-[#2a2a2a] focus:outline-none focus:border-lime-500 transition-colors placeholder-gray-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white uppercase tracking-wider">CPF</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(event) => setCpf(event.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full bg-[#1e1e1e] text-white text-sm rounded-xl px-4 py-3 border border-[#2a2a2a] focus:outline-none focus:border-lime-500 transition-colors placeholder-gray-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white uppercase tracking-wider">Telefone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-[#1e1e1e] text-white text-sm rounded-xl px-4 py-3 border border-[#2a2a2a] focus:outline-none focus:border-lime-500 transition-colors placeholder-gray-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Ex: joao@gmail.com"
                className="w-full bg-[#1e1e1e] text-white text-sm rounded-xl px-4 py-3 border border-[#2a2a2a] focus:outline-none focus:border-lime-500 transition-colors placeholder-gray-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Crie uma senha forte"
                className="w-full bg-[#1e1e1e] text-white text-sm rounded-xl px-4 py-3 border border-[#2a2a2a] focus:outline-none focus:border-lime-500 transition-colors placeholder-gray-600"
              />
            </div>

            <div className="flex items-start gap-3 mt-6">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={terms}
                  onChange={(event) => setTerms(event.target.checked)}
                  className="w-4 h-4 rounded border-[#2a2a2a] bg-[#1e1e1e] text-lime-500 focus:ring-lime-500 focus:ring-offset-[#121212]"
                />
              </div>
              <label htmlFor="terms" className="text-xs text-gray-400 leading-tight">
                Confirmo que <span className="text-lime-500 font-medium">tenho mais de 18 anos</span> e aceito os <a href="#" className="underline hover:text-white">Termos e Condições</a> e a <a href="#" className="underline hover:text-white">Política de Privacidade</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-lime-500 hover:bg-lime-400 text-black font-bold py-3.5 rounded-xl transition-colors mt-6 disabled:opacity-50"
            >
              CADASTRAR
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Já possui acesso?{' '}
              <button onClick={onLoginClick} type="button" className="text-lime-500 font-bold hover:underline">
                Entre aqui
              </button>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
