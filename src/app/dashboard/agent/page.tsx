
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, User } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  agency: string;
  status: 'Active' | 'Inactive';
}

export default function AgentPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    agency: '',
    status: 'Active' as const,
  });

  useEffect(() => {
    const saved = localStorage.getItem('pronimal_agents');
    if (saved) {
      setAgents(JSON.parse(saved));
    } else {
      const initial = [
        { id: '1', name: 'John Doe', email: 'john@agency.com', agency: 'Global Tech', status: 'Active' },
        { id: '2', name: 'Jane Smith', email: 'jane@skyline.com', agency: 'Skyline Real Estate', status: 'Active' },
      ];
      setAgents(initial);
      localStorage.setItem('pronimal_agents', JSON.stringify(initial));
    }
  }, []);

  const saveAgents = (updated: Agent[]) => {
    setAgents(updated);
    localStorage.setItem('pronimal_agents', JSON.stringify(updated));
  };

  const openModal = (agent?: Agent) => {
    if (agent) {
      setEditingAgent(agent);
      setFormData({
        name: agent.name,
        email: agent.email,
        agency: agent.agency,
        status: agent.status,
      });
    } else {
      setEditingAgent(null);
      setFormData({ name: '', email: '', agency: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editingAgent) {
      updated = agents.map(a => a.id === editingAgent.id ? { ...a, ...formData } : a);
    } else {
      const newAgent = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
      };
      updated = [newAgent, ...agents];
    }
    saveAgents(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      saveAgents(agents.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Agents</h1>
          <p className="text-gray-500">Manage your real estate agents</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="pronimal-btn-accent flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Agent</span>
        </button>
      </div>

      <div className="pronimal-card">
        <table className="pronimal-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Agency</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td className="font-semibold flex items-center gap-2">
                  <div className="bg-gray-100 p-1 rounded-full"><User size={14} /></div>
                  {agent.name}
                </td>
                <td>{agent.email}</td>
                <td>{agent.agency}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    agent.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {agent.status}
                  </span>
                </td>
                <td className="text-right space-x-2">
                  <button onClick={() => openModal(agent)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(agent.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md">
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
              <h2 className="text-xl font-bold text-primary">{editingAgent ? 'Edit Agent' : 'Add Agent'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Agent Name</label>
                <input type="text" className="pronimal-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <label className="pronimal-label">Email Address</label>
                <input type="email" className="pronimal-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div>
                <label className="pronimal-label">Agency</label>
                <input type="text" className="pronimal-input" value={formData.agency} onChange={(e) => setFormData({...formData, agency: e.target.value})} required />
              </div>
              <div>
                <label className="pronimal-label">Status</label>
                <select className="pronimal-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="pronimal-btn-primary">{editingAgent ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
