'use client';

import GoogleSignInButton from './GoogleSignInButton'; 

interface CollapsibleSidebarProps {
  isOpen: boolean;
}

export default function CollapsibleSidebar({ isOpen }: CollapsibleSidebarProps) {
  return (
    <>
      {/* Background Dimmer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ zIndex: 40 }}
      />

      {/* The Glass Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 z-50 transform transition-transform duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
          bg-white/5 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_-15px_rgba(0,0,0,0.5)]`} 
      >
        <div className="flex flex-col h-full p-8"> 
          <h2 className="text-2xl font-semibold mb-8 text-white tracking-tight">Account</h2>
          
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
             <p className="text-slate-400 text-sm mb-4">Sync your Nexus Hub</p>
             <GoogleSignInButton />
          </div>
        </div>
      </div>
    </>
  );
}
