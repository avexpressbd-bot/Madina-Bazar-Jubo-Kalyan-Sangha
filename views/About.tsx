
import React from 'react';
import { AboutData } from '../types';

const About: React.FC<{ data: AboutData }> = ({ data }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-sm border-b-2 border-blue-600 pb-1">আমাদের কথা</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-6 mb-8 leading-tight">মদিনা বাজার যুব কল্যাণ সংঘ - মানবতার সেবায় নিবেদিত</h2>
          <p className="text-slate-600 leading-relaxed text-xl mb-10 font-light">
            {data.description}
          </p>
          <div className="space-y-6">
            <div className="flex items-start bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mr-5 shrink-0 shadow-inner">
                <i className="fas fa-bullseye text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">আমাদের লক্ষ্য</h4>
                <p className="text-slate-500 mt-1">{data.mission}</p>
              </div>
            </div>
            <div className="flex items-start bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mr-5 shrink-0 shadow-inner">
                <i className="fas fa-eye text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">আমাদের উদ্দেশ্য</h4>
                <p className="text-slate-500 mt-1">{data.vision}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-3xl shadow-2xl overflow-hidden z-10 relative">
            <img 
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
              alt="About"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-16 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0,transparent_50%)]"></div>
        </div>
        <h3 className="text-3xl font-bold mb-16 relative z-10">আমাদের অর্জনসমূহ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
          {data.stats.map((stat, idx) => (
            <div key={idx} className="group">
              <p className="text-5xl font-black text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">{stat.count}</p>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
