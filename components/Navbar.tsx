
import React, { useState } from 'react';
import { View, User } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  users: User[];
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isLoggedIn, isAdmin, onLogout, users }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const pendingCount = users.filter(u => u.status === 'pending').length;

  const navLinks: { label: string; view: View }[] = [
    { label: 'হোম', view: 'home' },
    { label: 'এবাউট', view: 'about' },
    { label: 'মেম্বার', view: 'members' },
    { label: 'কমিটি', view: 'committee' },
    { label: 'গ্যালারি', view: 'gallery' },
    { label: 'নোটিশ', view: 'notice' },
    { label: 'ক্রিকেট', view: 'cricket' },
    { label: 'কন্টাক্ট', view: 'contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-users text-blue-700 text-xl"></i>
            </div>
            <span className="font-bold text-lg hidden sm:block tracking-tight">মদিনা বাজার যুব কল্যাণ সংঘ</span>
            <span className="font-bold text-lg sm:hidden">MBJKS</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => setView(link.view)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentView === link.view ? 'bg-blue-800 text-white shadow-inner' : 'hover:bg-blue-600'}`}
              >
                {link.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => setView('admin')}
                className={`relative px-3 py-2 rounded-lg text-sm font-bold bg-slate-900 text-blue-400 hover:text-white transition-all ml-2 flex items-center gap-2 group ${currentView === 'admin' ? 'ring-2 ring-blue-400' : ''}`}
              >
                <i className="fas fa-cog group-hover:rotate-90 transition-transform"></i> এডমিন
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] flex items-center justify-center text-white border border-white">
                      {pendingCount}
                    </span>
                  </span>
                )}
              </button>
            )}
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="ml-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
              >
                লগআউট
              </button>
            ) : (
              <button
                onClick={() => setView('auth')}
                className="ml-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
              >
                লগইন
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            {isAdmin && pendingCount > 0 && (
              <div className="relative">
                 <i className="fas fa-bell text-yellow-400"></i>
                 <span className="absolute -top-2 -right-2 bg-red-500 text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-blue-700">
                   {pendingCount}
                 </span>
              </div>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-blue-800 border-t border-blue-600 animate-fadeIn">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => { setView(link.view); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl hover:bg-blue-700 font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => { setView('admin'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl bg-slate-900 text-blue-400 font-bold flex justify-between items-center"
              >
                <span><i className="fas fa-cog mr-2"></i> এডমিন প্যানেল</span>
                {pendingCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {pendingCount} আবেদন
                  </span>
                )}
              </button>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => { onLogout(); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl bg-red-500 font-bold"
              >
                লগআউট
              </button>
            ) : (
              <button
                onClick={() => { setView('auth'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl bg-green-500 font-bold"
              >
                লগইন / আবেদন করুন
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
