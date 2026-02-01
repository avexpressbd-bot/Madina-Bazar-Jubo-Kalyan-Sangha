
import React from 'react';
import { Member } from '../types';

const Committee: React.FC<{ members: Member[] }> = ({ members }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <h2 className="text-4xl font-bold text-center mb-4 text-slate-800">কার্যনির্বাহী কমিটি</h2>
      <p className="text-center text-slate-600 mb-16">সংগঠনের লক্ষ্য ও উদ্দেশ্য বাস্তবায়নে নিবেদিতপ্রাণ নেতৃত্ব</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg mb-6">
              <img src={member.image} className="w-full h-full object-cover" alt={member.name} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{member.name}</h3>
            <p className="text-blue-600 font-bold uppercase tracking-wider text-sm mt-1">{member.role}</p>
            <p className="mt-4 text-slate-500 text-sm">{member.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Committee;
