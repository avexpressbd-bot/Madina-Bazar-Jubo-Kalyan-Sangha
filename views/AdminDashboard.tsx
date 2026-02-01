
import React, { useState } from 'react';
import { Member, Notice, Team, TournamentStats, GalleryImage } from '../types';

interface AdminDashboardProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  committee: Member[];
  setCommittee: React.Dispatch<React.SetStateAction<Member[]>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  gallery: GalleryImage[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
  upcomingTeams: Team[];
  setUpcomingTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  cricketStats: TournamentStats;
  setCricketStats: React.Dispatch<React.SetStateAction<TournamentStats>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  members, setMembers, 
  committee, setCommittee,
  notices, setNotices,
  gallery, setGallery,
  upcomingTeams, setUpcomingTeams,
  cricketStats, setCricketStats
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'committee' | 'notices' | 'gallery' | 'tournament' | 'stats'>('members');
  
  // Generic input states
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');

  const resetInputs = () => { setInput1(''); setInput2(''); setInput3(''); setInput4(''); };

  const handleAddMember = (isCommittee: boolean) => {
    if (!input1 || !input2 || !input3) return;
    const newEntry: Member = { 
      id: Date.now().toString(), 
      name: input1, 
      phone: input2, 
      role: input3, 
      image: input4 || `https://picsum.photos/seed/${Date.now()}/200/200` 
    };
    if (isCommittee) setCommittee([...committee, newEntry]);
    else setMembers([...members, newEntry]);
    resetInputs();
    alert('সফলভাবে যুক্ত হয়েছে!');
  };

  const handleAddNotice = () => {
    if (!input1 || !input2) return;
    setNotices([{ 
      id: Date.now().toString(), 
      title: input1, 
      description: input2, 
      videoUrl: input3, 
      date: new Date().toISOString().split('T')[0] 
    }, ...notices]);
    resetInputs();
    alert('নোটিশ প্রকাশিত হয়েছে!');
  };

  const handleAddGallery = () => {
    if (!input1) return;
    setGallery([{ id: Date.now().toString(), url: input1, caption: input2 }, ...gallery]);
    resetInputs();
    alert('ছবি গ্যালারিতে যুক্ত হয়েছে!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <i className="fas fa-tools text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">মাস্টার ড্যাশবোর্ড</h2>
              <p className="text-slate-400 text-sm">এখান থেকে ওয়েবসাইটের সবকিছু নিয়ন্ত্রণ করুন</p>
            </div>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl overflow-x-auto max-w-full scrollbar-hide">
            {[
              {id: 'members', label: 'মেম্বার'},
              {id: 'committee', label: 'কমিটি'},
              {id: 'notices', label: 'নোটিশ'},
              {id: 'gallery', label: 'গ্যালারি'},
              {id: 'tournament', label: 'টুর্নামেন্ট'}
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); resetInputs(); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center">
              <i className="fas fa-plus-circle mr-2 text-blue-600"></i> নতুন যোগ করুন
            </h3>
            
            <div className="space-y-4">
              {activeTab === 'members' || activeTab === 'committee' ? (
                <>
                  <input type="text" placeholder="নাম" className="w-full p-3 rounded-xl border bg-white" value={input1} onChange={e => setInput1(e.target.value)} />
                  <input type="text" placeholder="মোবাইল" className="w-full p-3 rounded-xl border bg-white" value={input2} onChange={e => setInput2(e.target.value)} />
                  <input type="text" placeholder="পদবী" className="w-full p-3 rounded-xl border bg-white" value={input3} onChange={e => setInput3(e.target.value)} />
                  <input type="text" placeholder="ছবির লিংঙ্ক (ঐচ্ছিক)" className="w-full p-3 rounded-xl border bg-white" value={input4} onChange={e => setInput4(e.target.value)} />
                  <button onClick={() => handleAddMember(activeTab === 'committee')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">সংরক্ষণ করুন</button>
                </>
              ) : activeTab === 'notices' ? (
                <>
                  <input type="text" placeholder="শিরোনাম" className="w-full p-3 rounded-xl border bg-white" value={input1} onChange={e => setInput1(e.target.value)} />
                  <textarea placeholder="বর্ণনা" className="w-full p-3 rounded-xl border bg-white" rows={4} value={input2} onChange={e => setInput2(e.target.value)}></textarea>
                  <input type="text" placeholder="ইউটিউব লিংঙ্ক (ঐচ্ছিক)" className="w-full p-3 rounded-xl border bg-white" value={input3} onChange={e => setInput3(e.target.value)} />
                  <button onClick={handleAddNotice} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">পাবলিশ করুন</button>
                </>
              ) : activeTab === 'gallery' ? (
                <>
                  <input type="text" placeholder="ছবির লিংঙ্ক (URL)" className="w-full p-3 rounded-xl border bg-white" value={input1} onChange={e => setInput1(e.target.value)} />
                  <input type="text" placeholder="ক্যাপশন" className="w-full p-3 rounded-xl border bg-white" value={input2} onChange={e => setInput2(e.target.value)} />
                  <button onClick={handleAddGallery} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">গ্যালারিতে যুক্ত করুন</button>
                </>
              ) : (
                <p className="text-slate-500 italic text-sm">টুর্নামেন্ট সেকশন থেকে বিগত আসরের তথ্য এবং আসন্ন দলগুলো ম্যানেজ করুন।</p>
              )}
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 text-slate-800">বর্তমান ডাটা</h3>
            <div className="space-y-4">
              {activeTab === 'members' && members.map(m => (
                <div key={m.id} className="flex items-center justify-between p-4 bg-white border rounded-2xl hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <img src={m.image} className="w-12 h-12 rounded-full object-cover mr-4" />
                    <div><p className="font-bold">{m.name}</p><p className="text-xs text-slate-500">{m.role}</p></div>
                  </div>
                  <button onClick={() => setMembers(members.filter(x => x.id !== m.id))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><i className="fas fa-trash"></i></button>
                </div>
              ))}
              {activeTab === 'committee' && committee.map(m => (
                <div key={m.id} className="flex items-center justify-between p-4 bg-white border rounded-2xl hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <img src={m.image} className="w-12 h-12 rounded-full object-cover mr-4" />
                    <div><p className="font-bold">{m.name}</p><p className="text-xs text-blue-600 font-bold">{m.role}</p></div>
                  </div>
                  <button onClick={() => setCommittee(committee.filter(x => x.id !== m.id))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><i className="fas fa-trash"></i></button>
                </div>
              ))}
              {activeTab === 'gallery' && gallery.map(img => (
                <div key={img.id} className="flex items-center justify-between p-4 bg-white border rounded-2xl overflow-hidden">
                  <div className="flex items-center overflow-hidden">
                    <img src={img.url} className="w-16 h-12 rounded object-cover mr-4" />
                    <p className="truncate text-sm font-medium">{img.caption}</p>
                  </div>
                  <button onClick={() => setGallery(gallery.filter(x => x.id !== img.id))} className="text-red-500 shrink-0 ml-4"><i className="fas fa-trash"></i></button>
                </div>
              ))}
              {activeTab === 'notices' && notices.map(n => (
                <div key={n.id} className="p-4 bg-white border rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold">{n.title}</p>
                    <button onClick={() => setNotices(notices.filter(x => x.id !== n.id))} className="text-red-500"><i className="fas fa-trash"></i></button>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{n.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
