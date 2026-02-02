'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Pencil, 
  X, 
  Info,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Type,
  ListOrdered,
  List,
  Plus,
  Trash2,
  Hash,
  Trophy,
  Users,
  Building,
  Star
} from 'lucide-react';

interface Counter {
  id: string;
  label: string;
  value: string;
  icon: 'Trophy' | 'Users' | 'Building' | 'Star' | 'Hash';
}

const ICON_MAP = {
  Trophy: Trophy,
  Users: Users,
  Building: Building,
  Star: Star,
  Hash: Hash,
};

export default function AboutUsPage() {
  const [content, setContent] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const [counterFormData, setCounterFormData] = useState({
    label: '',
    value: '',
    icon: 'Hash' as Counter['icon'],
  });
  
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load profile content
    const savedProfile = localStorage.getItem('pronimal_about_v3');
    if (savedProfile) {
      setContent(savedProfile);
    } else {
      const initialProfile = `
        <h1>Our Vision</h1>
        <p>Pronim.al was founded with a single mission: to revolutionize how real estate agencies and agents manage their relationships with property owners. We believe in providing simple, powerful, and beautiful tools that make professional management accessible to everyone.</p>
        
        <h2>Our Story</h2>
        <p>Based in the heart of the tech industry, we combine cutting-edge technology with deep industry expertise to deliver a dashboard that truly works for you. Our team is dedicated to building the most intuitive administrative experience on the market.</p>
        
        <h2>Core Values</h2>
        <ul>
          <li><strong>Transparency:</strong> We believe in open communication and honest data management.</li>
          <li><strong>Innovation:</strong> Constantly pushing the boundaries of what a dashboard can do.</li>
          <li><strong>User First:</strong> Every feature is designed with the user's efficiency in mind.</li>
        </ul>
      `;
      setContent(initialProfile);
      localStorage.setItem('pronimal_about_v3', initialProfile);
    }

    // Load counters
    const savedCounters = localStorage.getItem('pronimal_counters');
    if (savedCounters) {
      setCounters(JSON.parse(savedCounters));
    } else {
      const initialCounters: Counter[] = [
        { id: '1', label: 'Years Experience', value: '15+', icon: 'Trophy' },
        { id: '2', label: 'Happy Clients', value: '2.5k', icon: 'Users' },
        { id: '3', label: 'Properties Managed', value: '450', icon: 'Building' },
      ];
      setCounters(initialCounters);
      localStorage.setItem('pronimal_counters', JSON.stringify(initialCounters));
    }
  }, []);

  const saveProfile = (newContent: string) => {
    setContent(newContent);
    localStorage.setItem('pronimal_about_v3', newContent);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalContent = editorRef.current?.innerHTML || content;
    saveProfile(finalContent);
    setIsProfileModalOpen(false);
  };

  const saveCounters = (updated: Counter[]) => {
    setCounters(updated);
    localStorage.setItem('pronimal_counters', JSON.stringify(updated));
  };

  const openCounterModal = (counter?: Counter) => {
    if (counter) {
      setEditingCounter(counter);
      setCounterFormData({
        label: counter.label,
        value: counter.value,
        icon: counter.icon,
      });
    } else {
      setEditingCounter(null);
      setCounterFormData({ label: '', value: '', icon: 'Hash' });
    }
    setIsCounterModalOpen(true);
  };

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editingCounter) {
      updated = counters.map(c => c.id === editingCounter.id ? { ...c, ...counterFormData } : c);
    } else {
      const newCounter = {
        id: Math.random().toString(36).substr(2, 9),
        ...counterFormData,
      };
      updated = [...counters, newCounter];
    }
    saveCounters(updated);
    setIsCounterModalOpen(false);
  };

  const deleteCounter = (id: string) => {
    if (confirm('Delete this counter?')) {
      saveCounters(counters.filter(c => c.id !== id));
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">About Us</h1>
          <p className="text-gray-500">Manage your company story and key metrics</p>
        </div>
        <button 
          onClick={() => setIsProfileModalOpen(true)}
          className="pronimal-btn-accent flex items-center gap-2"
        >
          <Pencil size={18} />
          <span>Edit About Us</span>
        </button>
      </div>

      {/* Counters Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Hash className="text-accent" size={20} />
            <h2 className="text-lg font-bold text-primary">Company Counters</h2>
          </div>
          <button 
            onClick={() => openCounterModal()}
            className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            <Plus size={16} />
            <span>Add Counter</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {counters.map((counter) => {
            const Icon = ICON_MAP[counter.icon];
            return (
              <div key={counter.id} className="pronimal-card p-6 relative group">
                <div className="flex items-center gap-4">
                  <div className="bg-accent/10 p-3 rounded-lg text-accent">
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{counter.value}</p>
                    <p className="text-sm text-gray-500 font-medium">{counter.label}</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button 
                    onClick={() => openCounterModal(counter)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    onClick={() => deleteCounter(counter.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {counters.length === 0 && (
            <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
              No counters added yet.
            </div>
          )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="pronimal-card p-10">
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
          <Info className="text-accent" size={24} />
          <h2 className="text-xl font-bold text-primary">Company Profile</h2>
        </div>
        <div 
          className="text-gray-700 leading-relaxed rich-text-display prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Profile Editor Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full shadow-xl animate-in zoom-in-95 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Pencil className="text-accent" size={18} />
                <h2 className="text-lg font-bold text-primary">About Us Editor</h2>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="flex flex-col h-[85vh]">
              <div className="p-6 flex flex-col flex-1 overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 space-y-2">
                    <div className="flex flex-wrap items-center gap-1 pb-1.5 border-b border-gray-200">
                      <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Bold size={16} /></button>
                      <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Italic size={16} /></button>
                      <button type="button" onClick={() => execCommand('underline')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Underline size={16} /></button>
                      <button type="button" onClick={() => execCommand('strikeThrough')} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-300"><Strikethrough size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('formatBlock', '<h1>')} className="p-1.5 hover:bg-white rounded font-bold">H1</button>
                      <button type="button" onClick={() => execCommand('formatBlock', '<h2>')} className="p-1.5 hover:bg-white rounded font-bold">H2</button>
                      <button type="button" onClick={() => execCommand('formatBlock', '<p>')} className="p-1.5 hover:bg-white rounded"><Type size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-white rounded"><List size={16} /></button>
                      <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 hover:bg-white rounded"><ListOrdered size={16} /></button>
                    </div>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    className="flex-1 w-full p-8 border border-t-0 border-gray-200 rounded-b-md font-body text-base leading-relaxed focus:outline-none overflow-y-auto bg-white"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </div>

              <div className="p-4 flex gap-3 justify-end border-t border-gray-100 bg-gray-50/50">
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md text-sm">Cancel</button>
                <button type="submit" className="pronimal-btn-primary px-8 text-sm">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Counter CRUD Modal */}
      {isCounterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">
                {editingCounter ? 'Edit Counter' : 'Add New Counter'}
              </h2>
              <button onClick={() => setIsCounterModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCounterSubmit} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Label</label>
                <input
                  type="text"
                  className="pronimal-input"
                  value={counterFormData.label}
                  onChange={(e) => setCounterFormData({...counterFormData, label: e.target.value})}
                  placeholder="e.g. Happy Clients"
                  required
                />
              </div>
              <div>
                <label className="pronimal-label">Value</label>
                <input
                  type="text"
                  className="pronimal-input"
                  value={counterFormData.value}
                  onChange={(e) => setCounterFormData({...counterFormData, value: e.target.value})}
                  placeholder="e.g. 2.5k or 50+"
                  required
                />
              </div>
              <div>
                <label className="pronimal-label">Icon</label>
                <select 
                  className="pronimal-input"
                  value={counterFormData.icon}
                  onChange={(e) => setCounterFormData({...counterFormData, icon: e.target.value as Counter['icon']})}
                >
                  <option value="Hash">Default (Hash)</option>
                  <option value="Trophy">Trophy</option>
                  <option value="Users">Users</option>
                  <option value="Building">Building</option>
                  <option value="Star">Star</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsCounterModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium">Cancel</button>
                <button type="submit" className="pronimal-btn-primary">
                  {editingCounter ? 'Update Counter' : 'Add Counter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .rich-text-display h1 { font-size: 2rem; font-weight: 800; margin-bottom: 1.5rem; color: #1f2937; }
        .rich-text-display h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #374151; }
        .rich-text-display p { margin-bottom: 1rem; line-height: 1.75; }
        .rich-text-display ul, .rich-text-display ol { margin-left: 1.5rem; margin-bottom: 1rem; }
        .rich-text-display li { margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}
