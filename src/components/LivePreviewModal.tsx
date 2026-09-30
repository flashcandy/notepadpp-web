import React, { useState, useEffect, useRef } from 'react';
import { Play, X, RefreshCw, Terminal, Maximize2, ExternalLink, Code2 } from 'lucide-react';
import { DocumentFile } from '../types';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentFile;
  allDocuments: DocumentFile[];
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  onClose,
  document,
  allDocuments,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showConsole, setShowConsole] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setLogs([]);
  }, [document.id, refreshKey]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'NPP_RUNNER_LOG') {
        setLogs(prev => [...prev, e.data.log]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isOpen) return null;

  // Build bundle for preview
  let previewSrcDoc = '';

  if (document.language === 'html' || document.name.endsWith('.html')) {
    // Inject console capture script
    const consoleCaptureScript = `
      <script>
        (function() {
          const oldLog = console.log;
          const oldError = console.error;
          const oldWarn = console.warn;
          console.log = function(...args) {
            window.parent.postMessage({ type: 'NPP_RUNNER_LOG', log: '[LOG] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') }, '*');
            oldLog.apply(console, args);
          };
          console.warn = function(...args) {
            window.parent.postMessage({ type: 'NPP_RUNNER_LOG', log: '[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') }, '*');
            oldWarn.apply(console, args);
          };
          console.error = function(...args) {
            window.parent.postMessage({ type: 'NPP_RUNNER_LOG', log: '[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') }, '*');
            oldError.apply(console, args);
          };
          window.onerror = function(msg, url, line) {
            window.parent.postMessage({ type: 'NPP_RUNNER_LOG', log: '[RUNTIME ERROR] ' + msg + ' (line ' + line + ')' }, '*');
          };
        })();
      </script>
    `;

    // Also link any existing style.css or script.js from open documents if referenced!
    let content = document.content;
    allDocuments.forEach(doc => {
      if (doc.name.endsWith('.css') && content.includes(doc.name)) {
        content = content.replace(
          new RegExp(`<link[^>]*href=["']${doc.name}["'][^>]*>`, 'g'),
          `<style>${doc.content}</style>`
        );
      }
      if (doc.name.endsWith('.js') && content.includes(doc.name)) {
        content = content.replace(
          new RegExp(`<script[^>]*src=["']${doc.name}["'][^>]*>\\s*<\\/script>`, 'g'),
          `<script>${doc.content}</script>`
        );
      }
    });

    previewSrcDoc = `${consoleCaptureScript}\n${content}`;
  } else if (document.language === 'javascript' || document.name.endsWith('.js')) {
    previewSrcDoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: monospace; background: #0f172a; color: #f8fafc; padding: 16px; margin: 0; }
          .title { color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 8px; margin-bottom: 12px; font-weight: bold; }
        </style>
        <script>
          (function() {
            window.onerror = function(msg, url, line) {
              window.parent.postMessage({ type: 'NPP_RUNNER_LOG', log: '[RUNTIME ERROR] ' + msg + ' (line ' + line + ')' }, '*');
            };
            const oldLog = console.log;
            console.log = function(...args) {
              window.parent.postMessage({ type: 'NPP_RUNNER_LOG', log: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : a).join(' ') }, '*');
              oldLog.apply(console, args);
            };
          })();
        </script>
      </head>
      <body>
        <div class="title">⚡ Running ${document.name}</div>
        <script>
          try {
            ${document.content}
          } catch(err) {
            console.log("[ERROR] " + err.message);
          }
        </script>
      </body>
      </html>
    `;
  } else if (document.language === 'markdown' || document.name.endsWith('.md')) {
    previewSrcDoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1e293b; padding: 24px; max-width: 800px; margin: 0 auto; }
          h1, h2, h3 { color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          pre { background: #f1f5f9; padding: 12px; border-radius: 6px; overflow-x: auto; font-family: monospace; }
          blockquote { border-left: 4px solid #3b82f6; padding-left: 12px; color: #64748b; font-style: italic; }
          ul, ol { padding-left: 20px; }
        </style>
      </head>
      <body>
        <pre style="background: transparent; font-family: system-ui; white-space: pre-wrap;">${document.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      </body>
      </html>
    `;
  } else {
    previewSrcDoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: monospace; background: #0f172a; color: #f8fafc; padding: 20px; white-space: pre-wrap; word-break: break-all; }
        </style>
      </head>
      <body>${document.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
      </html>
    `;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div 
        className="w-full max-w-4xl h-[85vh] bg-[#ECE9D8] dark:bg-[#1E2530] border border-[#7F9DB9] dark:border-[#374151] rounded-lg shadow-2xl flex flex-col overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#0055EA] dark:bg-[#2563EB] text-white font-medium select-none shrink-0">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 fill-current text-emerald-300" />
            <span className="font-semibold">Notepad++ Live Runner & Preview — {document.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              title="Refresh / Rerun"
              className="p-1 hover:bg-white/20 rounded active:scale-95 transition-transform"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowConsole(!showConsole)}
              title="Toggle Console Logs"
              className={`p-1 rounded active:scale-95 transition-transform ${showConsole ? 'bg-white/30' : 'hover:bg-white/20'}`}
            >
              <Terminal className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              title="Close Preview"
              className="p-1 hover:bg-red-500 rounded active:scale-95 transition-transform"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-white dark:bg-slate-900">
          {/* Output iframe */}
          <div className="flex-1 h-full min-h-[300px] border-r border-gray-200 dark:border-gray-800">
            <iframe
              key={refreshKey}
              ref={iframeRef}
              srcDoc={previewSrcDoc}
              title="Live Code Preview"
              sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
              className="w-full h-full border-none bg-white"
            />
          </div>

          {/* Console Drawer */}
          {showConsole && (
            <div className="w-full md:w-80 h-48 md:h-full bg-[#0F172A] text-slate-100 flex flex-col shrink-0 border-t md:border-t-0 md:border-l border-slate-700 font-mono text-[11px]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#1E293B] border-b border-slate-700 text-slate-300 font-sans text-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Console Output
                </span>
                <button
                  onClick={() => setLogs([])}
                  className="px-1.5 py-0.5 text-[10px] hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              </div>

              <div className="flex-1 p-2 overflow-y-auto space-y-1 select-text">
                {logs.length === 0 ? (
                  <div className="text-slate-500 italic py-2">
                    Console is empty. Output from console.log() and runtime errors appear here.
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`break-words ${
                        log.startsWith('[ERROR]') || log.startsWith('[RUNTIME ERROR]') 
                          ? 'text-red-400' 
                          : log.startsWith('[WARN]') 
                          ? 'text-amber-400' 
                          : 'text-emerald-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
