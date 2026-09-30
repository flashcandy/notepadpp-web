import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, X, Plus, RefreshCw, Check, Copy, 
  FileCode, Bug, Zap, BookOpen, TestTube, Layers, Download, CheckCircle2, ChevronUp, ChevronDown
} from 'lucide-react';
import { AIConfig, AIModel } from '../types/ai';
import { DocumentFile } from '../types';

interface CopilotBarProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  activeDocument: DocumentFile;
  allDocuments: DocumentFile[];
  selectedText: string;
  onInsertCodeAtCursor: (code: string) => void;
  onReplaceDocumentContent: (code: string) => void;
  onOpenCodeInNewTab: (code: string, language: string, title?: string) => void;
  models: AIModel[];
  onQuickModelChange: (modelId: string, provider: 'gemini' | 'openrouter') => void;
  onOpenSettings: () => void;
}

export const CopilotBar: React.FC<CopilotBarProps> = ({
  isOpen,
  onClose,
  config,
  activeDocument,
  allDocuments,
  selectedText,
  onInsertCodeAtCursor,
  onReplaceDocumentContent,
  onOpenCodeInNewTab,
  models,
  onQuickModelChange,
  onOpenSettings,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('plaintext');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scope, setScope] = useState<'current' | 'workspace'>('current');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentModel = models.find((m) => m.id === config.model) || models[0];

  const handleExecute = async (action: string = 'generate', customPrompt?: string) => {
    const finalPrompt = customPrompt !== undefined ? customPrompt : prompt;
    if (!finalPrompt.trim() && action === 'generate') return;

    setIsLoading(true);
    setErrorMessage(null);
    setGeneratedCode(null);
    setExplanation(null);

    try {
      const targetCode = selectedText.trim() || activeDocument.content;
      
      const payload: any = {
        provider: config.provider,
        model: config.model,
        prompt: finalPrompt,
        code: targetCode,
        language: activeDocument.language,
        action,
        userApiKey: config.provider === 'openrouter' ? config.openRouterApiKey : config.googleApiKey,
      };

      if (scope === 'workspace' && allDocuments.length > 1) {
        payload.workspaceDocs = allDocuments.map((d) => ({
          name: d.name,
          language: d.language,
          content: d.content,
        }));
      }

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: Failed to generate code`);
      }

      const text = data.text || '';
      
      // Parse markdown code block if present
      const codeMatch = text.match(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/);
      if (codeMatch) {
        setDetectedLanguage(codeMatch[1] || activeDocument.language);
        setGeneratedCode(codeMatch[2].trimEnd());
        
        // Remove code block to get explanation
        const cleanedExplanation = text.replace(/```[a-zA-Z0-9_-]*\n[\s\S]*?```/g, '').trim();
        if (cleanedExplanation) {
          setExplanation(cleanedExplanation);
        }
      } else {
        // Raw code or text
        setGeneratedCode(text.trim());
        setDetectedLanguage(activeDocument.language);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error executing Copilot request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectDownload = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `copilot-${activeDocument.name || 'code.txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-[#F3F2EA] dark:bg-[#131B26] border-b border-[#D4D0C8] dark:border-[#2D3748] shadow-md z-20 shrink-0 text-xs">
      {/* Copilot Bar Main Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#E6E4D9] dark:bg-[#1A2332] border-b border-[#D4D0C8] dark:border-[#2A3649]">
        <div className="flex items-center gap-2">
          {/* GitHub Copilot Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-600 text-white font-semibold text-[11px] tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-current text-amber-300" />
            <span>GitHub Copilot</span>
          </div>

          {/* Scope Selector */}
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded overflow-hidden text-[11px]">
            <button
              onClick={() => setScope('current')}
              title={`Analyze only active file (${activeDocument.name})`}
              className={`px-2 py-0.5 font-medium transition-colors ${
                scope === 'current'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              📄 {activeDocument.name} {selectedText ? `(${selectedText.length} sel)` : ''}
            </button>
            <button
              onClick={() => setScope('workspace')}
              title={`Include all ${allDocuments.length} open tabs in Copilot context`}
              className={`px-2 py-0.5 font-medium flex items-center gap-1 transition-colors ${
                scope === 'workspace'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>All Tabs ({allDocuments.length})</span>
            </button>
          </div>

          {/* Model indicator / switcher */}
          <select
            value={config.model}
            onChange={(e) => {
              const selected = models.find((m) => m.id === e.target.value);
              if (selected) {
                onQuickModelChange(selected.id, selected.provider);
              }
            }}
            className="text-[11px] px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 outline-none max-w-[160px] truncate"
            title="Switch AI Engine"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse Copilot Panel' : 'Expand Copilot Panel'}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            title="Close Copilot (Esc)"
            className="p-1 hover:bg-red-500 hover:text-white rounded text-slate-600 dark:text-slate-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Interactive Area */}
      {isExpanded && (
        <div className="p-3 space-y-2.5">
          {/* Quick Action Pills for Document Analysis & Generation */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-0.5">Quick Actions:</span>
            <button
              onClick={() => handleExecute('analyze', 'Analyze open document for bugs, architecture, and improvements')}
              disabled={isLoading}
              className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-300 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-200 rounded flex items-center gap-1 shadow-xs transition-colors"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Analyze Document</span>
            </button>
            <button
              onClick={() => handleExecute('fix', 'Find and fix all bugs, edge cases, and runtime issues in this code')}
              disabled={isLoading}
              className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-300 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200 rounded flex items-center gap-1 shadow-xs transition-colors"
            >
              <Bug className="w-3 h-3 text-emerald-500" />
              <span>Fix Bugs</span>
            </button>
            <button
              onClick={() => handleExecute('test', 'Generate comprehensive runnable unit tests for this document')}
              disabled={isLoading}
              className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-300 dark:border-slate-700 hover:border-purple-400 text-slate-700 dark:text-slate-200 rounded flex items-center gap-1 shadow-xs transition-colors"
            >
              <TestTube className="w-3 h-3 text-purple-500" />
              <span>Write Unit Tests</span>
            </button>
            <button
              onClick={() => handleExecute('refactor', 'Refactor this code for readability, performance, and best practices')}
              disabled={isLoading}
              className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-300 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 rounded flex items-center gap-1 shadow-xs transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-indigo-500" />
              <span>Refactor & Clean</span>
            </button>
            <button
              onClick={() => handleExecute('doc', 'Add complete comments and documentation to this code')}
              disabled={isLoading}
              className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-300 dark:border-slate-700 hover:border-teal-400 text-slate-700 dark:text-slate-200 rounded flex items-center gap-1 shadow-xs transition-colors"
            >
              <BookOpen className="w-3 h-3 text-teal-500" />
              <span>Document</span>
            </button>
          </div>

          {/* Prompt Input Box */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleExecute('generate');
                  }
                  if (e.key === 'Escape') {
                    onClose();
                  }
                }}
                placeholder="Ask Copilot (e.g. 'Add input validation', 'Create a debounce utility', or 'Explain this logic')..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans shadow-inner"
              />
            </div>
            <button
              onClick={() => handleExecute('generate')}
              disabled={isLoading || (!prompt.trim() && !selectedText)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask Copilot</span>
                </>
              )}
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900 rounded-lg text-xs text-red-700 dark:text-red-300 flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={onOpenSettings}
                className="underline font-medium hover:text-red-800 ml-2"
              >
                Settings
              </button>
            </div>
          )}

          {/* Generated Code Result Panel with Zero Manual Copy Actions */}
          {generatedCode && (
            <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-950 text-slate-100 overflow-hidden shadow-lg animate-in fade-in duration-200">
              {/* Action Bar Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-bold uppercase">
                    {detectedLanguage}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    ({generatedCode.split('\n').length} lines)
                  </span>
                </div>

                {/* ZERO MANUAL COPY BUTTONS */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* 1. Insert at Cursor / Replace Selection */}
                  <button
                    onClick={() => {
                      onInsertCodeAtCursor(generatedCode);
                      onClose();
                    }}
                    title="Directly insert at cursor or replace selection without manual copying"
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold flex items-center gap-1 transition-colors shadow-xs active:scale-95"
                  >
                    <Zap className="w-3 h-3 text-amber-300 fill-current" />
                    <span>{selectedText ? 'Replace Selection' : '⚡ Insert at Cursor'}</span>
                  </button>

                  {/* 2. Replace Whole Document Content */}
                  <button
                    onClick={() => {
                      onReplaceDocumentContent(generatedCode);
                      onClose();
                    }}
                    title="Replace the entire open document content with this code in 1 click"
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium flex items-center gap-1 transition-colors shadow-xs active:scale-95"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>🔄 Replace File Content</span>
                  </button>

                  {/* 3. Save as New Tab */}
                  <button
                    onClick={() => {
                      onOpenCodeInNewTab(
                        generatedCode,
                        detectedLanguage,
                        `copilot-${Date.now().toString().slice(-4)}.${detectedLanguage === 'javascript' ? 'js' : detectedLanguage === 'python' ? 'py' : detectedLanguage === 'typescript' ? 'ts' : detectedLanguage === 'html' ? 'html' : 'txt'}`
                      );
                      onClose();
                    }}
                    title="Create a new document tab with this code and switch to it immediately"
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium flex items-center gap-1 transition-colors border border-slate-700"
                  >
                    <Plus className="w-3 h-3 text-blue-400" />
                    <span>💾 Save to New Tab</span>
                  </button>

                  {/* 4. Download File Directly */}
                  <button
                    onClick={handleDirectDownload}
                    title="Directly save/download this code as a physical file on disk"
                    className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {/* 5. Copy with feedback */}
                  <button
                    onClick={handleCopy}
                    title="Copy code to clipboard"
                    className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Code Snippet Box */}
              <pre className="p-3 text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed select-text bg-[#0D1117] text-slate-100">
                {generatedCode}
              </pre>

              {/* Optional brief explanation */}
              {explanation && (
                <div className="p-2.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-300 leading-normal select-text">
                  <span className="font-semibold text-blue-400 mr-1.5">Note:</span>
                  {explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
