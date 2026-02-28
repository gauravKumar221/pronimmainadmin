'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

const ToolbarButton = ({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }}
    className={`p-2 rounded hover:bg-gray-100 transition-colors ${
      active ? 'bg-gray-200 text-primary' : 'text-gray-600'
    }`}
  >
    {children}
  </button>
);

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content...',
  minHeight = '120px',
  className = '',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current) {
      const current = editorRef.current.innerHTML;
      const normalized = value || '';
      if (current !== normalized) {
        editorRef.current.innerHTML = normalized;
      }
    }
  }, [value]);

  return (
    <div className={`border border-gray-300 rounded-md overflow-hidden ${className}`}>
      <div className="flex items-center gap-1 p-1 border-b border-gray-200 bg-gray-50">
        <ToolbarButton
          onClick={() => execCommand('bold')}
          title="Bold"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand('italic')}
          title="Italic"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet list"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered list"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'blockquote')}
          title="Quote"
        >
          <Quote size={16} />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton
          onClick={() => execCommand('undo')}
          title="Undo"
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand('redo')}
          title="Redo"
        >
          <Redo size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'h3')}
          title="Heading"
        >
          <span className="text-xs font-bold">H3</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'p')}
          title="Paragraph"
        >
          <span className="text-xs">P</span>
        </ToolbarButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="pronimal-input min-h-[120px] p-3 outline-none overflow-y-auto [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600"
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}
