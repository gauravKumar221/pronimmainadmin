'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  FileText,
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
  Image as ImageIcon,
  Video,
  Volume2,
  Table,
  Eraser,
  Printer,
  Code,
  Maximize2,
  Undo2,
  Redo2
} from 'lucide-react';

interface PrivacySection {
  id: string;
  title: string;
  content: string;
}

export default function PrivacyPolicyPage() {
  const [sections, setSections] = useState<PrivacySection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<PrivacySection | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pronimal_privacy');
    if (saved) {
      setSections(JSON.parse(saved));
    } else {
      const initial = [
        {
          id: '1',
          title: "1. Introduction",
          content: "Welcome to Pronim.al. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us."
        },
        {
          id: '2',
          title: "2. Information We Collect",
          content: "We collect personal information that you voluntarily provide to us when registering at the Services, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us."
        }
      ];
      setSections(initial);
      localStorage.setItem('pronimal_privacy', JSON.stringify(initial));
    }
  }, []);

  const saveSections = (updated: PrivacySection[]) => {
    setSections(updated);
    localStorage.setItem('pronimal_privacy', JSON.stringify(updated));
  };

  const openModal = (section?: PrivacySection) => {
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
    if (confirm('Are you sure you want to delete this privacy policy section?')) {
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
          <h1 className="text-2xl font-bold text-primary">Privacy Policy</h1>
          <p className="text-gray-500">How we handle and protect your data</p>
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
          <FileText className="text-accent" size={24} />
          <h2 className="text-xl font-bold text-primary">Legal Document</h2>
        </div>

        <div className="space-y-8">
          {sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.id} className="relative group pb-8 last:pb-0 border-b last:border-0 border-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-primary">{section.title}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openModal(section)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(section.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
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
              No policy sections found. Click "Add Section" to create one.
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
                  {editingSection ? 'Section Editor' : 'New Section Editor'}
                </h2>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
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
                    placeholder="e.g. 1. Introduction"
                    required
                  />
                </div>
                
                <div className="flex flex-col h-full min-h-[450px]">
                  <label className="pronimal-label">Content Editor</label>
                  
                  <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 space-y-2">
                    <div className="flex flex-wrap items-center gap-1 pb-1.5 border-b border-gray-200">
                      <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Bold size={16} /></button>
                      <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Italic size={16} /></button>
                      <button type="button" onClick={() => execCommand('underline')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Underline size={16} /></button>
                      <button type="button" onClick={() => execCommand('strikeThrough')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Strikethrough size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('subscript')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Subscript size={16} /></button>
                      <button type="button" onClick={() => execCommand('superscript')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Superscript size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <select className="bg-white border border-gray-300 rounded text-xs px-2 py-1 outline-none focus:ring-1 focus:ring-accent" onChange={(e) => execCommand('fontName', e.target.value)}>
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times</option>
                        <option value="Courier New">Courier</option>
                      </select>
                      <select className="bg-white border border-gray-300 rounded text-xs px-2 py-1 outline-none focus:ring-1 focus:ring-accent" onChange={(e) => execCommand('fontSize', e.target.value)}>
                        <option value="3">12pt</option>
                        <option value="1">8pt</option>
                        <option value="2">10pt</option>
                        <option value="4">14pt</option>
                        <option value="5">18pt</option>
                        <option value="6">24pt</option>
                      </select>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <input type="color" className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer" onChange={(e) => execCommand('foreColor', e.target.value)} />
                      <button type="button" onClick={() => execCommand('hiliteColor', '#ffff00')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Highlighter size={16} /></button>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 pb-1.5 border-b border-gray-200">
                       <button type="button" onClick={() => execCommand('formatBlock', '<p>')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700 flex items-center gap-0.5"><Type size={16} /><span className="text-[10px]">P</span></button>
                       <button type="button" onClick={() => execCommand('formatBlock', '<h1>')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700 font-bold">H1</button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><AlignLeft size={16} /></button>
                      <button type="button" onClick={() => execCommand('justifyCenter')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><AlignCenter size={16} /></button>
                      <button type="button" onClick={() => execCommand('justifyRight')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><AlignRight size={16} /></button>
                      <button type="button" onClick={() => execCommand('justifyFull')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><AlignJustify size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><ListOrdered size={16} /></button>
                      <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><List size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('outdent')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Outdent size={16} /></button>
                      <button type="button" onClick={() => execCommand('indent')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Indent size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => {
                        const url = prompt('Enter the link URL:');
                        if (url) execCommand('createLink', url);
                      }} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><LinkIcon size={16} /></button>
                      <button type="button" className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><ImageIcon size={16} /></button>
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                      <button type="button" onClick={() => execCommand('undo')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Undo2 size={16} /></button>
                      <button type="button" onClick={() => execCommand('redo')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Redo2 size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('removeFormat')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Eraser size={16} /></button>
                      <button type="button" onClick={() => window.print()} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700"><Printer size={16} /></button>
                    </div>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    className="flex-1 w-full p-4 border border-t-0 border-gray-200 rounded-b-md font-body text-base leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent/20 overflow-y-auto min-h-[300px] bg-white"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                    onBlur={(e) => setFormData(prev => ({ ...prev, content: e.currentTarget.innerHTML }))}
                  />
                </div>
              </div>

              <div className="p-4 flex gap-3 justify-end border-t border-gray-100 bg-gray-50/50">
                <button type="button" onClick={closeModal} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md transition-colors text-sm">
                  Cancel
                </button>
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
