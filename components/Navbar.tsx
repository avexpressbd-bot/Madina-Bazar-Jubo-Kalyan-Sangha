
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
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <i className="fas fa-users text-blue-700 text-xl"></i>
            </div>
            <span className="font-bold text-lg hidden sm:block">মদিনা বাজার যুব কল্যাণ সংঘ</span>
            <span className="font-bold text-lg sm:hidden">MBJKS</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => setView(link.view)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === link.view ? 'bg-blue-800 text-white' : 'hover:bg-blue-600'}`}
              >
                {link.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => setView('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-bold bg-slate-900 text-blue-400 hover:text-white transition-all ml-2 flex items-center gap-2 ${currentView === 'admin' ? 'ring-2 ring-blue-400' : ''}`}
              >
                <i className="fas fa-cog"></i> এডমিন
              </button>
            )}
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="ml-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              >
                লগআউট
              </button>
            ) : (
              <button
                onClick={() => setView('auth')}
                className="ml-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              >
                লগইন
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
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
                className="block w-full text-left px-4 py-3 rounded-xl hover:bg-blue-700 font-medium"
              >
                {link.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => { setView('admin'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl bg-slate-900 text-blue-400 font-bold"
              >
                <i className="fas fa-cog mr-2"></i> এডমিন প্যানেল
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
                লগইন / রেজিস্ট্রেশন
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
