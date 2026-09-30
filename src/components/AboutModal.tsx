import React from 'react';
import { X, ExternalLink, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="w-full max-w-md bg-[#ECE9D8] dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] rounded shadow-2xl text-xs text-slate-800 dark:text-slate-200 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0055EA] dark:bg-[#2563EB] text-white font-medium select-none">
          <span>About Notepad++ Web Edition</span>
          <button onClick={onClose} className="p-0.5 hover:bg-red-500 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/icon.svg" 
              alt="Notepad++ Logo" 
              className="w-20 h-20 shadow-md rounded-2xl" 
            />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Notepad++ Web Edition
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              v8.7.1 Web & PWA (64-bit Browser Engine)
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left bg-white dark:bg-slate-800 p-3 rounded border border-gray-300 dark:border-gray-700">
            A free, feature-rich source code and note editor inspired by the classic Notepad++.
            Powered by <strong>React</strong>, <strong>Monaco Editor</strong>, and modern Web APIs.
            Features syntax highlighting for 30+ languages, drag-and-drop loading, dual split-view,
            local persistent storage, and installable PWA support.
          </p>

          <div className="text-[11px] text-slate-500 space-y-1">
            <p>Based on the powerful Monaco Code Editor component.</p>
            <p className="flex items-center justify-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for developers everywhere.
            </p>
          </div>
        </div>

        <div className="flex justify-end p-3 border-t border-[#D4D0C8] dark:border-[#2D3748] bg-[#F5F4EC] dark:bg-[#181F2A]">
          <button
            onClick={onClose}
            className="px-5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-gray-400 dark:border-gray-600 rounded font-medium"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
