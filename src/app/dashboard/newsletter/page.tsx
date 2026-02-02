'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Plus, 
  Trash2, 
  Send, 
  X, 
  User, 
  CheckCircle,
  Bold,
  Italic,
  Underline,
  Type,
  List,
  Eraser,
  Undo2,
  Redo2
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
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [composerContent, setComposerContent] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

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

  const handleSendNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Newsletter sent to ' + subscribers.filter(s => s.status === 'Active').length + ' subscribers!');
    setIsComposeModalOpen(false);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Newsletter</h1>
          <p className="text-gray-500">Manage subscribers and send email updates</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsComposeModalOpen(true)}
            className="pronimal-btn-primary flex items-center gap-2"
          >
            <Send size={18} />
            <span>Compose Newsletter</span>
          </button>
          <button 
            onClick={() => setIsSubscriberModalOpen(true)}
            className="pronimal-btn-accent flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
        </div>

        <div className="space-y-6">
          <div className="pronimal-card p-6 bg-accent/5 border-accent/10">
            <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
              <Mail size={18} className="text-accent" />
              Quick Stats
            </h3>
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Growth</p>
                <p className="text-2xl font-black text-primary">+12% <span className="text-xs font-normal text-gray-400 ml-1">this month</span></p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Open Rate</p>
                <p className="text-2xl font-black text-primary">68.4%</p>
              </div>
            </div>
          </div>
        </div>
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

      {isComposeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full shadow-xl animate-in zoom-in-95 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <Send size={18} className="text-accent" />
                Compose Newsletter
              </h2>
              <button onClick={() => setIsComposeModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSendNewsletter} className="flex flex-col h-[80vh]">
              <div className="p-6 flex flex-col flex-1 overflow-hidden">
                <div className="mb-4">
                  <label className="pronimal-label">Newsletter Subject</label>
                  <input type="text" className="pronimal-input" placeholder="e.g. Our Monthly Update" required />
                </div>
                
                <div className="flex flex-col h-full overflow-hidden">
                  <label className="pronimal-label">Content</label>
                  <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1 border-b-0">
                    <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Bold size={16} /></button>
                    <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Italic size={16} /></button>
                    <button type="button" onClick={() => execCommand('underline')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Underline size={16} /></button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <button type="button" onClick={() => execCommand('formatBlock', '<h1>')} className="p-1.5 hover:bg-white rounded font-bold">H1</button>
                    <button type="button" onClick={() => execCommand('formatBlock', '<h2>')} className="p-1.5 hover:bg-white rounded font-bold">H2</button>
                    <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-white rounded"><List size={16} /></button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <button type="button" onClick={() => execCommand('undo')} className="p-1.5 hover:bg-white rounded"><Undo2 size={16} /></button>
                    <button type="button" onClick={() => execCommand('redo')} className="p-1.5 hover:bg-white rounded"><Redo2 size={16} /></button>
                  </div>
                  <div
                    ref={editorRef}
                    contentEditable
                    className="flex-1 w-full p-4 border border-gray-200 rounded-b-md focus:outline-none overflow-y-auto bg-white"
                    placeholder="Write your newsletter here..."
                  />
                </div>
              </div>

              <div className="p-4 flex gap-3 justify-end border-t border-gray-100 bg-gray-50/50">
                <button type="button" onClick={() => setIsComposeModalOpen(false)} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md text-sm">Cancel</button>
                <button type="submit" className="pronimal-btn-primary px-8 text-sm flex items-center gap-2">
                  <Send size={16} />
                  Send to {subscribers.filter(s => s.status === 'Active').length} Subscribers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
