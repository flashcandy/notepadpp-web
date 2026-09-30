/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  loadDocumentsFromStorage, saveDocumentsToStorage,
  loadActiveTabIdFromStorage, saveActiveTabIdToStorage,
  loadSplitTabIdFromStorage, saveSplitTabIdToStorage,
  loadSettingsFromStorage, saveSettingsToStorage,
  loadAIConfigFromStorage, saveAIConfigToStorage,
  DEFAULT_SETTINGS
} from './utils/storage';
import { DocumentFile, EditorSettings, CursorInfo, ThemeType, LineEnding, EncodingType } from './types';
import { AIConfig, AIModel, DEFAULT_AI_CONFIG } from './types/ai';
import { getLanguageByFilename, getLanguageById } from './utils/languages';
import { TextTransforms } from './utils/textTransform';
import { usePWAInstall } from './hooks/usePWAInstall';

import { MenuBar } from './components/MenuBar';
import { Toolbar } from './components/Toolbar';
import { TabBar } from './components/TabBar';
import { Sidebar } from './components/Sidebar';
import { EditorPane, EditorPaneHandle } from './components/EditorPane';
import { StatusBar } from './components/StatusBar';
import { FindReplaceModal, SearchOptions } from './components/FindReplaceModal';
import { LivePreviewModal } from './components/LivePreviewModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { AboutModal } from './components/AboutModal';
import { MobileQuickBar } from './components/MobileQuickBar';
import { PWAInstallModal } from './components/PWAInstallModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { AISettingsModal } from './components/AISettingsModal';
import { CopilotBar } from './components/CopilotBar';

import { 
  FileCode, Menu, Plus, Upload, Columns, Play, Download, WifiOff, X, Sparkles, Save
} from 'lucide-react';

