
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  User, 
  Building2, 
  Contact,
  Info,
  HelpCircle,
  ShieldCheck,
  FileCheck,
  LogOut,
  Mail,
  MessageSquare
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Blog Management', href: '/dashboard/blog', icon: FileText },
  { name: 'Banner Management', href: '/dashboard/banner', icon: ImageIcon },
  { name: 'Agents', href: '/dashboard/agent', icon: User },
  { name: 'Agencies', href: '/dashboard/agency', icon: Building2 },
  { name: 'Owners', href: '/dashboard/owner', icon: Contact },
  { name: 'Newsletter', href: '/dashboard/newsletter', icon: Mail },
  { name: 'Contact Us', href: '/dashboard/contact', icon: MessageSquare },
  { name: 'About Us', href: '/dashboard/about', icon: Info },
  { name: 'FAQs', href: '/dashboard/faqs', icon: HelpCircle },
  { name: 'Privacy Policy', href: '/dashboard/privacy', icon: ShieldCheck },
  { name: 'Terms & Conditions', href: '/dashboard/terms', icon: FileCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    localStorage.removeItem('pronimal_last_login');
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">Pronim.al</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
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
