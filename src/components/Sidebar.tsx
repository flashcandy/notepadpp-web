import React, { useState, useRef } from 'react';
import { 
  Folder, FileCode, Plus, Upload, Download, Trash2, Search, 
  ChevronDown, ChevronRight, X, FileText, CheckCircle2, AlertCircle
} from 'lucide-react';
import { DocumentFile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentFile[];
  activeTabId: string;
  onSelectDocument: (id: string) => void;
  onNewFile: () => void;
  onUploadFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadFolder: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadFile: (doc: DocumentFile) => void;
  onDownloadAll: () => void;
  onDeleteFile: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  documents,
  activeTabId,
  onSelectDocument,
  onNewFile,
  onUploadFiles,
  onUploadFolder,
  onDownloadFile,
  onDownloadAll,
  onDeleteFile,
}) => {
  const [filterText, setFilterText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const unsavedCount = documents.filter(d => d.isDirty).length;

  return (
    <div className="w-64 bg-[#F5F4EC] dark:bg-[#151D28] border-r border-[#D4D0C8] dark:border-[#2D3748] flex flex-col h-full shrink-0 select-none z-20">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#ECE9D8] dark:bg-[#1B2432] border-b border-[#D4D0C8] dark:border-[#2D3748]">
        <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800 dark:text-slate-200">
          <Folder className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Workspace Explorer</span>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-slate-500"
          title="Close Sidebar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#F0EFE7] dark:bg-[#18212E] border-b border-[#D4D0C8] dark:border-[#2D3748] text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <button
            onClick={onNewFile}
            title="New File"
            className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded hover:text-blue-600"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload External Files"
            className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded hover:text-emerald-600"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => folderInputRef.current?.click()}
            title="Upload Entire Folder"
            className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded hover:text-amber-600"
          >
            <Folder className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onDownloadAll}
          title="Backup & Export All Files"
          className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] hover:bg-white dark:hover:bg-slate-700 rounded hover:text-blue-600"
        >
          <Download className="w-3 h-3" />
          <span>Export All</span>
        </button>

        {/* Hidden inputs for uploading */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={onUploadFiles}
          multiple
          className="hidden"
        />
        <input
          type="file"
          ref={folderInputRef}
          onChange={onUploadFolder}
          // @ts-expect-error webkitdirectory is supported in Chromium/Firefox
          webkitdirectory=""
          directory=""
          className="hidden"
        />
      </div>

      {/* Search Filter */}
      <div className="p-2 border-b border-[#D4D0C8] dark:border-[#2D3748]">
        <div className="relative flex items-center">
          <Search className="w-3 h-3 absolute left-2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter files..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-6 pr-2 py-1 text-xs bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-gray-700 rounded outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
          />
          {filterText && (
            <button
              onClick={() => setFilterText('')}
              className="absolute right-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto py-1">
        <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Open Documents ({documents.length})</span>
          {unsavedCount > 0 && (
            <span className="text-red-500 flex items-center gap-1 font-normal text-[10px]">
              <AlertCircle className="w-3 h-3" /> {unsavedCount} unsaved
            </span>
          )}
        </div>

        {filteredDocs.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-slate-400">
            No files found
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isActive = doc.id === activeTabId;
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc.id)}
                className={`group flex items-center justify-between px-3 py-1 text-xs cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#316AC5] text-white dark:bg-[#2563EB]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                  <span className="truncate">{doc.name}</span>
                  {doc.isDirty && (
                    <span 
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isActive ? 'bg-amber-300' : 'bg-red-500'
                      }`}
                      title="Unsaved changes"
                    />
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadFile(doc);
                    }}
                    title="Download file"
                    className="p-0.5 hover:bg-black/10 dark:hover:bg-white/20 rounded"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  {documents.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(doc.id);
                      }}
                      title="Delete file"
                      className="p-0.5 hover:bg-red-500 hover:text-white rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="p-2 border-t border-[#D4D0C8] dark:border-[#2D3748] bg-[#ECE9D8] dark:bg-[#1B2432] text-[11px] text-slate-500 dark:text-slate-400">
        <p className="truncate">Drag & drop files anytime to load.</p>
      </div>
    </div>
  );
};
