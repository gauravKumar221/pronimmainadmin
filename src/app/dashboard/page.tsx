'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Image as ImageIcon,
  HelpCircle,
  ArrowRight,
  Mail,
  MessageSquare,
  ClipboardList,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { fetchSuperAdminStats } from '@/lib/api';

export default function DashboardPage() {
  const [loginTime, setLoginTime] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    newsletter?: { total: number; subscribed: number };
    contactUs?: { total: number; read: number; pending: number };
    enquiry?: { total: number };
    blog?: { total: number };
    faq?: { total: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTime = localStorage.getItem('pronimal_last_login');
    if (storedTime) {
      setLoginTime(new Date(storedTime).toLocaleString());
    }
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchSuperAdminStats();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const quickNav = [
    { name: 'Blog Manager', href: '/dashboard/blog', icon: FileText, desc: 'Create and edit articles' },
    { name: 'Enquiry Form', href: '/dashboard/enquiry', icon: ClipboardList, desc: 'View blog enquiries' },
    { name: 'FAQ Manager', href: '/dashboard/faqs', icon: HelpCircle, desc: 'Update support questions' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pronim.al Overview</h1>
          <p className="text-gray-500">Welcome back, Admin!</p>
        </div>
        {loginTime && (
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
            <Clock size={14} className="text-accent" />
            <span>
              Session started: <span className="font-medium text-primary">{loginTime}</span>
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="pronimal-card p-6 h-24 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/dashboard/newsletter"
            className="pronimal-card p-6 flex items-center gap-4 hover:border-accent transition-colors"
          >
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Newsletter</p>
              <p className="text-2xl font-bold text-primary">
                {stats.newsletter?.subscribed ?? 0}
                <span className="text-sm font-normal text-gray-500"> / {stats.newsletter?.total ?? 0}</span>
              </p>
              <p className="text-xs text-gray-400">subscribed / total</p>
            </div>
          </Link>

          <Link
            href="/dashboard/contact"
            className="pronimal-card p-6 flex items-center gap-4 hover:border-accent transition-colors"
          >
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Contact Us</p>
              <p className="text-2xl font-bold text-primary">{stats.contactUs?.total ?? 0}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-green-500" /> {stats.contactUs?.read ?? 0} read
                <span className="mx-1">·</span>
                <Circle size={12} className="text-amber-500" /> {stats.contactUs?.pending ?? 0} pending
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/enquiry"
            className="pronimal-card p-6 flex items-center gap-4 hover:border-accent transition-colors"
          >
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Enquiries</p>
              <p className="text-2xl font-bold text-primary">{stats.enquiry?.total ?? 0}</p>
              <p className="text-xs text-gray-400">from blog page</p>
            </div>
          </Link>

          <Link
            href="/dashboard/blog"
            className="pronimal-card p-6 flex items-center gap-4 hover:border-accent transition-colors"
          >
            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Blog Posts</p>
              <p className="text-2xl font-bold text-primary">{stats.blog?.total ?? 0}</p>
              <p className="text-xs text-gray-400">FAQs: {stats.faq?.total ?? 0}</p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="pronimal-card p-6 text-center text-gray-500">
          Failed to load stats. Please refresh.
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">Quick Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="pronimal-card p-6 hover:border-accent transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="bg-gray-50 text-accent p-3 rounded-lg w-fit group-hover:bg-accent group-hover:text-white transition-colors">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-accent transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
