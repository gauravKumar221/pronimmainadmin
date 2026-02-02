
'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Eye, 
  X,
  Clock,
  User,
  PhoneCall,
  Mail,
  MapPin,
  Save
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
  // Inquiries State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Contact Info State
  const [info, setInfo] = useState({
    address: '123 Tech Avenue, Innovation District, SF',
    phone: '+1 (555) 000-1111',
    email: 'contact@pronim.al',
    workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
  });
  const [infoSuccess, setInfoSuccess] = useState('');

  useEffect(() => {
    // Load Messages
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

    // Load Contact Info
    const savedInfo = localStorage.getItem('pronimal_contact_info');
    if (savedInfo) setInfo(JSON.parse(savedInfo));
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

  const handleInfoSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pronimal_contact_info', JSON.stringify(info));
    setInfoSuccess('Contact information updated successfully!');
    setTimeout(() => setInfoSuccess(''), 3000);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Contact Us</h1>
          <p className="text-gray-500">Manage user inquiries and your public contact information</p>
        </div>
      </div>

      {/* Inquiries Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-accent" size={20} />
          <h2 className="text-xl font-bold text-primary">User Messages</h2>
        </div>
        <div className="pronimal-card">
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
      </section>

      {/* Contact Info Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="text-accent" size={20} />
          <h2 className="text-xl font-bold text-primary">Public Contact Details</h2>
        </div>
        
        {infoSuccess && (
          <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-md animate-in fade-in slide-in-from-top-1">
            {infoSuccess}
          </div>
        )}

        <div className="pronimal-card">
          <form onSubmit={handleInfoSave} className="p-8 space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="pronimal-label flex items-center gap-2"><MapPin size={16} /> Office Address</label>
                <input className="pronimal-input" value={info.address} onChange={e => setInfo({...info, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="pronimal-label flex items-center gap-2"><PhoneCall size={16} /> Phone Number</label>
                  <input className="pronimal-input" value={info.phone} onChange={e => setInfo({...info, phone: e.target.value})} />
                </div>
                <div>
                  <label className="pronimal-label flex items-center gap-2"><Mail size={16} /> Contact Email</label>
                  <input className="pronimal-input" value={info.email} onChange={e => setInfo({...info, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="pronimal-label flex items-center gap-2"><Clock size={16} /> Working Hours</label>
                <input className="pronimal-input" value={info.workingHours} onChange={e => setInfo({...info, workingHours: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="pronimal-btn-primary flex items-center gap-2">
              <Save size={18} />
              Save Contact Details
            </button>
          </form>
        </div>
      </section>

      {/* View Message Modal */}
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
