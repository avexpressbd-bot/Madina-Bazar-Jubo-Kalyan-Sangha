
import React, { useState } from 'react';
import { Member, Notice, Team, TournamentStats, GalleryImage, User, Post } from '../types';

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
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  members, setMembers, 
  committee, setCommittee,
  notices, setNotices,
  gallery, setGallery,
  upcomingTeams, setUpcomingTeams,
  cricketStats, setCricketStats,
  users, setUsers,
  posts, setPosts
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'committee' | 'notices' | 'gallery' | 'posts' | 'requests'>('members');
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Input states
  const [input1, setInput1] = useState(''); // Name / Title / Content
  const [input2, setInput2] = useState(''); // Phone / Description / URL
  const [input3, setInput3] = useState(''); // Role / Video URL / MediaType
  const [input4, setInput4] = useState(''); // Image URL

  const resetInputs = () => { 
    setInput1(''); setInput2(''); setInput3(''); setInput4(''); 
    setEditingId(null);
  };

  const handleEdit = (type: string, item: any) => {
    setEditingId(item.id);
    if (type === 'members' || type === 'committee') {
      setInput1(item.name); setInput2(item.phone); setInput3(item.role); setInput4(item.image);
    } else if (type === 'notices') {
      setInput1(item.title); setInput2(item.description); setInput3(item.videoUrl || '');
    } else if (type === 'gallery') {
      setInput1(item.url); setInput2(item.caption);
    } else if (type === 'posts') {
      setInput1(item.content); setInput2(item.mediaUrl || ''); setInput3(item.mediaType);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    if (activeTab === 'members' || activeTab === 'committee') {
      if (!input1 || !input3) return alert('নাম ও পদবী আবশ্যক!');
      const data = { id: editingId || Date.now().toString(), name: input1, phone: input2, role: input3, image: input4 || `https://picsum.photos/seed/${Date.now()}/200/200` };
      const setter = activeTab === 'members' ? setMembers : setCommittee;
      const list = activeTab === 'members' ? members : committee;
      
      if (editingId) setter(list.map(i => i.id === editingId ? data : i));
      else setter([...list, data]);
    } 
    else if (activeTab === 'notices') {
      if (!input1 || !input2) return alert('শিরোনাম ও বর্ণনা আবশ্যক!');
      const data = { id: editingId || Date.now().toString(), title: input1, description: input2, videoUrl: input3, date: new Date().toLocaleDateString('bn-BD') };
      if (editingId) setNotices(notices.map(i => i.id === editingId ? data : i));
      else setNotices([data, ...notices]);
    }
    else if (activeTab === 'gallery') {
      if (!input1) return alert('ছবির ইউআরএল আবশ্যক!');
      const data = { id: editingId || Date.now().toString(), url: input1, caption: input2 };
      if (editingId) setGallery(gallery.map(i => i.id === editingId ? data : i));
      else setGallery([data, ...gallery]);
    }
    else if (activeTab === 'posts') {
      if (!input1) return alert('পোস্টের লেখা আবশ্যক!');
      const data: Post = { 
        id: editingId || Date.now().toString(), 
        content: input1, 
        mediaUrl: input2, 
        mediaType: (input3 as any) || 'none', 
        date: new Date().toLocaleString('bn-BD'),
        likes: 0
      };
      if (editingId) setPosts(posts.map(i => i.id === editingId ? data : i));
      else setPosts([data, ...posts]);
    }
    
    resetInputs();
    alert('সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const pendingRequests = users.filter(u => u.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-blue-900/50">
                <i className="fas fa-tools text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold">মাস্টার ড্যাশবোর্ড</h2>
                <p className="text-slate-400 text-sm">সবকিছু এডিট এবং কন্ট্রোল করুন</p>
              </div>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-xl overflow-x-auto max-w-full no-scrollbar">
              {[
                {id: 'posts', label: 'পোস্ট ফিড'},
                {id: 'notices', label: 'নোটিশ'},
                {id: 'members', label: 'মেম্বার'},
                {id: 'committee', label: 'কমিটি'},
                {id: 'gallery', label: 'গ্যালারি'},
                {id: 'requests', label: `আবেদন (${pendingRequests.length})`}
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
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab !== 'requests' && (
            <div className="lg:col-span-1 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit sticky top-24">
              <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center">
                <i className={`fas ${editingId ? 'fa-edit text-orange-500' : 'fa-plus-circle text-blue-600'} mr-2`}></i> 
                {editingId ? 'তথ্য পরিবর্তন করুন' : 'নতুন তথ্য যোগ করুন'}
              </h3>
              
              <div className="space-y-4">
                {activeTab === 'posts' ? (
                  <>
                    <textarea placeholder="পোস্টের ক্যাপশন/লেখা লিখুন..." className="w-full p-4 rounded-xl border bg-white focus:ring-2 focus:ring-blue-100 outline-none" rows={4} value={input1} onChange={e => setInput1(e.target.value)}></textarea>
                    <input type="text" placeholder="মিডিয়া লিংঙ্ক (ছবি বা ভিডিও URL)" className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-100 outline-none" value={input2} onChange={e => setInput2(e.target.value)} />
                    <select className="w-full p-3 rounded-xl border bg-white outline-none" value={input3} onChange={e => setInput3(e.target.value)}>
                      <option value="none">কোনো মিডিয়া নেই</option>
                      <option value="image">ছবি (Image)</option>
                      <option value="video">ভিডিও (Video)</option>
                    </select>
                  </>
                ) : activeTab === 'notices' ? (
                  <>
                    <input type="text" placeholder="নোটিশের শিরোনাম" className="w-full p-3 rounded-xl border bg-white outline-none" value={input1} onChange={e => setInput1(e.target.value)} />
                    <textarea placeholder="বিস্তারিত বর্ণনা..." className="w-full p-3 rounded-xl border bg-white outline-none" rows={4} value={input2} onChange={e => setInput2(e.target.value)}></textarea>
                    <input type="text" placeholder="ভিডিও লিংঙ্ক (ঐচ্ছিক)" className="w-full p-3 rounded-xl border bg-white outline-none" value={input3} onChange={e => setInput3(e.target.value)} />
                  </>
                ) : activeTab === 'gallery' ? (
                  <>
                    <input type="text" placeholder="ছবির ইউআরএল" className="w-full p-3 rounded-xl border bg-white outline-none" value={input1} onChange={e => setInput1(e.target.value)} />
                    <input type="text" placeholder="ক্যাপশন (ঐচ্ছিক)" className="w-full p-3 rounded-xl border bg-white outline-none" value={input2} onChange={e => setInput2(e.target.value)} />
                  </>
                ) : (
                  <>
                    <input type="text" placeholder="নাম" className="w-full p-3 rounded-xl border bg-white outline-none" value={input1} onChange={e => setInput1(e.target.value)} />
                    <input type="text" placeholder="মোবাইল" className="w-full p-3 rounded-xl border bg-white outline-none" value={input2} onChange={e => setInput2(e.target.value)} />
                    <input type="text" placeholder="পদবী" className="w-full p-3 rounded-xl border bg-white outline-none" value={input3} onChange={e => setInput3(e.target.value)} />
                    <input type="text" placeholder="ছবির ইউআরএল" className="w-full p-3 rounded-xl border bg-white outline-none" value={input4} onChange={e => setInput4(e.target.value)} />
                  </>
                )}

                <div className="flex gap-2">
                  <button onClick={handleSave} className={`flex-1 ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 rounded-xl transition-all shadow-lg`}>
                    {editingId ? 'আপডেট করুন' : 'সেভ করুন'}
                  </button>
                  {editingId && (
                    <button onClick={resetInputs} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-3 rounded-xl font-bold">বাতিল</button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className={`${activeTab === 'requests' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
            <h3 className="text-lg font-bold mb-6 text-slate-800 flex justify-between items-center">
              <span>বিদ্যমান ডাটা লিস্ট</span>
              <span className="text-sm font-normal text-slate-400">এডিট বা ডিলিট করতে পারেন</span>
            </h3>

            <div className="space-y-4">
              {activeTab === 'posts' && posts.map(p => (
                <div key={p.id} className="bg-white border rounded-2xl p-4 shadow-sm group">
                  <p className="font-medium line-clamp-2 mb-2">{p.content}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">{p.date}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit('posts', p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><i className="fas fa-edit"></i></button>
                      <button onClick={() => { if(confirm('ডিলিট করবেন?')) setPosts(posts.filter(x => x.id !== p.id)) }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'notices' && notices.map(n => (
                <div key={n.id} className="bg-white border rounded-2xl p-4 shadow-sm flex justify-between items-center">
                  <div className="truncate pr-4"><p className="font-bold truncate">{n.title}</p><p className="text-xs text-slate-400">{n.date}</p></div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleEdit('notices', n)} className="p-2 text-blue-600"><i className="fas fa-edit"></i></button>
                    <button onClick={() => setNotices(notices.filter(x => x.id !== n.id))} className="p-2 text-red-500"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              ))}

              {(activeTab === 'members' || activeTab === 'committee') && (activeTab === 'members' ? members : committee).map(m => (
                <div key={m.id} className="bg-white border rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center truncate">
                    <img src={m.image} className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div className="truncate"><p className="font-bold truncate">{m.name}</p><p className="text-xs text-slate-400">{m.role}</p></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(activeTab, m)} className="p-2 text-blue-600"><i className="fas fa-edit"></i></button>
                    <button onClick={() => {
                      const setter = activeTab === 'members' ? setMembers : setCommittee;
                      const list = activeTab === 'members' ? members : committee;
                      setter(list.filter(x => x.id !== m.id));
                    }} className="p-2 text-red-500"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              ))}

              {activeTab === 'requests' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingRequests.length === 0 ? <p className="text-center py-10 text-slate-400 col-span-2">কোনো নতুন আবেদন নেই</p> : 
                    pendingRequests.map(u => (
                      <div key={u.id} className="bg-white border-2 border-slate-50 p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-lg">{u.name}</h4>
                        <p className="text-sm text-slate-500 mb-4">{u.email} | {u.phone}</p>
                        <div className="flex gap-2">
                          <button onClick={() => setUsers(users.map(x => x.id === u.id ? {...x, status: 'approved'} : x))} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold">অ্যাপ্রুভ</button>
                          <button onClick={() => setUsers(users.filter(x => x.id !== u.id))} className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-bold">বাতিল</button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
