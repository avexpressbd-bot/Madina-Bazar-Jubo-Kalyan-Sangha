
import React from 'react';
import { FooterData } from '../types';

const Contact: React.FC<{ footerData: FooterData }> = ({ footerData }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">আমাদের সাথে যোগাযোগ করুন</h2>
        <p className="text-slate-600">যে কোনো জিজ্ঞাসা বা সহযোগিতার জন্য আমাদের লিখুন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">আপনার নাম</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100" placeholder="সম্পূর্ণ নাম" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">মোবাইল নাম্বার</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100" placeholder="০১৭০০-০০০০০০" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">বিষয়</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100" placeholder="কি বিষয়ে লিখতে চান?" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">আপনার বার্তা</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100" placeholder="আপনার কথাগুলো এখানে লিখুন..."></textarea>
            </div>
            <button type="button" onClick={() => alert('বার্তা গ্রহণ করা হয়েছে। শীঘ্রই যোগাযোগ করা হবে।')} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">বার্তা পাঠান</button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-blue-600 p-8 rounded-3xl text-white">
            <h3 className="text-2xl font-bold mb-6">যোগাযোগের ঠিকানা</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-4 text-xl opacity-70"></i>
                <p>{footerData.address}</p>
              </div>
              <div className="flex items-start">
                <i className="fas fa-phone mt-1 mr-4 text-xl opacity-70"></i>
                <p>{footerData.phone}</p>
              </div>
              <div className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-4 text-xl opacity-70"></i>
                <p>{footerData.email}</p>
              </div>
            </div>
          </div>

          <div className="h-64 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
             <div className="w-full h-full bg-slate-200 flex items-center justify-center relative">
               <div className="text-center p-6">
                 <i className="fas fa-map-marked-alt text-4xl text-slate-400 mb-2"></i>
                 <p className="text-slate-500 text-sm">গুগল ম্যাপ লোড হচ্ছে...</p>
                 <button className="mt-4 px-4 py-2 bg-blue-500 text-white text-xs rounded-lg">ম্যাপ ওপেন করুন</button>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                  <i className="fas fa-map-marker-alt text-red-500 text-3xl animate-bounce"></i>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
