
import React from 'react';
import { View } from '../types';

const Home: React.FC<{ setView: (view: View) => void }> = ({ setView }) => {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            স্বাগতম মদিনা বাজার যুব কল্যাণ সংঘে
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-slate-200">
            ঐক্য, সেবা ও প্রগতির পথে আমরা একসাথে এগিয়ে যাচ্ছি। আসুন আমাদের সাথে যুক্ত হয়ে সমাজ পরিবর্তনে ভূমিকা রাখুন।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setView('auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-xl"
            >
              মেম্বার হিসেবে যোগ দিন
            </button>
            <button 
              onClick={() => setView('about')}
              className="bg-white hover:bg-slate-100 text-blue-700 px-8 py-3 rounded-full font-bold text-lg transition-all shadow-xl"
            >
              আমাদের সম্পর্কে জানুন
            </button>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800 underline decoration-blue-500 underline-offset-8">আমাদের কার্যক্রম</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="fa-cricket-bat-ball" 
              title="বার্ষিক ক্রিকেট টুর্নামেন্ট" 
              desc="প্রতি বছর জাঁকজমকপূর্ণ ক্রিকেট টুর্নামেন্টের আয়োজন করা হয় যেখানে এলাকার প্রতিভাবান খেলোয়াড়রা অংশগ্রহণ করে।"
              onClick={() => setView('cricket')}
            />
            <FeatureCard 
              icon="fa-hands-helping" 
              title="সমাজসেবা" 
              desc="অসহায় মানুষের পাশে দাঁড়ানো এবং এলাকার উন্নয়নে নানা কর্মসূচি পালন করি আমরা।"
              onClick={() => setView('about')}
            />
            <FeatureCard 
              icon="fa-bullhorn" 
              title="সচেতনতামূলক সভা" 
              desc="মাদক ও দুর্নীতির বিরুদ্ধে এবং যুব সমাজকে সঠিক পথ দেখাতে নিয়মিত সভার আয়োজন করা হয়।"
              onClick={() => setView('notice')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; desc: string; onClick: () => void }> = ({ icon, title, desc, onClick }) => (
  <div 
    onClick={onClick}
    className="p-8 border border-slate-100 rounded-2xl bg-slate-50 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer text-center group"
  >
    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      <i className={`fas ${icon} text-2xl`}></i>
    </div>
    <h3 className="text-xl font-bold mb-4 text-slate-800">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

export default Home;
