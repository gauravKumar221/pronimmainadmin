
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('adminix_blogs');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      const initialPosts = [
        { id: '1', title: 'Welcome to Adminix', description: 'This is your first admin post.', createdAt: new Date().toISOString() },
        { id: '2', title: 'Admin Tips & Tricks', description: 'How to use the dashboard effectively.', createdAt: new Date().toISOString() },
      ];
      setPosts(initialPosts);
      localStorage.setItem('adminix_blogs', JSON.stringify(initialPosts));
    }
  }, []);

  const savePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('adminix_blogs', JSON.stringify(newPosts));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      const updated = posts.map(p => 
        p.id === editingPost.id ? { ...p, title, description } : p
      );
      savePosts(updated);
    } else {
      const newPost: BlogPost = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
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

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setDescription(post.description);
    } else {
      setEditingPost(null);
      setTitle('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setTitle('');
    setDescription('');
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
          className="adminix-btn-accent flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Post</span>
        </button>
      </div>

      <div className="adminix-card">
        <table className="adminix-table">
          <thead>
            <tr>
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
                <td colSpan={4} className="text-center py-8 text-gray-400">
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
                <label className="adminix-label">Title</label>
                <input
                  type="text"
                  className="adminix-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="adminix-label">Description</label>
                <textarea
                  className="adminix-input min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 font-medium">
                  Cancel
                </button>
                <button type="submit" className="adminix-btn-primary">
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
