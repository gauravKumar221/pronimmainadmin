'use client';

import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Pencil, Trash2, X, HelpCircle, Info } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function FAQsPage() {
  const [generalFaqs, setGeneralFaqs] = useState<FAQ[]>([]);
  const [aboutUsFaqs, setAboutUsFaqs] = useState<FAQ[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<{ faq: FAQ, type: 'general' | 'about' } | null>(null);
  const [modalType, setModalType] = useState<'general' | 'about'>('general');
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });

  useEffect(() => {
    // Load General FAQs
    const savedGeneral = localStorage.getItem('pronimal_faqs');
    if (savedGeneral) {
      setGeneralFaqs(JSON.parse(savedGeneral));
    } else {
      const initialGeneral = [
        { id: '1', question: "What is Pronim.al?", answer: "Pronim.al is a comprehensive admin dashboard for agencies and agents." },
        { id: '2', question: "How do I add a new agent?", answer: "Navigate to 'Agents' and click 'Add Agent'." }
      ];
      setGeneralFaqs(initialGeneral);
      localStorage.setItem('pronimal_faqs', JSON.stringify(initialGeneral));
    }

    // Load About Us FAQs
    const savedAbout = localStorage.getItem('pronimal_about_faq_list');
    if (savedAbout) {
      setAboutUsFaqs(JSON.parse(savedAbout));
    } else {
      const initialAbout = [
        { id: 'a1', question: "How was Pronim.al started?", answer: "Started by a team of real estate professionals and tech innovators." }
      ];
      setAboutUsFaqs(initialAbout);
      localStorage.setItem('pronimal_about_faq_list', JSON.stringify(initialAbout));
    }
  }, []);

  const saveFaqs = (type: 'general' | 'about', updated: FAQ[]) => {
    if (type === 'general') {
      setGeneralFaqs(updated);
      localStorage.setItem('pronimal_faqs', JSON.stringify(updated));
    } else {
      setAboutUsFaqs(updated);
      localStorage.setItem('pronimal_about_faq_list', JSON.stringify(updated));
    }
  };

  const openModal = (type: 'general' | 'about', faq?: FAQ) => {
    setModalType(type);
    if (faq) {
      setEditingFaq({ faq, type });
      setFormData({ question: faq.question, answer: faq.answer });
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
    const currentList = modalType === 'general' ? generalFaqs : aboutUsFaqs;
    let updated;

    if (editingFaq) {
      updated = currentList.map(f => f.id === editingFaq.faq.id ? { ...f, ...formData } : f);
    } else {
      const newFaq = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
      };
      updated = [...currentList, newFaq];
    }
    
    saveFaqs(modalType, updated);
    closeModal();
  };

  const handleDelete = (type: 'general' | 'about', id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this FAQ?')) {
      const currentList = type === 'general' ? generalFaqs : aboutUsFaqs;
      saveFaqs(type, currentList.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Frequently Asked Questions</h1>
        <p className="text-gray-500">Manage all your dashboard and company related questions</p>
      </div>

      {/* General FAQs Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HelpCircle size={20} className="text-accent" />
            <h2 className="text-xl font-bold text-primary">General FAQs</h2>
          </div>
          <button 
            onClick={() => openModal('general')}
            className="pronimal-btn-accent flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Add General FAQ</span>
          </button>
        </div>
        <div className="pronimal-card p-6">
          {generalFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {generalFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-0">
                  <div className="flex items-center justify-between group">
                    <AccordionTrigger className="text-left font-semibold text-primary flex-1 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <div className="flex items-center gap-2 px-4">
                      <button onClick={(e) => { e.stopPropagation(); openModal('general', faq); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                        <Pencil size={16} />
                      </button>
                      <button onClick={(e) => handleDelete('general', faq.id, e)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
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
            <div className="text-center py-8 text-gray-400">No General FAQs found.</div>
          )}
        </div>
      </div>

      {/* About Us FAQs Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Info size={20} className="text-accent" />
            <h2 className="text-xl font-bold text-primary">About Us FAQs</h2>
          </div>
          <button 
            onClick={() => openModal('about')}
            className="pronimal-btn-accent flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Add About FAQ</span>
          </button>
        </div>
        <div className="pronimal-card p-6">
          {aboutUsFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {aboutUsFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-0">
                  <div className="flex items-center justify-between group">
                    <AccordionTrigger className="text-left font-semibold text-primary flex-1 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <div className="flex items-center gap-2 px-4">
                      <button onClick={(e) => { e.stopPropagation(); openModal('about', faq); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                        <Pencil size={16} />
                      </button>
                      <button onClick={(e) => handleDelete('about', faq.id, e)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
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
            <div className="text-center py-8 text-gray-400">No About Us FAQs found.</div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-8 rounded-lg text-center space-y-4">
        <h2 className="text-lg font-bold text-primary">Still have questions?</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Reach out to our support team for assistance.
        </p>
        <button className="pronimal-btn-accent">Contact Support</button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">
                {editingFaq ? 'Edit FAQ' : `Add New ${modalType === 'general' ? 'General' : 'About Us'} FAQ`}
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
                  required
                />
              </div>
              <div>
                <label className="pronimal-label">Answer</label>
                <textarea
                  className="pronimal-input min-h-[150px]"
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  required
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 font-medium">Cancel</button>
                <button type="submit" className="pronimal-btn-primary">
                  {editingFaq ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
