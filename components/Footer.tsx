
import React from 'react';
import { View, FooterData } from '../types';

interface FooterProps {
  setView: (view: View) => void;
  footerData: FooterData;
}

const Footer: React.FC<FooterProps> = ({ setView, footerData }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-white text-xl font-bold mb-4">মদিনা বাজার যুব কল্যাণ সংঘ</h3>
          <p className="text-sm leading-relaxed">
            {footerData.description}
          </p>
        </div>
        <div>
          <h3 className="text-white text-xl font-bold mb-4">দ্রুত লিংক</h3>
          <ul className="space-y-2">
            <li><button onClick={() => setView('home')} className="hover:text-white transition-colors">হোম</button></li>
            <li><button onClick={() => setView('members')} className="hover:text-white transition-colors">মেম্বার লিস্ট</button></li>
            <li><button onClick={() => setView('cricket')} className="hover:text-white transition-colors">ক্রিকেট টুর্নামেন্ট</button></li>
            <li><button onClick={() => setView('contact')} className="hover:text-white transition-colors">যোগাযোগ</button></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-xl font-bold mb-4">যোগাযোগ</h3>
          <p className="mb-2"><i className="fas fa-map-marker-alt mr-2 text-blue-500"></i> {footerData.address}</p>
          <p className="mb-2"><i className="fas fa-phone mr-2 text-blue-500"></i> {footerData.phone}</p>
          <p className="mb-2"><i className="fas fa-envelope mr-2 text-blue-500"></i> {footerData.email}</p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <a href={footerData.facebook} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-white transition-colors"><i className="fab fa-facebook"></i></a>
            <a href={footerData.youtube} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-white transition-colors"><i className="fab fa-youtube"></i></a>
            <a href={footerData.instagram} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-white transition-colors"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs">
        <p>© ২০২৪ মদিনা বাজার যুব কল্যাণ সংঘ। সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
};

export default Footer;
