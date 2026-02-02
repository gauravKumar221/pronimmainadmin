'use client';

import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Pencil, Trash2, X, MessageCircleQuestion } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function AboutUsFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('pronimal_about_faq_list');
    if (saved) {
      setFaqs(JSON.parse(saved));
    } else {
      const initial = [
        {
          id: '1',
          question: "How was Pronim.al started?",
          answer: "Pronim.al was started by a team of real estate professionals and tech innovators who saw a gap in the market for high-quality, professional administration tools for property owners and agencies."
        },
        {
          id: '2',
          question: "What makes us different?",
          answer: "Unlike other platforms, we focus exclusively on the admin experience, ensuring that every tool we build is optimized for speed, clarity, and ease of use."
        },
        {
          id: '3',
          question: "Can I visit your office?",
          answer: "While we are a remote-first company, we maintain a central hub in the tech district and frequently host industry events. Contact our support team for more details!"
        }
      ];
      setFaqs(initial);
      localStorage.setItem('pronimal_about_faq_list', JSON.stringify(initial));
    }
  }, []);

  const saveFaqs = (updated: FAQ[]) => {
    setFaqs(updated);
    localStorage.setItem('pronimal_about_faq_list', JSON.stringify(updated));
  };

  const openModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
      });
    } else {
      setEditingFaq(null);
      setFormData({ question: '', answer: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    setFormData({ question: '', answer: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editingFaq) {
      updated = faqs.map(f => f.id === editingFaq.id ? { ...f, ...formData } : f);
    } else {
      const newFaq = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
      };
      updated = [...faqs, newFaq];
    }
    saveFaqs(updated);
    closeModal();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this About Us FAQ?')) {
      saveFaqs(faqs.filter(f => f.id !== id));
    }
  };

  const handleEdit = (faq: FAQ, e: React.MouseEvent) => {
    e.stopPropagation();
    openModal(faq);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">About Us FAQ</h1>
          <p className="text-gray-500">Manage frequently asked questions specifically about your company</p>
        </div>
        <button 
          onClick={() => openModal()}
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
                      onClick={(e) => handleEdit(faq, e)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit FAQ"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(faq.id, e)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete FAQ"
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">
                {editingFaq ? 'Edit About Us FAQ' : 'Add New About Us FAQ'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Question</label>
                <input
                  type="text"
                  className="pronimal-input"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  placeholder="e.g. When was the company founded?"
                  required
                />
              </div>
              <div>
                <label className="pronimal-label">Answer</label>
                <textarea
                  className="pronimal-input min-h-[150px]"
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  placeholder="Provide a detailed answer..."
                  required
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 font-medium">
                  Cancel
                </button>
                <button type="submit" className="pronimal-btn-primary">
                  {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
