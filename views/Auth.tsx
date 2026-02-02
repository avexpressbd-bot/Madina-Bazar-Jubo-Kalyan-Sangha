
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthProps {
  onLogin: (role: 'user' | 'admin') => void;
  users: User[];
}

const Auth: React.FC<AuthProps> = ({ onLogin, users }) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLoginView) {
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        onLogin('admin');
        return;
      }

      const foundUser = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (!foundUser) {
        setError('ভুল ইমেইল অথবা পাসওয়ার্ড!');
      } else if (foundUser.status === 'pending') {
        setError('আপনার আবেদনটি এখনও এডমিন অ্যাপ্রুভ করেনি।');
      } else {
        onLogin(foundUser.role);
      }
    } else {
      if (formData.email === ADMIN_EMAIL || users.some(u => u.email === formData.email)) {
        setError('এই ইমেইলটি ব্যবহার করা সম্ভব নয়।');
        return;
      }

      const userId = 'user-' + Date.now();
      const newUser: User = {
        id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        status: 'pending',
        role: 'user'
      };

      try {
        await setDoc(doc(db, 'users', userId), newUser);
        setSuccess('রেজিস্ট্রেশন আবেদন সফলভাবে জমা হয়েছে! এডমিন অ্যাপ্রুভ করলে আপনি লগইন করতে পারবেন।');
        setTimeout(() => setIsLoginView(true), 3500);
      } catch (err) {
        setError('কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fadeIn border border-slate-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-1">{isLoginView ? 'লগইন' : 'রেজিস্ট্রেশন'}</h2>
          <p className="opacity-70 text-sm">মদিনা বাজার যুব কল্যাণ সংঘ</p>
        </div>
        
        <form className="p-8 space-y-5" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold border border-green-100">{success}</div>}

          {!isLoginView && (
            <>
              <input type="text" name="name" required placeholder="আপনার নাম" value={formData.name} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border" />
              <input type="text" name="phone" required placeholder="মোবাইল নম্বর" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border" />
            </>
          )}
          <input type="email" name="email" required placeholder="ইমেইল" value={formData.email} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border" />
          <input type="password" name="password" required placeholder="পাসওয়ার্ড" value={formData.password} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border" />

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg mt-2">
            {isLoginView ? 'লগইন করুন' : 'আবেদন জমা দিন'}
          </button>

          <button type="button" onClick={() => setIsLoginView(!isLoginView)} className="w-full text-blue-600 font-bold text-sm mt-4">
            {isLoginView ? 'নতুন একাউন্ট খুলতে চান?' : 'ইতিমধ্যেই একাউন্ট আছে? লগইন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
