'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Eye, 
  X,
  Clock,
  User
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function ContactUsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const savedMessages = localStorage.getItem('pronimal_contact_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      const initialMessages: ContactMessage[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          subject: 'Partnership Inquiry',
          message: 'Hello, I am interested in partnering with Pronim.al for our real estate projects in London. Looking forward to hearing from you.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isRead: false
        }
      ];
      setMessages(initialMessages);
      localStorage.setItem('pronimal_contact_messages', JSON.stringify(initialMessages));
    }
  }, []);

  const deleteMessage = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      const updated = messages.filter(m => m.id !== id);
      setMessages(updated);
      localStorage.setItem('pronimal_contact_messages', JSON.stringify(updated));
    }
  };

  const openMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsViewModalOpen(true);
    
    if (!msg.isRead) {
      const updated = messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m);
      setMessages(updated);
      localStorage.setItem('pronimal_contact_messages', JSON.stringify(updated));
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
            {messages.length > 0 ? (
              messages.map((msg) => (
                <tr key={msg.id} className={!msg.isRead ? 'bg-blue-50/30' : ''}>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">{msg.name}</span>
                      <span className="text-xs text-gray-500">{msg.email}</span>
                    </div>
                  </td>
                  <td className="max-w-xs truncate font-medium">{msg.subject}</td>
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
                    <button onClick={() => deleteMessage(msg.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
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
                  <p className="font-bold text-primary flex items-center gap-2"><User size={14} className="text-accent" /> {selectedMessage.name}</p>
                  <p className="text-gray-600">{selectedMessage.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest mb-1">Sent On</p>
                  <p className="font-bold text-primary flex items-center gap-2"><Clock size={14} className="text-accent" /> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                <p className="font-bold mb-2">Subject: {selectedMessage.subject}</p>
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
