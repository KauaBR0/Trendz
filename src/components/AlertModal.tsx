import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AlertModal({ isOpen, onClose, onConfirm }: AlertModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={32} className="text-yellow-500" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-4">Atenção</h2>
        
        <p className="text-sm text-gray-400 mb-8 max-w-[260px]">
          Você tem certeza de que deseja sair do formulário de registro?
        </p>

        <div className="flex gap-4 w-full">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white font-medium py-3 px-4 rounded-xl border border-[#2a2a2a] transition-colors"
          >
            Sair
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Registrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
