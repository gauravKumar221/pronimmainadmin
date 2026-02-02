
'use client';

import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock,
  Save
} from 'lucide-react';

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

export default function ContactInfoPage() {
  const [info, setInfo] = useState<ContactInfo>({
    address: '123 Tech Avenue, Innovation District, SF',
    phone: '+1 (555) 000-1111',
    email: 'contact@pronim.al',
    workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
  });

  const [success, setSuccess] = useState('');

  useEffect(() => {
    const savedInfo = localStorage.getItem('pronimal_contact_info');
    if (savedInfo) setInfo(JSON.parse(savedInfo));
  }, []);

  const handleInfoSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pronimal_contact_info', JSON.stringify(info));
    setSuccess('Contact information updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Contact Info</h1>
          <p className="text-gray-500">Manage your public office and contact details</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-md animate-in fade-in slide-in-from-top-1">
          {success}
        </div>
      )}

      <div className="pronimal-card">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <PhoneCall className="text-accent" size={20} />
          <h2 className="font-bold text-primary">Public Contact Details</h2>
        </div>
        <form onSubmit={handleInfoSave} className="p-8 space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="pronimal-label flex items-center gap-2">
                <MapPin size={16} /> Office Address
              </label>
              <input 
                className="pronimal-input" 
                value={info.address} 
                onChange={e => setInfo({...info, address: e.target.value})}
                placeholder="Full office address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="pronimal-label flex items-center gap-2">
                  <PhoneCall size={16} /> Phone Number
                </label>
                <input 
                  className="pronimal-input" 
                  value={info.phone} 
                  onChange={e => setInfo({...info, phone: e.target.value})}
                  placeholder="+1 (000) 000-0000"
                />
              </div>
              <div>
                <label className="pronimal-label flex items-center gap-2">
                  <Mail size={16} /> Contact Email
                </label>
                <input 
                  className="pronimal-input" 
                  value={info.email} 
                  onChange={e => setInfo({...info, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div>
              <label className="pronimal-label flex items-center gap-2">
                <Clock size={16} /> Working Hours
              </label>
              <input 
                className="pronimal-input" 
                value={info.workingHours} 
                onChange={e => setInfo({...info, workingHours: e.target.value})}
                placeholder="e.g. Mon - Fri: 9am - 5pm"
              />
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="pronimal-btn-primary flex items-center gap-2">
              <Save size={18} />
              Save Contact Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
