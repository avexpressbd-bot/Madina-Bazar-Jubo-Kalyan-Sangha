
import React from 'react';
import { Notice } from '../types';

const NoticeBoard: React.FC<{ notices: Notice[] }> = ({ notices }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">নোটিশ বোর্ড</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-blue-600">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-slate-800">{notice.title}</h3>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{notice.date}</span>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">{notice.description}</p>
              
              {notice.videoUrl && (
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-inner bg-slate-100">
                  <iframe 
                    className="w-full h-full"
                    src={notice.videoUrl} 
                    title="Notice Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          ))}
          {notices.length === 0 && (
            <div className="bg-white p-12 rounded-2xl text-center text-slate-500 shadow-md">
              বর্তমানে কোনো নোটিশ নেই।
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
            <h4 className="text-orange-800 font-bold mb-4 flex items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              জরুরী সতর্কতা
            </h4>
            <p className="text-orange-700 text-sm leading-relaxed">
              ক্লাবের যে কোনো ধরণের অভিযোগ বা পরামর্শের জন্য সরাসরি সভাপতি বা সাধারণ সম্পাদকের সাথে যোগাযোগ করুন।
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h4 className="text-slate-800 font-bold mb-4">আর্কাইভ</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-slate-500 hover:text-blue-600 cursor-pointer">
                <i className="far fa-file-alt mr-2"></i> জানুয়ারি ২০২৪ এর নোটিশ
              </li>
              <li className="flex items-center text-sm text-slate-500 hover:text-blue-600 cursor-pointer">
                <i className="far fa-file-alt mr-2"></i> ফেব্রুয়ারি ২০২৪ এর নোটিশ
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
