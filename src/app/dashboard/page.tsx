
'use client';

import React, { useState, useEffect } from 'react';
import { User, Building2, Contact, FileText, Clock } from 'lucide-react';

export default function DashboardPage() {
  const [loginTime, setLoginTime] = useState<string | null>(null);

  useEffect(() => {
    const storedTime = localStorage.getItem('pronimal_last_login');
    if (storedTime) {
      setLoginTime(new Date(storedTime).toLocaleString());
    }
  }, []);

  const stats = [
    { name: 'Total Agents', value: '124', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Agencies', value: '42', icon: Building2, color: 'text-accent', bg: 'bg-green-50' },
    { name: 'Total Owners', value: '89', icon: Contact, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Blog Posts', value: '12', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
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
            <span>Session started: <span className="font-medium text-primary">{loginTime}</span></span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="pronimal-card p-6 flex items-center gap-4">
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
        <div className="pronimal-card">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Recent Activities</h2>
            <button className="text-accent text-sm font-medium">View All</button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0"></div>
              <div>
                <p className="text-sm text-gray-800">New agent <span className="font-semibold">Michael Chen</span> joined Global Tech Agency.</p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0"></div>
              <div>
                <p className="text-sm text-gray-800">Agency <span className="font-semibold">Skyline Real Estate</span> updated their profile.</p>
                <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
              </div>
            </div>
            <div className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0"></div>
              <div>
                <p className="text-sm text-gray-800">New property owner <span className="font-semibold">Sarah Jenkins</span> registered.</p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pronimal-card">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-lg">Quick Access</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <button className="pronimal-btn-primary text-sm">Add New Agent</button>
            <button className="pronimal-btn-accent text-sm">Manage Agencies</button>
            <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">Property Reports</button>
            <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">Owner Requests</button>
          </div>
        </div>
      </div>
    </div>
  );
}
