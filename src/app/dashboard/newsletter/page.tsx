'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Plus, Trash2, X, User, RefreshCw } from 'lucide-react';
import {
  fetchNewsletters,
  deleteNewsletter,
  toggleNewsletterSubscription,
  addNewsletterSubscriber,
  type NewsletterSubscriber,
} from '@/lib/api';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [isSubscriberModalOpen, setIsSubscriberModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadNewsletters = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchNewsletters({ page: 1, limit: 100 });
      setSubscribers(data.newsletters);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscribers');
      setSubscribers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNewsletters();
  }, [loadNewsletters]);

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      await addNewsletterSubscriber(email.trim());
      await loadNewsletters();
      setEmail('');
      setIsSubscriberModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add subscriber');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    setIsLoading(true);
    setError('');
    try {
      await deleteNewsletter(id);
      await loadNewsletters();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSubscription = async (sub: NewsletterSubscriber) => {
    setIsLoading(true);
    setError('');
    try {
      await toggleNewsletterSubscription(sub.id, !sub.subscribed);
      await loadNewsletters();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsLoading(false);
    }
  };

  const activeCount = subscribers.filter((s) => s.subscribed).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Newsletter</h1>
          <p className="text-gray-500">Subscribers from pronim-frontend newsletter sign-up</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadNewsletters}
            disabled={isLoading}
            className="pronimal-btn-accent flex items-center gap-2"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsSubscriberModalOpen(true)}
            className="pronimal-btn-accent flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-md text-sm">{error}</div>
      )}

      <div className="pronimal-card">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-bold text-primary flex items-center gap-2">
            <User size={18} className="text-accent" />
            Subscribers List
          </h2>
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {activeCount} Active / {subscribers.length} Total
          </span>
        </div>
        <table className="pronimal-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && subscribers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td className="font-medium">
                    <span className="inline-flex items-center gap-2">
                      <Mail size={14} className="text-gray-400 flex-shrink-0" />
                      {sub.email}
                    </span>
                  </td>
                  <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleToggleSubscription(sub)}
                      disabled={isLoading}
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        sub.subscribed ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {sub.subscribed ? 'Active' : 'Unsubscribed'}
                    </button>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleDeleteSubscriber(sub.id)}
                      disabled={isLoading}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!isLoading && subscribers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400">
                  No subscribers yet. New sign-ups from the frontend will appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isSubscriberModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">Add Subscriber</h2>
              <button onClick={() => setIsSubscriberModalOpen(false)}>
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddSubscriber} className="p-6 space-y-4">
              <div>
                <label className="pronimal-label">Email Address</label>
                <input
                  type="email"
                  className="pronimal-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="subscriber@example.com"
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsSubscriberModalOpen(false)}
                  className="px-4 py-2 text-gray-600"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="pronimal-btn-accent">
                  {isLoading ? 'Adding...' : 'Add Subscriber'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
