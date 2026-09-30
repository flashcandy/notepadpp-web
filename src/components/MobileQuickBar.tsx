import React, { useState } from 'react';
import { Undo2, Redo2, Save, Search, ChevronDown, ChevronUp, Keyboard } from 'lucide-react';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  if (isCollapsed) {
    return (
      <div className="flex md:hidden items-center justify-between px-2 py-0.5 bg-[#ECE9D8] dark:bg-[#151D28] border-t border-[#D4D0C8] dark:border-[#2D3748] text-[10px] text-slate-500 z-30 select-none h-5">
        <span className="flex items-center gap-1 font-mono">
          <Keyboard className="w-2.5 h-2.5" /> Keys hidden
        </span>
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-0.5 px-1.5 py-0.2 bg-white dark:bg-slate-800 rounded border border-gray-300 dark:border-gray-700 text-[10px] text-blue-600 dark:text-blue-400"
        >
          <ChevronUp className="w-2.5 h-2.5" />
          <span>Show Touch Keys</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex md:hidden items-center gap-1 px-1 py-0.5 bg-[#ECE9D8] dark:bg-[#151D28] border-t border-[#D4D0C8] dark:border-[#2D3748] overflow-x-auto scrollbar-none z-30 select-none h-7 shrink-0">
      <button
        onClick={onUndo}
        className="px-1.5 h-5.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-300 dark:border-gray-700 rounded text-xs shrink-0 active:bg-blue-100 flex items-center justify-center"
        title="Undo"
      >
        <Undo2 className="w-3 h-3" />
      </button>

      <button
        onClick={onRedo}
        className="px-1.5 h-5.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-300 dark:border-gray-700 rounded text-xs shrink-0 active:bg-blue-100 flex items-center justify-center"
        title="Redo"
      >
        <Redo2 className="w-3 h-3" />
      </button>

      <button
        onClick={onSave}
        className="px-1.5 h-5.5 bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 border border-gray-300 dark:border-gray-700 rounded text-xs shrink-0 active:bg-blue-100 flex items-center justify-center"
        title="Save"
      >
        <Save className="w-3 h-3" />
      </button>

      <button
        onClick={onSearch}
        className="px-1.5 h-5.5 bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-gray-300 dark:border-gray-700 rounded text-xs shrink-0 active:bg-blue-100 flex items-center justify-center"
        title="Search"
      >
        <Search className="w-3 h-3" />
      </button>

      <div className="w-[1px] h-3.5 bg-gray-300 dark:bg-gray-700 mx-0.5 shrink-0" />

      {quickKeys.map((k, idx) => (
        <button
          key={idx}
          onClick={() => onInsertText(k.val)}
          className="px-1.5 h-5.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-300 dark:border-gray-700 rounded text-[11px] font-mono font-medium shrink-0 active:bg-blue-500 active:text-white transition-colors flex items-center justify-center"
        >
          {k.label}
        </button>
      ))}

      {/* Collapse button */}
      <button
        onClick={() => setIsCollapsed(true)}
        className="px-1 h-5.5 bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] shrink-0 ml-1 flex items-center gap-0.5"
        title="Hide Touch Keys"
      >
        <ChevronDown className="w-3 h-3" />
      </button>
    </div>
  );
};
