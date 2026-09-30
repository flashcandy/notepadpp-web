import React from 'react';
import {
  FilePlus, FolderOpen, Save, Layers, X, Printer, Scissors, Copy,
  ClipboardPaste, Undo2, Redo2, Search, Replace, ZoomIn, ZoomOut, WrapText,
  AlignLeft, Play, Columns, Moon, Sun, Download, Maximize2, Minimize2,
  FolderTree, BookOpen, Sparkles
} from 'lucide-react';
import { ThemeType } from '../types';

interface ToolbarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onSaveAll: () => void;
  onClose: () => void;
  onCloseAll: () => void;
  onPrint: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFind: () => void;
  onReplace: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleWordWrap: () => void;
  isWordWrap: boolean;
  onToggleWhitespace: () => void;
  isShowWhitespace: boolean;
  onToggleMinimap: () => void;
  isShowMinimap: boolean;
  onToggleSplitView: () => void;
  isSplitView: boolean;
  onRunPreview: () => void;
  currentTheme: ThemeType;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isInstallable: boolean;
  onInstallPWA: () => void;
  isPWAInstalled: boolean;
  onToggleAIAssistant: () => void;
  isAIAssistantOpen: boolean;
  onToggleCopilotBar: () => void;
  isCopilotBarOpen: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onSaveAll,
  onClose,
  onCloseAll,
  onPrint,
  onCut,
  onCopy,
  onPaste,
  onUndo,
  onRedo,
  onFind,
  onReplace,
  onZoomIn,
  onZoomOut,
  onToggleWordWrap,
  isWordWrap,
  onToggleWhitespace,
  isShowWhitespace,
  onToggleMinimap,
  isShowMinimap,
  onToggleSplitView,
  isSplitView,
  onRunPreview,
  currentTheme,
  onToggleTheme,
  onToggleSidebar,
  isSidebarOpen,
  isFullscreen,
  onToggleFullscreen,
  isInstallable,
  onInstallPWA,
  isPWAInstalled,
  onToggleAIAssistant,
  isAIAssistantOpen,
  onToggleCopilotBar,
  isCopilotBarOpen,
}) => {
  return (
    <div className="flex items-center gap-0.5 bg-[#F0EFE7] dark:bg-[#181F2A] border-b border-[#D4D0C8] dark:border-[#2D3748] px-1.5 py-1 text-slate-700 dark:text-slate-300 overflow-x-auto select-none shrink-0 scrollbar-none">
      {/* File Group */}
      <button 
        onClick={onNew} 
        title="New (Ctrl+N)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded hover:border-[#808080] active:scale-95 transition-transform"
      >
        <FilePlus className="w-4 h-4 text-[#D97706] dark:text-[#FBBF24]" />
      </button>

      <button 
        onClick={onOpen} 
        title="Open... (Ctrl+O)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <FolderOpen className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
      </button>

      <button 
        onClick={onSave} 
        title="Save to Local Disk (Ctrl+S)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <Save className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
      </button>

      <button 
        onClick={onSaveAs} 
        title="Save As to Local Disk... (Ctrl+Alt+S / F12)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <Download className="w-4 h-4 text-[#0D9488] dark:text-[#2DD4BF]" />
      </button>

      <button 
        onClick={onSaveAll} 
        title="Save All to Local Disk (Ctrl+Shift+S)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <Layers className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
      </button>

      <button 
        onClick={onClose} 
        title="Close (Ctrl+W)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <X className="w-4 h-4 text-[#DC2626] dark:text-[#F87171]" />
      </button>

      <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Edit Group */}
      <button 
        onClick={onPrint} 
        title="Print... (Ctrl+P)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <Printer className="w-4 h-4" />
      </button>

      <button 
        onClick={onCut} 
        title="Cut (Ctrl+X)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <Scissors className="w-4 h-4" />
      </button>

      <button 
        onClick={onCopy} 
        title="Copy (Ctrl+C)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <Copy className="w-4 h-4" />
      </button>

      <button 
        onClick={onPaste} 
        title="Paste (Ctrl+V)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <ClipboardPaste className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Undo / Redo */}
      <button 
        onClick={onUndo} 
        title="Undo (Ctrl+Z)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <Undo2 className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
      </button>

      <button 
        onClick={onRedo} 
        title="Redo (Ctrl+Y)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <Redo2 className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
      </button>

      <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Search */}
      <button 
        onClick={onFind} 
        title="Find... (Ctrl+F)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <Search className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
      </button>

      <button 
        onClick={onReplace} 
        title="Replace... (Ctrl+H)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <Replace className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
      </button>

      <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Zoom */}
      <button 
        onClick={onZoomIn} 
        title="Zoom In (Ctrl + +)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <button 
        onClick={onZoomOut} 
        title="Zoom Out (Ctrl + -)" 
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* View options */}
      <button 
        onClick={onToggleWordWrap} 
        title="Word Wrap" 
        className={`p-1 rounded transition-colors ${
          isWordWrap 
            ? 'bg-[#316AC5] text-white dark:bg-[#2563EB] shadow-inner' 
            : 'hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748]'
        }`}
      >
        <WrapText className="w-4 h-4" />
      </button>

      <button 
        onClick={onToggleWhitespace} 
        title="Show All Characters / Whitespace" 
        className={`p-1 rounded transition-colors ${
          isShowWhitespace 
            ? 'bg-[#316AC5] text-white dark:bg-[#2563EB] shadow-inner' 
            : 'hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748]'
        }`}
      >
        <AlignLeft className="w-4 h-4" />
      </button>

      <button 
        onClick={onToggleMinimap} 
        title="Document Map (Minimap)" 
        className={`p-1 rounded transition-colors ${
          isShowMinimap 
            ? 'bg-[#316AC5] text-white dark:bg-[#2563EB] shadow-inner' 
            : 'hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748]'
        }`}
      >
        <BookOpen className="w-4 h-4" />
      </button>

      <button 
        onClick={onToggleSplitView} 
        title="Dual View / Split Editor (Ctrl+Alt+S)" 
        className={`p-1 rounded transition-colors ${
          isSplitView 
            ? 'bg-[#316AC5] text-white dark:bg-[#2563EB] shadow-inner' 
            : 'hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748]'
        }`}
      >
        <Columns className="w-4 h-4" />
      </button>

      <button 
        onClick={onToggleSidebar} 
        title="Toggle File Workspace Explorer" 
        className={`p-1 rounded transition-colors ${
          isSidebarOpen 
            ? 'bg-[#316AC5] text-white dark:bg-[#2563EB] shadow-inner' 
            : 'hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748]'
        }`}
      >
        <FolderTree className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Run Demo / Preview */}
      <button 
        onClick={onRunPreview} 
        title="Run / Launch in Preview (F5)" 
        className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition-colors active:scale-95"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span className="hidden sm:inline">Run</span>
      </button>

      <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* AI Assistant Button */}
      <button 
        onClick={onToggleAIAssistant} 
        title="Notepad++ AI Code Assistant (Ctrl+Shift+A)" 
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium transition-all active:scale-95 ${
          isAIAssistantOpen 
            ? 'bg-purple-600 text-white shadow-sm' 
            : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900 border border-purple-300 dark:border-purple-800'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 fill-current" />
        <span className="hidden sm:inline">AI Code</span>
      </button>

      {/* GitHub Copilot Inline Bar Button */}
      <button 
        onClick={onToggleCopilotBar} 
        title="GitHub Copilot Inline Prompt & Analysis (Ctrl+I / Alt+\)" 
        className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold transition-all active:scale-95 ${
          isCopilotBarOpen 
            ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400' 
            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-300 dark:border-blue-800'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 fill-current text-amber-400" />
        <span>Copilot</span>
      </button>

      {/* Spacer to push PWA & theme to right */}
      <div className="flex-1" />

      {/* PWA Install Button */}
      {(!isPWAInstalled || isInstallable) && (
        <button
          onClick={onInstallPWA}
          title="Install Notepad++ as PWA App"
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-colors active:scale-95 whitespace-nowrap mr-1"
        >
          <img src="/icon.svg" alt="App Logo" className="w-3.5 h-3.5" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          <Download className="w-3 h-3" />
          <span className="text-[11px]">Install App</span>
        </button>
      )}

      {/* Theme Toggle */}
      <button
        onClick={onToggleTheme}
        title={`Current Theme: ${currentTheme}. Click to switch theme`}
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        {currentTheme.includes('dark') || currentTheme === 'monokai' || currentTheme === 'dracula' ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700" />
        )}
      </button>

      {/* Fullscreen */}
      <button
        onClick={onToggleFullscreen}
        title="Toggle Fullscreen (F11)"
        className="p-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded active:scale-95 transition-transform"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
