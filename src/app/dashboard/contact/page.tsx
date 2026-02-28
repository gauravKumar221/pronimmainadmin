'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Eye, 
  X,
  Clock,
  User,
  Phone
} from 'lucide-react';
import { fetchSendMessages, markSendMessageAsRead, deleteSendMessage, SendMessage } from '@/lib/api';

function getSubjectPreview(message: string, maxLen = 50): string {
  const text = message.trim();
  return text.length <= maxLen ? text : text.slice(0, maxLen) + '…';
}

export default function ContactUsPage() {
  const [messages, setMessages] = useState<SendMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<SendMessage | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSendMessages({ page: 1, limit: 100 });
      setMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteSendMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setIsViewModalOpen(false);
        setSelectedMessage(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const openMessage = async (msg: SendMessage) => {
    setSelectedMessage(msg);
    setIsViewModalOpen(true);

    if (!msg.isRead) {
      try {
        const updated = await markSendMessageAsRead(msg.id, true);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: updated.isRead } : m))
        );
        setSelectedMessage((s) => (s?.id === msg.id ? { ...s, isRead: true } : s));
      } catch {
        // Ignore - still show message
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Contact Us</h1>
          <p className="text-gray-500">Manage and respond to user inquiries</p>
        </div>
      </div>

      <div className="pronimal-card">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <MessageSquare className="text-accent" size={18} />
          <h2 className="font-bold text-primary">User Messages</h2>
        </div>
        <table className="pronimal-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500">Loading…</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-red-500">{error}</td>
              </tr>
            ) : messages.length > 0 ? (
              messages.map((msg) => (
                <tr key={msg.id} className={!msg.isRead ? 'bg-blue-50/30' : ''}>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">
                        {msg.name} {msg.lastName}
                      </span>
                      <span className="text-xs text-gray-500">{msg.email}</span>
                    </div>
                  </td>
                  <td className="max-w-xs truncate font-medium">{getSubjectPreview(msg.message)}</td>
                  <td className="text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      msg.isRead ? 'bg-gray-100 text-gray-500' : 'bg-accent/10 text-accent'
                    }`}>
                      {msg.isRead ? 'Read' : 'New'}
                    </span>
                  </td>
                  <td className="text-right space-x-2">
                    <button onClick={() => openMessage(msg)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-md transition-colors">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-20 text-gray-400">
                  <MessageSquare className="mx-auto mb-2 opacity-20" size={48} />
                  <p>No messages found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isViewModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-primary">Message Details</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest mb-1">From</p>
                  <p className="font-bold text-primary flex items-center gap-2"><User size={14} className="text-accent" /> {selectedMessage.name} {selectedMessage.lastName}</p>
                  <p className="text-gray-600">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-gray-600 flex items-center gap-1 mt-1"><Phone size={12} /> {selectedMessage.phone}</p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest mb-1">Sent On</p>
                  <p className="font-bold text-primary flex items-center gap-2"><Clock size={14} className="text-accent" /> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                <p className="font-bold mb-2">Message</p>
                {selectedMessage.message}
              </div>
            </div>

            <div className="p-4 flex justify-end border-t border-gray-100 bg-gray-50/50">
              <button onClick={() => setIsViewModalOpen(false)} className="pronimal-btn-primary px-8">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
