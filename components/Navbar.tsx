
import React, { useState } from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isLoggedIn, isAdmin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: { label: string; view: View }[] = [
    { label: 'হোম', view: 'home' },
    { label: 'এবাউট', view: 'about' },
    { label: 'মেম্বার', view: 'members' },
    { label: 'কমিটি', view: 'committee' },
    { label: 'গ্যালারি', view: 'gallery' },
    { label: 'নোটিশ', view: 'notice' },
    { label: 'ক্রিকেট টুর্নামেন্ট', view: 'cricket' },
    { label: 'কন্টাক্ট', view: 'contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
            <i className="fas fa-users text-2xl mr-2"></i>
            <span className="font-bold text-lg hidden sm:block">মদিনা বাজার যুব কল্যাণ সংঘ</span>
            <span className="font-bold text-lg sm:hidden">MBJKS</span>
          </div>

          <div className="hidden lg:flex space-x-4 items-center">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => setView(link.view)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === link.view ? 'bg-blue-800 text-white' : 'hover:bg-blue-600'
                }`}
              >
                {link.label}
              </button>
            ))}
            
            {isAdmin && (
              <button
                onClick={() => setView('admin')}
                className={`px-3 py-2 rounded-md text-sm font-medium bg-orange-500 hover:bg-orange-600 ${currentView === 'admin' ? 'ring-2 ring-white' : ''}`}
              >
                ড্যাশবোর্ড
              </button>
            )}

            {!isLoggedIn ? (
              <button
                onClick={() => setView('auth')}
                className="ml-4 px-4 py-2 rounded-md bg-white text-blue-700 font-bold hover:bg-slate-100 transition-colors"
              >
                লগইন
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="ml-4 px-4 py-2 rounded-md bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
              >
                লগআউট
              </button>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-blue-800 pb-4 px-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => {
                setView(link.view);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 text-base font-medium border-b border-blue-700 last:border-0"
            >
              {link.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => {
                setView('admin');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 text-base font-medium text-orange-400"
            >
              এডমিন ড্যাশবোর্ড
            </button>
          )}
          {!isLoggedIn ? (
            <button
              onClick={() => {
                setView('auth');
                setIsMenuOpen(false);
              }}
              className="w-full mt-4 bg-white text-blue-700 py-3 rounded-lg font-bold"
            >
              লগইন / রেজিস্টার
            </button>
          ) : (
            <button
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              className="w-full mt-4 bg-red-500 text-white py-3 rounded-lg font-bold"
            >
              লগআউট
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
