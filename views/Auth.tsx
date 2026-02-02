
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (role: 'user' | 'admin') => void;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const Auth: React.FC<AuthProps> = ({ onLogin, setUsers }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const ADMIN_EMAIL = 'admin@mbjks.org'; 
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLoginView) {
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        onLogin('admin');
        return;
      }

      const savedUsers: User[] = JSON.parse(localStorage.getItem('mbjks_users') || '[]');
      const foundUser = savedUsers.find((u) => u.email === formData.email && u.password === formData.password);
      
      if (!foundUser) {
        setError('ভুল ইমেইল অথবা পাসওয়ার্ড!');
      } else if (foundUser.status === 'pending') {
        setError('আপনার একাউন্টটি এখনও অনুমোদিত হয়নি। দয়া করে এডমিনের অনুমোদনের জন্য অপেক্ষা করুন।');
      } else {
        onLogin(foundUser.role);
      }
    } else {
      const savedUsers: User[] = JSON.parse(localStorage.getItem('mbjks_users') || '[]');
      if (savedUsers.some((u) => u.email === formData.email)) {
        setError('এই ইমেইল দিয়ে ইতিপূর্বেই একাউন্ট খোলা হয়েছে।');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        status: 'pending', // Registration now starts as pending
        role: 'user'
      };

      setUsers(prevUsers => [...prevUsers, newUser]);
      
      setSuccess('আপনার রেজিস্ট্রেশন আবেদন সফলভাবে জমা হয়েছে! এডমিন অনুমোদন করার পর আপনি লগইন করতে পারবেন।');
      setTimeout(() => {
        setIsLoginView(true);
        setFormData({ name: '', email: formData.email, phone: '', password: '' });
      }, 3500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-fadeIn border border-slate-100">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">{isLoginView ? 'লগইন' : 'রেজিস্ট্রেশন'}</h2>
          <p className="opacity-80 text-sm">মদিনা বাজার যুব কল্যাণ সংঘ</p>
        </div>
        
        <form className="p-8 space-y-5" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-start animate-pulse">
            <i className="fas fa-exclamation-circle mr-2 mt-0.5"></i>
            <span>{error}</span>
          </div>}
          
          {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-xs font-bold flex items-start">
            <i className="fas fa-check-circle mr-2 mt-0.5"></i>
            <span>{success}</span>
          </div>}

          {!isLoginView && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">পূর্ণ নাম</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="আপনার নাম" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">মোবাইল নম্বর</label>
                <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="০১৭০০-০০০০০০" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all" />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">ইমেইল ঠিকানা</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="example@mail.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all" />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">পাসওয়ার্ড</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all" />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95">
            {isLoginView ? 'লগইন করুন' : 'আবেদন জমা দিন'}
          </button>

          <div className="text-center pt-2">
            <button type="button" onClick={() => { setIsLoginView(!isLoginView); setError(''); setSuccess(''); }} className="text-blue-600 font-bold hover:underline text-sm">
              {isLoginView ? 'নতুন মেম্বার হতে চান? এখানে আবেদন করুন' : 'ইতিমধ্যেই একাউন্ট আছে? লগইন করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
