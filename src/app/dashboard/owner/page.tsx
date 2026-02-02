
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Contact } from 'lucide-react';

interface Owner {
  id: string;
  name: string;
  email: string;
  properties: number;
}

export default function OwnerPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    properties: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem('pronimal_owners');
    if (saved) {
      setOwners(JSON.parse(saved));
    } else {
      const initial = [
        { id: '1', name: 'Robert Jenkins', email: 'robert@owners.com', properties: 3 },
        { id: '2', name: 'Sarah Parker', email: 'sarah@owners.com', properties: 1 },
      ];
      setOwners(initial);
      localStorage.setItem('pronimal_owners', JSON.stringify(initial));
    }
  }, []);

  const saveOwners = (updated: Owner[]) => {
    setOwners(updated);
    localStorage.setItem('pronimal_owners', JSON.stringify(updated));
  };

  const openModal = (owner?: Owner) => {
    if (owner) {
      setEditingOwner(owner);
      setFormData({
        name: owner.name,
        email: owner.email,
        properties: owner.properties,
      });
    } else {
      setEditingOwner(null);
      setFormData({ name: '', email: '', properties: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editingOwner) {
      updated = owners.map(o => o.id === editingOwner.id ? { ...o, ...formData } : o);
    } else {
      const newOwner = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
      };
      updated = [newOwner, ...owners];
    }
    saveOwners(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this owner?')) {
      saveOwners(owners.filter(o => o.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Owners</h1>
          <p className="text-gray-500">Manage property owners</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="pronimal-btn-accent flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Owner</span>
        </button>
      </div>

      <div className="pronimal-card">
        <table className="pronimal-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Properties</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((owner) => (
              <tr key={owner.id}>
                <td className="font-semibold flex items-center gap-2">
                  <div className="bg-gray-100 p-1 rounded-full"><Contact size={14} /></div>
                  {owner.name}
                </td>
                <td>{owner.email}</td>
                <td>{owner.properties}</td>
                <td className="text-right space-x-2">
                  <button onClick={() => openModal(owner)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(owner.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">{editingOwner ? 'Edit Owner' : 'Add Owner'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Owner Name</label>
                <input type="text" className="pronimal-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <label className="pronimal-label">Email Address</label>
                <input type="email" className="pronimal-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div>
                <label className="pronimal-label">Number of Properties</label>
                <input type="number" className="pronimal-input" value={formData.properties} onChange={(e) => setFormData({...formData, properties: parseInt(e.target.value)})} required />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="pronimal-btn-primary">{editingOwner ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
