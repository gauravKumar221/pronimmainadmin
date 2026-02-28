'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Trash2,
  Eye,
  X,
  Clock,
  User,
  Phone,
} from 'lucide-react';
import { fetchEnquiries, deleteEnquiry, Enquiry } from '@/lib/api';

function getSubjectPreview(message: string, maxLen = 50): string {
  const text = message.trim();
  return text.length <= maxLen ? text : text.slice(0, maxLen) + '…';
}

export default function EnquiryFormPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEnquiries({ page: 1, limit: 100 });
      setEnquiries(data.enquiries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry?.id === id) {
        setIsViewModalOpen(false);
        setSelectedEnquiry(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const openEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Enquiry Form</h1>
          <p className="text-gray-500">Manage enquiries submitted from the blog page</p>
        </div>
      </div>

      <div className="pronimal-card">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <ClipboardList className="text-accent" size={18} />
          <h2 className="font-bold text-primary">Enquiries</h2>
        </div>
        <table className="pronimal-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Date</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-red-500">
                  {error}
                </td>
              </tr>
            ) : enquiries.length > 0 ? (
              enquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">{enquiry.name}</span>
                      <span className="text-xs text-gray-500">{enquiry.email}</span>
                    </div>
                  </td>
                  <td className="max-w-xs truncate font-medium">
                    {getSubjectPreview(enquiry.message)}
                  </td>
                  <td className="text-gray-500">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-right space-x-2">
                    <button
                      onClick={() => openEnquiry(enquiry)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-md transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(enquiry.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-20 text-gray-400">
                  <ClipboardList className="mx-auto mb-2 opacity-20" size={48} />
                  <p>No enquiries found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isViewModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-primary">Enquiry Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest mb-1">
                    From
                  </p>
                  <p className="font-bold text-primary flex items-center gap-2">
                    <User size={14} className="text-accent" /> {selectedEnquiry.name}
                  </p>
                  <p className="text-gray-600">{selectedEnquiry.email}</p>
                  {selectedEnquiry.phone && (
                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                      <Phone size={12} /> {selectedEnquiry.phone}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest mb-1">
                    Submitted On
                  </p>
                  <p className="font-bold text-primary flex items-center gap-2">
                    <Clock size={14} className="text-accent" />{' '}
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                <p className="font-bold mb-2">Message</p>
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="p-4 flex justify-end border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="pronimal-btn-primary px-8"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
