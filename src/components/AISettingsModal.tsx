import React, { useState, useEffect } from 'react';
import { X, Sparkles, Key, Check, ExternalLink, ShieldCheck, Cpu } from 'lucide-react';
import { AIConfig, AIModel } from '../types/ai';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onSaveConfig: (config: AIConfig) => void;
  models: AIModel[];
  hasServerGeminiKey: boolean;
  hasServerOpenRouterKey: boolean;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  models,
  hasServerGeminiKey,
  hasServerOpenRouterKey,
}) => {
  const [provider, setProvider] = useState(config.provider);
  const [model, setModel] = useState(config.model);
  const [openRouterApiKey, setOpenRouterApiKey] = useState(config.openRouterApiKey);
  const [googleApiKey, setGoogleApiKey] = useState(config.googleApiKey);
  const [autoSendContext, setAutoSendContext] = useState(config.autoSendContext);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProvider(config.provider);
      setModel(config.model);
      setOpenRouterApiKey(config.openRouterApiKey);
      setGoogleApiKey(config.googleApiKey);
      setAutoSendContext(config.autoSendContext);
      setSavedToast(false);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      provider,
      model,
      openRouterApiKey: openRouterApiKey.trim(),
      googleApiKey: googleApiKey.trim(),
      autoSendContext,
    });
    setSavedToast(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const filteredModels = models.filter((m) => m.provider === provider);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#1E2530] border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl text-xs text-slate-800 dark:text-slate-200 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0055EA] dark:bg-[#2563EB] text-white font-medium select-none">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="font-semibold text-sm">Notepad++ AI Assistant Settings</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              AI Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setProvider('gemini');
                  setModel('gemini-2.5-flash');
                }}
                className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                  provider === 'gemini'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-xs">
                  <span>Google Gemini</span>
                  {hasServerGeminiKey && (
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-normal">
                      Ready
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Built-in Google Gemini 2.5 Flash & Pro models
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProvider('openrouter');
                  setModel('openrouter/free');
                }}
                className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                  provider === 'openrouter'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-xs">
                  <span>OpenRouter (Free)</span>
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-normal">
                    Free Models
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Auto Free Router, Qwen, Gemma 4, Nemotron & more
                </span>
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              Select AI Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#151D28] border border-gray-300 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-blue-500 font-sans"
            >
              {filteredModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.isFree ? '— Free' : ''}
                </option>
              ))}
            </select>
            {models.find((m) => m.id === model) && (
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {models.find((m) => m.id === model)?.description}
              </p>
            )}
          </div>

          {/* API Key Configurations */}
          {provider === 'openrouter' ? (
            <div className="space-y-2 p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  OpenRouter API Key
                </label>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  Get free key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={openRouterApiKey}
                onChange={(e) => setOpenRouterApiKey(e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-[#151D28] border border-gray-300 dark:border-gray-700 rounded text-xs font-mono outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Your key is stored safely in your browser’s local storage and used directly for OpenRouter model requests.
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Google Gemini API Status
                </label>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                {hasServerGeminiKey ? (
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Connected via server environment (no user key required)
                  </p>
                ) : (
                  <p className="text-amber-600 dark:text-amber-400">
                    No server key detected. You can paste your own Google Gemini API key below:
                  </p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Optional custom Google API key override..."
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-[#151D28] border border-gray-300 dark:border-gray-700 rounded text-xs font-mono outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Preferences */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={autoSendContext}
                onChange={(e) => setAutoSendContext(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Automatically include active code context with AI requests</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/40">
          <div>
            {savedToast && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Settings Saved!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow transition-colors active:scale-95"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
