import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import type * as monacoEditor from 'monaco-editor';
import { DocumentFile, EditorSettings, CursorInfo } from '../types';
import { getLanguageById } from '../utils/languages';

export interface EditorPaneHandle {
  insertTextAtCursor: (text: string) => void;
  replaceEntireDocument: (text: string) => void;
  focus: () => void;
}

interface EditorPaneProps {
  file: DocumentFile;
  onChangeContent: (content: string) => void;
  onUpdateCursor: (info: CursorInfo) => void;
  settings: EditorSettings;
  onFileDrop: (files: FileList) => void;
}

export const EditorPane = forwardRef<EditorPaneHandle, EditorPaneProps>(({
  file,
  onChangeContent,
  onUpdateCursor,
  settings,
  onFileDrop,
}, ref) => {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const langObj = getLanguageById(file.language);

  // Expose imperative handle for direct Copilot code injection
  useImperativeHandle(ref, () => ({
    insertTextAtCursor: (text: string) => {
      if (!editorRef.current) {
        const sep = file.content.length > 0 && !file.content.endsWith('\n') ? '\n' : '';
        onChangeContent(file.content + sep + text);
        return;
      }
      const editor = editorRef.current;
      const selection = editor.getSelection();
      if (selection) {
        editor.executeEdits('copilot', [{
          range: selection,
          text,
          forceMoveMarkers: true,
        }]);
        editor.pushUndoStop();
        editor.focus();
      } else {
        const position = editor.getPosition() || { lineNumber: 1, column: 1 };
        editor.executeEdits('copilot', [{
          range: new (monacoRef.current?.Range || Object)(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          ),
          text,
          forceMoveMarkers: true,
        }]);
        editor.pushUndoStop();
        editor.focus();
      }
    },
    replaceEntireDocument: (text: string) => {
      if (!editorRef.current) {
        onChangeContent(text);
        return;
      }
      const editor = editorRef.current;
      const model = editor.getModel();
      if (model) {
        const fullRange = model.getFullModelRange();
        editor.executeEdits('copilot', [{
          range: fullRange,
          text,
          forceMoveMarkers: true,
        }]);
        editor.pushUndoStop();
        editor.focus();
      } else {
        onChangeContent(text);
      }
    },
    focus: () => {
      editorRef.current?.focus();
    },
  }), [file.content, onChangeContent]);

  // Setup Monaco themes
  const handleEditorWillMount = (monaco: Monaco) => {
    monacoRef.current = monaco;

    // Notepad++ Classic Theme
    monaco.editor.defineTheme('notepad-classic', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'string', foreground: '808080' },
        { token: 'number', foreground: 'FF8000' },
        { token: 'type', foreground: '008080', fontStyle: 'bold' },
        { token: 'delimiter', foreground: '000000' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#E8EEF8',
        'editorLineNumber.foreground': '#808080',
        'editorLineNumber.activeForeground': '#000000',
        'editorGutter.background': '#ECE9D8',
        'editor.selectionBackground': '#C2D9FB',
        'editorCursor.foreground': '#000000',
      },
    });

    // Notepad++ Dark Theme
    monaco.editor.defineTheme('notepad-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '57A64A', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'string', foreground: 'D69D85' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': '#151D28',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#1F2937',
        'editorLineNumber.foreground': '#4E5C72',
        'editorLineNumber.activeForeground': '#38BDF8',
        'editorGutter.background': '#101722',
        'editor.selectionBackground': '#264F78',
        'editorCursor.foreground': '#58A6FF',
      },
    });

    // Monokai
    monaco.editor.defineTheme('monokai-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '75715E' },
        { token: 'keyword', foreground: 'F92672' },
        { token: 'string', foreground: 'E6DB74' },
        { token: 'number', foreground: 'AE81FF' },
        { token: 'type', foreground: '66D9EF' },
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#F8F8F2',
        'editor.lineHighlightBackground': '#3E3D32',
        'editorLineNumber.foreground': '#90908A',
        'editor.selectionBackground': '#49483E',
      },
    });

    // Dracula
    monaco.editor.defineTheme('dracula-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272A4' },
        { token: 'keyword', foreground: 'FF79C6' },
        { token: 'string', foreground: 'F1FA8C' },
        { token: 'number', foreground: 'BD93F9' },
        { token: 'type', foreground: '8BE9FD' },
      ],
      colors: {
        'editor.background': '#282A36',
        'editor.foreground': '#F8F8F2',
        'editor.lineHighlightBackground': '#44475A',
        'editorLineNumber.foreground': '#6272A4',
        'editor.selectionBackground': '#44475A',
      },
    });
  };

  const getMonacoThemeName = (theme: string) => {
    switch (theme) {
      case 'npp-classic':
        return 'notepad-classic';
      case 'npp-dark':
        return 'notepad-dark';
      case 'monokai':
        return 'monokai-theme';
      case 'dracula':
        return 'dracula-theme';
      case 'github-light':
        return 'vs';
      default:
        return 'vs-dark';
    }
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Track cursor position and selection
    const updateCursorStats = () => {
      const position = editor.getPosition();
      const selection = editor.getSelection();
      const model = editor.getModel();

      if (!position || !model) return;

      const selectedText = selection ? model.getValueInRange(selection) : '';
      const totalLines = model.getLineCount();
      const totalLength = model.getValueLength();

      onUpdateCursor({
        lineNumber: position.lineNumber,
        column: position.column,
        selectionLength: selectedText.length,
        selectedText,
        totalLines,
        totalLength,
      });
    };

    editor.onDidChangeCursorPosition(updateCursorStats);
    editor.onDidChangeCursorSelection(updateCursorStats);
    editor.onDidChangeModelContent(() => {
      updateCursorStats();
    });

    updateCursorStats();
  };

  // Drag and drop handler for loading external files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDrop(e.dataTransfer.files);
    }
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative w-full h-full overflow-hidden bg-white dark:bg-[#151D28]"
    >
      <Editor
        height="100%"
        width="100%"
        language={langObj.monacoId}
        value={file.content}
        onChange={(val) => onChangeContent(val || '')}
        theme={getMonacoThemeName(settings.theme)}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorMount}
        options={{
          fontSize: settings.fontSize,
          wordWrap: settings.wordWrap ? 'on' : 'off',
          minimap: { enabled: settings.showMinimap },
          renderWhitespace: settings.showWhitespace ? 'all' : 'none',
          tabSize: settings.tabSize,
          insertSpaces: settings.insertSpaces,
          lineNumbers: settings.lineNumbers ? 'on' : 'off',
          readOnly: file.readOnly,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          fontLigatures: true,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          padding: { top: 6, bottom: 6 },
          fixedOverflowWidgets: true,
        }}
      />
    </div>
  );
});

EditorPane.displayName = 'EditorPane';
