import { Modal } from './Modal';
import { useApp } from '../context/AppContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useApp();

  const handleLogin = () => {
    login();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-lime-500 rounded-lg flex items-center justify-center text-black font-bold text-3xl mb-6">
          Z
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-8">Bem vindo a Trendzbr</h2>

        <div className="w-full space-y-3">
          <button 
            onClick={handleLogin}
            className="w-full bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white font-medium py-3 px-4 rounded-xl border border-[#2a2a2a] transition-colors flex items-center justify-center gap-3"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue com Google
          </button>
          
          <button 
            onClick={handleLogin}
            className="w-full bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white font-medium py-3 px-4 rounded-xl border border-[#2a2a2a] transition-colors flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="white" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
            Continue com Apple
          </button>

          <div className="relative mt-4">
            <input
              type="email"
              placeholder="Endereço de Email"
              className="w-full bg-[#1e1e1e] text-white text-sm rounded-xl pl-4 pr-24 py-3 border border-[#2a2a2a] focus:outline-none focus:border-lime-500 transition-colors placeholder-gray-500"
            />
            <button 
              onClick={handleLogin}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-lime-500/20 hover:bg-lime-500/30 text-lime-500 text-xs font-bold px-4 rounded-lg transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>

        <div className="w-full flex items-center gap-4 my-6">
          <div className="h-px bg-[#2a2a2a] flex-1"></div>
          <span className="text-gray-500 text-xs font-medium uppercase">ou</span>
          <div className="h-px bg-[#2a2a2a] flex-1"></div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={handleLogin}
            className="w-12 h-12 bg-[#1e1e1e] hover:bg-[#2a2a2a] rounded-xl border border-[#2a2a2a] flex items-center justify-center transition-colors"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#5865F2]"><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M7.5 16.5c1.5 1 4.5 1 6 0"></path><path d="M5.07 4.31A19.9 19.9 0 0 0 1 10c0 5.5 3.5 10 8 10 1.5 0 2.5-1 4-1s2.5 1 4 1c4.5 0 8-4.5 8-10 0-5.69-4.07-5.69-4.07-5.69-1.5-1-3.5-1-5.5-1-1 0-2 1-3 1s-2-1-3-1c-2 0-4 0-5.5 1Z"></path></svg>
          </button>
          <button 
            onClick={handleLogin}
            className="w-12 h-12 bg-[#1e1e1e] hover:bg-[#2a2a2a] rounded-xl border border-[#2a2a2a] flex items-center justify-center transition-colors"
          >
            <div className="w-5 h-5 bg-yellow-400 rounded-sm flex items-center justify-center text-black font-bold text-xs">S</div>
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 max-w-[280px]">
          Ao continuar, você concorda com nossos <a href="#" className="underline hover:text-gray-300">Política de Privacidade</a> e <a href="#" className="underline hover:text-gray-300">Termos de Uso</a>.
        </p>
      </div>
    </Modal>
  );
}
