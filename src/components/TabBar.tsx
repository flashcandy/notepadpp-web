import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Save, Copy, Columns, ArrowRightLeft, Edit3 } from 'lucide-react';
import { DocumentFile } from '../types';

interface TabBarProps {
  documents: DocumentFile[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string, e?: React.MouseEvent) => void;
  onNewTab: () => void;
  onCloneToOtherView: (id: string) => void;
  onCloseOthers: (id: string) => void;
  onCloseToRight: (id: string) => void;
  onRenameTab: (id: string, newName: string) => void;
  onSaveTab: (id: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  documents,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onCloneToOtherView,
  onCloseOthers,
  onCloseToRight,
  onRenameTab,
  onSaveTab,
}) => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    docId: string;
  } | null>(null);

  const [renamingDocId, setRenamingDocId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleGlobalClick = () => {
      if (contextMenu?.visible) {
        setContextMenu(null);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [contextMenu]);

  useEffect(() => {
    if (renamingDocId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingDocId]);

  const handleContextMenu = (e: React.MouseEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      docId,
    });
  };

  const startRename = (doc: DocumentFile) => {
    setRenamingDocId(doc.id);
    setRenameValue(doc.name);
    setContextMenu(null);
  };

  const submitRename = () => {
    if (renamingDocId && renameValue.trim()) {
      onRenameTab(renamingDocId, renameValue.trim());
    }
    setRenamingDocId(null);
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const offset = direction === 'left' ? -150 : 150;
      tabsContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center bg-[#E1DFD6] dark:bg-[#151B24] border-b border-[#B8B4A8] dark:border-[#2D3748] h-7 select-none overflow-hidden shrink-0">
      {/* Scroll Left Button if needed */}
      <button 
        onClick={() => scrollTabs('left')}
        className="px-1 h-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0"
        title="Scroll Tabs Left"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Tabs container with double click for new tab */}
      <div
        ref={tabsContainerRef}
        onDoubleClick={(e) => {
          if (e.target === tabsContainerRef.current) {
            onNewTab();
          }
        }}
        className="flex items-end h-full overflow-x-auto overflow-y-hidden scrollbar-none flex-1 gap-[1px] pl-1 pr-2"
      >
        {documents.map((doc) => {
          const isActive = doc.id === activeTabId;
          const isDirty = doc.isDirty;

          return (
            <div
              key={doc.id}
              onClick={() => onSelectTab(doc.id)}
              onContextMenu={(e) => handleContextMenu(e, doc.id)}
              className={`group relative flex items-center gap-1.5 px-2.5 h-[26px] text-xs cursor-pointer border-t border-x rounded-t transition-colors shrink-0 max-w-[200px] ${
                isActive
                  ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-slate-100 border-[#9BA0A5] dark:border-[#38BDF8]/40 border-b-transparent font-medium shadow-sm z-10'
                  : 'bg-[#ECE9D8] dark:bg-[#1A222D] text-slate-600 dark:text-slate-400 border-transparent hover:bg-[#F5F4EC] dark:hover:bg-[#202B39]'
              }`}
              title={`${doc.name} ${isDirty ? '(Unsaved)' : ''}`}
            >
              {/* Authentic Notepad++ Floppy Disk: Blue = Saved, Red = Modified */}
              <div 
                className="shrink-0 cursor-pointer"
                title={isDirty ? "Document modified (Red disk)" : "Document saved (Blue disk)"}
                onClick={(e) => {
                  if (isDirty) {
                    e.stopPropagation();
                    onSaveTab(doc.id);
                  }
                }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  {/* Floppy outline */}
                  <path 
                    d="M2 1h9l3 3v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" 
                    fill={isDirty ? '#EF4444' : '#3B82F6'} 
                  />
                  {/* Metal slider */}
                  <rect x="4" y="2" width="6" height="4" rx="0.5" fill="#E2E8F0" />
                  <rect x="7" y="3" width="1.5" height="2.5" fill="#475569" />
                  {/* Label paper */}
                  <rect x="3.5" y="8" width="9" height="6.5" rx="0.5" fill="#FFFFFF" opacity="0.9" />
                  <line x1="5" y1="10" x2="11" y2="10" stroke={isDirty ? '#EF4444' : '#3B82F6'} strokeWidth="1" />
                  <line x1="5" y1="12" x2="10" y2="12" stroke={isDirty ? '#EF4444' : '#3B82F6'} strokeWidth="1" />
                </svg>
              </div>

              {/* Document Name or Rename Input */}
              {renamingDocId === doc.id ? (
                <input
                  ref={renameInputRef}
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={submitRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitRename();
                    if (e.key === 'Escape') setRenamingDocId(null);
                  }}
                  className="bg-white dark:bg-slate-800 text-xs px-1 border border-blue-500 rounded outline-none w-24"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span 
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    startRename(doc);
                  }}
                  className="truncate text-[11px] leading-tight"
                >
                  {doc.name}
                </span>
              )}

              {/* Close Tab Button */}
              <button
                onClick={(e) => onCloseTab(doc.id, e)}
                title="Close Tab (Ctrl+W)"
                className="opacity-60 group-hover:opacity-100 hover:bg-red-500 hover:text-white p-0.5 rounded text-gray-500 dark:text-gray-400 shrink-0 transition-opacity ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          onClick={onNewTab}
          title="New Tab (Ctrl+N)"
          className="flex items-center justify-center w-6 h-[24px] px-1 hover:bg-[#D4D0C8] dark:hover:bg-[#2D3748] rounded text-slate-700 dark:text-slate-300 transition-colors shrink-0 mb-[1px]"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scroll Right Button */}
      <button 
        onClick={() => scrollTabs('right')}
        className="px-1 h-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0"
        title="Scroll Tabs Right"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Tab Context Menu */}
      {contextMenu?.visible && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 bg-white dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] shadow-xl py-1 rounded text-xs text-slate-800 dark:text-slate-200 min-w-[200px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onCloseTab(contextMenu.docId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left"
          >
            <X className="w-3.5 h-3.5 text-red-500" />
            <span>Close</span>
          </button>

          <button
            onClick={() => {
              onCloseOthers(contextMenu.docId);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left"
          >
            Close All BUT This
          </button>

          <button
            onClick={() => {
              onCloseToRight(contextMenu.docId);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left"
          >
            Close Multiple Tabs to the Right
          </button>

          <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

          <button
            onClick={() => {
              onSaveTab(contextMenu.docId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left"
          >
            <Save className="w-3.5 h-3.5 text-green-600" />
            <span>Save</span>
          </button>

          <button
            onClick={() => {
              const doc = documents.find(d => d.id === contextMenu.docId);
              if (doc) startRename(doc);
            }}
            className="w-full flex items-center gap-2 px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-500" />
            <span>Rename File...</span>
          </button>

          <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

          <button
            onClick={() => {
              onCloneToOtherView(contextMenu.docId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left"
          >
            <Columns className="w-3.5 h-3.5 text-purple-500" />
            <span>Clone to Other View (Split)</span>
          </button>

          <button
            onClick={() => {
              const doc = documents.find(d => d.id === contextMenu.docId);
              if (doc) {
                navigator.clipboard.writeText(doc.name);
              }
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-1 hover:bg-[#316AC5] hover:text-white dark:hover:bg-[#2563EB] text-left"
          >
            <Copy className="w-3.5 h-3.5 text-gray-500" />
            <span>Copy File Name</span>
          </button>
        </div>
      )}
    </div>
  );
};
