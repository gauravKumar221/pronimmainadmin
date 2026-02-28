'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Pencil,
  X,
  FileCheck,
  Bold,
  Italic,
  Underline,
  Type,
  ListOrdered,
  List,
} from 'lucide-react';
import { fetchTermsAndConditions, updateTermsAndConditions } from '@/lib/api';

const DEFAULT_HTML = `<h1>Terms and Conditions</h1>
<p>Last updated: ${new Date().toLocaleDateString()}</p>
<h2>1. Use of the Services</h2>
<p>Pronim.al provides a platform for publishing, searching and managing real estate properties in Albania. Use of the services is conditioned on acceptance and compliance with these Terms.</p>
<h2>2. Registration and Account</h2>
<p>To access certain services, you must create a user account and provide accurate and complete information. You are responsible for maintaining the confidentiality of your credentials.</p>
<h2>3. Content and Intellectual Property</h2>
<p>All content on Pronim.al is the property of Pronim.al or third parties. Reproduction or commercial use without written consent is not permitted.</p>
<h2>4. User Obligations</h2>
<p>You must not publish false, misleading, or unlawful content. You agree to comply with all laws and regulations relating to the use of the Site.</p>`;

export default function TermsAndConditionsPage() {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('Terms and Conditions');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const loadTerms = async () => {
    setLoading(true);
    setError(null);
    try {
      const terms = await fetchTermsAndConditions();
      setTitle(terms.title || 'Terms and Conditions');
      setContent(terms.content || DEFAULT_HTML);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
      setContent(DEFAULT_HTML);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerms();
  }, []);

  const handleEdit = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalContent = editorRef.current?.innerHTML ?? content;
    setSaving(true);
    try {
      await updateTermsAndConditions({ title, content: finalContent });
      setContent(finalContent);
      closeModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleFormat = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault();
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Terms & Conditions</h1>
          <p className="text-gray-500">Manage the global terms and conditions document</p>
        </div>
        <button onClick={handleEdit} className="pronimal-btn-accent flex items-center gap-2">
          <Pencil size={18} />
          <span>Edit Terms</span>
        </button>
      </div>

      {loading ? (
        <div className="pronimal-card p-10 text-center text-gray-500">Loading…</div>
      ) : error ? (
        <div className="pronimal-card p-10 text-center text-red-500">{error}</div>
      ) : (
        <div className="pronimal-card p-10">
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
            <FileCheck className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-primary">Official Agreement</h2>
          </div>
          <div
            className="text-gray-700 leading-relaxed rich-text-display prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full shadow-xl animate-in zoom-in-95 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-primary">Terms & Conditions Editor</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col h-[85vh]">
              <div className="p-6 flex flex-col flex-1 overflow-hidden">
                <div className="mb-4">
                  <label className="pronimal-label block mb-2">Title</label>
                  <input
                    type="text"
                    className="pronimal-input w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
                  <button type="button" onMouseDown={(e) => handleFormat(e, 'bold')} className="p-1.5 hover:bg-white rounded">
                    <Bold size={16} />
                  </button>
                  <button type="button" onMouseDown={(e) => handleFormat(e, 'italic')} className="p-1.5 hover:bg-white rounded">
                    <Italic size={16} />
                  </button>
                  <button type="button" onMouseDown={(e) => handleFormat(e, 'underline')} className="p-1.5 hover:bg-white rounded">
                    <Underline size={16} />
                  </button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <button type="button" onMouseDown={(e) => handleFormat(e, 'formatBlock', '<h1>')} className="p-1.5 hover:bg-white rounded font-bold">
                    H1
                  </button>
                  <button type="button" onMouseDown={(e) => handleFormat(e, 'formatBlock', '<h2>')} className="p-1.5 hover:bg-white rounded font-bold">
                    H2
                  </button>
                  <button type="button" onMouseDown={(e) => handleFormat(e, 'formatBlock', '<p>')} className="p-1.5 hover:bg-white rounded">
                    <Type size={16} />
                  </button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <button type="button" onMouseDown={(e) => handleFormat(e, 'insertUnorderedList')} className="p-1.5 hover:bg-white rounded">
                    <List size={16} />
                  </button>
                  <button type="button" onMouseDown={(e) => handleFormat(e, 'insertOrderedList')} className="p-1.5 hover:bg-white rounded">
                    <ListOrdered size={16} />
                  </button>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  className="flex-1 w-full p-8 border border-t-0 border-gray-200 rounded-b-md focus:outline-none overflow-y-auto bg-white min-h-[300px]"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
              <div className="p-4 flex gap-3 justify-end border-t border-gray-100 bg-gray-50/50">
                <button type="button" onClick={closeModal} className="px-6 py-2 text-gray-600 font-medium">
                  Cancel
                </button>
                <button type="submit" className="pronimal-btn-primary px-8" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Terms'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
