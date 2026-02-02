
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  Building2, 
  LogOut 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Blog Management', href: '/dashboard/blog', icon: FileText },
  { name: 'Banner Management', href: '/dashboard/banner', icon: ImageIcon },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Agencies', href: '/dashboard/agency', icon: Building2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth cookie
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    // Clear login time from localStorage
    localStorage.removeItem('pronimal_last_login');
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">Pronim.al</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive 
                  ? 'bg-accent text-white font-semibold' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
