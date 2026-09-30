import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Settings, X, Trash2, Copy, Check, Plus, 
  ArrowRight, RefreshCw, FileCode, CheckCircle2, ChevronDown, 
  HelpCircle, Wrench, Zap, BookOpen, Languages, Layers, Download, Bug, TestTube
} from 'lucide-react';
import { AIConfig, AIMessage, AIModel } from '../types/ai';
import { DocumentFile } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onOpenSettings: () => void;
  activeDocument: DocumentFile;
  allDocuments: DocumentFile[];
  selectedText: string;
  onInsertCodeAtCursor: (code: string) => void;
  onReplaceDocumentContent: (code: string) => void;
  onOpenCodeInNewTab: (code: string, language: string, title?: string) => void;
  models: AIModel[];
  onQuickModelChange: (modelId: string, provider: 'gemini' | 'openrouter') => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onOpenSettings,
  activeDocument,
  allDocuments,
  selectedText,
  onInsertCodeAtCursor,
  onReplaceDocumentContent,
  onOpenCodeInNewTab,
  models,
  onQuickModelChange,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I'm your **Notepad++ GitHub Copilot**.\n\nI can analyze your open documents, write code, find bugs, or create unit tests. Use the 1-click actions below any code to insert or save without manual copy!`,
      timestamp: Date.now(),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [scope, setScope] = useState<'current' | 'workspace'>('current');
  const [targetTranslateLang, setTargetTranslateLang] = useState('python');
  const [showTranslateSelect, setShowTranslateSelect] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentModelObj = models.find((m) => m.id === config.model) || models[0];

  const handleSendMessage = async (customAction?: string, overridePrompt?: string) => {
    const promptToSend = overridePrompt !== undefined ? overridePrompt : inputPrompt;
    if (!promptToSend.trim() && !customAction) return;

    const action = customAction || 'chat';
    const effectiveCode = selectedText || (config.autoSendContext ? activeDocument.content : '');

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: promptToSend || `Execute ${action} on code`,
      timestamp: Date.now(),
      action,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload: any = {
        provider: config.provider,
        model: config.model,
        prompt: promptToSend,
        code: effectiveCode,
        language: activeDocument.language,
        action,
        targetLanguage: action === 'translate' ? targetTranslateLang : undefined,
        userApiKey: config.provider === 'openrouter' ? config.openRouterApiKey : config.googleApiKey,
        history: messages
          .filter((m) => m.id !== 'welcome-msg')
          .slice(-6)
          .map((m) => ({ role: m.role, content: m.content })),
      };

      if (scope === 'workspace' && allDocuments.length > 1) {
        payload.workspaceDocs = allDocuments.map((d) => ({
          name: d.name,
          language: d.language,
          content: d.content,
        }));
      }

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server returned error (${response.status})`);
      }

      const assistantMessage: AIMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.text || 'Done!',
        timestamp: Date.now(),
        modelUsed: data.model,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate AI response.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleDownloadCode = (code: string, lang: string) => {
    const ext = lang === 'javascript' ? 'js' : lang === 'python' ? 'py' : lang === 'typescript' ? 'ts' : lang === 'html' ? 'html' : 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `copilot-${activeDocument.name || `code.${ext}`}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to render message with formatted code blocks and ZERO-COPY direct action buttons
  const renderMessageContent = (msg: AIMessage) => {
    const parts = msg.content.split(/(```[\s\S]*?```)/g);

    return (
      <div className="space-y-2 text-xs leading-relaxed break-words select-text">
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const lines = part.slice(3, -3).split('\n');
            const lang = lines[0].trim() || 'code';
            const codeBody = lines.slice(1).join('\n');
            const codeId = `${msg.id}-${index}`;

            return (
              <div 
                key={index} 
                className="my-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-slate-950 text-slate-100 overflow-hidden shadow-sm"
              >
                {/* Code header bar with ZERO MANUAL COPY BUTTONS */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 px-2.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-300">
                  <span className="font-mono text-emerald-400 font-semibold uppercase">{lang}</span>
                  
                  <div className="flex flex-wrap items-center gap-1">
                    {/* 1. Insert at Cursor */}
                    <button
                      onClick={() => onInsertCodeAtCursor(codeBody)}
                      className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-1 transition-colors font-medium active:scale-95 shadow-xs"
                      title="Insert code directly at cursor without copying"
                    >
                      <Zap className="w-3 h-3 text-amber-300 fill-current" />
                      <span>Insert</span>
                    </button>

                    {/* 2. Replace Document Content */}
                    <button
                      onClick={() => onReplaceDocumentContent(codeBody)}
                      className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded flex items-center gap-1 transition-colors font-medium active:scale-95 shadow-xs"
                      title="Replace entire active file with this code"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Replace</span>
                    </button>

                    {/* 3. Save as New Tab */}
                    <button
                      onClick={() => onOpenCodeInNewTab(codeBody, lang, `copilot-${lang}-${Date.now().toString().slice(-4)}.${lang === 'javascript' ? 'js' : lang === 'python' ? 'py' : lang === 'typescript' ? 'ts' : lang === 'html' ? 'html' : 'txt'}`)}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 transition-colors border border-slate-700"
                      title="Open in new document tab and switch to it"
                    >
                      <Plus className="w-3 h-3 text-blue-400" />
                      <span>New Tab</span>
                    </button>

                    {/* 4. Download file */}
                    <button
                      onClick={() => handleDownloadCode(codeBody, lang)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                      title="Directly save/download code as file on disk"
                    >
                      <Download className="w-3 h-3" />
                    </button>

                    {/* 5. Copy */}
                    <button
                      onClick={() => handleCopyCode(codeBody, codeId)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                      title="Copy code to clipboard"
                    >
                      {copiedCodeId === codeId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Code content */}
                <pre className="p-3 text-[11px] font-mono overflow-x-auto whitespace-pre leading-normal bg-[#0D1117]">
                  {codeBody}
                </pre>
              </div>
            );
          }

          // Plain text markdown handling
          return (
            <p key={index} className="whitespace-pre-wrap">
              {part}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden"
        onClick={onClose}
      />

      <div className="fixed md:relative inset-y-0 right-0 z-50 md:z-30 w-full sm:w-96 md:w-96 h-full bg-[#F5F4EC] dark:bg-[#151D28] border-l border-[#D4D0C8] dark:border-[#2D3748] flex flex-col shrink-0 select-none shadow-2xl animate-in slide-in-from-right-4 md:animate-none duration-150">
        {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0055EA] dark:bg-[#2563EB] text-white shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="font-semibold text-xs tracking-wide">Notepad++ GitHub Copilot</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSettings}
            title="Configure AI Models & Keys"
            className="p-1 hover:bg-white/20 rounded active:scale-95 transition-transform"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setMessages([
                {
                  id: 'welcome-msg',
                  role: 'assistant',
                  content: "Chat cleared. What code or document would you like to analyze next?",
                  timestamp: Date.now(),
                },
              ]);
            }}
            title="Clear Chat History"
            className="p-1 hover:bg-white/20 rounded active:scale-95 transition-transform"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            title="Close Assistant"
            className="p-1 hover:bg-white/20 rounded active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scope Selector Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#E8E6DC] dark:bg-[#1C2433] border-b border-[#D4D0C8] dark:border-[#2D3748] text-[11px]">
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-0.5">
          <button
            onClick={() => setScope('current')}
            title="Analyze active file only"
            className={`px-2 py-0.5 rounded transition-colors font-medium ${
              scope === 'current'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            📄 Current File
          </button>
          <button
            onClick={() => setScope('workspace')}
            title={`Analyze all ${allDocuments.length} open document tabs`}
            className={`px-2 py-0.5 rounded transition-colors font-medium flex items-center gap-1 ${
              scope === 'workspace'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>All Tabs ({allDocuments.length})</span>
          </button>
        </div>

        {/* Engine picker */}
        <select
          value={config.model}
          onChange={(e) => {
            const selected = models.find((m) => m.id === e.target.value);
            if (selected) {
              onQuickModelChange(selected.id, selected.provider);
            }
          }}
          className="text-[11px] px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 outline-none max-w-[130px] truncate"
          title="Switch Model"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Action Buttons for Document Analysis */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-[#F0EFE7] dark:bg-[#1A2230] border-b border-[#D4D0C8] dark:border-[#2D3748] overflow-x-auto scrollbar-none text-[11px]">
        <button
          onClick={() => handleSendMessage('analyze', `Perform a full GitHub Copilot analysis of ${activeDocument.name} for bugs, security, and architecture.`)}
          disabled={isLoading}
          className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center gap-1 whitespace-nowrap shadow-2xs"
        >
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Analyze</span>
        </button>
        <button
          onClick={() => handleSendMessage('fix', `Find and fix all bugs in ${activeDocument.name}.`)}
          disabled={isLoading}
          className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center gap-1 whitespace-nowrap shadow-2xs"
        >
          <Bug className="w-3 h-3 text-emerald-500" />
          <span>Fix Bugs</span>
        </button>
        <button
          onClick={() => handleSendMessage('test', `Write comprehensive unit tests for ${activeDocument.name}.`)}
          disabled={isLoading}
          className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center gap-1 whitespace-nowrap shadow-2xs"
        >
          <TestTube className="w-3 h-3 text-purple-500" />
          <span>Unit Tests</span>
        </button>
        <button
          onClick={() => handleSendMessage('refactor', `Refactor and clean ${activeDocument.name}.`)}
          disabled={isLoading}
          className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center gap-1 whitespace-nowrap shadow-2xs"
        >
          <RefreshCw className="w-3 h-3 text-indigo-500" />
          <span>Refactor</span>
        </button>
        <button
          onClick={() => handleSendMessage('doc', `Add documentation and docstrings to ${activeDocument.name}.`)}
          disabled={isLoading}
          className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center gap-1 whitespace-nowrap shadow-2xs"
        >
          <BookOpen className="w-3 h-3 text-teal-500" />
          <span>Doc</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[90%] rounded-xl px-3 py-2 text-xs shadow-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none'
              }`}
            >
              {msg.role === 'assistant' ? (
                renderMessageContent(msg)
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.content}</p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
              <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {msg.modelUsed && <span>• {msg.modelUsed}</span>}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
            <span>Copilot is analyzing and writing code...</span>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900 rounded-lg text-xs text-red-700 dark:text-red-300 space-y-2">
            <div>
              <div className="font-semibold">Copilot Error</div>
              <p className="break-words mt-0.5">{errorMessage}</p>
            </div>
            
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-red-200 dark:border-red-900/50">
              <button
                onClick={() => {
                  onQuickModelChange('gemini-2.5-flash', 'gemini');
                  setErrorMessage(null);
                }}
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-slate-700 rounded text-[11px] font-medium text-blue-700 dark:text-blue-300 shadow-xs"
              >
                ✨ Switch to Google Gemini (Fast & Free)
              </button>
              <button
                onClick={() => {
                  onQuickModelChange('openrouter/free', 'openrouter');
                  setErrorMessage(null);
                }}
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded text-[11px] font-medium text-slate-800 dark:text-slate-200 shadow-xs"
              >
                🔄 Switch to OpenRouter Free Router
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-[#101722] border-t border-[#D4D0C8] dark:border-[#2D3748] shrink-0">
        <div className="relative border border-slate-300 dark:border-slate-700 rounded-lg bg-[#FAF9F5] dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-inner">
          <textarea
            ref={textareaRef}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask Copilot to analyze, generate, or modify code... (Enter to send)"
            rows={2}
            className="w-full p-2.5 bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none resize-none"
          />

          <div className="flex items-center justify-between px-2.5 pb-2 pt-1 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500">
            <span>Shift+Enter for newline</span>
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded font-medium flex items-center gap-1 transition-all shadow-xs active:scale-95"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
