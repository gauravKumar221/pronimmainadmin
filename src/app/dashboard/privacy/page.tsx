'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

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
        },
        {
          id: '3',
          title: "3. How We Use Your Information",
          content: "We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations."
        },
        {
          id: '4',
          title: "4. Sharing Your Information",
          content: "We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations."
        },
        {
          id: '5',
          title: "5. Data Security",
          content: "We aim to protect your personal information through a system of organizational and technical security measures."
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
    let updated;
    if (editingSection) {
      updated = sections.map(s => s.id === editingSection.id ? { ...s, ...formData } : s);
    } else {
      const newSection = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
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
        <div className="space-y-6">
          {sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.id} className="relative group border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-bold text-primary">{section.title}</h2>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openModal(section)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit Section"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(section.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Section"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
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
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">
                {editingSection ? 'Edit Section' : 'Add New Section'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Section Title</label>
                <input
                  type="text"
                  className="pronimal-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. 1. Introduction"
                  required
                />
              </div>
              <div>
                <label className="pronimal-label">Content</label>
                <textarea
                  className="pronimal-input min-h-[200px]"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Enter the section content..."
                  required
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 font-medium">
                  Cancel
                </button>
                <button type="submit" className="pronimal-btn-primary">
                  {editingSection ? 'Update Section' : 'Add Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
