
import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 sticky top-0 z-10">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-gray-200 mx-2" />
            <h2 className="text-sm font-medium text-gray-500">Admin Dashboard</h2>
          </header>
          <div className="p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
