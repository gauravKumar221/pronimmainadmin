'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Plus, 
  Trash2, 
  X, 
  User
} from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  status: 'Active' | 'Unsubscribed';
  joinedAt: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isSubscriberModalOpen, setIsSubscriberModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('pronimal_subscribers');
    if (saved) {
      setSubscribers(JSON.parse(saved));
    } else {
      const initial = [
        { id: '1', email: 'hello@example.com', status: 'Active', joinedAt: new Date().toISOString() },
        { id: '2', email: 'marketing@agency.com', status: 'Active', joinedAt: new Date().toISOString() },
      ];
      setSubscribers(initial);
      localStorage.setItem('pronimal_subscribers', JSON.stringify(initial));
    }
  }, []);

  const saveSubscribers = (updated: Subscriber[]) => {
    setSubscribers(updated);
    localStorage.setItem('pronimal_subscribers', JSON.stringify(updated));
  };

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub: Subscriber = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      status: 'Active',
      joinedAt: new Date().toISOString(),
    };
    saveSubscribers([newSub, ...subscribers]);
    setEmail('');
    setIsSubscriberModalOpen(false);
  };

  const handleDeleteSubscriber = (id: string) => {
    if (confirm('Remove this subscriber?')) {
      saveSubscribers(subscribers.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Newsletter</h1>
          <p className="text-gray-500">Manage your email subscriber list</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsSubscriberModalOpen(true)}
            className="pronimal-btn-accent flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      <div className="pronimal-card">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-bold text-primary flex items-center gap-2">
            <User size={18} className="text-accent" />
            Subscribers List
          </h2>
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {subscribers.filter(s => s.status === 'Active').length} Active
          </span>
        </div>
        <table className="pronimal-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr key={sub.id}>
                <td className="font-medium">{sub.email}</td>
                <td>{new Date(sub.joinedAt).toLocaleDateString()}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    sub.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="text-right">
                  <button 
                    onClick={() => handleDeleteSubscriber(sub.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400">
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isSubscriberModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">Add Subscriber</h2>
              <button onClick={() => setIsSubscriberModalOpen(false)}><X size={24} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddSubscriber} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Email Address</label>
                <input 
                  type="email" 
                  className="pronimal-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="e.g. subscriber@example.com"
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsSubscriberModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="pronimal-btn-accent">Add Subscriber</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
