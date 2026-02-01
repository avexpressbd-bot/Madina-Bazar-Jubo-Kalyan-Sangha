
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">আমাদের কথা</span>
          <h2 className="text-4xl font-extrabold text-slate-800 mt-2 mb-6 leading-tight">মদিনা বাজার যুব কল্যাণ সংঘ - মানবতার সেবায় আমরা সর্বদা নিবেদিত</h2>
          <p className="text-slate-600 leading-relaxed text-lg mb-6">
            মদিনা বাজার যুব কল্যাণ সংঘ একটি অরাজনৈতিক ও সেবামূলক সংগঠন। এলাকার যুবকদের সঠিক পথে পরিচালনা করা এবং সমাজের অবহেলিত মানুষের পাশে দাঁড়ানোর লক্ষ্য নিয়ে আমাদের এই পথচলা শুরু হয়।
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 shrink-0 mt-1">
                <i className="fas fa-check"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">আমাদের লক্ষ্য</h4>
                <p className="text-slate-500 text-sm">সুশিক্ষিত ও আদর্শ যুব সমাজ গড়ে তোলা যারা দেশের উন্নয়নে অবদান রাখবে।</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 shrink-0 mt-1">
                <i className="fas fa-check"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">আমাদের উদ্দেশ্য</h4>
                <p className="text-slate-500 text-sm">মাদক মুক্ত সমাজ গঠন এবং অসহায়দের শিক্ষা ও চিকিৎসায় সহায়তা করা।</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1000" 
            className="rounded-3xl shadow-2xl z-10 relative" 
            alt="About"
          />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-600 rounded-3xl -z-10 animate-pulse"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-slate-200 rounded-3xl -z-10"></div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-3xl p-12 text-center">
        <h3 className="text-2xl font-bold mb-8">আমাদের অর্জনসমূহ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-4xl font-extrabold text-blue-600 mb-2">৫০০+</p>
            <p className="text-slate-500">সেবা গ্রহীতা</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600 mb-2">১০+</p>
            <p className="text-slate-500">সাফল্যের বছর</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600 mb-2">৫+</p>
            <p className="text-slate-500">ক্রিকেট টুর্নামেন্ট</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600 mb-2">৫০+</p>
            <p className="text-slate-500">স্বেচ্ছাসেবী</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
