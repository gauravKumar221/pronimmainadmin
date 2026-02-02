
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

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

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    localStorage.removeItem('pronimal_last_login');
    router.push('/login');
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2 overflow-hidden bg-primary h-16 shrink-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white">
          <span className="font-bold text-lg">P</span>
        </div>
        {state === "expanded" && (
          <h1 className="text-xl font-bold tracking-tight text-white truncate">Pronim.al</h1>
        )}
      </SidebarHeader>
      
      <SidebarContent className="bg-primary">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={`
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-accent text-white hover:bg-accent/90' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }
                      `}
                    >
                      <Link href={item.href}>
                        <item.icon size={20} />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-gray-700 bg-primary">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
