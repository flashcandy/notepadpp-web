import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'File Operations',
      items: [
        { key: 'Ctrl + N', desc: 'Create new document' },
        { key: 'Ctrl + O', desc: 'Open file from computer' },
        { key: 'Ctrl + S', desc: 'Save current document' },
        { key: 'Ctrl + Shift + S', desc: 'Save all documents' },
        { key: 'Ctrl + W', desc: 'Close active document tab' },
        { key: 'Ctrl + P', desc: 'Print document' },
      ],
    },
    {
      title: 'Editing & Search',
      items: [
        { key: 'Ctrl + Z', desc: 'Undo last change' },
        { key: 'Ctrl + Y', desc: 'Redo last change' },
        { key: 'Ctrl + F', desc: 'Find in active document' },
        { key: 'Ctrl + H', desc: 'Replace in document' },
        { key: 'Ctrl + G', desc: 'Go to line' },
        { key: 'Ctrl + A', desc: 'Select all text' },
      ],
    },
    {
      title: 'AI & GitHub Copilot',
      items: [
        { key: 'Ctrl + I / Alt + \\', desc: 'GitHub Copilot Inline Prompt & Document Analysis' },
        { key: 'Ctrl + Shift + A', desc: 'Toggle AI Code Assistant Drawer' },
        { key: '1-Click Insert', desc: 'Directly inject code at cursor without manual copy' },
        { key: '1-Click Replace', desc: 'Replace entire file content with generated code' },
        { key: '1-Click New Tab', desc: 'Save generated code into a new document tab' },
      ],
    },
    {
      title: 'View & Navigation',
      items: [
        { key: 'Ctrl + Alt + S', desc: 'Toggle Dual Split View (side-by-side)' },
        { key: 'Ctrl + + / -', desc: 'Zoom in / Zoom out' },
        { key: 'Ctrl + /', desc: 'Reset zoom to 100%' },
        { key: 'F5', desc: 'Run / Live Preview' },
        { key: 'F11', desc: 'Toggle Fullscreen' },
      ],
    },
    {
      title: 'Drag & Drop & Tabs',
      items: [
        { key: 'Drag & Drop', desc: 'Drop files anywhere to open instantly' },
        { key: 'Double-Click Tab Area', desc: 'Create new document' },
        { key: 'Right-Click Tab', desc: 'Open tab context menu (Clone to view, etc.)' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="w-full max-w-lg bg-[#ECE9D8] dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] rounded shadow-2xl text-xs text-slate-800 dark:text-slate-200 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-[#0055EA] dark:bg-[#2563EB] text-white font-medium select-none">
          <div className="flex items-center gap-1.5">
            <Keyboard className="w-4 h-4" />
            <span>Notepad++ Shortcut Mapper</span>
          </div>
          <button onClick={onClose} className="p-0.5 hover:bg-red-500 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 border-b border-[#D4D0C8] dark:border-[#374151] pb-1 mb-2 text-xs uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded text-[11px]">
                    <span className="text-slate-600 dark:text-slate-300">{item.desc}</span>
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded text-[10px] font-mono font-medium text-blue-600 dark:text-blue-400">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end p-3 border-t border-[#D4D0C8] dark:border-[#2D3748] bg-[#F5F4EC] dark:bg-[#181F2A]">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-gray-400 dark:border-gray-600 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
