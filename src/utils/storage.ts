import { DocumentFile, EditorSettings } from '../types';
import { AIConfig, DEFAULT_AI_CONFIG } from '../types/ai';

const STORAGE_KEYS = {
  DOCUMENTS: 'npp_web_documents_v1',
  ACTIVE_TAB_ID: 'npp_web_active_tab_id_v1',
  SPLIT_TAB_ID: 'npp_web_split_tab_id_v1',
  SETTINGS: 'npp_web_settings_v1',
  SPLIT_VIEW_MODE: 'npp_web_split_view_mode_v1',
  RECENT_FILES: 'npp_web_recent_files_v1',
  AI_CONFIG: 'npp_web_ai_config_v1',
};

export const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'npp-classic',
  fontSize: 14,
  wordWrap: false,
  showMinimap: true,
  showWhitespace: false,
  tabSize: 4,
  insertSpaces: true,
  lineNumbers: true,
  autoSave: true,
};

const DEFAULT_DOCUMENTS: DocumentFile[] = [
  {
    id: 'doc-welcome',
    name: 'Welcome.txt',
    language: 'plaintext',
    content: `======================================================================
  Notepad++ Web Edition — Modern Browser & PWA Clone
======================================================================

Welcome to Notepad++ Web!
This application brings the beloved, lightweight, and versatile editing
experience of Notepad++ directly to your browser and mobile device.

KEY FEATURES:
----------------------------------------------------------------------
* Multi-Tab Document Interface
  - Blue floppy disk = Document saved
  - Red floppy disk = Modified / unsaved changes
  - Double-click empty tab space to create a new file
  - Right-click tabs for Close Others, Clone to Other View, etc.

* Dual View / Split Editor
  - Click the Split View button on the toolbar or right-click any tab
  - Compare files side-by-side or edit two documents simultaneously

* Drag-and-Drop File Loading
  - Drag files from your computer and drop them anywhere onto the editor!
  - Supports loading external source code, text files, JSON, and scripts.

* Monaco Editor Powered
  - Over 30+ syntax-highlighted languages supported
  - Line numbers, code folding, minimap (Document Map), bracket matching

* Persistent Local Storage
  - All your files and tabs are automatically saved in browser storage.
  - Refresh the page anytime and continue right where you left off.

* Text Manipulation (Edit -> Line Operations / Transform)
  - Sort lines alphabetically (A-Z / Z-A)
  - Remove duplicate lines & empty lines
  - Trim trailing spaces
  - Base64 / URL Encode & Decode

* Run & Live Preview (Run -> Launch Preview)
  - Test and run HTML, CSS, JavaScript, or Markdown directly in the app!

* Progressive Web App (PWA)
  - Click the "Install App" button in the toolbar to install on desktop or mobile.

SHORTCUTS:
----------------------------------------------------------------------
Ctrl + N          : New Document
Ctrl + O          : Open File from Device
Ctrl + S          : Save Active Document
Ctrl + Shift + S    : Save All Open Documents
Ctrl + W          : Close Active Tab
Ctrl + F          : Find & Search
Ctrl + H          : Find & Replace
Ctrl + G          : Go to Line
Ctrl + Alt + S    : Split View (Side-by-Side)
F11               : Toggle Fullscreen Mode

Enjoy fast, friction-free editing!
`,
    isDirty: false,
    lineEnding: 'CRLF',
    encoding: 'UTF-8',
    readOnly: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'doc-html-demo',
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notepad++ Live Demo</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 32px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
    }
    h1 { color: #38bdf8; margin-top: 0; font-size: 24px; }
    p { color: #94a3b8; line-height: 1.6; }
    button {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #1d4ed8; }
    #counter { font-weight: bold; color: #4ade80; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 Notepad++ Live Runner</h1>
    <p>Edit this HTML file and press <strong>Run -> Launch Preview</strong> on the toolbar to test changes live!</p>
    <p>Clicks: <span id="counter">0</span></p>
    <button onclick="increment()">Click Me</button>
  </div>

  <script>
    let count = 0;
    function increment() {
      count++;
      document.getElementById('counter').textContent = count;
    }
  </script>
</body>
</html>`,
    isDirty: false,
    lineEnding: 'CRLF',
    encoding: 'UTF-8',
    readOnly: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'doc-js-demo',
    name: 'algorithm.js',
    language: 'javascript',
    content: `/**
 * Fibonacci & Prime Generator
 * Notepad++ JavaScript sample
 */

function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

function generatePrimes(limit = 50) {
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}

console.log("Primes up to 50:", generatePrimes(50));
`,
    isDirty: false,
    lineEnding: 'LF',
    encoding: 'UTF-8',
    readOnly: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'doc-notes-md',
    name: 'Notes.md',
    language: 'markdown',
    content: `# 📝 Project Notes & Tasks

## Sprint Checklist
- [x] Integrate Monaco Editor for syntax highlighting
- [x] Implement multi-tab management with dirty state indicator
- [x] Configure LocalStorage persistence
- [x] Add drag-and-drop file loading support
- [x] Setup PWA for mobile & desktop installation
- [x] Provide dual split-view editing
- [x] Add classic Notepad++ line transforms and search

> *“Code is like humor. When you have to explain it, it’s bad.”* – Cory House
`,
    isDirty: false,
    lineEnding: 'CRLF',
    encoding: 'UTF-8',
    readOnly: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export function loadDocumentsFromStorage(): DocumentFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!raw) return DEFAULT_DOCUMENTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_DOCUMENTS;
  } catch (e) {
    console.warn('Failed to parse documents from localStorage, restoring defaults', e);
    return DEFAULT_DOCUMENTS;
  }
}

export function saveDocumentsToStorage(docs: DocumentFile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save documents to localStorage', e);
  }
}

export function loadActiveTabIdFromStorage(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB_ID) || 'doc-welcome';
  } catch {
    return 'doc-welcome';
  }
}

export function saveActiveTabIdToStorage(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB_ID, id);
  } catch {}
}

export function loadSplitTabIdFromStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.SPLIT_TAB_ID);
  } catch {
    return null;
  }
}

export function saveSplitTabIdToStorage(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.SPLIT_TAB_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SPLIT_TAB_ID);
    }
  } catch {}
}

export function loadSettingsFromStorage(): EditorSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: EditorSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
}

export function loadRecentFiles(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT_FILES);
    return raw ? JSON.parse(raw) : ['Welcome.txt', 'index.html', 'algorithm.js', 'Notes.md'];
  } catch {
    return [];
  }
}

export function saveRecentFile(filename: string): void {
  try {
    const recents = loadRecentFiles().filter(f => f !== filename);
    recents.unshift(filename);
    localStorage.setItem(STORAGE_KEYS.RECENT_FILES, JSON.stringify(recents.slice(0, 10)));
  } catch {}
}

export function loadAIConfigFromStorage(): AIConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AI_CONFIG);
    if (!raw) return DEFAULT_AI_CONFIG;
    const config = { ...DEFAULT_AI_CONFIG, ...JSON.parse(raw) };
    // Migrate deprecated OpenRouter slugs
    if (
      config.model === 'qwen/qwen-2.5-coder-32b-instruct:free' ||
      config.model === 'meta-llama/llama-3.3-70b-instruct:free' ||
      config.model === 'mistralai/mistral-small-24b-instruct-2501:free'
    ) {
      config.model = 'openrouter/free';
    }
    return config;
  } catch {
    return DEFAULT_AI_CONFIG;
  }
}

export function saveAIConfigToStorage(config: AIConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AI_CONFIG, JSON.stringify(config));
  } catch {}
}
