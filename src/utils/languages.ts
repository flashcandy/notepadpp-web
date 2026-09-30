export interface LanguageDefinition {
  id: string;
  name: string;
  extensions: string[];
  aliases?: string[];
  monacoId: string;
}

export const SUPPORTED_LANGUAGES: LanguageDefinition[] = [
  { id: 'plaintext', name: 'Normal Text (Plain text)', extensions: ['.txt', '.text', '.log'], monacoId: 'plaintext' },
  { id: 'javascript', name: 'JavaScript', extensions: ['.js', '.mjs', '.cjs'], aliases: ['js'], monacoId: 'javascript' },
  { id: 'typescript', name: 'TypeScript', extensions: ['.ts', '.mts', '.cts'], aliases: ['ts'], monacoId: 'typescript' },
  { id: 'jsx', name: 'JavaScript (JSX)', extensions: ['.jsx'], aliases: ['react-js'], monacoId: 'javascript' },
  { id: 'tsx', name: 'TypeScript (TSX)', extensions: ['.tsx'], aliases: ['react-ts'], monacoId: 'typescript' },
  { id: 'html', name: 'HTML (HyperText Markup)', extensions: ['.html', '.htm', '.xhtml'], aliases: ['xhtml'], monacoId: 'html' },
  { id: 'css', name: 'CSS (Cascading Style Sheets)', extensions: ['.css'], monacoId: 'css' },
  { id: 'scss', name: 'SCSS / SASS', extensions: ['.scss', '.sass'], monacoId: 'scss' },
  { id: 'json', name: 'JSON (JavaScript Object Notation)', extensions: ['.json', '.jsonc'], monacoId: 'json' },
  { id: 'python', name: 'Python', extensions: ['.py', '.pyw', '.ipynb'], aliases: ['py'], monacoId: 'python' },
  { id: 'c', name: 'C', extensions: ['.c', '.h'], monacoId: 'c' },
  { id: 'cpp', name: 'C++', extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.hxx', '.hh'], aliases: ['c++'], monacoId: 'cpp' },
  { id: 'csharp', name: 'C#', extensions: ['.cs'], aliases: ['c#', 'csharp'], monacoId: 'csharp' },
  { id: 'java', name: 'Java', extensions: ['.java', '.class'], monacoId: 'java' },
  { id: 'rust', name: 'Rust', extensions: ['.rs'], aliases: ['rs'], monacoId: 'rust' },
  { id: 'go', name: 'Go', extensions: ['.go'], aliases: ['golang'], monacoId: 'go' },
  { id: 'php', name: 'PHP (Hypertext Preprocessor)', extensions: ['.php', '.phtml', '.php4', '.php5'], monacoId: 'php' },
  { id: 'sql', name: 'SQL (Structured Query)', extensions: ['.sql', '.ddl', '.dml'], monacoId: 'sql' },
  { id: 'markdown', name: 'Markdown', extensions: ['.md', '.markdown', '.mdown', '.mkd'], aliases: ['md'], monacoId: 'markdown' },
  { id: 'xml', name: 'XML (Extensible Markup)', extensions: ['.xml', '.svg', '.xaml', '.plist', '.xslt'], monacoId: 'xml' },
  { id: 'yaml', name: 'YAML', extensions: ['.yaml', '.yml'], aliases: ['yml'], monacoId: 'yaml' },
  { id: 'shell', name: 'Bash / Shell Script', extensions: ['.sh', '.bash', '.zsh', '.command'], aliases: ['sh', 'bash'], monacoId: 'shell' },
  { id: 'bat', name: 'Batch / Windows CMD', extensions: ['.bat', '.cmd'], monacoId: 'bat' },
  { id: 'powershell', name: 'PowerShell', extensions: ['.ps1', '.psm1', '.psd1'], aliases: ['ps'], monacoId: 'powershell' },
  { id: 'dockerfile', name: 'Dockerfile', extensions: ['.dockerfile', 'Dockerfile'], monacoId: 'dockerfile' },
  { id: 'ini', name: 'INI / Configuration', extensions: ['.ini', '.conf', '.cfg', '.properties'], monacoId: 'ini' },
  { id: 'ruby', name: 'Ruby', extensions: ['.rb', '.rake'], monacoId: 'ruby' },
  { id: 'swift', name: 'Swift', extensions: ['.swift'], monacoId: 'swift' },
  { id: 'kotlin', name: 'Kotlin', extensions: ['.kt', '.kts'], monacoId: 'kotlin' },
  { id: 'dart', name: 'Dart', extensions: ['.dart'], monacoId: 'dart' },
  { id: 'lua', name: 'Lua', extensions: ['.lua'], monacoId: 'lua' },
  { id: 'r', name: 'R Language', extensions: ['.r', '.R'], monacoId: 'r' },
  { id: 'perl', name: 'Perl', extensions: ['.pl', '.pm'], monacoId: 'perl' },
];

export function getLanguageByFilename(filename: string): LanguageDefinition {
  const lower = filename.toLowerCase();
  
  if (lower === 'dockerfile') {
    return SUPPORTED_LANGUAGES.find(l => l.id === 'dockerfile') || SUPPORTED_LANGUAGES[0];
  }

  const dotIndex = lower.lastIndexOf('.');
  if (dotIndex !== -1) {
    const ext = lower.substring(dotIndex);
    const match = SUPPORTED_LANGUAGES.find(l => l.extensions.includes(ext));
    if (match) return match;
  }

  return SUPPORTED_LANGUAGES[0]; // plaintext default
}

export function getLanguageById(id: string): LanguageDefinition {
  return SUPPORTED_LANGUAGES.find(l => l.id === id || l.monacoId === id) || SUPPORTED_LANGUAGES[0];
}
