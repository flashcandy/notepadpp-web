import React from 'react';
import { Undo2, Redo2, CornerDownLeft, Save, Search } from 'lucide-react';

interface MobileQuickBarProps {
  onInsertText: (text: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onSearch: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  onInsertText,
  onUndo,
  onRedo,
  onSave,
  onSearch,
}) => {
  const quickKeys = [
    { label: 'Tab', val: '    ' },
    { label: '{', val: '{' },
    { label: '}', val: '}' },
    { label: '(', val: '(' },
    { label: ')', val: ')' },
    { label: '[', val: '[' },
    { label: ']', val: ']' },
    { label: ';', val: ';' },
    { label: '=', val: '=' },
    { label: ':', val: ':' },
    { label: '"', val: '"' },
    { label: "'", val: "'" },
    { label: '<', val: '<' },
    { label: '>', val: '>' },
    { label: '/', val: '/' },
    { label: '\\', val: '\\' },
    { label: '$', val: '$' },
    { label: '!', val: '!' },
    { label: '&', val: '&' },
    { label: '|', val: '|' },
    { label: '#', val: '#' },
    { label: '_', val: '_' },
    { label: '-', val: '-' },
    { label: '+', val: '+' },
  ];

  return (
    <div className="flex md:hidden items-center gap-1 p-1 bg-[#ECE9D8] dark:bg-[#151D28] border-t border-[#D4D0C8] dark:border-[#2D3748] overflow-x-auto scrollbar-none z-30 select-none">
      <button
        onClick={onUndo}
        className="px-2 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-300 dark:border-gray-700 rounded text-xs shrink-0 active:bg-blue-100"
        title="Undo"
      >
        <Undo2 className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={onRedo}
        className="px-2 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-300 dark:border-gray-700 rounded text-xs shrink-0 active:bg-blue-100"
        title="Redo"
      >
        <Redo2 className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={onSave}
        className="px-2 py-1 bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 border border-gray-300 dark:border-gray-700 rounded text-xs shrink-0 active:bg-blue-100"
        title="Save"
      >
        <Save className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={onSearch}
        className="px-2 py-1 bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-gray-300 dark:border-gray-700 rounded text-xs shrink-0 active:bg-blue-100"
        title="Search"
      >
        <Search className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-0.5 shrink-0" />

      {quickKeys.map((k, idx) => (
        <button
          key={idx}
          onClick={() => onInsertText(k.val)}
          className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-300 dark:border-gray-700 rounded text-xs font-mono font-medium shrink-0 active:bg-blue-500 active:text-white transition-colors"
        >
          {k.label}
        </button>
      ))}
    </div>
  );
};
