import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, FolderOpen, Save, X, RotateCcw, RotateCw, Scissors, Copy, ClipboardPaste,
  Search, ZoomIn, ZoomOut, Eye, Settings, Play, HelpCircle, Columns, Terminal, Check, Sparkles, Key
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/languages';
import { ThemeType, LineEnding, EncodingType } from '../types';

interface MenuBarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAll: () => void;
  onCloseCurrent: () => void;
  onCloseAll: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onSelectAll: () => void;
  onFind: () => void;
  onReplace: () => void;
  onGotoLine: () => void;
  onToggleWordWrap: () => void;
  isWordWrap: boolean;
  onToggleMinimap: () => void;
  isShowMinimap: boolean;
  onToggleWhitespace: () => void;
  isShowWhitespace: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleSplitView: () => void;
  isSplitView: boolean;
  onRunPreview: () => void;
  onToggleFullscreen: () => void;
  currentTheme: ThemeType;
  onChangeTheme: (theme: ThemeType) => void;
  currentLanguage: string;
  onChangeLanguage: (langId: string) => void;
  currentLineEnding: LineEnding;
  onChangeLineEnding: (ending: LineEnding) => void;
  currentEncoding: EncodingType;
  onChangeEncoding: (encoding: EncodingType) => void;
  onTransform: (action: string) => void;
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onToggleAIAssistant: () => void;
  onOpenAISettings: () => void;
  onToggleCopilot?: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNew,
  onOpen,
  onSave,
  onSaveAll,
  onCloseCurrent,
  onCloseAll,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onSelectAll,
  onFind,
  onReplace,
  onGotoLine,
  onToggleWordWrap,
  isWordWrap,
  onToggleMinimap,
  isShowMinimap,
  onToggleWhitespace,
  isShowWhitespace,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleSplitView,
  isSplitView,
  onRunPreview,
  onToggleFullscreen,
  currentTheme,
  onChangeTheme,
  currentLanguage,
  onChangeLanguage,
  currentLineEnding,
  onChangeLineEnding,
  currentEncoding,
  onChangeEncoding,
  onTransform,
  onOpenShortcuts,
  onOpenAbout,
  onToggleSidebar,
  isSidebarOpen,
  onToggleAIAssistant,
  onOpenAISettings,
  onToggleCopilot,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMouseEnter = (menu: string) => {
    if (activeMenu !== null) {
      setActiveMenu(menu);
    }
  };

  const handleItemClick = (action: () => void) => {
    action();
    setActiveMenu(null);
  };

  return (
    <div 
      ref={menuBarRef} 
      className="relative flex items-center bg-[#ECE9D8] dark:bg-[#1E2530] text-[#111827] dark:text-[#E2E8F0] text-xs font-sans border-b border-[#D4D0C8] dark:border-[#2D3748] px-1 select-none z-40 h-6 shrink-0"
    >
      {/* File Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('file')}
          onMouseEnter={() => handleMouseEnter('file')}
          className={`px-2 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer transition-colors ${
            activeMenu === 'file' ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]' : ''
          }`}
        >
          <span className="underline">F</span>ile
        </button>
        {activeMenu === 'file' && (
          <div className="absolute left-0 top-full mt-0.5 w-60 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(onNew)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> New</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+N</span>
            </button>
            <button onClick={() => handleItemClick(onOpen)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><FolderOpen className="w-3.5 h-3.5" /> Open...</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+O</span>
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleItemClick(onSave)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><Save className="w-3.5 h-3.5" /> Save</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+S</span>
            </button>
            <button onClick={() => handleItemClick(onSaveAll)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><Save className="w-3.5 h-3.5" /> Save All</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+Shift+S</span>
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleItemClick(onCloseCurrent)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><X className="w-3.5 h-3.5" /> Close</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+W</span>
            </button>
            <button onClick={() => handleItemClick(onCloseAll)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Close All</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+Shift+W</span>
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleItemClick(() => window.print())} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Print...</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+P</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('edit')}
          onMouseEnter={() => handleMouseEnter('edit')}
          className={`px-2 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer transition-colors ${
            activeMenu === 'edit' ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]' : ''
          }`}
        >
          <span className="underline">E</span>dit
        </button>
        {activeMenu === 'edit' && (
          <div className="absolute left-0 top-full mt-0.5 w-64 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(onUndo)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><RotateCcw className="w-3.5 h-3.5" /> Undo</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+Z</span>
            </button>
            <button onClick={() => handleItemClick(onRedo)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><RotateCw className="w-3.5 h-3.5" /> Redo</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+Y</span>
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleItemClick(onCut)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><Scissors className="w-3.5 h-3.5" /> Cut</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+X</span>
            </button>
            <button onClick={() => handleItemClick(onCopy)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Copy</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+C</span>
            </button>
            <button onClick={() => handleItemClick(onPaste)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><ClipboardPaste className="w-3.5 h-3.5" /> Paste</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+V</span>
            </button>
            <button onClick={() => handleItemClick(onSelectAll)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Select All</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+A</span>
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <div className="px-3 py-0.5 text-[10px] font-semibold text-gray-500 uppercase">Line Operations</div>
            <button onClick={() => handleItemClick(() => onTransform('sort-asc'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Sort Lines Lexicographically (A → Z)
            </button>
            <button onClick={() => handleItemClick(() => onTransform('sort-desc'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Sort Lines Reverse (Z → A)
            </button>
            <button onClick={() => handleItemClick(() => onTransform('remove-duplicates'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Remove Consecutive Duplicate Lines
            </button>
            <button onClick={() => handleItemClick(() => onTransform('remove-empty'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Remove Empty Lines
            </button>
            <button onClick={() => handleItemClick(() => onTransform('trim-trailing'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Trim Trailing Whitespace
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <div className="px-3 py-0.5 text-[10px] font-semibold text-gray-500 uppercase">Case Conversion</div>
            <button onClick={() => handleItemClick(() => onTransform('uppercase'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              UPPERCASE
            </button>
            <button onClick={() => handleItemClick(() => onTransform('lowercase'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              lowercase
            </button>
            <button onClick={() => handleItemClick(() => onTransform('titlecase'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Proper Case (Title Case)
            </button>
          </div>
        )}
      </div>

      {/* Search Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('search')}
          onMouseEnter={() => handleMouseEnter('search')}
          className={`px-2 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer transition-colors ${
            activeMenu === 'search' ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]' : ''
          }`}
        >
          <span className="underline">S</span>earch
        </button>
        {activeMenu === 'search' && (
          <div className="absolute left-0 top-full mt-0.5 w-60 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(onFind)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><Search className="w-3.5 h-3.5" /> Find...</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+F</span>
            </button>
            <button onClick={() => handleItemClick(onReplace)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Replace...</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+H</span>
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleItemClick(onGotoLine)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Go to Line...</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+G</span>
            </button>
          </div>
        )}
      </div>

      {/* View Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('view')}
          onMouseEnter={() => handleMouseEnter('view')}
          className={`px-2 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer transition-colors ${
            activeMenu === 'view' ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]' : ''
          }`}
        >
          <span className="underline">V</span>iew
        </button>
        {activeMenu === 'view' && (
          <div className="absolute left-0 top-full mt-0.5 w-60 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(onToggleWordWrap)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2">
                {isWordWrap && <Check className="w-3.5 h-3.5 text-blue-500" />} Word Wrap
              </span>
            </button>
            <button onClick={() => handleItemClick(onToggleMinimap)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2">
                {isShowMinimap && <Check className="w-3.5 h-3.5 text-blue-500" />} Document Map (Minimap)
              </span>
            </button>
            <button onClick={() => handleItemClick(onToggleWhitespace)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2">
                {isShowWhitespace && <Check className="w-3.5 h-3.5 text-blue-500" />} Show Whitespace & TAB
              </span>
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleItemClick(onToggleSidebar)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2">
                {isSidebarOpen && <Check className="w-3.5 h-3.5 text-blue-500" />} File Workspace Panel
              </span>
            </button>
            <button onClick={() => handleItemClick(onToggleSplitView)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2">
                {isSplitView && <Check className="w-3.5 h-3.5 text-blue-500" />} Dual View (Split Editor)
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+Alt+S</span>
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleItemClick(onZoomIn)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><ZoomIn className="w-3.5 h-3.5" /> Zoom In</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+Num +</span>
            </button>
            <button onClick={() => handleItemClick(onZoomOut)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><ZoomOut className="w-3.5 h-3.5" /> Zoom Out</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+Num -</span>
            </button>
            <button onClick={() => handleItemClick(onResetZoom)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Reset Zoom</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+Num /</span>
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleItemClick(onToggleFullscreen)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Toggle Fullscreen</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">F11</span>
            </button>
          </div>
        )}
      </div>

      {/* Encoding Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('encoding')}
          onMouseEnter={() => handleMouseEnter('encoding')}
          className={`px-2 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer transition-colors ${
            activeMenu === 'encoding' ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]' : ''
          }`}
        >
          Encodin<span className="underline">g</span>
        </button>
        {activeMenu === 'encoding' && (
          <div className="absolute left-0 top-full mt-0.5 w-52 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(() => onChangeEncoding('UTF-8'))} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Encode in UTF-8</span>
              {currentEncoding === 'UTF-8' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
            <button onClick={() => handleItemClick(() => onChangeEncoding('ANSI'))} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Encode in ANSI</span>
              {currentEncoding === 'ANSI' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <div className="px-3 py-0.5 text-[10px] font-semibold text-gray-500 uppercase">Line Ending Format</div>
            <button onClick={() => handleItemClick(() => onChangeLineEnding('CRLF'))} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Windows (CRLF)</span>
              {currentLineEnding === 'CRLF' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
            <button onClick={() => handleItemClick(() => onChangeLineEnding('LF'))} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Unix / macOS (LF)</span>
              {currentLineEnding === 'LF' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
          </div>
        )}
      </div>

      {/* Language Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('language')}
          onMouseEnter={() => handleMouseEnter('language')}
          className={`px-2 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer transition-colors ${
            activeMenu === 'language' ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]' : ''
          }`}
        >
          <span className="underline">L</span>anguage
        </button>
        {activeMenu === 'language' && (
          <div className="absolute left-0 top-full mt-0.5 w-64 max-h-96 overflow-y-auto bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-lg py-1 z-50 text-xs">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.id}
                onClick={() => handleItemClick(() => onChangeLanguage(lang.id))}
                className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left"
              >
                <span>{lang.name}</span>
                {currentLanguage === lang.id && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Settings / Themes */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('settings')}
          onMouseEnter={() => handleMouseEnter('settings')}
          className={`px-2 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer transition-colors ${
            activeMenu === 'settings' ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]' : ''
          }`}
        >
          <span className="underline">S</span>ettings
        </button>
        {activeMenu === 'settings' && (
          <div className="absolute left-0 top-full mt-0.5 w-56 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-lg py-1 z-50 text-xs">
            <div className="px-3 py-0.5 text-[10px] font-semibold text-gray-500 uppercase">Style Configurator (Themes)</div>
            <button onClick={() => handleItemClick(() => onChangeTheme('npp-classic'))} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Notepad++ Classic (Light)</span>
              {currentTheme === 'npp-classic' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
            <button onClick={() => handleItemClick(() => onChangeTheme('npp-dark'))} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Notepad++ Dark Mode</span>
              {currentTheme === 'npp-dark' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
            <button onClick={() => handleItemClick(() => onChangeTheme('vs-dark'))} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Visual Studio Dark</span>
              {currentTheme === 'vs-dark' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
            <button onClick={() => handleItemClick(() => onChangeTheme('monokai'))} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Monokai</span>
              {currentTheme === 'monokai' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
            <button onClick={() => handleItemClick(() => onChangeTheme('dracula'))} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Dracula</span>
              {currentTheme === 'dracula' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
            <button onClick={() => handleItemClick(() => onChangeTheme('github-light'))} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>GitHub Light</span>
              {currentTheme === 'github-light' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
          </div>
        )}
      </div>

      {/* Tools Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('tools')}
          onMouseEnter={() => handleMouseEnter('tools')}
          className={`px-2 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer transition-colors ${
            activeMenu === 'tools' ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]' : ''
          }`}
        >
          <span className="underline">T</span>ools
        </button>
        {activeMenu === 'tools' && (
          <div className="absolute left-0 top-full mt-0.5 w-60 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-lg py-1 z-50 text-xs">
            <div className="px-3 py-0.5 text-[10px] font-semibold text-gray-500 uppercase">MIME / Encoding Tools</div>
            <button onClick={() => handleItemClick(() => onTransform('base64-encode'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Base64 Encode
            </button>
            <button onClick={() => handleItemClick(() => onTransform('base64-decode'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Base64 Decode
            </button>
            <button onClick={() => handleItemClick(() => onTransform('url-encode'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              URL Encode
            </button>
            <button onClick={() => handleItemClick(() => onTransform('url-decode'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              URL Decode
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <div className="px-3 py-0.5 text-[10px] font-semibold text-gray-500 uppercase">JSON Tools</div>
            <button onClick={() => handleItemClick(() => onTransform('format-json'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Prettify / Format JSON
            </button>
            <button onClick={() => handleItemClick(() => onTransform('minify-json'))} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Minify / Compact JSON
            </button>
          </div>
        )}
      </div>

      {/* AI Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('ai')}
          onMouseEnter={() => handleMouseEnter('ai')}
          className={`px-2 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer transition-colors flex items-center gap-1 ${
            activeMenu === 'ai' ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]' : 'text-purple-700 dark:text-purple-300 font-medium'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span><span className="underline">A</span>I</span>
        </button>
        {activeMenu === 'ai' && (
          <div className="absolute left-0 top-full mt-0.5 w-64 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(() => { if (onToggleCopilot) onToggleCopilot(); })} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left font-medium">
              <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-blue-500 fill-current" /> GitHub Copilot Bar</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+I</span>
            </button>
            <button onClick={() => handleItemClick(onToggleAIAssistant)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left font-medium">
              <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-purple-500" /> AI Assistant Drawer</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">Ctrl+Shift+A</span>
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleItemClick(() => { if (onToggleCopilot) onToggleCopilot(); else onToggleAIAssistant(); })} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Analyze Open Document
            </button>
            <button onClick={() => handleItemClick(() => { if (onToggleCopilot) onToggleCopilot(); else onToggleAIAssistant(); })} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Find & Fix Bugs
            </button>
            <button onClick={() => handleItemClick(() => { if (onToggleCopilot) onToggleCopilot(); else onToggleAIAssistant(); })} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Generate Unit Tests
            </button>
            <button onClick={() => handleItemClick(() => { if (onToggleCopilot) onToggleCopilot(); else onToggleAIAssistant(); })} className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              Refactor & Clean Document
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleItemClick(onOpenAISettings)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><Key className="w-3.5 h-3.5 text-amber-500" /> AI Models & API Keys...</span>
            </button>
          </div>
        )}
      </div>

      {/* Run Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('run')}
          onMouseEnter={() => handleMouseEnter('run')}
          className={`px-2 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer transition-colors ${
            activeMenu === 'run' ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]' : ''
          }`}
        >
          <span className="underline">R</span>un
        </button>
        {activeMenu === 'run' && (
          <div className="absolute left-0 top-full mt-0.5 w-56 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(onRunPreview)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left font-medium">
              <span className="flex items-center gap-2"><Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Launch in Preview</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">F5</span>
            </button>
          </div>
        )}
      </div>

      {/* Help Menu */}
      <div className="relative">
        <button
          onClick={() => handleMenuClick('help')}
          onMouseEnter={() => handleMouseEnter('help')}
          className={`px-2 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer transition-colors ${
            activeMenu === 'help' ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]' : ''
          }`}
        >
          <span className="underline">H</span>elp
        </button>
        {activeMenu === 'help' && (
          <div className="absolute left-0 top-full mt-0.5 w-52 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(onOpenShortcuts)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span>Shortcut Mapper...</span>
            </button>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <button onClick={() => handleItemClick(onOpenAbout)} className="w-full flex items-center justify-between px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left">
              <span className="flex items-center gap-2"><HelpCircle className="w-3.5 h-3.5" /> About Notepad++</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
