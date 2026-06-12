import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-mariscos-900 border border-brass p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="w-16 h-16 text-brass mx-auto mb-4" />
        <h2 className="text-2xl font-display text-brass mb-2">¡SOLICITUD ENVIADA!</h2>
        <p className="text-mariscos-200 mb-6">
          Los datos llegaron al sistema correctamente. Nuestro equipo se pondrá en contacto contigo vía WhatsApp.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-brass hover:bg-brass-light text-mariscos-900 font-bold py-3 rounded-lg transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
