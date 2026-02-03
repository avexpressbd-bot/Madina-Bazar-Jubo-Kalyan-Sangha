
import React, { useState } from 'react';
import { db, ref, set, push } from '../firebase';
import { User } from '../types';

interface AuthProps {
  onLogin: (role: 'user' | 'admin') => void;
  users: User[];
}

const Auth: React.FC<AuthProps> = ({ onLogin, users }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', image: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const ADMIN_EMAIL = 'admin@mbjks.org'; 
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (isLoginView) {
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        onLogin('admin');
        return;
      }

      const foundUser = users.find((u) => u.email === formData.email && u.password === formData.password);
      
      if (!foundUser) {
        setError('ভুল ইমেইল অথবা পাসওয়ার্ড!');
      } else if (foundUser.status === 'pending') {
        setError('আপনার একাউন্টটি এখনও অনুমোদিত হয়নি। দয়া করে এডমিনের অনুমোদনের জন্য অপেক্ষা করুন।');
      } else {
        onLogin(foundUser.role);
      }
    } else {
      if (users.some((u) => u.email === formData.email)) {
        setError('এই ইমেইল দিয়ে ইতিপূর্বেই একাউন্ট খোলা হয়েছে।');
        return;
      }

      const usersRef = ref(db, 'users');
      const newUserRef = push(usersRef);
      const newUser: User = {
        id: newUserRef.key || Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        image: formData.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        status: 'pending',
        role: 'user'
      };

      await set(newUserRef, newUser);
      
      setSuccess('আপনার আবেদন সফলভাবে জমা হয়েছে! এডমিন অনুমোদন করার পর আপনি লগইন করতে পারবেন।');
      setTimeout(() => {
        setIsLoginView(true);
        setFormData({ name: '', email: formData.email, phone: '', password: '', image: '' });
      }, 3500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">{isLoginView ? 'লগইন' : 'রেজিস্ট্রেশন'}</h2>
          <p className="opacity-80">মদিনা বাজার যুব কল্যাণ সংঘ</p>
        </div>
        
        <form className="p-8 space-y-5" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-start">
            <i className="fas fa-exclamation-circle mr-2 mt-0.5"></i><span>{error}</span>
          </div>}
          
          {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-xs font-bold flex items-start">
            <i className="fas fa-check-circle mr-2 mt-0.5"></i><span>{success}</span>
          </div>}

          {!isLoginView && (
            <>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="আপনার নাম" className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-100" />
              <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="মোবাইল নম্বর" className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-100" />
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">আপনার প্রোফাইল ছবি (লিঙ্ক দিন)</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://image-link.com/photo.jpg" className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
            </>
          )}

          <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="ইমেইল ঠিকানা" className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-100" />
          <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="পাসওয়ার্ড" className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-100" />

          <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 transform hover:-translate-y-0.5">
            {isLoginView ? 'লগইন করুন' : 'আবেদন জমা দিন'}
          </button>

          <div className="text-center pt-2">
            <button type="button" onClick={() => { setIsLoginView(!isLoginView); setError(''); setSuccess(''); }} className="text-blue-600 font-bold text-sm hover:underline">
              {isLoginView ? 'নতুন মেম্বার হতে চান? আবেদন করুন' : 'ইতিমধ্যেই একাউন্ট আছে? লগইন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
