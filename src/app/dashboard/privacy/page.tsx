'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, FileText } from 'lucide-react';

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
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </div>
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
          <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Pencil className="text-accent" size={20} />
                <h2 className="text-xl font-bold text-primary">
                  {editingSection ? 'Section Editor' : 'New Section Editor'}
                </h2>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              <div>
                <label className="pronimal-label">Content Editor</label>
                <div className="relative group">
                  <textarea
                    className="pronimal-input min-h-[300px] font-body text-base leading-relaxed resize-y focus:ring-accent"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Type your policy content here..."
                    required
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Markdown not supported (Plain Text)
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="pronimal-btn-primary px-8"
                >
                  {editingSection ? 'Save Changes' : 'Publish Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
