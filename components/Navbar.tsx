
import React, { useState } from 'react';
import { View, User, FooterData } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  users: User[];
  footerData: FooterData;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isLoggedIn, isAdmin, onLogout, users, footerData }) => {
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
    <div className="fixed top-0 left-0 right-0 z-50 shadow-2xl">
      {/* Top Bar integrated into the Blue Theme */}
      <div className="bg-blue-800 text-blue-100 py-1.5 border-b border-blue-700/50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] md:text-[11px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="flex items-center gap-1.5"><i className="fas fa-phone-alt text-blue-300"></i> <span className="hidden xs:inline">{footerData.phone}</span></span>
            <span className="hidden sm:flex items-center gap-1.5"><i className="fas fa-envelope text-blue-300"></i> {footerData.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline opacity-70">অনুসরণ করুন:</span>
            <div className="flex items-center gap-4">
              <a href={footerData.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all transform hover:scale-110"><i className="fab fa-facebook-f"></i></a>
              <a href={footerData.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all transform hover:scale-110"><i className="fab fa-youtube"></i></a>
              <a href={footerData.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all transform hover:scale-110"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView('home')}>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                <i className="fas fa-handshake text-blue-700 text-xl"></i>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm md:text-lg tracking-tight leading-none">মদিনা বাজার যুব কল্যাণ সংঘ</span>
                <span className="text-[10px] font-bold opacity-70 tracking-[0.2em] uppercase hidden md:block">Unity • Service • Progress</span>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => setView(link.view)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide ${currentView === link.view ? 'bg-blue-900 text-white shadow-inner' : 'hover:bg-blue-600/50'}`}
                >
                  {link.label}
                </button>
              ))}
              {isAdmin && (
                <button
                  onClick={() => setView('admin')}
                  className={`relative px-4 py-2 rounded-xl text-xs font-black bg-slate-900 text-blue-400 hover:text-white transition-all ml-4 flex items-center gap-2 border border-blue-500/30 ${currentView === 'admin' ? 'ring-2 ring-blue-400 bg-slate-800' : ''}`}
                >
                  <i className="fas fa-user-shield"></i> এডমিন
                  {pendingCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 text-[10px] flex items-center justify-center text-white border-2 border-blue-700 font-black">
                        {pendingCount}
                      </span>
                    </span>
                  )}
                </button>
              )}
              {isLoggedIn ? (
                <button
                  onClick={onLogout}
                  className="ml-4 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 border border-red-500/30"
                >
                  লগআউট
                </button>
              ) : (
                <button
                  onClick={() => setView('auth')}
                  className="ml-4 bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 border border-emerald-400/30"
                >
                  লগইন
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-4">
              {isAdmin && pendingCount > 0 && (
                <div className="relative" onClick={() => setView('admin')}>
                   <i className="fas fa-bell text-yellow-300 animate-swing"></i>
                   <span className="absolute -top-2 -right-2 bg-red-600 text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-blue-700 font-bold">
                     {pendingCount}
                   </span>
                </div>
              )}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-2xl">
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-blue-800 border-t border-blue-600/50 shadow-2xl">
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => { setView(link.view); setIsMenuOpen(false); }}
                  className={`block w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${currentView === link.view ? 'bg-blue-900 shadow-inner' : 'hover:bg-blue-700'}`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-blue-700 space-y-3">
                {isAdmin && (
                  <button
                    onClick={() => { setView('admin'); setIsMenuOpen(false); }}
                    className="block w-full text-left px-5 py-4 rounded-2xl bg-slate-950 text-blue-400 font-black flex justify-between items-center border border-blue-500/20"
                  >
                    <span><i className="fas fa-shield-halved mr-3"></i> এডমিন প্যানেল</span>
                    {pendingCount > 0 && <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-lg">{pendingCount} আবেদন</span>}
                  </button>
                )}
                {isLoggedIn ? (
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-5 py-4 rounded-2xl bg-red-600 font-black shadow-lg">লগআউট</button>
                ) : (
                  <button onClick={() => { setView('auth'); setIsMenuOpen(false); }} className="block w-full text-left px-5 py-4 rounded-2xl bg-emerald-500 font-black shadow-lg">লগইন / আবেদন করুন</button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <style>{`
        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          80% { transform: rotate(-5deg); }
        }
        .animate-swing {
          animation: swing 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
