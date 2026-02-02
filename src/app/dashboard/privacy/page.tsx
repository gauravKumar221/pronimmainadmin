'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Pencil, 
  X, 
  FileText,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
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
  Eraser,
  Printer,
  Undo2,
  Redo2
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pronimal_privacy_v2');
    if (saved) {
      setContent(saved);
    } else {
      const initial = `
        <h1>Privacy Policy</h1>
        <p>Last updated: ${new Date().toLocaleDateString()}</p>
        
        <h2>1. Introduction</h2>
        <p>Welcome to Pronim.al. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
        
        <h2>2. Information We Collect</h2>
        <p>We collect personal information that you voluntarily provide to us when registering at the Services, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us.</p>
        
        <h2>3. How We Use Your Information</h2>
        <p>We use personal information collected via our Services for a variety of business purposes. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
        
        <h2>4. Sharing Your Information</h2>
        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
        
        <h2>5. Data Security</h2>
        <p>We aim to protect your personal information through a system of organizational and technical security measures.</p>
      `;
      setContent(initial);
      localStorage.setItem('pronimal_privacy_v2', initial);
    }
  }, []);

  const saveContent = (newContent: string) => {
    setContent(newContent);
    localStorage.setItem('pronimal_privacy_v2', newContent);
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
        <button 
          onClick={handleEdit}
          className="pronimal-btn-accent flex items-center gap-2"
        >
          <Pencil size={18} />
          <span>Edit Policy</span>
        </button>
      </div>

      <div className="pronimal-card p-10">
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
          <FileText className="text-accent" size={24} />
          <h2 className="text-xl font-bold text-primary">Official Document</h2>
        </div>

        <div 
          className="text-gray-700 leading-relaxed rich-text-display prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full shadow-xl animate-in zoom-in-95 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Pencil className="text-accent" size={18} />
                <h2 className="text-lg font-bold text-primary">Privacy Policy Editor</h2>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col h-[85vh]">
              <div className="p-6 flex flex-col flex-1 overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 space-y-2">
                    <div className="flex flex-wrap items-center gap-1 pb-1.5 border-b border-gray-200">
                      <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700" title="Bold"><Bold size={16} /></button>
                      <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700" title="Italic"><Italic size={16} /></button>
                      <button type="button" onClick={() => execCommand('underline')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700" title="Underline"><Underline size={16} /></button>
                      <button type="button" onClick={() => execCommand('strikeThrough')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700" title="Strikethrough"><Strikethrough size={16} /></button>
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
                       <button type="button" onClick={() => execCommand('formatBlock', '<p>')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700 flex items-center gap-0.5" title="Paragraph"><Type size={16} /><span className="text-[10px]">P</span></button>
                       <button type="button" onClick={() => execCommand('formatBlock', '<h1>')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700 font-bold">H1</button>
                       <button type="button" onClick={() => execCommand('formatBlock', '<h2>')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300 text-gray-700 font-bold">H2</button>
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
                    className="flex-1 w-full p-8 border border-t-0 border-gray-200 rounded-b-md font-body text-base leading-relaxed focus:outline-none overflow-y-auto bg-white"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </div>

              <div className="p-4 flex gap-3 justify-end border-t border-gray-100 bg-gray-50/50">
                <button type="button" onClick={closeModal} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" className="pronimal-btn-primary px-8 text-sm">
                  Save Privacy Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .rich-text-display h1 { font-size: 2rem; font-weight: 800; margin-bottom: 1.5rem; color: #1f2937; }
        .rich-text-display h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #374151; }
        .rich-text-display p { margin-bottom: 1rem; line-height: 1.75; }
        .rich-text-display ul, .rich-text-display ol { margin-left: 1.5rem; margin-bottom: 1rem; }
        .rich-text-display li { margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}
