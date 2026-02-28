'use client';

import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, Pencil, Trash2, X, HelpCircle } from 'lucide-react';
import { fetchFaqs, createFaq, updateFaq, deleteFaq, Faq } from '@/lib/api';

const CATEGORIES = [
  { value: 'sale', label: 'Questions about the sale' },
  { value: 'rent', label: 'Question about renting' },
  { value: 'general', label: 'General' },
  { value: 'about', label: 'About Us' },
] as const;

type Category = (typeof CATEGORIES)[number]['value'];

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'sale' as Category,
    order: 0,
  });

  const loadFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFaqs({ page: 1, limit: 200 });
      setFaqs(data.faqs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openModal = (category: Category, faq?: Faq) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category as Category,
        order: faq.order,
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question: '',
        answer: '',
        category,
        order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await updateFaq(editingFaq.id, formData);
      } else {
        await createFaq(formData);
      }
      closeModal();
      loadFaqs();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save FAQ');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await deleteFaq(id);
      loadFaqs();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete FAQ');
    }
  };

  const faqsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = faqs.filter((f) => f.category === cat.value);
    return acc;
  }, {} as Record<Category, Faq[]>);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Frequently Asked Questions</h1>
        <p className="text-gray-500">Manage FAQs for the frontend (sale, rent) and other sections</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading…</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        CATEGORIES.map((cat) => (
          <div key={cat.value} className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} className="text-accent" />
                <h2 className="text-xl font-bold text-primary">{cat.label}</h2>
              </div>
              <button
                onClick={() => openModal(cat.value)}
                className="pronimal-btn-accent flex items-center gap-2"
              >
                <Plus size={18} />
                <span>Add FAQ</span>
              </button>
            </div>
            <div className="pronimal-card p-6">
              {faqsByCategory[cat.value]?.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {faqsByCategory[cat.value].map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-0">
                      <div className="flex items-center justify-between group">
                        <AccordionTrigger className="text-left font-semibold text-primary flex-1 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <div className="flex items-center gap-2 px-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(faq.category as Category, faq);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(faq.id, e)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No FAQs in this category. Click &quot;Add FAQ&quot; to create one.
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Category</label>
                <select
                  className="pronimal-input"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as Category })
                  }
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="pronimal-label">Question</label>
                <input
                  type="text"
                  className="pronimal-input"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="pronimal-label">Answer</label>
                <textarea
                  className="pronimal-input min-h-[150px]"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="pronimal-label">Order (optional)</label>
                <input
                  type="number"
                  className="pronimal-input"
                  min={0}
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 font-medium"
                >
                  Cancel
                </button>
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
