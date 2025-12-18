import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  type?: 'alert' | 'confirm' | 'danger';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  content,
  type = 'alert',
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-[#f3f0e6] max-w-lg w-full relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-[#2a2a2a] transform rotate-1 transition-all">
        
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50 pointer-events-none"></div>

        {/* Header */}
        <div className={`p-4 border-b-2 border-[#2a2a2a] flex justify-between items-center relative z-10 
          ${type === 'danger' ? 'bg-red-900 text-white' : 'bg-[#2a2a2a] text-[#f3f0e6]'}`}>
          <h2 className="text-xl font-display tracking-widest uppercase">
            {type === 'danger' ? '⚠️ WARNING' : 'NOTICE'}
          </h2>
          <div className="text-xs font-mono opacity-70">SYSTEM MSG</div>
        </div>

        {/* Content */}
        <div className="p-8 relative z-10">
          <h3 className="text-2xl font-display text-center mb-6 text-[#2a2a2a] border-b-2 border-dashed border-gray-400 pb-4">
            {title}
          </h3>
          
          <div className="font-serif text-lg text-gray-800 leading-relaxed break-keep">
            {content}
          </div>
        </div>

        {/* Footer / Buttons */}
        <div className="p-4 bg-[#e5e5e5] border-t-2 border-[#2a2a2a] flex justify-end gap-3 relative z-10">
          {type !== 'alert' && (
            <Button 
              variant="secondary" 
              onClick={onCancel}
              className="min-w-[100px]"
            >
              {cancelLabel}
            </Button>
          )}
          
          <Button 
            variant={type === 'danger' ? 'danger' : 'primary'} 
            onClick={onConfirm}
            className="min-w-[100px] shadow-lg"
          >
            {confirmLabel}
          </Button>
        </div>

        {/* Decorative Stamps */}
        {type === 'confirm' && (
          <div className="absolute bottom-20 right-8 w-24 h-24 border-4 border-red-700 rounded-full flex items-center justify-center opacity-20 pointer-events-none -rotate-12">
            <span className="text-red-700 font-black text-xs">CONFIDENTIAL</span>
          </div>
        )}
      </div>
    </div>
  );
};