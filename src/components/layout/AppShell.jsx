import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const AppShell = ({ children, header, hideNav = false }) => {
  return (
    <div className="min-h-screen bg-background">
      {header}
      <main className="pb-32">
        {children || <Outlet />}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
};