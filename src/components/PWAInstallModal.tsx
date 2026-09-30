import React from 'react';
import { X, Download, Share, PlusSquare, CheckCircle, Smartphone, Laptop } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  onTriggerInstall: () => void;
  isIOS: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  onTriggerInstall,
  isIOS,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#1E2530] border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl text-xs text-slate-800 dark:text-slate-200 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0055EA] dark:bg-[#2563EB] text-white font-medium select-none">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="font-semibold text-sm">Install Notepad++ App</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src="/icon.svg" 
              alt="Notepad++ Logo" 
              className="w-14 h-14 rounded-xl shadow"
            />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Notepad++ Web Edition
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Install as a standalone native-like app on desktop or mobile.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Full offline editing with LocalStorage saving</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Fast window launch from your desktop or home screen</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>No browser toolbars, maximal screen workspace</span>
            </div>
          </div>

          {/* Desktop / Android Flow */}
          {isInstallable && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onTriggerInstall();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-semibold shadow transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Install Application Now</span>
              </button>
            </div>
          )}

          {/* iOS Safari Instructions */}
          {isIOS && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> To install on iPhone or iPad:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Tap the <strong>Share button</strong> <Share className="inline w-3.5 h-3.5 text-blue-500 mx-0.5" /> in Safari’s bottom bar.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="inline w-3.5 h-3.5 text-blue-500 mx-0.5" />.</li>
                <li>Tap <strong>Add</strong> in the top-right corner.</li>
              </ol>
            </div>
          )}

          {!isInstallable && !isIOS && (
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              To install in Chrome or Edge, click the <strong>Install</strong> icon in the browser address bar (top right) or menu <strong>(⋮) → Install Notepad++</strong>.
            </div>
          )}
        </div>

        <div className="flex justify-end p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/40">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
