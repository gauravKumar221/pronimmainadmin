
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Banner {
  id: number;
  title: string;
  imageUrl: string;
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('adminix_banners');
    if (saved) {
      setBanners(JSON.parse(saved));
    } else {
      const initial = [
        { id: 1, title: 'Summer Collection Sale', imageUrl: 'https://picsum.photos/seed/adminix-1/1200/400' },
        { id: 2, title: 'New Arrival Technology', imageUrl: 'https://picsum.photos/seed/adminix-2/1200/400' },
      ];
      setBanners(initial);
      localStorage.setItem('adminix_banners', JSON.stringify(initial));
    }
  }, []);

  const handleUpdate = (id: number, field: 'title' | 'imageUrl', value: string) => {
    const updated = banners.map(b => b.id === id ? { ...b, [field]: value } : b);
    setBanners(updated);
  };

  const handleSave = () => {
    localStorage.setItem('adminix_banners', JSON.stringify(banners));
    setSuccess('Banners updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Banner Management</h1>
        <p className="text-gray-500">Update homepage hero banners</p>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-md">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {banners.map((banner) => (
          <div key={banner.id} className="adminix-card">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-lg">Banner {banner.id}</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden border border-gray-100">
                {banner.imageUrl && (
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="adminix-label">Banner Title</label>
                  <input
                    type="text"
                    className="adminix-input"
                    value={banner.title}
                    onChange={(e) => handleUpdate(banner.id, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="adminix-label">Image URL</label>
                  <input
                    type="text"
                    className="adminix-input"
                    value={banner.imageUrl}
                    onChange={(e) => handleUpdate(banner.id, 'imageUrl', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="adminix-btn-primary px-8"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
