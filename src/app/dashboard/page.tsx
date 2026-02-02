
'use client';

import React from 'react';
import { Users, Building2, FileText, Image as ImageIcon } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { name: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Agencies', value: '42', icon: Building2, color: 'text-accent', bg: 'bg-green-50' },
    { name: 'Blog Posts', value: '89', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Active Banners', value: '2', icon: ImageIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="adminix-card p-6 flex items-center gap-4">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="adminix-card">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Recent Activities</h2>
            <button className="text-accent text-sm font-medium">View All</button>
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-800">New agency <span className="font-semibold">Skyline Real Estate</span> registered.</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="adminix-card">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-lg">Quick Access</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <button className="adminix-btn-primary text-sm">Create New Blog Post</button>
            <button className="adminix-btn-accent text-sm">Manage Banners</button>
            <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">System Settings</button>
            <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">User Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
}
