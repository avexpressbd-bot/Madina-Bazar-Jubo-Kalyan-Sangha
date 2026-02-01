
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (role: 'user' | 'admin') => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ---------------------------------------------------------
  // এই ইমেইল এবং পাসওয়ার্ডটি আপনি আপনার গিটহাবে পুশ করার আগে আপনার মতো করে বদলে দিন।
  // ডোমেইন হোস্ট করার পর এই তথ্য দিয়েই আপনাকে লগইন করতে হবে।
  // ---------------------------------------------------------
  const ADMIN_EMAIL = 'admin@mbjks.org'; 
  const ADMIN_PASSWORD = 'admin123';
  // ---------------------------------------------------------

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginView) {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        onLogin('admin');
      } 
      else if (email && password.length >= 6) {
        onLogin('user');
      } 
      else {
        setError('ভুল ইমেইল অথবা পাসওয়ার্ড! পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।');
      }
    } else {
      alert('রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।');
      setIsLoginView(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">{isLoginView ? 'লগইন করুন' : 'রেজিস্ট্রেশন'}</h2>
          <p className="opacity-80 text-sm">মদিনা বাজার যুব কল্যাণ সংঘ পোর্টালে স্বাগতম</p>
        </div>
        
        <form className="p-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-100 flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">ইমেইল ঠিকানা</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল দিন"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">পাসওয়ার্ড</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all"
          >
            {isLoginView ? 'লগইন করুন' : 'একাউন্ট খুলুন'}
          </button>

          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={() => { setIsLoginView(!isLoginView); setError(''); }} 
              className="text-blue-600 font-bold hover:underline text-sm"
            >
              {isLoginView ? 'নতুন একাউন্ট খুলতে চান? এখানে ক্লিক করুন' : 'ইতিমধ্যেই একাউন্ট আছে? লগইন করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
