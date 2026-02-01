
import React from 'react';
import { Member } from '../types';

const Members: React.FC<{ members: Member[] }> = ({ members }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">আমাদের মেম্বারগণ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl shadow-sm border p-6 text-center hover:shadow-xl transition-all">
            <img src={member.image} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-slate-50" alt={member.name} />
            <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
            <p className="text-blue-600 text-sm mb-4">{member.role}</p>
            <p className="text-slate-500 text-xs"><i className="fas fa-phone-alt mr-1"></i> {member.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;
