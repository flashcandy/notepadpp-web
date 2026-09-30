import React, { useState, useEffect, useRef } from 'react';
import { Search, Replace as ReplaceIcon, X, Check, Hash } from 'lucide-react';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'find' | 'replace' | 'count';
  setActiveTab: (tab: 'find' | 'replace' | 'count') => void;
  onFindNext: (query: string, options: SearchOptions) => boolean;
  onFindPrev: (query: string, options: SearchOptions) => boolean;
  onReplace: (query: string, replacement: string, options: SearchOptions) => boolean;
  onReplaceAll: (query: string, replacement: string, options: SearchOptions) => number;
  onCount: (query: string, options: SearchOptions) => number;
  initialQuery?: string;
}

export interface SearchOptions {
  matchCase: boolean;
  wholeWord: boolean;
  isRegex: boolean;
  wrapAround: boolean;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onFindNext,
  onFindPrev,
  onReplace,
  onReplaceAll,
  onCount,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [replacement, setReplacement] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [isRegex, setIsRegex] = useState(false);
  const [wrapAround, setWrapAround] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const findInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setQuery(initialQuery);
      }
      setTimeout(() => {
        findInputRef.current?.focus();
        findInputRef.current?.select();
      }, 50);
      setStatusMessage(null);
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const currentOptions: SearchOptions = {
    matchCase,
    wholeWord,
    isRegex,
    wrapAround,
  };

  const handleFindNext = () => {
    if (!query) return;
    const found = onFindNext(query, currentOptions);
    if (!found) {
      setStatusMessage(`Cannot find "${query}"`);
    } else {
      setStatusMessage(null);
    }
  };

  const handleFindPrev = () => {
    if (!query) return;
    const found = onFindPrev(query, currentOptions);
    if (!found) {
      setStatusMessage(`Cannot find "${query}"`);
    } else {
      setStatusMessage(null);
    }
  };

  const handleReplaceOne = () => {
    if (!query) return;
    const replaced = onReplace(query, replacement, currentOptions);
    if (!replaced) {
      setStatusMessage(`No match found to replace`);
    } else {
      setStatusMessage(`Replaced 1 occurrence`);
    }
  };

  const handleReplaceAllOccurrences = () => {
    if (!query) return;
    const count = onReplaceAll(query, replacement, currentOptions);
    setStatusMessage(`Replaced all ${count} occurrences`);
  };

  const handleCountOccurrences = () => {
    if (!query) return;
    const count = onCount(query, currentOptions);
    setStatusMessage(`Count: ${count} matches found in document`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div 
        className="w-full max-w-md bg-[#ECE9D8] dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] rounded shadow-2xl text-xs text-slate-900 dark:text-slate-100 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0055EA] dark:bg-[#2563EB] text-white font-medium select-none">
          <div className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            <span>Notepad++ Find & Replace</span>
          </div>
          <button onClick={onClose} className="p-0.5 hover:bg-red-500 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab strip: Find, Replace, Count */}
        <div className="flex border-b border-[#D4D0C8] dark:border-[#2D3748] px-2 pt-2 bg-[#E1DFD6] dark:bg-[#151D28]">
          <button
            onClick={() => { setActiveTab('find'); setStatusMessage(null); }}
            className={`px-4 py-1 border-t border-x rounded-t text-xs font-medium cursor-pointer ${
              activeTab === 'find'
                ? 'bg-[#ECE9D8] dark:bg-[#1E2530] border-[#9BA0A5] dark:border-[#374151] border-b-[#ECE9D8] dark:border-b-[#1E2530] text-blue-700 dark:text-blue-400'
                : 'bg-[#D6D2C4] dark:bg-[#101722] border-transparent text-slate-600 dark:text-slate-400 hover:bg-[#ECE9D8]'
            }`}
          >
            Find
          </button>
          <button
            onClick={() => { setActiveTab('replace'); setStatusMessage(null); }}
            className={`px-4 py-1 border-t border-x rounded-t text-xs font-medium cursor-pointer ${
              activeTab === 'replace'
                ? 'bg-[#ECE9D8] dark:bg-[#1E2530] border-[#9BA0A5] dark:border-[#374151] border-b-[#ECE9D8] dark:border-b-[#1E2530] text-blue-700 dark:text-blue-400'
                : 'bg-[#D6D2C4] dark:bg-[#101722] border-transparent text-slate-600 dark:text-slate-400 hover:bg-[#ECE9D8]'
            }`}
          >
            Replace
          </button>
          <button
            onClick={() => { setActiveTab('count'); setStatusMessage(null); }}
            className={`px-4 py-1 border-t border-x rounded-t text-xs font-medium cursor-pointer ${
              activeTab === 'count'
                ? 'bg-[#ECE9D8] dark:bg-[#1E2530] border-[#9BA0A5] dark:border-[#374151] border-b-[#ECE9D8] dark:border-b-[#1E2530] text-blue-700 dark:text-blue-400'
                : 'bg-[#D6D2C4] dark:bg-[#101722] border-transparent text-slate-600 dark:text-slate-400 hover:bg-[#ECE9D8]'
            }`}
          >
            Count
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          {/* Find what */}
          <div className="flex items-center gap-2">
            <label className="w-24 font-medium text-right shrink-0">Find what :</label>
            <input
              ref={findInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFindNext();
                if (e.key === 'Escape') onClose();
              }}
              placeholder="Search text..."
              className="flex-1 px-2 py-1 text-xs bg-white dark:bg-[#151D28] border border-gray-400 dark:border-gray-600 rounded outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Replace with (only on replace tab) */}
          {activeTab === 'replace' && (
            <div className="flex items-center gap-2">
              <label className="w-24 font-medium text-right shrink-0">Replace with :</label>
              <input
                type="text"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleReplaceOne();
                  if (e.key === 'Escape') onClose();
                }}
                placeholder="Replacement..."
                className="flex-1 px-2 py-1 text-xs bg-white dark:bg-[#151D28] border border-gray-400 dark:border-gray-600 rounded outline-none focus:border-blue-500 font-mono"
              />
            </div>
          )}

          {/* Options checkboxes */}
          <div className="grid grid-cols-2 gap-2 pl-24 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="rounded"
              />
              <span>Match case</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={(e) => setWholeWord(e.target.checked)}
                className="rounded"
              />
              <span>Match whole word only</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={wrapAround}
                onChange={(e) => setWrapAround(e.target.checked)}
                className="rounded"
              />
              <span>Wrap around</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isRegex}
                onChange={(e) => setIsRegex(e.target.checked)}
                className="rounded"
              />
              <span>Regular expression</span>
            </label>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded text-[11px] text-blue-800 dark:text-blue-300 font-medium">
              {statusMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#D4D0C8] dark:border-[#2D3748]">
            {activeTab === 'find' && (
              <>
                <button
                  onClick={handleFindPrev}
                  className="px-3 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-gray-400 dark:border-gray-600 rounded active:scale-95 transition-transform"
                >
                  Find Prev
                </button>
                <button
                  onClick={handleFindNext}
                  className="px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border border-[#1D4ED8] rounded active:scale-95 transition-transform font-medium"
                >
                  Find Next
                </button>
                <button
                  onClick={handleCountOccurrences}
                  className="px-3 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-gray-400 dark:border-gray-600 rounded active:scale-95 transition-transform"
                >
                  Count
                </button>
              </>
            )}

            {activeTab === 'replace' && (
              <>
                <button
                  onClick={handleFindNext}
                  className="px-3 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-gray-400 dark:border-gray-600 rounded active:scale-95 transition-transform"
                >
                  Find Next
                </button>
                <button
                  onClick={handleReplaceOne}
                  className="px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border border-[#1D4ED8] rounded active:scale-95 transition-transform font-medium"
                >
                  Replace
                </button>
                <button
                  onClick={handleReplaceAllOccurrences}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 rounded active:scale-95 transition-transform font-medium"
                >
                  Replace All
                </button>
              </>
            )}

            {activeTab === 'count' && (
              <button
                onClick={handleCountOccurrences}
                className="px-4 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border border-[#1D4ED8] rounded active:scale-95 transition-transform font-medium"
              >
                Find & Count All
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-gray-400 dark:border-gray-600 rounded active:scale-95 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
