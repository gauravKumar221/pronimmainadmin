
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Upload } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pronimal_blogs');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      const initialPosts: BlogPost[] = [
        { 
          id: '1', 
          title: 'Welcome to Pronim.al', 
          description: 'This is your first admin post.', 
          imageUrl: 'https://picsum.photos/seed/blog-1/600/400',
          createdAt: new Date().toISOString() 
        },
        { 
          id: '2', 
          title: 'Admin Tips & Tricks', 
          description: 'How to use the dashboard effectively.', 
          imageUrl: 'https://picsum.photos/seed/blog-2/600/400',
          createdAt: new Date().toISOString() 
        },
      ];
      setPosts(initialPosts);
      localStorage.setItem('pronimal_blogs', JSON.stringify(initialPosts));
    }
  }, []);

  const savePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('pronimal_blogs', JSON.stringify(newPosts));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      const updated = posts.map(p => 
        p.id === editingPost.id ? { ...p, title, description, imageUrl } : p
      );
      savePosts(updated);
    } else {
      const newPost: BlogPost = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        imageUrl: imageUrl || 'https://picsum.photos/seed/default/600/400',
        createdAt: new Date().toISOString(),
      };
      savePosts([newPost, ...posts]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const filtered = posts.filter(p => p.id !== id);
      savePosts(filtered);
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

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setDescription(post.description);
      setImageUrl(post.imageUrl);
    } else {
      setEditingPost(null);
      setTitle('');
      setDescription('');
      setImageUrl('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Blog Management</h1>
          <p className="text-gray-500">Manage your website articles and updates</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="pronimal-btn-accent flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Post</span>
        </button>
      </div>

      <div className="pronimal-card">
        <table className="pronimal-table">
          <thead>
            <tr>
              <th className="w-24">Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="relative w-16 h-12 rounded bg-gray-100 overflow-hidden border border-gray-100">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="font-semibold">{post.title}</td>
                  <td className="max-w-xs truncate">{post.description}</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="text-right space-x-2">
                    <button 
                      onClick={() => openModal(post)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No blog posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">
                {editingPost ? 'Edit Blog Post' : 'Create New Post'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Title</label>
                <input
                  type="text"
                  className="pronimal-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="pronimal-label">Post Image</label>
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
                  <div className="mt-2 relative h-32 w-full rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="pronimal-label">Description</label>
                <textarea
                  className="pronimal-input min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 font-medium">
                  Cancel
                </button>
                <button type="submit" className="pronimal-btn-primary">
                  {editingPost ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
