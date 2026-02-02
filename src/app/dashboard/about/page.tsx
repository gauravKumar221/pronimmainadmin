'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Pencil, 
  X, 
  Info,
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
  Undo2,
  Redo2,
  Eraser,
  Printer,
  Plus,
  Trash2,
  MessageCircleQuestion
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function AboutUsPage() {
  // Profile Content State
  const [content, setContent] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // FAQ State
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqFormData, setFaqFormData] = useState({
    question: '',
    answer: '',
  });

  useEffect(() => {
    // Load Profile
    const savedProfile = localStorage.getItem('pronimal_about_v3');
    if (savedProfile) {
      setContent(savedProfile);
    } else {
      const initialProfile = `
        <h1>Our Vision</h1>
        <p>Pronim.al was founded with a single mission: to revolutionize how real estate agencies and agents manage their relationships with property owners. We believe in providing simple, powerful, and beautiful tools that make professional management accessible to everyone.</p>
        
        <h2>Our Story</h2>
        <p>Based in the heart of the tech industry, we combine cutting-edge technology with deep industry expertise to deliver a dashboard that truly works for you. Our team is dedicated to building the most intuitive administrative experience on the market.</p>
        
        <h2>Core Values</h2>
        <ul>
          <li><strong>Transparency:</strong> We believe in open communication and honest data management.</li>
          <li><strong>Innovation:</strong> Constantly pushing the boundaries of what a dashboard can do.</li>
          <li><strong>User First:</strong> Every feature is designed with the user's efficiency in mind.</li>
        </ul>
      `;
      setContent(initialProfile);
      localStorage.setItem('pronimal_about_v3', initialProfile);
    }

    // Load FAQs
    const savedFaqs = localStorage.getItem('pronimal_about_faq_list');
    if (savedFaqs) {
      setFaqs(JSON.parse(savedFaqs));
    } else {
      const initialFaqs = [
        {
          id: '1',
          question: "How was Pronim.al started?",
          answer: "Pronim.al was started by a team of real estate professionals and tech innovators who saw a gap in the market for high-quality, professional administration tools for property owners and agencies."
        },
        {
          id: '2',
          question: "What makes us different?",
          answer: "Unlike other platforms, we focus exclusively on the admin experience, ensuring that every tool we build is optimized for speed, clarity, and ease of use."
        }
      ];
      setFaqs(initialFaqs);
      localStorage.setItem('pronimal_about_faq_list', JSON.stringify(initialFaqs));
    }
  }, []);

  // Profile Handlers
  const saveProfile = (newContent: string) => {
    setContent(newContent);
    localStorage.setItem('pronimal_about_v3', newContent);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalContent = editorRef.current?.innerHTML || content;
    saveProfile(finalContent);
    setIsProfileModalOpen(false);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  // FAQ Handlers
  const saveFaqs = (updated: FAQ[]) => {
    setFaqs(updated);
    localStorage.setItem('pronimal_about_faq_list', JSON.stringify(updated));
  };

  const openFaqModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqFormData({ question: faq.question, answer: faq.answer });
    } else {
      setEditingFaq(null);
      setFaqFormData({ question: '', answer: '' });
    }
    setIsFaqModalOpen(true);
  };

  const handleFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editingFaq) {
      updated = faqs.map(f => f.id === editingFaq.id ? { ...f, ...faqFormData } : f);
    } else {
      const newFaq = {
        id: Math.random().toString(36).substr(2, 9),
        ...faqFormData,
      };
      updated = [...faqs, newFaq];
    }
    saveFaqs(updated);
    setIsFaqModalOpen(false);
  };

  const handleDeleteFaq = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this About Us FAQ?')) {
      saveFaqs(faqs.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">About Us</h1>
          <p className="text-gray-500">Manage your company story and frequently asked questions</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="faq">About Us FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="pronimal-btn-accent flex items-center gap-2"
            >
              <Pencil size={18} />
              <span>Edit Profile</span>
            </button>
          </div>
          <div className="pronimal-card p-10">
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
              <Info className="text-accent" size={24} />
              <h2 className="text-xl font-bold text-primary">Company Profile</h2>
            </div>
            <div 
              className="text-gray-700 leading-relaxed rich-text-display prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => openFaqModal()}
              className="pronimal-btn-accent flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Add FAQ</span>
            </button>
          </div>
          <div className="pronimal-card p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <MessageCircleQuestion className="text-accent" size={24} />
              <h2 className="text-xl font-bold text-primary">Company FAQ List</h2>
            </div>

            {faqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-0">
                    <div className="flex items-center justify-between group">
                      <AccordionTrigger className="text-left font-semibold text-primary flex-1 hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <div className="flex items-center gap-2 px-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openFaqModal(faq); }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteFaq(faq.id, e)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <AccordionContent className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No FAQs found. Click "Add FAQ" to create one.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Profile Editor Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full shadow-xl animate-in zoom-in-95 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Pencil className="text-accent" size={18} />
                <h2 className="text-lg font-bold text-primary">About Us Editor</h2>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="flex flex-col h-[85vh]">
              <div className="p-6 flex flex-col flex-1 overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 space-y-2">
                    <div className="flex flex-wrap items-center gap-1 pb-1.5 border-b border-gray-200">
                      <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Bold size={16} /></button>
                      <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Italic size={16} /></button>
                      <button type="button" onClick={() => execCommand('underline')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Underline size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('formatBlock', '<h1>')} className="p-1.5 hover:bg-white rounded font-bold">H1</button>
                      <button type="button" onClick={() => execCommand('formatBlock', '<h2>')} className="p-1.5 hover:bg-white rounded font-bold">H2</button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-white rounded"><List size={16} /></button>
                      <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1.5 hover:bg-white rounded"><AlignLeft size={16} /></button>
                      <button type="button" onClick={() => execCommand('justifyCenter')} className="p-1.5 hover:bg-white rounded"><AlignCenter size={16} /></button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => execCommand('undo')} className="p-1.5 hover:bg-white rounded"><Undo2 size={16} /></button>
                      <button type="button" onClick={() => execCommand('redo')} className="p-1.5 hover:bg-white rounded"><Redo2 size={16} /></button>
                      <button type="button" onClick={() => execCommand('removeFormat')} className="p-1.5 hover:bg-white rounded ml-2 text-red-500"><Eraser size={16} /></button>
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
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md text-sm">Cancel</button>
                <button type="submit" className="pronimal-btn-primary px-8 text-sm">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button onClick={() => setIsFaqModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleFaqSubmit} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Question</label>
                <input
                  type="text"
                  className="pronimal-input"
                  value={faqFormData.question}
                  onChange={(e) => setFaqFormData({...faqFormData, question: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="pronimal-label">Answer</label>
                <textarea
                  className="pronimal-input min-h-[150px]"
                  value={faqFormData.answer}
                  onChange={(e) => setFaqFormData({...faqFormData, answer: e.target.value})}
                  required
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsFaqModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium">Cancel</button>
                <button type="submit" className="pronimal-btn-primary">
                  {editingFaq ? 'Update' : 'Create'}
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
