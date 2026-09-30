export type LineEnding = 'CRLF' | 'LF';
export type EncodingType = 'UTF-8' | 'ANSI' | 'UTF-16 LE';

export interface DocumentFile {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
  lineEnding: LineEnding;
  encoding: EncodingType;
  readOnly: boolean;
  createdAt: number;
  updatedAt: number;
  cursorPosition?: {
    lineNumber: number;
    column: number;
  };
}

export type ThemeType = 'npp-classic' | 'npp-dark' | 'vs-dark' | 'monokai' | 'dracula' | 'github-light';

export type SplitViewMode = 'none' | 'vertical' | 'horizontal';

export interface EditorSettings {
  theme: ThemeType;
  fontSize: number;
  wordWrap: boolean;
  showMinimap: boolean;
  showWhitespace: boolean;
  tabSize: number;
  insertSpaces: boolean;
  lineNumbers: boolean;
  autoSave: boolean;
}

export interface CursorInfo {
  lineNumber: number;
  column: number;
  selectionLength: number;
  selectedText: string;
  totalLines: number;
  totalLength: number;
}
