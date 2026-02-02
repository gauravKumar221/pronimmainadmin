'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  FileCheck,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  ChevronDown,
  Highlighter,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  List,
  Outdent,
  Indent,
  Link as LinkIcon,
  ImageIcon,
  Printer,
  Eraser,
  Undo2,
  Redo2
} from 'lucide-react';

interface TermSection {
  id: string;
  title: string;
  content: string;
}

export default function TermsAndConditionsPage() {
  const [sections, setSections] = useState<TermSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<TermSection | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pronimal_terms');
    if (saved) {
      setSections(JSON.parse(saved));
    } else {
      const initial = [
        {
          id: '1',
          title: "1. Agreement to Terms",
          content: "These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (\"you\") and Pronim.al (\"we,\" \"us\" or \"our\")."
        },
        {
          id: '2',
          title: "2. Intellectual Property Rights",
          content: "Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site are owned or controlled by us."
        }
      ];
      setSections(initial);
      localStorage.setItem('pronimal_terms', JSON.stringify(initial));
    }
  }, []);

  const saveSections = (updated: TermSection[]) => {
    setSections(updated);
    localStorage.setItem('pronimal_terms', JSON.stringify(updated));
  };

  const openModal = (section?: TermSection) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        title: section.title,
        content: section.content,
      });
    } else {
      setEditingSection(null);
      setFormData({ title: '', content: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setFormData({ title: '', content: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalContent = editorRef.current?.innerHTML || formData.content;
    let updated;
    if (editingSection) {
      updated = sections.map(s => s.id === editingSection.id ? { ...s, title: formData.title, content: finalContent } : s);
    } else {
      const newSection = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        content: finalContent,
      };
      updated = [...sections, newSection];
    }
    saveSections(updated);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this term section?')) {
      saveSections(sections.filter(s => s.id !== id));
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Terms & Conditions</h1>
          <p className="text-gray-500">Legal agreement for using Pronim.al</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="pronimal-btn-accent flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Section</span>
        </button>
      </div>

      <div className="pronimal-card p-8">
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
          <FileCheck className="text-accent" size={24} />
          <h2 className="text-xl font-bold text-primary">Legal Agreement</h2>
        </div>

        <div className="space-y-8">
          {sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.id} className="relative group pb-8 last:pb-0 border-b last:border-0 border-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-primary">{section.title}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(section)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(section.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div 
                  className="text-gray-700 leading-relaxed rich-text-content"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              No sections found. Click "Add Section" to create one.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full shadow-xl animate-in zoom-in-95 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Pencil className="text-accent" size={18} />
                <h2 className="text-lg font-bold text-primary">
                  {editingSection ? 'Terms Editor' : 'New Terms Editor'}
                </h2>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col h-[85vh]">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="pronimal-label">Section Title</label>
                  <input
                    type="text"
                    className="pronimal-input font-semibold"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. 1. Agreement to Terms"
                    required
                  />
                </div>
                
                <div className="flex flex-col h-full min-h-[450px]">
                  <label className="pronimal-label">Content Editor</label>
                  
                  <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 space-y-2">
                    <div className="flex flex-wrap items-center gap-1 pb-1.5 border-b border-gray-200">
                      <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Bold size={16} /></button>
                      <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Italic size={16} /></button>
                      <button type="button" onClick={() => execCommand('underline')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Underline size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><AlignLeft size={16} /></button>
                      <button type="button" onClick={() => execCommand('justifyCenter')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><AlignCenter size={16} /></button>
                      <button type="button" onClick={() => execCommand('justifyRight')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><AlignRight size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><List size={16} /></button>
                      <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><ListOrdered size={16} /></button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => execCommand('undo')} className="p-1.5 hover:bg-white rounded"><Undo2 size={16} /></button>
                      <button type="button" onClick={() => execCommand('redo')} className="p-1.5 hover:bg-white rounded"><Redo2 size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('removeFormat')} className="p-1.5 hover:bg-white rounded"><Eraser size={16} /></button>
                    </div>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    className="flex-1 w-full p-4 border border-t-0 border-gray-200 rounded-b-md font-body text-base leading-relaxed focus:outline-none overflow-y-auto min-h-[300px] bg-white"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                    onBlur={(e) => setFormData(prev => ({ ...prev, content: e.currentTarget.innerHTML }))}
                  />
                </div>
              </div>

              <div className="p-4 flex gap-3 justify-end border-t border-gray-100 bg-gray-50/50">
                <button type="button" onClick={closeModal} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md text-sm">Cancel</button>
                <button type="submit" className="pronimal-btn-primary px-8 text-sm">
                  {editingSection ? 'Update Section' : 'Publish Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
