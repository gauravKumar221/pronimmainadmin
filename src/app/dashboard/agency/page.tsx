
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface Agency {
  id: string;
  name: string;
  location: string;
  category: string;
  employees: string;
}

export default function AgencyPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category: '',
    employees: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('pronimal_agencies');
    if (saved) {
      setAgencies(JSON.parse(saved));
    } else {
      const initial = [
        { id: '1', name: 'Global Tech Solutions', location: 'New York', category: 'IT', employees: '50-200' },
        { id: '2', name: 'Skyline Real Estate', location: 'London', category: 'Property', employees: '10-50' },
        { id: '3', name: 'Creative Minds Agency', location: 'Berlin', category: 'Marketing', employees: '1-10' },
      ];
      setAgencies(initial);
      localStorage.setItem('pronimal_agencies', JSON.stringify(initial));
    }
  }, []);

  const saveAgencies = (updated: Agency[]) => {
    setAgencies(updated);
    localStorage.setItem('pronimal_agencies', JSON.stringify(updated));
  };

  const openModal = (agency?: Agency) => {
    if (agency) {
      setEditingAgency(agency);
      setFormData({
        name: agency.name,
        location: agency.location,
        category: agency.category,
        employees: agency.employees,
      });
    } else {
      setEditingAgency(null);
      setFormData({ name: '', location: '', category: '', employees: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editingAgency) {
      updated = agencies.map(a => a.id === editingAgency.id ? { ...a, ...formData } : a);
    } else {
      const newAgency = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
      };
      updated = [newAgency, ...agencies];
    }
    saveAgencies(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this agency?')) {
      saveAgencies(agencies.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Agencies</h1>
          <p className="text-gray-500">Manage registered agencies and partners</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="pronimal-btn-accent flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Agency</span>
        </button>
      </div>

      <div className="pronimal-card">
        <table className="pronimal-table">
          <thead>
            <tr>
              <th>Agency Name</th>
              <th>Location</th>
              <th>Category</th>
              <th>Size</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency) => (
              <tr key={agency.id}>
                <td className="font-semibold">{agency.name}</td>
                <td>{agency.location}</td>
                <td>{agency.category}</td>
                <td>{agency.employees}</td>
                <td className="text-right space-x-2">
                  <button 
                    onClick={() => openModal(agency)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(agency.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
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
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">
                {editingAgency ? 'Edit Agency' : 'Add New Agency'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Agency Name</label>
                <input
                  type="text"
                  className="pronimal-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="pronimal-label">Location</label>
                <input
                  type="text"
                  className="pronimal-input"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="pronimal-label">Category</label>
                <input
                  type="text"
                  className="pronimal-input"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g. IT, Real Estate, Marketing"
                  required
                />
              </div>
              <div>
                <label className="pronimal-label">Employee Count</label>
                <select
                  className="pronimal-input"
                  value={formData.employees}
                  onChange={(e) => setFormData({...formData, employees: e.target.value})}
                  required
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="10-50">10-50 employees</option>
                  <option value="50-200">50-200 employees</option>
                  <option value="200-500">200-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium">
                  Cancel
                </button>
                <button type="submit" className="pronimal-btn-primary">
                  {editingAgency ? 'Update Agency' : 'Add Agency'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
