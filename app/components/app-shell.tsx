'use client';

import { useState } from 'react';
import SidebarComponent from './sidebar';
import { ChatProvider } from '../lib/chat-context';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ChatProvider>
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`transition-all duration-300 ${
          collapsed ? 'ml-[80px]' : 'ml-[320px]'
        }`}
      >
        {children}
      </main>
    </ChatProvider>
  );
}