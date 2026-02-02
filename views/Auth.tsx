
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
      // Admin Login Check
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        onLogin('admin');
        return;
      }

      // We need to check against the current state of users from App
      // This will be handled via a callback if needed, but for now we look at localStorage 
      // as a fallback or simply let App.tsx handle validation if it was more complex.
      const savedUsers = JSON.parse(localStorage.getItem('mbjks_users') || '[]');
      const foundUser = savedUsers.find((u: User) => u.email === formData.email && u.password === formData.password);
      
      if (!foundUser) {
        setError('ভুল ইমেইল অথবা পাসওয়ার্ড!');
      } else if (foundUser.status === 'pending') {
        setError('আপনার একাউন্টটি এখনও পেন্ডিং আছে। এডমিন অ্যাপ্রুভ করলে লগইন করতে পারবেন।');
      } else {
        onLogin(foundUser.role);
      }
    } else {
      const savedUsers = JSON.parse(localStorage.getItem('mbjks_users') || '[]');
      if (savedUsers.some((u: User) => u.email === formData.email)) {
        setError('এই ইমেইল দিয়ে ইতিপূর্বেই একাউন্ট খোলা হয়েছে।');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        status: 'pending',
        role: 'user'
      };

      // CRITICAL: Use functional update to ensure we don't overwrite other new users
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      setSuccess('রেজিস্ট্রেশন সফল হয়েছে! এডমিন আপনার তথ্য যাচাই করে অ্যাপ্রুভ করলে আপনি লগইন করতে পারবেন।');
      setIsLoginView(true);
      setFormData({ name: '', email: '', phone: '', password: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-xs font-bold border border-green-100 flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              {success}
            </div>
          )}

          {!isLoginView && (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">আপনার নাম</label>
                <input 
                  type="text" 
                  name="name"
                  required 
                  value={formData.name} 
                  onChange={handleChange}
                  placeholder="সম্পূর্ণ নাম লিখুন"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">মোবাইল নাম্বার</label>
                <input 
                  type="text" 
                  name="phone"
                  required 
                  value={formData.phone} 
                  onChange={handleChange}
                  placeholder="০১৭০০-০০০০০০"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">ইমেইল ঠিকানা</label>
            <input 
              type="email" 
              name="email"
              required 
              value={formData.email} 
              onChange={handleChange}
              placeholder="আপনার ইমেইল দিন"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">পাসওয়ার্ড</label>
            <input 
              type="password" 
              name="password"
              required 
              value={formData.password} 
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
          >
            {isLoginView ? 'লগইন করুন' : 'রেজিস্ট্রেশনের জন্য আবেদন করুন'}
          </button>

          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={() => { setIsLoginView(!isLoginView); setError(''); setSuccess(''); }} 
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
