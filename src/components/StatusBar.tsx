import React, { useState } from 'react';
import { Wifi, WifiOff, Globe, HardDrive } from 'lucide-react';
import { CursorInfo, LineEnding, EncodingType } from '../types';
import { SUPPORTED_LANGUAGES, getLanguageById } from '../utils/languages';

interface StatusBarProps {
  cursorInfo: CursorInfo;
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
  lineEnding: LineEnding;
  onChangeLineEnding: (ending: LineEnding) => void;
  encoding: EncodingType;
  onChangeEncoding: (encoding: EncodingType) => void;
  fontSize: number;
  onResetZoom: () => void;
  isReadOnly: boolean;
  onToggleReadOnly: () => void;
  isOnline: boolean;
  insertMode: 'INS' | 'OVR';
  onToggleInsertMode: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  cursorInfo,
  currentLanguage,
  onChangeLanguage,
  lineEnding,
  onChangeLineEnding,
  encoding,
  onChangeEncoding,
  fontSize,
  onResetZoom,
  isReadOnly,
  onToggleReadOnly,
  isOnline,
  insertMode,
  onToggleInsertMode,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langObj = getLanguageById(currentLanguage);

  return (
    <div className="relative flex items-center bg-[#ECE9D8] dark:bg-[#181F2A] border-t border-[#D4D0C8] dark:border-[#2D3748] text-slate-800 dark:text-slate-300 text-[10px] sm:text-[11px] font-sans h-5.5 sm:h-6 px-1 select-none shrink-0 overflow-x-auto scrollbar-none">
      {/* Panel 1: Cursor line & col */}
      <div className="px-1.5 sm:px-2 py-0.5 border-r border-[#D4D0C8] dark:border-[#2D3748] whitespace-nowrap min-w-[70px] sm:min-w-[130px] font-mono tabular-nums">
        <span className="sm:hidden">L:{cursorInfo.lineNumber} C:{cursorInfo.column}</span>
        <span className="hidden sm:inline">Ln : {cursorInfo.lineNumber} , Col : {cursorInfo.column} , Sel : {cursorInfo.selectionLength}</span>
      </div>

      {/* Panel 2: Length and Lines (Hidden on small mobile) */}
      <div className="hidden sm:block px-2 py-0.5 border-r border-[#D4D0C8] dark:border-[#2D3748] whitespace-nowrap min-w-[140px] font-mono tabular-nums">
        Length : {cursorInfo.totalLength.toLocaleString()}  Lines : {cursorInfo.totalLines.toLocaleString()}
      </div>

      {/* Panel 3: Line ending CRLF / LF */}
      <button
        onClick={() => onChangeLineEnding(lineEnding === 'CRLF' ? 'LF' : 'CRLF')}
        title="Click to toggle Windows (CRLF) / Unix (LF)"
        className="px-1.5 sm:px-2 py-0.5 border-r border-[#D4D0C8] dark:border-[#2D3748] whitespace-nowrap hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
      >
        <span className="sm:hidden">{lineEnding}</span>
        <span className="hidden sm:inline">{lineEnding === 'CRLF' ? 'Windows (CRLF)' : 'Unix (LF)'}</span>
      </button>

      {/* Panel 4: Encoding */}
      <button
        onClick={() => onChangeEncoding(encoding === 'UTF-8' ? 'ANSI' : 'UTF-8')}
        title="Click to toggle UTF-8 / ANSI"
        className="px-1.5 sm:px-2 py-0.5 border-r border-[#D4D0C8] dark:border-[#2D3748] whitespace-nowrap hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
      >
        {encoding}
      </button>

      {/* Panel 5: Insert Mode INS / OVR */}
      <button
        onClick={onToggleInsertMode}
        title="Click to toggle INS / OVR"
        className="px-1.5 sm:px-2 py-0.5 border-r border-[#D4D0C8] dark:border-[#2D3748] whitespace-nowrap font-mono hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
      >
        {insertMode}
      </button>

      {/* Panel 6: Language selector popup */}
      <div className="relative">
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          title="Click to change programming syntax"
          className="px-1.5 sm:px-2 py-0.5 border-r border-[#D4D0C8] dark:border-[#2D3748] whitespace-nowrap hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] cursor-pointer font-medium"
        >
          {langObj.name.split('(')[0].trim()}
        </button>

        {showLangMenu && (
          <div 
            className="fixed bottom-7 left-2 right-2 sm:left-auto sm:right-auto sm:w-56 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-2xl rounded max-h-60 sm:max-h-72 overflow-y-auto py-1 z-50 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1 font-semibold text-slate-500 border-b border-gray-200 dark:border-gray-700 text-[10px] uppercase">
              Select Syntax Highlighting
            </div>
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  onChangeLanguage(l.id);
                  setShowLangMenu(false);
                }}
                className={`w-full px-3 py-1 text-left hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] truncate ${
                  currentLanguage === l.id ? 'bg-blue-100 dark:bg-blue-900/50 font-semibold' : ''
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Panel 7: Zoom Level */}
      <button
        onClick={onResetZoom}
        title="Click to reset zoom to 100%"
        className="px-2 py-0.5 border-r border-[#D4D0C8] dark:border-[#2D3748] whitespace-nowrap tabular-nums hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
      >
        {Math.round((fontSize / 14) * 100)}%
      </button>

      {/* Panel 8: Read Only Toggle */}
      <button
        onClick={onToggleReadOnly}
        title="Click to toggle Read-Only protection"
        className={`px-2 py-0.5 border-r border-[#D4D0C8] dark:border-[#2D3748] whitespace-nowrap hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer ${
          isReadOnly ? 'text-red-600 dark:text-red-400 font-bold' : ''
        }`}
      >
        {isReadOnly ? '[Read Only]' : 'Normal'}
      </button>

      <div className="flex-1" />

      {/* Panel 9: Network / Persistent storage status */}
      <div 
        className="px-2 py-0.5 flex items-center gap-1.5 whitespace-nowrap text-[10px]"
        title={isOnline ? "Online & Persistent in LocalStorage" : "Offline mode (cached locally)"}
      >
        <HardDrive className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        <span className="hidden sm:inline">Saved locally</span>
        {isOnline ? (
          <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <WifiOff className="w-3 h-3 text-amber-500" />
        )}
      </div>
    </div>
  );
};
