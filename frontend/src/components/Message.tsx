import { X } from 'lucide-react';
import { useEffect } from 'react';

interface MessageProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
}

export const Message = ({ 
  type, 
  message, 
  onClose, 
  autoClose = true 
}: MessageProps) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';

  return (
    <div className={`glass-effect ${bgColor} text-white p-4 rounded-xl border-l-4 ${borderColor} shadow-2xl max-w-md mx-auto mb-6 flex items-center justify-between`}>
      <span className="font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
