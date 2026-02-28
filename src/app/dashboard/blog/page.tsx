'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Upload } from 'lucide-react';
import Image from 'next/image';
import { RichTextEditor } from '@/components/RichTextEditor';
import { fetchBlogs, createBlog, updateBlog, deleteBlog, uploadBlogImage, type BlogPost } from '@/lib/api';

function stripHtml(html: string): string {
  if (!html) return '';
  if (typeof document === 'undefined') return html.replace(/<[^>]*>/g, '');
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const loadBlogs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchBlogs();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripHtml(description).trim()) {
      setError('Description is required');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      if (editingPost) {
        await updateBlog(editingPost.id, {
          title,
          description,
          imageUrl: imageUrl || undefined,
        });
      } else {
        await createBlog({
          title,
          description,
          imageUrl: imageUrl || undefined,
        });
      }
      await loadBlogs();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setIsLoading(true);
    setError('');
    try {
      await deleteBlog(id);
      await loadBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    setUploadingImage(true);
    setError('');
    try {
      const url = await uploadBlogImage(file);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setDescription(post.description);
      setImageUrl(post.imageUrl || '');
    } else {
      setEditingPost(null);
      setTitle('');
      setDescription('');
      setImageUrl('');
    }
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setError('');
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
          disabled={isLoading}
          className="pronimal-btn-accent flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Post</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-md text-sm">
          {error}
        </div>
      )}

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
            {isLoading && posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : posts.length > 0 ? (
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
                          unoptimized={post.imageUrl.startsWith('data:')}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="font-semibold">{post.title}</td>
                  <td className="max-w-xs truncate">{stripHtml(post.description)}</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="text-right space-x-2">
                    <button
                      onClick={() => openModal(post)}
                      disabled={isLoading}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={isLoading}
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
                    disabled={uploadingImage}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Upload image to S3"
                  >
                    {uploadingImage ? (
                      <span className="text-xs">Uploading...</span>
                    ) : (
                      <Upload size={20} />
                    )}
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
                      unoptimized={imageUrl.startsWith('data:') || imageUrl.includes('amazonaws')}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="pronimal-label">Description</label>
                <RichTextEditor
                  key={editingPost?.id ?? 'new'}
                  value={description}
                  onChange={setDescription}
                  placeholder="Write your post description or content..."
                  minHeight="160px"
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="pronimal-btn-primary">
                  {isLoading ? 'Saving...' : editingPost ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
