
import React, { useState } from 'react';
import { Member, Notice, Team, TournamentStats, GalleryImage, User } from '../types';

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
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  members, setMembers, 
  committee, setCommittee,
  notices, setNotices,
  gallery, setGallery,
  upcomingTeams, setUpcomingTeams,
  cricketStats, setCricketStats,
  users, setUsers
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'committee' | 'notices' | 'gallery' | 'tournament' | 'requests'>('members');
  
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');

  const resetInputs = () => { setInput1(''); setInput2(''); setInput3(''); setInput4(''); };

  const handleAddMember = (isCommittee: boolean) => {
    if (!input1.trim() || !input2.trim() || !input3.trim()) {
      alert('দয়া করে নাম, মোবাইল এবং পদবী সঠিকভাবে পূরণ করুন।');
      return;
    }
    const newEntry: Member = { 
      id: Date.now().toString(), 
      name: input1.trim(), 
      phone: input2.trim(), 
      role: input3.trim(), 
      image: input4.trim() || `https://picsum.photos/seed/${Date.now()}/200/200` 
    };
    if (isCommittee) setCommittee(prev => [...prev, newEntry]);
    else setMembers(prev => [...prev, newEntry]);
    resetInputs();
    alert('সফলভাবে যুক্ত হয়েছে!');
  };

  const handleApproveUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'approved' } : u));
    alert('ইউজার অ্যাপ্রুভ করা হয়েছে!');
  };

  const handleRejectUser = (userId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই রিকোয়েস্টটি ডিলিট করতে চান?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const pendingRequests = users.filter(u => u.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-blue-900/50">
              <i className="fas fa-tools text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">মাস্টার ড্যাশবোর্ড</h2>
              <p className="text-slate-400 text-sm">ওয়েবসাইটের সবকিছু এখান থেকে নিয়ন্ত্রণ করুন</p>
            </div>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl overflow-x-auto max-w-full no-scrollbar">
            {[
              {id: 'members', label: 'মেম্বার'},
              {id: 'committee', label: 'কমিটি'},
              {id: 'notices', label: 'নোটিশ'},
              {id: 'gallery', label: 'গ্যালারি'},
              {id: 'tournament', label: 'টুর্নামেন্ট'},
              {id: 'requests', label: `ইউজার রিকোয়েস্ট (${pendingRequests.length})`}
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); resetInputs(); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab !== 'requests' ? (
            <>
              {/* Form Section */}
              <div className="lg:col-span-1 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center">
                  <i className="fas fa-plus-circle mr-2 text-blue-600"></i> নতুন তথ্য যোগ করুন
                </h3>
                
                <div className="space-y-4">
                  {activeTab === 'members' || activeTab === 'committee' ? (
                    <>
                      <input type="text" placeholder="নাম" className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-100 outline-none" value={input1} onChange={e => setInput1(e.target.value)} />
                      <input type="text" placeholder="মোবাইল" className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-100 outline-none" value={input2} onChange={e => setInput2(e.target.value)} />
                      <input type="text" placeholder="পদবী" className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-100 outline-none" value={input3} onChange={e => setInput3(e.target.value)} />
                      <input type="text" placeholder="ছবির লিংঙ্ক (URL)" className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-100 outline-none" value={input4} onChange={e => setInput4(e.target.value)} />
                      <button onClick={() => handleAddMember(activeTab === 'committee')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg">সংরক্ষণ করুন</button>
                    </>
                  ) : activeTab === 'notices' ? (
                    <>
                      <input type="text" placeholder="শিরোনাম" className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-100 outline-none" value={input1} onChange={e => setInput1(e.target.value)} />
                      <textarea placeholder="নোটিশের বিস্তারিত বর্ণনা" className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-100 outline-none" rows={4} value={input2} onChange={e => setInput2(e.target.value)}></textarea>
                      <input type="text" placeholder="ইউটিউব ভিডিও লিংঙ্ক (ঐচ্ছিক)" className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-100 outline-none" value={input3} onChange={e => setInput3(e.target.value)} />
                      <button onClick={() => {
                        if(!input1.trim() || !input2.trim()) {
                          alert('দয়া করে শিরোনাম এবং বর্ণনা দিন।');
                          return;
                        }
                        setNotices(prev => [{id: Date.now().toString(), title: input1.trim(), description: input2.trim(), videoUrl: input3.trim(), date: new Date().toLocaleDateString('bn-BD')}, ...prev]);
                        resetInputs();
                        alert('নোটিশ পাবলিশ হয়েছে!');
                      }} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg">পাবলিশ করুন</button>
                    </>
                  ) : activeTab === 'gallery' ? (
                    <>
                      <input type="text" placeholder="ছবির লিংঙ্ক (URL)" className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-100 outline-none" value={input1} onChange={e => setInput1(e.target.value)} />
                      <input type="text" placeholder="ছবির ক্যাপশন" className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-100 outline-none" value={input2} onChange={e => setInput2(e.target.value)} />
                      <button onClick={() => {
                        if(!input1.trim()) {
                          alert('দয়া করে ছবির ইউআরএল (URL) দিন।');
                          return;
                        }
                        setGallery(prev => [{id: Date.now().toString(), url: input1.trim(), caption: input2.trim()}, ...prev]);
                        resetInputs();
                        alert('গ্যালারিতে যুক্ত হয়েছে!');
                      }} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg">গ্যালারিতে যুক্ত করুন</button>
                    </>
                  ) : (
                    <div className="text-slate-500 bg-blue-50 p-4 rounded-xl text-sm border border-blue-100">
                      <i className="fas fa-info-circle mr-2"></i> টুর্নামেন্ট সেকশনে বিগত আসরের রেজাল্ট এবং প্লেয়ারদের তথ্য আপডেট করার অপশন শীঘ্রই যুক্ত করা হচ্ছে।
                    </div>
                  )}
                </div>
              </div>

              {/* List Section */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold mb-6 text-slate-800">বর্তমান ডাটা লিস্ট</h3>
                <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                  {activeTab === 'members' && (members.length === 0 ? <p className="text-slate-400 italic">কোনো মেম্বার নেই</p> : members.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-4 bg-white border rounded-2xl hover:border-blue-200 transition-all shadow-sm">
                      <div className="flex items-center">
                        <img src={m.image} className="w-12 h-12 rounded-full object-cover mr-4" />
                        <div><p className="font-bold text-slate-800">{m.name}</p><p className="text-xs text-slate-500">{m.role}</p></div>
                      </div>
                      <button onClick={() => { if(confirm('ডিলিট করতে চান?')) setMembers(prev => prev.filter(x => x.id !== m.id)) }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><i className="fas fa-trash"></i></button>
                    </div>
                  )))}
                  {activeTab === 'committee' && (committee.length === 0 ? <p className="text-slate-400 italic">কোনো কমিটি মেম্বার নেই</p> : committee.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-4 bg-white border rounded-2xl hover:border-blue-200 transition-all shadow-sm">
                      <div className="flex items-center">
                        <img src={m.image} className="w-12 h-12 rounded-full object-cover mr-4" />
                        <div><p className="font-bold text-slate-800">{m.name}</p><p className="text-xs text-blue-600 font-bold">{m.role}</p></div>
                      </div>
                      <button onClick={() => { if(confirm('ডিলিট করতে চান?')) setCommittee(prev => prev.filter(x => x.id !== m.id)) }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><i className="fas fa-trash"></i></button>
                    </div>
                  )))}
                  {activeTab === 'gallery' && (gallery.length === 0 ? <p className="text-slate-400 italic">গ্যালারি খালি</p> : gallery.map(img => (
                    <div key={img.id} className="flex items-center justify-between p-4 bg-white border rounded-2xl shadow-sm">
                      <div className="flex items-center overflow-hidden">
                        <img src={img.url} className="w-16 h-12 rounded object-cover mr-4" />
                        <p className="truncate text-sm font-medium">{img.caption || 'No caption'}</p>
                      </div>
                      <button onClick={() => { if(confirm('ডিলিট করতে চান?')) setGallery(prev => prev.filter(x => x.id !== img.id)) }} className="text-red-500 shrink-0 ml-4"><i className="fas fa-trash"></i></button>
                    </div>
                  )))}
                  {activeTab === 'notices' && (notices.length === 0 ? <p className="text-slate-400 italic">কোনো নোটিশ নেই</p> : notices.map(n => (
                    <div key={n.id} className="p-4 bg-white border rounded-2xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-slate-800">{n.title}</p>
                        <button onClick={() => { if(confirm('ডিলিট করতে চান?')) setNotices(prev => prev.filter(x => x.id !== n.id)) }} className="text-red-500"><i className="fas fa-trash"></i></button>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{n.description}</p>
                    </div>
                  )))}
                </div>
              </div>
            </>
          ) : (
            /* User Requests View */
            <div className="lg:col-span-3">
              <h3 className="text-lg font-bold mb-6 text-slate-800">নতুন ইউজার রেজিস্ট্রেশন রিকোয়েস্ট ({pendingRequests.length})</h3>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <i className="fas fa-user-clock text-4xl text-slate-300 mb-4"></i>
                  <p className="text-slate-500">বর্তমানে কোনো নতুন রিকোয়েস্ট নেই</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingRequests.map(u => (
                    <div key={u.id} className="bg-white border-2 border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-xl text-slate-800">{u.name}</h4>
                          <p className="text-blue-600 text-sm font-medium">{u.email}</p>
                          <p className="text-slate-500 text-sm mt-1">ফোন: {u.phone}</p>
                        </div>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>
                      </div>
                      <div className="flex gap-3 pt-4 border-t border-slate-50">
                        <button 
                          onClick={() => handleApproveUser(u.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                          <i className="fas fa-check"></i> অ্যাপ্রুভ
                        </button>
                        <button 
                          onClick={() => handleRejectUser(u.id)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <i className="fas fa-times"></i> বাতিল
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