export default function App() {
  const editorPaneRef = useRef<EditorPaneHandle>(null);

  // State
  const [documents, setDocuments] = useState<DocumentFile[]>(loadDocumentsFromStorage);
  const [activeTabId, setActiveTabId] = useState<string>(loadActiveTabIdFromStorage);
  const [splitTabId, setSplitTabId] = useState<string | null>(loadSplitTabIdFromStorage);
  const [isSplitView, setIsSplitView] = useState<boolean>(!!loadSplitTabIdFromStorage());
  const [settings, setSettings] = useState<EditorSettings>(loadSettingsFromStorage);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDraggingOverWindow, setIsDraggingOverWindow] = useState<boolean>(false);
  const [insertMode, setInsertMode] = useState<'INS' | 'OVR'>('INS');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Assistant & Copilot State
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isCopilotBarOpen, setIsCopilotBarOpen] = useState<boolean>(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState<boolean>(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>(loadAIConfigFromStorage);
  const [aiModels, setAiModels] = useState<AIModel[]>([
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash (Google)',
      provider: 'gemini',
      description: 'Ultra-fast, stable code generation and reasoning (Default)',
      isFree: true,
    },
    {
      id: 'gemini-3.8-flash',
      name: 'Gemini 3.8 Flash (Google)',
      provider: 'gemini',
      description: 'Next-gen reasoning and multimodal code synthesis',
      isFree: true,
    },
    {
      id: 'gemini-3.1-pro-preview',
      name: 'Gemini 3.1 Pro (Google)',
      provider: 'gemini',
      description: 'Complex architectural design and deep debugging',
      isFree: false,
    },
    {
      id: 'openrouter/free',
      name: 'Auto Free Router (OpenRouter)',
      provider: 'openrouter',
      description: 'Smart router that dynamically selects the best currently active free model (Recommended)',
      isFree: true,
    },
    {
      id: 'qwen/qwen3.8-27b:free',
      name: 'Qwen 3.8 27B (Free)',
      provider: 'openrouter',
      description: 'Flagship Qwen open-weights coding model with high precision',
      isFree: true,
    },
    {
      id: 'nvidia/nemotron-3.5-lightning:free',
      name: 'NVIDIA Nemotron 3.5 Lightning (Free)',
      provider: 'openrouter',
      description: 'Ultra-low latency reasoning model optimized by NVIDIA',
      isFree: true,
    },
    {
      id: 'liquid/lfm-2.5-2.6b:free',
      name: 'Liquid LFM 2.5 (Free)',
      provider: 'openrouter',
      description: 'Ultra-fast lightweight model for instant code snippets',
      isFree: true,
    },
  ]);
  const [hasServerGeminiKey, setHasServerGeminiKey] = useState<boolean>(true);
  const [hasServerOpenRouterKey, setHasServerOpenRouterKey] = useState<boolean>(false);

  // Modals
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [findReplaceTab, setFindReplaceTab] = useState<'find' | 'replace' | 'count'>('find');
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPWAInstallModalOpen, setIsPWAInstallModalOpen] = useState(false);

  // Cursor state
  const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
    lineNumber: 1,
    column: 1,
    selectionLength: 0,
    selectedText: '',
    totalLines: 1,
    totalLength: 0,
  });

  // PWA install hook
  const { isInstallable, isInstalled: isPWAInstalled, isIOS, install: triggerPWAInstall } = usePWAInstall();

  // Active document helper
  const activeDocument = documents.find(d => d.id === activeTabId) || documents[0] || {
    id: 'empty',
    name: 'new 1',
    content: '',
    language: 'plaintext',
    isDirty: false,
    lineEnding: 'CRLF',
    encoding: 'UTF-8',
    readOnly: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const splitDocument = documents.find(d => d.id === splitTabId) || activeDocument;

  // Track online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    saveDocumentsToStorage(documents);
  }, [documents]);

  useEffect(() => {
    saveActiveTabIdToStorage(activeTabId);
  }, [activeTabId]);

  useEffect(() => {
    saveSplitTabIdToStorage(isSplitView ? splitTabId : null);
  }, [isSplitView, splitTabId]);

  useEffect(() => {
    saveSettingsToStorage(settings);
    // Apply dark class to html document for Tailwind styling
    if (settings.theme.includes('dark') || settings.theme === 'monokai' || settings.theme === 'dracula') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Window drag and drop overlay listener
  useEffect(() => {
    let dragCounter = 0;

    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDraggingOverWindow(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        setIsDraggingOverWindow(false);
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDraggingOverWindow(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleLoadFiles(e.dataTransfer.files);
      }
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [documents]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N / Cmd+N
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n' && !e.shiftKey) {
        e.preventDefault();
        handleNewDocument();
      }
      // Ctrl+S / Cmd+S (Save active document to local disk)
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handleSaveDocument(activeTabId, false);
      }
      // F12 or Ctrl+Alt+S (Save As to local disk)
      else if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 's')) {
        e.preventDefault();
        handleSaveDocument(activeTabId, true);
      }
      // Ctrl+Shift+S (Save all to local disk)
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveAllLocalDocuments();
      }
      // Ctrl+W / Cmd+W (close tab)
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w' && !e.shiftKey) {
        e.preventDefault();
        handleCloseTab(activeTabId);
      }
      // Ctrl+F / Cmd+F
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setFindReplaceTab('find');
        setIsFindReplaceOpen(true);
      }
      // Ctrl+H / Cmd+H
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setFindReplaceTab('replace');
        setIsFindReplaceOpen(true);
      }
      // F5 (Run)
      else if (e.key === 'F5') {
        e.preventDefault();
        setIsLivePreviewOpen(true);
      }
      // Ctrl+Alt+V (Split view)
      else if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handleToggleSplitView();
      }
      // F11 (Fullscreen)
      else if (e.key === 'F11') {
        e.preventDefault();
        handleToggleFullscreen();
      }
      // Ctrl+Shift+A (AI Assistant)
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAIAssistantOpen(prev => !prev);
      }
      // Ctrl+I or Alt+\ (GitHub Copilot Inline Prompt)
      else if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i' && !e.shiftKey) || (e.altKey && e.key === '\\')) {
        e.preventDefault();
        setIsCopilotBarOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, documents, isSplitView]);

  // Fetch AI models list and provider status on mount
  useEffect(() => {
    fetch('/api/ai/models')
      .then((res) => res.json())
      .then((data) => {
        if (data.models && Array.isArray(data.models)) {
          setAiModels(data.models);
        }
        if (typeof data.hasServerGeminiKey === 'boolean') {
          setHasServerGeminiKey(data.hasServerGeminiKey);
        }
        if (typeof data.hasServerOpenRouterKey === 'boolean') {
          setHasServerOpenRouterKey(data.hasServerOpenRouterKey);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch AI models from server:', err);
      });
  }, []);

  // Document management actions
  const handleNewDocument = () => {
    const newDocNumber = documents.length + 1;
    const newDocName = `new ${newDocNumber}`;
    const newDoc: DocumentFile = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: newDocName,
      content: '',
      language: 'plaintext',
      isDirty: false,
      lineEnding: 'CRLF',
      encoding: 'UTF-8',
      readOnly: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setDocuments(prev => [...prev, newDoc]);
    setActiveTabId(newDoc.id);
  };

  const handleOpenFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        handleLoadFiles(files);
      }
    };
    input.click();
  };

  const handleLoadFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lang = getLanguageByFilename(file.name);
        const newDoc: DocumentFile = {
          id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          content: text,
          language: lang.id,
          isDirty: false,
          lineEnding: text.includes('\r\n') ? 'CRLF' : 'LF',
          encoding: 'UTF-8',
          readOnly: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        setDocuments(prev => {
          // If a file with same name and content exists, select it
          const existing = prev.find(d => d.name === file.name);
          if (existing) {
            setActiveTabId(existing.id);
            return prev;
          }
          setActiveTabId(newDoc.id);
          return [...prev, newDoc];
        });
      };
      reader.readAsText(file);
    });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(prev => (prev === message ? null : prev));
    }, 3200);
  };

  // Save to Local Disk (Uses native File System Access API dialog or falls back to direct download)
  const handleSaveLocalFile = async (doc: DocumentFile, forceSaveAs: boolean = false) => {
    // If native File System Access API is supported
    if ('showSaveFilePicker' in window) {
      try {
        const ext = doc.name.includes('.') ? '.' + doc.name.split('.').pop() : '.txt';
        const options: any = {
          suggestedName: doc.name,
          types: [
            {
              description: `${doc.language.toUpperCase()} file (*${ext})`,
              accept: {
                'text/plain': [ext, '.txt'],
              },
            },
          ],
        };

        const handle = await (window as any).showSaveFilePicker(options);
        const writable = await handle.createWritable();
        await writable.write(doc.content);
        await writable.close();

        const savedName = handle.name || doc.name;
        const langObj = getLanguageByFilename(savedName);

        setDocuments(prev =>
          prev.map(d =>
            d.id === doc.id
              ? { ...d, name: savedName, language: langObj.id, isDirty: false, updatedAt: Date.now() }
              : d
          )
        );

        showToast(`Saved "${savedName}" to local disk successfully!`);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // User intentionally cancelled the save dialog
          return;
        }
        console.warn('File System Access API not permitted, falling back to download:', err);
      }
    }

    // Direct browser local download fallback (works in 100% of browsers)
    handleDownloadFile(doc);
    setDocuments(prev =>
      prev.map(d => (d.id === doc.id ? { ...d, isDirty: false, updatedAt: Date.now() } : d))
    );
    showToast(`Saved "${doc.name}" to your local computer!`);
  };

  const handleSaveDocument = (docId: string, saveAs: boolean = false) => {
    const doc = documents.find(d => d.id === docId) || activeDocument;
    if (doc) {
      handleSaveLocalFile(doc, saveAs);
    }
  };

  const handleSaveAllLocalDocuments = () => {
    documents.forEach((doc, idx) => {
      setTimeout(() => {
        handleDownloadFile(doc);
      }, idx * 120);
    });

    setDocuments(prev =>
      prev.map(d => ({ ...d, isDirty: false, updatedAt: Date.now() }))
    );
    showToast(`Saved all ${documents.length} open files to local disk!`);
  };

  const handleSaveAllDocuments = () => {
    handleSaveAllLocalDocuments();
  };

  const handleCloseTab = (idToClose: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (documents.length <= 1) {
      // Don't close last tab, replace with empty new 1
      handleNewDocument();
      setDocuments(prev => prev.filter(d => d.id !== idToClose));
      return;
    }

    const index = documents.findIndex(d => d.id === idToClose);
    const newDocs = documents.filter(d => d.id !== idToClose);
    setDocuments(newDocs);

    if (activeTabId === idToClose) {
      const nextActive = newDocs[Math.max(0, index - 1)];
      if (nextActive) setActiveTabId(nextActive.id);
    }

    if (splitTabId === idToClose) {
      setSplitTabId(null);
      setIsSplitView(false);
    }
  };

  const handleCloseOthers = (keepId: string) => {
    setDocuments(prev => prev.filter(d => d.id === keepId));
    setActiveTabId(keepId);
    if (splitTabId !== keepId) setSplitTabId(null);
  };

  const handleCloseToRight = (targetId: string) => {
    const index = documents.findIndex(d => d.id === targetId);
    if (index === -1) return;
    const newDocs = documents.slice(0, index + 1);
    setDocuments(newDocs);
    if (!newDocs.some(d => d.id === activeTabId)) {
      setActiveTabId(targetId);
    }
  };

  const handleRenameTab = (id: string, newName: string) => {
    const lang = getLanguageByFilename(newName);
    setDocuments(prev =>
      prev.map(d => (d.id === id ? { ...d, name: newName, language: lang.id } : d))
    );
  };

  const handleContentChange = (content: string, docId: string) => {
    setDocuments(prev =>
      prev.map(d =>
        d.id === docId ? { ...d, content, isDirty: true, updatedAt: Date.now() } : d
      )
    );
  };

  // Dual split view
  const handleToggleSplitView = () => {
    if (!isSplitView) {
      // Find a document other than active, or clone active
      const other = documents.find(d => d.id !== activeTabId) || activeDocument;
      setSplitTabId(other.id);
      setIsSplitView(true);
    } else {
      setIsSplitView(false);
      setSplitTabId(null);
    }
  };

  const handleCloneToOtherView = (docId: string) => {
    setSplitTabId(docId);
    setIsSplitView(true);
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Text transformations
  const handleTransform = (action: string) => {
    const doc = activeDocument;
    let transformed = doc.content;

    switch (action) {
      case 'uppercase':
        transformed = TextTransforms.toUpperCase(doc.content);
        break;
      case 'lowercase':
        transformed = TextTransforms.toLowerCase(doc.content);
        break;
      case 'titlecase':
        transformed = TextTransforms.toTitleCase(doc.content);
        break;
      case 'invertcase':
        transformed = TextTransforms.invertCase(doc.content);
        break;
      case 'sort-asc':
        transformed = TextTransforms.sortLinesAscending(doc.content);
        break;
      case 'sort-desc':
        transformed = TextTransforms.sortLinesDescending(doc.content);
        break;
      case 'remove-duplicates':
        transformed = TextTransforms.removeDuplicateLines(doc.content);
        break;
      case 'remove-empty':
        transformed = TextTransforms.removeEmptyLines(doc.content);
        break;
      case 'trim-trailing':
        transformed = TextTransforms.trimTrailingWhitespace(doc.content);
        break;
      case 'base64-encode':
        transformed = TextTransforms.base64Encode(doc.content);
        break;
      case 'base64-decode':
        transformed = TextTransforms.base64Decode(doc.content);
        break;
      case 'url-encode':
        transformed = TextTransforms.urlEncode(doc.content);
        break;
      case 'url-decode':
        transformed = TextTransforms.urlDecode(doc.content);
        break;
      case 'format-json':
        transformed = TextTransforms.formatJSON(doc.content);
        break;
      case 'minify-json':
        transformed = TextTransforms.minifyJSON(doc.content);
        break;
    }

    handleContentChange(transformed, doc.id);
  };

  // Search & Replace logic
  const handleFindNext = (query: string, options: SearchOptions): boolean => {
    if (!query) return false;
    const content = activeDocument.content;
    let flags = 'g';
    if (!options.matchCase) flags += 'i';

    let pattern: RegExp;
    try {
      pattern = options.isRegex
        ? new RegExp(query, flags)
        : new RegExp(options.wholeWord ? `\\b${query}\\b` : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    } catch {
      return false;
    }

    const matches = Array.from(content.matchAll(pattern));
    return matches.length > 0;
  };

  const handleFindPrev = (query: string, options: SearchOptions): boolean => {
    return handleFindNext(query, options);
  };

  const handleReplaceOne = (query: string, replacement: string, options: SearchOptions): boolean => {
    if (!query) return false;
    const content = activeDocument.content;
    let pattern: RegExp;
    try {
      pattern = options.isRegex
        ? new RegExp(query, options.matchCase ? '' : 'i')
        : new RegExp(options.wholeWord ? `\\b${query}\\b` : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), options.matchCase ? '' : 'i');
    } catch {
      return false;
    }

    if (!pattern.test(content)) return false;
    const updated = content.replace(pattern, replacement);
    handleContentChange(updated, activeDocument.id);
    return true;
  };

  const handleReplaceAll = (query: string, replacement: string, options: SearchOptions): number => {
    if (!query) return 0;
    const content = activeDocument.content;
    let flags = 'g';
    if (!options.matchCase) flags += 'i';

    let pattern: RegExp;
    try {
      pattern = options.isRegex
        ? new RegExp(query, flags)
        : new RegExp(options.wholeWord ? `\\b${query}\\b` : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    } catch {
      return 0;
    }

    const matches = Array.from(content.matchAll(pattern));
    if (matches.length === 0) return 0;

    const updated = content.replace(pattern, replacement);
    handleContentChange(updated, activeDocument.id);
    return matches.length;
  };

  const handleCountMatches = (query: string, options: SearchOptions): number => {
    if (!query) return 0;
    const content = activeDocument.content;
    let flags = 'g';
    if (!options.matchCase) flags += 'i';

    let pattern: RegExp;
    try {
      pattern = options.isRegex
        ? new RegExp(query, flags)
        : new RegExp(options.wholeWord ? `\\b${query}\\b` : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    } catch {
      return 0;
    }

    const matches = Array.from(content.matchAll(pattern));
    return matches.length;
  };

  // Download individual file
  const handleDownloadFile = (doc: DocumentFile) => {
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download all files backup as JSON bundle
  const handleDownloadAll = () => {
    const backup = {
      app: 'Notepad++ Web',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      documents,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notepad_plus_plus_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Insert character (for mobile accessory keyboard)
  const handleInsertText = (text: string) => {
    const doc = activeDocument;
    handleContentChange(doc.content + text, doc.id);
  };

  // AI Code insertion and document handlers with Zero-Copy Monaco native integration
  const handleInsertCodeAtCursor = (code: string) => {
    if (editorPaneRef.current) {
      editorPaneRef.current.insertTextAtCursor(code);
    } else {
      const doc = activeDocument;
      if (cursorInfo.selectedText && doc.content.includes(cursorInfo.selectedText)) {
        const updated = doc.content.replace(cursorInfo.selectedText, code);
        handleContentChange(updated, doc.id);
      } else {
        const separator = doc.content.length > 0 && !doc.content.endsWith('\n') ? '\n' : '';
        handleContentChange(doc.content + separator + code, doc.id);
      }
    }
  };

  const handleReplaceDocumentContent = (code: string) => {
    if (editorPaneRef.current) {
      editorPaneRef.current.replaceEntireDocument(code);
    } else {
      handleContentChange(code, activeDocument.id);
    }
  };

  const handleOpenCodeInNewTab = (code: string, language: string, title?: string) => {
    const langObj = getLanguageById(language);
    const ext = langObj.extensions[0] || '.txt';
    const filename = title || `ai-code-${documents.length + 1}${ext}`;
    const newDoc: DocumentFile = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: filename,
      content: code,
      language: langObj.id,
      isDirty: true,
      lineEnding: 'CRLF',
      encoding: 'UTF-8',
      readOnly: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setDocuments((prev) => [...prev, newDoc]);
    setActiveTabId(newDoc.id);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#ECE9D8] dark:bg-[#101722] text-slate-800 dark:text-slate-100 font-sans select-none">
      {/* Drag & Drop Full Window Overlay Indicator */}
      {isDraggingOverWindow && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-600/90 text-white backdrop-blur-sm pointer-events-none transition-all">
          <Upload className="w-16 h-16 animate-bounce mb-3" />
          <h2 className="text-2xl font-bold tracking-tight">Drop files to open in Notepad++</h2>
          <p className="text-sm opacity-90 mt-1">Supports source code, text files, JSON, markdown, and scripts</p>
        </div>
      )}

      {/* Top Windows Chrome Bar for Notepad++ branding & Mobile header */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#1E2530] text-slate-200 border-b border-[#2D3748] h-6.5 sm:h-7 shrink-0 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {/* Notepad++ Chameleon Logo */}
          <img 
            src="/icon.svg" 
            alt="Notepad++" 
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm shadow-xs shrink-0"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          <span className="font-semibold tracking-wide text-white text-[11px] sm:text-xs shrink-0">Notepad++</span>
          <span className="hidden sm:inline text-slate-400 text-[11px] truncate">
            — [{activeDocument.name}{activeDocument.isDirty ? ' *' : ''}]
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Mobile sidebar toggle button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-1 hover:bg-slate-700 rounded text-slate-300"
            title="Files Workspace"
          >
            <Menu className="w-3.5 h-3.5" />
          </button>

          {/* Quick AI button on header */}
          <button
            onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
            className={`flex items-center gap-1 p-1 sm:px-2 sm:py-0.5 rounded text-[11px] font-medium transition-colors ${
              isAIAssistantOpen 
                ? 'bg-purple-600 text-white shadow-xs' 
                : 'bg-purple-900/70 text-purple-200 hover:bg-purple-800'
            }`}
            title="Toggle AI Code Assistant (Ctrl+Shift+A)"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span className="hidden sm:inline">AI Code</span>
          </button>

          {/* Quick Run button on header */}
          <button
            onClick={() => setIsLivePreviewOpen(true)}
            className="flex items-center gap-1 p-1 sm:px-2 sm:py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium shadow-xs"
            title="Run Code Preview"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          {/* Install PWA button */}
          {(!isPWAInstalled || isInstallable) && (
            <button
              onClick={() => setIsPWAInstallModalOpen(true)}
              className="flex items-center gap-1 p-1 sm:px-2 sm:py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium shadow-xs"
              title="Install Notepad++ App"
            >
              <Download className="w-3 h-3" />
              <span className="hidden xs:inline">Install</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Menu Bar */}
      <div className="hidden md:block">
        <MenuBar
          onNew={handleNewDocument}
          onOpen={handleOpenFilePicker}
          onSave={() => handleSaveDocument(activeTabId, false)}
          onSaveAs={() => handleSaveDocument(activeTabId, true)}
          onSaveAll={handleSaveAllLocalDocuments}
          onCloseCurrent={() => handleCloseTab(activeTabId)}
          onCloseAll={() => {
            handleNewDocument();
            setDocuments(prev => prev.slice(prev.length - 1));
          }}
          onUndo={() => {}}
          onRedo={() => {}}
          onCut={() => {}}
          onCopy={() => {}}
          onPaste={() => {}}
          onSelectAll={() => {}}
          onFind={() => { setFindReplaceTab('find'); setIsFindReplaceOpen(true); }}
          onReplace={() => { setFindReplaceTab('replace'); setIsFindReplaceOpen(true); }}
          onGotoLine={() => {}}
          onToggleWordWrap={() => setSettings(s => ({ ...s, wordWrap: !s.wordWrap }))}
          isWordWrap={settings.wordWrap}
          onToggleMinimap={() => setSettings(s => ({ ...s, showMinimap: !s.showMinimap }))}
          isShowMinimap={settings.showMinimap}
          onToggleWhitespace={() => setSettings(s => ({ ...s, showWhitespace: !s.showWhitespace }))}
          isShowWhitespace={settings.showWhitespace}
          onZoomIn={() => setSettings(s => ({ ...s, fontSize: Math.min(32, s.fontSize + 1) }))}
          onZoomOut={() => setSettings(s => ({ ...s, fontSize: Math.max(10, s.fontSize - 1) }))}
          onResetZoom={() => setSettings(s => ({ ...s, fontSize: 14 }))}
          onToggleSplitView={handleToggleSplitView}
          isSplitView={isSplitView}
          onRunPreview={() => setIsLivePreviewOpen(true)}
          onToggleFullscreen={handleToggleFullscreen}
          currentTheme={settings.theme}
          onChangeTheme={(theme) => setSettings(s => ({ ...s, theme }))}
          currentLanguage={activeDocument.language}
          onChangeLanguage={(langId) => {
            setDocuments(prev =>
              prev.map(d => (d.id === activeTabId ? { ...d, language: langId } : d))
            );
          }}
          currentLineEnding={activeDocument.lineEnding}
          onChangeLineEnding={(ending) => {
            setDocuments(prev =>
              prev.map(d => (d.id === activeTabId ? { ...d, lineEnding: ending, isDirty: true } : d))
            );
          }}
          currentEncoding={activeDocument.encoding}
          onChangeEncoding={(enc) => {
            setDocuments(prev =>
              prev.map(d => (d.id === activeTabId ? { ...d, encoding: enc, isDirty: true } : d))
            );
          }}
          onTransform={handleTransform}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          onToggleAIAssistant={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
          onOpenAISettings={() => setIsAISettingsOpen(true)}
          onToggleCopilot={() => setIsCopilotBarOpen(!isCopilotBarOpen)}
        />
      </div>

      {/* Classic Toolbar */}
      <Toolbar
        onNew={handleNewDocument}
        onOpen={handleOpenFilePicker}
        onSave={() => handleSaveDocument(activeTabId, false)}
        onSaveAs={() => handleSaveDocument(activeTabId, true)}
        onSaveAll={handleSaveAllLocalDocuments}
        onClose={() => handleCloseTab(activeTabId)}
        onCloseAll={() => {
          handleNewDocument();
          setDocuments(prev => prev.slice(prev.length - 1));
        }}
        onPrint={() => window.print()}
        onCut={() => {}}
        onCopy={() => {}}
        onPaste={() => {}}
        onUndo={() => {}}
        onRedo={() => {}}
        onFind={() => { setFindReplaceTab('find'); setIsFindReplaceOpen(true); }}
        onReplace={() => { setFindReplaceTab('replace'); setIsFindReplaceOpen(true); }}
        onZoomIn={() => setSettings(s => ({ ...s, fontSize: Math.min(32, s.fontSize + 1) }))}
        onZoomOut={() => setSettings(s => ({ ...s, fontSize: Math.max(10, s.fontSize - 1) }))}
        onToggleWordWrap={() => setSettings(s => ({ ...s, wordWrap: !s.wordWrap }))}
        isWordWrap={settings.wordWrap}
        onToggleWhitespace={() => setSettings(s => ({ ...s, showWhitespace: !s.showWhitespace }))}
        isShowWhitespace={settings.showWhitespace}
        onToggleMinimap={() => setSettings(s => ({ ...s, showMinimap: !s.showMinimap }))}
        isShowMinimap={settings.showMinimap}
        onToggleSplitView={handleToggleSplitView}
        isSplitView={isSplitView}
        onRunPreview={() => setIsLivePreviewOpen(true)}
        currentTheme={settings.theme}
        onToggleTheme={() => {
          const themes: ThemeType[] = ['npp-classic', 'npp-dark', 'vs-dark', 'monokai', 'dracula', 'github-light'];
          const nextIdx = (themes.indexOf(settings.theme) + 1) % themes.length;
          setSettings(s => ({ ...s, theme: themes[nextIdx] }));
        }}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isInstallable={isInstallable}
        onInstallPWA={() => setIsPWAInstallModalOpen(true)}
        isPWAInstalled={isPWAInstalled}
        onToggleAIAssistant={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
        isAIAssistantOpen={isAIAssistantOpen}
        onToggleCopilotBar={() => setIsCopilotBarOpen(!isCopilotBarOpen)}
        isCopilotBarOpen={isCopilotBarOpen}
      />

      {/* Main Workspace: Sidebar + Document Views + AI Assistant */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Workspace Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          documents={documents}
          activeTabId={activeTabId}
          onSelectDocument={(id) => {
            setActiveTabId(id);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          onNewFile={handleNewDocument}
          onUploadFiles={(e) => {
            if (e.target.files) handleLoadFiles(e.target.files);
          }}
          onUploadFolder={(e) => {
            if (e.target.files) handleLoadFiles(e.target.files);
          }}
          onDownloadFile={handleDownloadFile}
          onDownloadAll={handleDownloadAll}
          onDeleteFile={handleCloseTab}
        />

        {/* Editor Area (Single View or Split Dual View) */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-white dark:bg-[#151D28]">
          {/* Document Tabs Bar */}
          <TabBar
            documents={documents}
            activeTabId={activeTabId}
            onSelectTab={setActiveTabId}
            onCloseTab={handleCloseTab}
            onNewTab={handleNewDocument}
            onCloneToOtherView={handleCloneToOtherView}
            onCloseOthers={handleCloseOthers}
            onCloseToRight={handleCloseToRight}
            onRenameTab={handleRenameTab}
            onSaveTab={handleSaveDocument}
          />

          {/* GitHub Copilot Inline Assistant Bar */}
          <CopilotBar
            isOpen={isCopilotBarOpen}
            onClose={() => setIsCopilotBarOpen(false)}
            config={aiConfig}
            activeDocument={activeDocument}
            allDocuments={documents}
            selectedText={cursorInfo.selectedText}
            onInsertCodeAtCursor={handleInsertCodeAtCursor}
            onReplaceDocumentContent={handleReplaceDocumentContent}
            onOpenCodeInNewTab={handleOpenCodeInNewTab}
            models={aiModels}
            onQuickModelChange={(modelId, provider) => {
              const updated = { ...aiConfig, model: modelId, provider };
              setAiConfig(updated);
              saveAIConfigToStorage(updated);
            }}
            onOpenSettings={() => setIsAISettingsOpen(true)}
          />

          {/* Editors Container */}
          <div className="flex-1 flex overflow-hidden min-h-0 relative">
            {/* Primary Editor Pane */}
            <div className={`h-full min-w-0 ${isSplitView ? 'w-1/2 border-r border-[#D4D0C8] dark:border-[#2D3748]' : 'w-full'}`}>
              <EditorPane
                ref={editorPaneRef}
                file={activeDocument}
                onChangeContent={(content) => handleContentChange(content, activeDocument.id)}
                onUpdateCursor={setCursorInfo}
                settings={settings}
                onFileDrop={handleLoadFiles}
              />
            </div>

            {/* Split View Secondary Editor Pane */}
            {isSplitView && (
              <div className="h-full w-1/2 min-w-0 flex flex-col bg-white dark:bg-[#151D28]">
                {/* Secondary tab header */}
                <div className="flex items-center justify-between px-3 py-1 bg-[#ECE9D8] dark:bg-[#1A222D] border-b border-[#D4D0C8] dark:border-[#2D3748] text-xs font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <Columns className="w-3.5 h-3.5 text-blue-500" />
                    <span className="truncate">View 2: {splitDocument.name}</span>
                  </div>
                  <button
                    onClick={() => setIsSplitView(false)}
                    className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                    title="Close Split View"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 min-h-0">
                  <EditorPane
                    file={splitDocument}
                    onChangeContent={(content) => handleContentChange(content, splitDocument.id)}
                    onUpdateCursor={() => {}}
                    settings={settings}
                    onFileDrop={handleLoadFiles}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Assistant Drawer */}
        <AIAssistantDrawer
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          config={aiConfig}
          onOpenSettings={() => setIsAISettingsOpen(true)}
          activeDocument={activeDocument}
          allDocuments={documents}
          selectedText={cursorInfo.selectedText}
          onInsertCodeAtCursor={handleInsertCodeAtCursor}
          onReplaceDocumentContent={handleReplaceDocumentContent}
          onOpenCodeInNewTab={handleOpenCodeInNewTab}
          models={aiModels}
          onQuickModelChange={(modelId, provider) => {
            const updated = { ...aiConfig, model: modelId, provider };
            setAiConfig(updated);
            saveAIConfigToStorage(updated);
          }}
        />
      </div>

      {/* Mobile Keyboard Quick Accessory Bar */}
      <MobileQuickBar
        onInsertText={handleInsertText}
        onUndo={() => {}}
        onRedo={() => {}}
        onSave={() => handleSaveDocument(activeTabId)}
        onSearch={() => { setFindReplaceTab('find'); setIsFindReplaceOpen(true); }}
      />

      {/* Classic Notepad++ Status Bar */}
      <StatusBar
        cursorInfo={cursorInfo}
        currentLanguage={activeDocument.language}
        onChangeLanguage={(lang) => {
          setDocuments(prev =>
            prev.map(d => (d.id === activeTabId ? { ...d, language: lang } : d))
          );
        }}
        lineEnding={activeDocument.lineEnding}
        onChangeLineEnding={(ending) => {
          setDocuments(prev =>
            prev.map(d => (d.id === activeTabId ? { ...d, lineEnding: ending, isDirty: true } : d))
          );
        }}
        encoding={activeDocument.encoding}
        onChangeEncoding={(enc) => {
          setDocuments(prev =>
            prev.map(d => (d.id === activeTabId ? { ...d, encoding: enc, isDirty: true } : d))
          );
        }}
        fontSize={settings.fontSize}
        onResetZoom={() => setSettings(s => ({ ...s, fontSize: 14 }))}
        isReadOnly={activeDocument.readOnly}
        onToggleReadOnly={() => {
          setDocuments(prev =>
            prev.map(d => (d.id === activeTabId ? { ...d, readOnly: !d.readOnly } : d))
          );
        }}
        isOnline={isOnline}
        insertMode={insertMode}
        onToggleInsertMode={() => setInsertMode(m => (m === 'INS' ? 'OVR' : 'INS'))}
      />

      {/* Find and Replace Modal */}
      <FindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        activeTab={findReplaceTab}
        setActiveTab={setFindReplaceTab}
        onFindNext={handleFindNext}
        onFindPrev={handleFindPrev}
        onReplace={handleReplaceOne}
        onReplaceAll={handleReplaceAll}
        onCount={handleCountMatches}
        initialQuery={cursorInfo.selectedText}
      />

      {/* Live Preview / Code Runner Modal */}
      <LivePreviewModal
        isOpen={isLivePreviewOpen}
        onClose={() => setIsLivePreviewOpen(false)}
        document={activeDocument}
        allDocuments={documents}
      />

      {/* Keyboard Shortcuts Reference */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* About Notepad++ Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={isPWAInstallModalOpen}
        onClose={() => setIsPWAInstallModalOpen(false)}
        isInstallable={isInstallable}
        onTriggerInstall={triggerPWAInstall}
        isIOS={isIOS}
      />

      {/* AI Assistant Settings Modal */}
      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        config={aiConfig}
        onSaveConfig={(newConfig) => {
          setAiConfig(newConfig);
          saveAIConfigToStorage(newConfig);
        }}
        models={aiModels}
        hasServerGeminiKey={hasServerGeminiKey}
        hasServerOpenRouterKey={hasServerOpenRouterKey}
      />

      {/* Save to Local Disk Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-9 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center justify-center sm:justify-start gap-2.5 bg-[#1A2230] text-white px-4 py-2.5 rounded-lg shadow-2xl border border-emerald-500/80 text-xs font-sans animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <Save className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
