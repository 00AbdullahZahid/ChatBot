'use client';

import { useState } from 'react';
import SidebarComponent from './sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`transition-all duration-300 ${
          collapsed ? 'ml-[112px]' : 'ml-[352px]'
        }`}
      >
        {children}
      </main>
    </>
  );
}