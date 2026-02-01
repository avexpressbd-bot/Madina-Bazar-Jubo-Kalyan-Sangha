
import React from 'react';
import { View } from '../types';

interface FooterProps {
  setView: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-white text-xl font-bold mb-4">মদিনা বাজার যুব কল্যাণ সংঘ</h3>
          <p className="text-sm leading-relaxed">
            একটি সামাজিক সংগঠন যা যুবদের উন্নয়ন ও সমাজসেবায় নিবেদিত। আমরা শিক্ষা, ক্রীড়া ও সমাজসেবামূলক কর্মকাণ্ডের মাধ্যমে আমাদের এলাকাকে সমৃদ্ধ করতে চাই।
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
          <p className="mb-2"><i className="fas fa-map-marker-alt mr-2 text-blue-500"></i> মদিনা বাজার, সিলেট, বাংলাদেশ</p>
          <p className="mb-2"><i className="fas fa-phone mr-2 text-blue-500"></i> +৮৮০ ১৭০০ ০০০০০০</p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <a href="#" className="text-2xl hover:text-white transition-colors"><i className="fab fa-facebook"></i></a>
            <a href="#" className="text-2xl hover:text-white transition-colors"><i className="fab fa-youtube"></i></a>
            <a href="#" className="text-2xl hover:text-white transition-colors"><i className="fab fa-instagram"></i></a>
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
