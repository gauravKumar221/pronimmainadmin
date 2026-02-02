
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pencil, X, FileText, Bold, Italic, Underline, Strikethrough, Type, AlignLeft, AlignCenter, ListOrdered, List, Undo2, Redo2, Eraser } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pronimal_privacy_v2');
    if (saved) {
      setContent(saved);
    } else {
      const initial = `<h1>Privacy Policy</h1><p>Last updated: ${new Date().toLocaleDateString()}</p><h2>1. Introduction</h2><p>Welcome to Pronim.al. We are committed to protecting your personal information and your right to privacy.</p>`;
      setContent(initial);
      localStorage.setItem('pronimal_privacy_v2', initial);
    }
  }, []);

  const saveContent = (newContent: string) => {
    setContent(newContent);
    localStorage.setItem('pronimal_privacy_v2', newContent);
  };

  const handleEdit = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalContent = editorRef.current?.innerHTML || content;
    saveContent(finalContent);
    closeModal();
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Privacy Policy</h1>
          <p className="text-gray-500">Manage the global privacy policy document</p>
        </div>
        <button onClick={handleEdit} className="pronimal-btn-accent flex items-center gap-2">
          <Pencil size={18} />
          <span>Edit Policy</span>
        </button>
      </div>

      <div className="pronimal-card p-10">
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
          <FileText className="text-accent" size={24} />
          <h2 className="text-xl font-bold text-primary">Official Document</h2>
        </div>
        <div className="text-gray-700 leading-relaxed rich-text-display prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full shadow-xl animate-in zoom-in-95 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-primary">Privacy Policy Editor</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col h-[85vh]">
              <div className="p-6 flex flex-col flex-1 overflow-hidden">
                <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
                  <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-white rounded"><Bold size={16} /></button>
                  <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-white rounded"><Italic size={16} /></button>
                  <button type="button" onClick={() => execCommand('underline')} className="p-1.5 hover:bg-white rounded"><Underline size={16} /></button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <button type="button" onClick={() => execCommand('formatBlock', '<h1>')} className="p-1.5 hover:bg-white rounded font-bold">H1</button>
                  <button type="button" onClick={() => execCommand('formatBlock', '<h2>')} className="p-1.5 hover:bg-white rounded font-bold">H2</button>
                  <button type="button" onClick={() => execCommand('formatBlock', '<p>')} className="p-1.5 hover:bg-white rounded"><Type size={16} /></button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-white rounded"><List size={16} /></button>
                  <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 hover:bg-white rounded"><ListOrdered size={16} /></button>
                </div>
                <div ref={editorRef} contentEditable className="flex-1 w-full p-8 border border-t-0 border-gray-200 rounded-b-md focus:outline-none overflow-y-auto bg-white" dangerouslySetInnerHTML={{ __html: content }} />
              </div>
              <div className="p-4 flex gap-3 justify-end border-t border-gray-100 bg-gray-50/50">
                <button type="button" onClick={closeModal} className="px-6 py-2 text-gray-600 font-medium">Cancel</button>
                <button type="submit" className="pronimal-btn-primary px-8">Save Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
