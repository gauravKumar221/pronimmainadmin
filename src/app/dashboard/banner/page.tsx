
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Upload, Plus, Trash2, Pencil, X, ImageIcon } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pronimal_banners');
    if (saved) {
      setBanners(JSON.parse(saved));
    } else {
      const initial = [
        { id: '1', title: 'Summer Collection Sale', imageUrl: 'https://picsum.photos/seed/pronimal-1/1200/400' },
        { id: '2', title: 'New Arrival Technology', imageUrl: 'https://picsum.photos/seed/pronimal-2/1200/400' },
      ];
      setBanners(initial);
      localStorage.setItem('pronimal_banners', JSON.stringify(initial));
    }
  }, []);

  const saveBanners = (updatedBanners: Banner[]) => {
    setBanners(updatedBanners);
    localStorage.setItem('pronimal_banners', JSON.stringify(updatedBanners));
  };

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setTitle(banner.title);
      setImageUrl(banner.imageUrl);
    } else {
      setEditingBanner(null);
      setTitle('');
      setImageUrl('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setTitle('');
    setImageUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedBanners;
    if (editingBanner) {
      updatedBanners = banners.map(b => b.id === editingBanner.id ? { ...b, title, imageUrl } : b);
    } else {
      const newBanner: Banner = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        imageUrl: imageUrl || 'https://picsum.photos/seed/banner/1200/400',
      };
      updatedBanners = [...banners, newBanner];
    }
    saveBanners(updatedBanners);
    setSuccess(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!');
    setTimeout(() => setSuccess(''), 3000);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      const filtered = banners.filter(b => b.id !== id);
      saveBanners(filtered);
      setSuccess('Banner deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Banner Management</h1>
          <p className="text-gray-500">Manage your homepage hero banners</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="pronimal-btn-accent flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Banner</span>
        </button>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-md animate-in fade-in slide-in-from-top-1">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {banners.length > 0 ? (
          banners.map((banner) => (
            <div key={banner.id} className="pronimal-card group relative">
              <div className="relative h-48 bg-gray-100 overflow-hidden border-b border-gray-100">
                {banner.imageUrl ? (
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImageIcon size={40} />
                    <span className="mt-2 text-sm">No image available</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openModal(banner)}
                    className="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-md transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-md transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h2 className="font-bold text-lg text-primary truncate">{banner.title}</h2>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Banner ID: {banner.id}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No banners found. Click "Add Banner" to create one.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Banner Title</label>
                <input
                  type="text"
                  className="pronimal-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Collection Sale"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="pronimal-label">Banner Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="pronimal-input flex-1"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL or upload below"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
                    title="Upload local image"
                  >
                    <Upload size={20} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
                {imageUrl && (
                  <div className="mt-2 relative h-40 w-full rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 font-medium">
                  Cancel
                </button>
                <button type="submit" className="pronimal-btn-primary">
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
