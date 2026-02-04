
import React, { useState, useEffect } from 'react';
import { db, ref, set, push, update } from '../firebase';
import { Member, Notice, Team, TournamentStats, GalleryImage, User, Post, FooterData, AboutData, SpecialMatch } from '../types';

interface AdminDashboardProps {
  members: Member[];
  committee: Member[];
  notices: Notice[];
  gallery: GalleryImage[];
  upcomingTeams: Team[];
  cricketStats: TournamentStats;
  users: User[];
  posts: Post[];
  footerData: FooterData;
  aboutData: AboutData;
  specialMatch: SpecialMatch;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  members, committee, notices, gallery, upcomingTeams, cricketStats, users, posts, footerData, aboutData, specialMatch
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'notices' | 'people' | 'gallery' | 'cricket' | 'site_settings' | 'requests'>('people');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const showSuccess = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // --- Local States for Forms ---
  const [newPerson, setNewPerson] = useState({ name: '', role: '', phone: '', image: '', type: 'member' });
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  
  const [newPost, setNewPost] = useState({ content: '', mediaUrl: '', mediaType: 'none' as any });
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  const [newNotice, setNewNotice] = useState({ title: '', description: '', videoUrl: '' });
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  
  const [newGalleryImg, setNewGalleryImg] = useState({ url: '', caption: '' });
  const [localCricketStats, setLocalCricketStats] = useState<TournamentStats>(cricketStats);
  const [newTeam, setNewTeam] = useState({ name: '', logo: '', captainName: '', captainImage: '', playersCount: '0' });
  const [localFooter, setLocalFooter] = useState<FooterData>(footerData);
  const [localAbout, setLocalAbout] = useState<AboutData>(aboutData);
  const [localSpecialMatch, setLocalSpecialMatch] = useState<SpecialMatch>(specialMatch);

  useEffect(() => {
    if (cricketStats) setLocalCricketStats(cricketStats);
    if (footerData) setLocalFooter(footerData);
    if (aboutData) setLocalAbout(aboutData);
    if (specialMatch) setLocalSpecialMatch(specialMatch);
  }, [cricketStats, footerData, aboutData, specialMatch]);

  // Post Submit Handler (Create/Update)
  const handlePostSubmit = async () => {
    if(!newPost.content) return alert('পোস্টের লেখা লিখুন');
    setIsSaving(true);
    try {
      const id = editingPostId || push(ref(db, 'posts')).key;
      const postData = {
        id,
        ...newPost,
        date: editingPostId ? (posts.find(p => p.id === editingPostId)?.date || new Date().toLocaleDateString('bn-BD')) : new Date().toLocaleDateString('bn-BD'),
        likes: posts.find(p => p.id === editingPostId)?.likes || 0
      };
      await set(ref(db, `posts/${id}`), postData);
      setNewPost({content:'', mediaUrl:'', mediaType:'none'}); 
      setEditingPostId(null);
      showSuccess(editingPostId ? 'পোস্ট আপডেট হয়েছে' : 'পাবলিশ হয়েছে');
    } catch (e: any) { alert(e.message); } finally { setIsSaving(false); }
  };

  // Notice Submit Handler (Create/Update)
  const handleNoticeSubmit = async () => {
    if(!newNotice.title || !newNotice.description) return alert('শিরোনাম ও বিবরণ পূরণ করুন');
    setIsSaving(true);
    try {
      const id = editingNoticeId || push(ref(db, 'notices')).key;
      const noticeData = {
        id,
        ...newNotice,
        date: editingNoticeId ? (notices.find(n => n.id === editingNoticeId)?.date || new Date().toLocaleDateString('bn-BD')) : new Date().toLocaleDateString('bn-BD'),
      };
      await set(ref(db, `notices/${id}`), noticeData);
      setNewNotice({title:'', description:'', videoUrl:''});
      setEditingNoticeId(null);
      showSuccess(editingNoticeId ? 'নোটিশ আপডেট হয়েছে' : 'নোটিশ পাবলিশ হয়েছে');
    } catch (e: any) { alert(e.message); } finally { setIsSaving(false); }
  };

  const handleApproveUser = async (user: User) => {
    if (!window.confirm(`${user.name} কে মেম্বার হিসেবে অনুমোদন করবেন?`)) return;
    setIsSaving(true);
    try {
      const userRef = ref(db, `users/${user.id}`);
      await update(userRef, { status: 'approved' });
      const memberId = push(ref(db, 'members')).key || Date.now().toString();
      const newMember: Member = {
        id: memberId,
        name: user.name,
        phone: user.phone,
        role: 'সাধারণ সদস্য',
        image: user.image || DEFAULT_AVATAR
      };
      await set(ref(db, `members/${memberId}`), newMember);
      showSuccess('মেম্বার অনুমোদন করা হয়েছে!');
    } catch (e: any) { alert(e.message); } finally { setIsSaving(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {saveStatus && (
        <div className="fixed top-28 right-4 z-[100] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <i className="fas fa-check-circle text-xl"></i>
          <span className="font-bold">{saveStatus}</span>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 px-6 py-4 flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'people', label: 'মেম্বার ও কমিটি', icon: 'fa-users' },
            { id: 'feed', label: 'পোস্ট ফিড', icon: 'fa-rss' },
            { id: 'notices', label: 'নোটিশ বোর্ড', icon: 'fa-bullhorn' },
            { id: 'requests', label: `আবেদন (${users.filter(u => u.status === 'pending').length})`, icon: 'fa-user-clock' },
            { id: 'gallery', label: 'গ্যালারি', icon: 'fa-images' },
            { id: 'cricket', label: 'ক্রিকেট হাব', icon: 'fa-bat-ball' },
            { id: 'site_settings', label: 'সাইট সেটিংস', icon: 'fa-cog' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <i className={`fas ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 lg:p-12 min-h-[600px]">
          {/* Post Feed Tab */}
          {activeTab === 'feed' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 h-fit">
                  <h4 className="font-black text-2xl mb-8 flex items-center gap-3">
                    <i className="fas fa-edit text-blue-600"></i> {editingPostId ? 'পোস্ট আপডেট করুন' : 'নতুন পোস্ট করুন'}
                  </h4>
                  <div className="space-y-4">
                    <textarea 
                      className="w-full p-4 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-100" 
                      placeholder="কি লিখছেন..." 
                      value={newPost.content} 
                      onChange={e => setNewPost({...newPost, content: e.target.value})} 
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <select 
                         className="p-4 border rounded-xl bg-white text-sm font-bold"
                         value={newPost.mediaType}
                         onChange={e => setNewPost({...newPost, mediaType: e.target.value as any})}
                       >
                         <option value="none">মিডিয়া নেই</option>
                         <option value="image">ছবি (Image)</option>
                         <option value="video">ভিডিও (Video)</option>
                       </select>
                       <input 
                         className="p-4 border rounded-xl text-sm" 
                         placeholder="লিঙ্ক (URL)" 
                         value={newPost.mediaUrl} 
                         onChange={e => setNewPost({...newPost, mediaUrl: e.target.value})} 
                       />
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={handlePostSubmit} 
                        className={`flex-1 ${editingPostId ? 'bg-orange-600' : 'bg-blue-600'} text-white py-4 rounded-xl font-black shadow-lg`}
                      >
                        {editingPostId ? 'আপডেট করুন' : 'পাবলিশ করুন'}
                      </button>
                      {editingPostId && (
                        <button 
                          onClick={() => { setEditingPostId(null); setNewPost({content:'', mediaUrl:'', mediaType:'none'}); }} 
                          className="px-6 bg-slate-200 text-slate-600 rounded-xl font-bold"
                        >
                          বাতিল
                        </button>
                      )}
                    </div>
                  </div>
               </div>
               
               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                  <h5 className="font-black text-slate-400 uppercase text-xs tracking-widest mb-4">ইতিপূর্বের পোস্টসমূহ</h5>
                  {posts.map(post => (
                    <div key={post.id} className="bg-white p-5 border rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                      <p className="text-slate-800 text-sm line-clamp-2 mb-4 font-medium">{post.content}</p>
                      <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-[10px] text-slate-400 font-bold">{post.date}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingPostId(post.id);
                              setNewPost({ content: post.content, mediaUrl: post.mediaUrl || '', mediaType: post.mediaType });
                            }} 
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={async () => {
                              if(window.confirm('পোস্টটি মুছে ফেলবেন?')) await set(ref(db, `posts/${post.id}`), null);
                            }} 
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && <p className="text-center py-10 text-slate-400 italic">এখনও কোনো পোস্ট নেই</p>}
               </div>
            </div>
          )}

          {/* Notices Tab */}
          {activeTab === 'notices' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 h-fit">
                  <h4 className="font-black text-2xl mb-8 flex items-center gap-3">
                    <i className="fas fa-bullhorn text-orange-600"></i> {editingNoticeId ? 'নোটিশ আপডেট' : 'নতুন নোটিশ'}
                  </h4>
                  <div className="space-y-4">
                    <input 
                      className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100" 
                      placeholder="নোটিশের শিরোনাম" 
                      value={newNotice.title} 
                      onChange={e => setNewNotice({...newNotice, title: e.target.value})} 
                    />
                    <textarea 
                      className="w-full p-4 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-100" 
                      placeholder="বিস্তারিত বিবরণ..." 
                      value={newNotice.description} 
                      onChange={e => setNewNotice({...newNotice, description: e.target.value})} 
                    />
                    <input 
                      className="w-full p-4 border rounded-xl text-sm" 
                      placeholder="ভিডিও লিঙ্ক (ঐচ্ছিক)" 
                      value={newNotice.videoUrl} 
                      onChange={e => setNewNotice({...newNotice, videoUrl: e.target.value})} 
                    />
                    <div className="flex gap-3">
                      <button 
                        onClick={handleNoticeSubmit} 
                        className={`flex-1 ${editingNoticeId ? 'bg-orange-600' : 'bg-blue-600'} text-white py-4 rounded-xl font-black shadow-lg`}
                      >
                        {editingNoticeId ? 'আপডেট নোটিশ' : 'নোটিশ পাবলিশ'}
                      </button>
                      {editingNoticeId && (
                        <button 
                          onClick={() => { setEditingNoticeId(null); setNewNotice({title:'', description:'', videoUrl:''}); }} 
                          className="px-6 bg-slate-200 text-slate-600 rounded-xl font-bold"
                        >
                          বাতিল
                        </button>
                      )}
                    </div>
                  </div>
               </div>
               
               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                  <h5 className="font-black text-slate-400 uppercase text-xs tracking-widest mb-4">প্রকাশিত নোটিশসমূহ</h5>
                  {notices.map(notice => (
                    <div key={notice.id} className="bg-white p-5 border rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                      <h6 className="font-bold text-slate-800 text-lg mb-1">{notice.title}</h6>
                      <p className="text-slate-500 text-xs line-clamp-2 mb-4">{notice.description}</p>
                      <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-[10px] text-blue-600 font-black uppercase">{notice.date}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingNoticeId(notice.id);
                              setNewNotice({ title: notice.title, description: notice.description, videoUrl: notice.videoUrl || '' });
                            }} 
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={async () => {
                              if(window.confirm('নোটিশটি মুছে ফেলবেন?')) await set(ref(db, `notices/${notice.id}`), null);
                            }} 
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notices.length === 0 && <p className="text-center py-10 text-slate-400 italic">বর্তমানে কোনো নোটিশ নেই</p>}
               </div>
            </div>
          )}

          {/* Cricket Hub Tab */}
          {activeTab === 'cricket' && (
            <div className="space-y-12">
               {/* Special Match High Voltage Editor */}
               <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] border border-blue-500/20 shadow-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <h4 className="font-black text-3xl flex items-center gap-3"><i className="fas fa-bolt text-yellow-400"></i> হাইভোল্টেজ ম্যাচ কন্ট্রোল</h4>
                    <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Junior vs Senior Match</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">ম্যাচ টাইটেল (Title)</label>
                       <input className="w-full p-4 border border-white/10 rounded-2xl bg-white/5 outline-none focus:ring-2 focus:ring-blue-500/50" value={localSpecialMatch.title} onChange={e => setLocalSpecialMatch({...localSpecialMatch, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-yellow-400 uppercase tracking-widest ml-1">ম্যাচ তারিখ ও সময় (Status)</label>
                       <input className="w-full p-4 border border-white/10 rounded-2xl bg-white/5 outline-none focus:ring-2 focus:ring-yellow-500/50" value={localSpecialMatch.date} onChange={e => setLocalSpecialMatch({...localSpecialMatch, date: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Team 1 Edit */}
                    <div className="space-y-8 bg-white/5 p-8 rounded-[3rem] border border-white/5">
                       <div>
                          <label className="text-[10px] font-black text-blue-400 uppercase block mb-2 tracking-widest">দল ১ এর নাম (Team A)</label>
                          <input className="w-full p-4 border border-white/10 rounded-2xl bg-white/10 font-black text-xl" value={localSpecialMatch.team1Name} onChange={e => setLocalSpecialMatch({...localSpecialMatch, team1Name: e.target.value})} />
                       </div>
                       
                       <div>
                          <p className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2"><i className="fas fa-users-line"></i> প্লেয়ার লিস্ট (১১ জন মূল)</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Array(11).fill(0).map((_, i) => (
                              <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/5 p-1">
                                <span className="w-6 h-6 flex items-center justify-center text-[10px] font-black opacity-30">{i+1}</span>
                                <input className="flex-1 p-2 text-sm bg-transparent outline-none" placeholder={`খেলোয়াড় ${i+1}`} value={localSpecialMatch.team1Players[i] || ''} onChange={e => {
                                   const newList = [...localSpecialMatch.team1Players];
                                   newList[i] = e.target.value;
                                   setLocalSpecialMatch({...localSpecialMatch, team1Players: newList});
                                }} />
                              </div>
                            ))}
                          </div>
                       </div>

                       <div>
                          <p className="text-xs font-black text-red-400 uppercase mb-4 tracking-widest flex items-center gap-2"><i className="fas fa-user-plus"></i> অতিরিক্ত প্লেয়ার (৩ জন)</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {Array(3).fill(0).map((_, i) => (
                              <input key={i} className="w-full p-3 text-sm border border-red-500/20 rounded-xl bg-red-900/10 outline-none focus:ring-2 focus:ring-red-500/50" placeholder={`অতিরিক্ত ${i+1}`} value={localSpecialMatch.team1Subs[i] || ''} onChange={e => {
                                 const newList = [...localSpecialMatch.team1Subs];
                                 newList[i] = e.target.value;
                                 setLocalSpecialMatch({...localSpecialMatch, team1Subs: newList});
                              }} />
                            ))}
                          </div>
                       </div>
                    </div>

                    {/* Team 2 Edit */}
                    <div className="space-y-8 bg-white/5 p-8 rounded-[3rem] border border-white/5">
                       <div>
                          <label className="text-[10px] font-black text-yellow-400 uppercase block mb-2 tracking-widest">দল ২ এর নাম (Team B)</label>
                          <input className="w-full p-4 border border-white/10 rounded-2xl bg-white/10 font-black text-xl" value={localSpecialMatch.team2Name} onChange={e => setLocalSpecialMatch({...localSpecialMatch, team2Name: e.target.value})} />
                       </div>
                       
                       <div>
                          <p className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2"><i className="fas fa-users-line"></i> প্লেয়ার লিস্ট (১১ জন মূল)</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Array(11).fill(0).map((_, i) => (
                              <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/5 p-1">
                                <span className="w-6 h-6 flex items-center justify-center text-[10px] font-black opacity-30">{i+1}</span>
                                <input className="flex-1 p-2 text-sm bg-transparent outline-none" placeholder={`খেলোয়াড় ${i+1}`} value={localSpecialMatch.team2Players[i] || ''} onChange={e => {
                                   const newList = [...localSpecialMatch.team2Players];
                                   newList[i] = e.target.value;
                                   setLocalSpecialMatch({...localSpecialMatch, team2Players: newList});
                                }} />
                              </div>
                            ))}
                          </div>
                       </div>

                       <div>
                          <p className="text-xs font-black text-red-400 uppercase mb-4 tracking-widest flex items-center gap-2"><i className="fas fa-user-plus"></i> অতিরিক্ত প্লেয়ার (৩ জন)</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {Array(3).fill(0).map((_, i) => (
                              <input key={i} className="w-full p-3 text-sm border border-red-500/20 rounded-xl bg-red-900/10 outline-none focus:ring-2 focus:ring-red-500/50" placeholder={`অতিরিক্ত ${i+1}`} value={localSpecialMatch.team2Subs[i] || ''} onChange={e => {
                                 const newList = [...localSpecialMatch.team2Subs];
                                 newList[i] = e.target.value;
                                 setLocalSpecialMatch({...localSpecialMatch, team2Subs: newList});
                              }} />
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>

                  <button onClick={async () => {
                    setIsSaving(true);
                    await set(ref(db, 'specialMatch'), localSpecialMatch);
                    setIsSaving(false);
                    showSuccess('ম্যাচ তথ্য আপডেট হয়েছে');
                  }} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-black text-xl mt-12 shadow-[0_15px_40px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-3">
                    <i className="fas fa-save"></i> ম্যাচ সেটিংস সেভ করুন
                  </button>
               </div>

               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                  <h4 className="font-black text-2xl mb-8 flex items-center gap-3"><i className="fas fa-trophy text-yellow-500"></i> টুর্নামেন্ট আর্কাইভ এডিটর</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase">টুর্নামেন্ট বছর</label>
                       <input className="w-full p-4 border rounded-xl" value={localCricketStats.year} onChange={e => setLocalCricketStats({...localCricketStats, year: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
                    <div className="space-y-4 bg-yellow-50/50 p-6 rounded-3xl border border-yellow-100">
                       <p className="font-black text-yellow-600 uppercase text-xs tracking-widest flex items-center gap-2"><i className="fas fa-crown"></i> বিজয়ী দল (Winner)</p>
                       <div className="space-y-3">
                          <input className="w-full p-4 border rounded-xl bg-white" placeholder="বিজয়ী দলের নাম" value={localCricketStats.winner} onChange={e => setLocalCricketStats({...localCricketStats, winner: e.target.value})} />
                          <input className="w-full p-4 border rounded-xl bg-white" placeholder="বিজয়ী দলের লগো (URL)" value={localCricketStats.winnerImage} onChange={e => setLocalCricketStats({...localCricketStats, winnerImage: e.target.value})} />
                       </div>
                    </div>
                    <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                       <p className="font-black text-slate-500 uppercase text-xs tracking-widest flex items-center gap-2"><i className="fas fa-medal"></i> রানার্স-আপ দল (Runner Up)</p>
                       <div className="space-y-3">
                          <input className="w-full p-4 border rounded-xl bg-white" placeholder="রানার্স-আপ দলের নাম" value={localCricketStats.runnerUp} onChange={e => setLocalCricketStats({...localCricketStats, runnerUp: e.target.value})} />
                          <input className="w-full p-4 border rounded-xl bg-white" placeholder="রানার্স-আপ দলের লগো (URL)" value={localCricketStats.runnerUpImage} onChange={e => setLocalCricketStats({...localCricketStats, runnerUpImage: e.target.value})} />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                     <div className="space-y-6">
                        <p className="font-black text-blue-600 uppercase text-xs tracking-widest">সেরা ব্যাটার তথ্য</p>
                        <input className="w-full p-4 border rounded-xl" placeholder="নাম" value={localCricketStats.topScorer.name} onChange={e => setLocalCricketStats({...localCricketStats, topScorer: {...localCricketStats.topScorer, name: e.target.value}})} />
                        <div className="flex gap-4">
                          <input className="w-24 p-4 border rounded-xl" placeholder="রান" value={localCricketStats.topScorer.runs} onChange={e => setLocalCricketStats({...localCricketStats, topScorer: {...localCricketStats.topScorer, runs: parseInt(e.target.value) || 0}})} />
                          <input className="flex-1 p-4 border rounded-xl" placeholder="ছবির ইউআরএল" value={localCricketStats.topScorer.image} onChange={e => setLocalCricketStats({...localCricketStats, topScorer: {...localCricketStats.topScorer, image: e.target.value}})} />
                        </div>
                     </div>
                     <div className="space-y-6">
                        <p className="font-black text-red-600 uppercase text-xs tracking-widest">সেরা বোলার তথ্য</p>
                        <input className="w-full p-4 border rounded-xl" placeholder="নাম" value={localCricketStats.topWicketTaker.name} onChange={e => setLocalCricketStats({...localCricketStats, topWicketTaker: {...localCricketStats.topWicketTaker, name: e.target.value}})} />
                        <div className="flex gap-4">
                          <input className="w-24 p-4 border rounded-xl" placeholder="উইকেট" value={localCricketStats.topWicketTaker.wickets} onChange={e => setLocalCricketStats({...localCricketStats, topWicketTaker: {...localCricketStats.topWicketTaker, wickets: parseInt(e.target.value) || 0}})} />
                          <input className="flex-1 p-4 border rounded-xl" placeholder="ছবির ইউআরএল" value={localCricketStats.topWicketTaker.image} onChange={e => setLocalCricketStats({...localCricketStats, topWicketTaker: {...localCricketStats.topWicketTaker, image: e.target.value}})} />
                        </div>
                     </div>
                  </div>
                  <button onClick={async () => { setIsSaving(true); await set(ref(db, 'cricketStats'), localCricketStats); setIsSaving(false); showSuccess('টুর্নামেন্ট তথ্য আপডেট হয়েছে'); }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl">সব পরিবর্তন সেভ করুন</button>
               </div>
               
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                  <h4 className="font-black text-2xl mb-8 flex items-center gap-3"><i className="fas fa-users-viewfinder text-blue-600"></i> নিবন্ধিত দলসমূহ ম্যানেজমেন্ট</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                       <input className="w-full p-4 border rounded-xl" placeholder="দলের নাম" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} />
                       <input className="w-full p-4 border rounded-xl" placeholder="দলের লগো ইউআরএল" value={newTeam.logo} onChange={e => setNewTeam({...newTeam, logo: e.target.value})} />
                       <input className="w-full p-4 border rounded-xl" placeholder="ক্যাপ্টেনের নাম" value={newTeam.captainName} onChange={e => setNewTeam({...newTeam, captainName: e.target.value})} />
                       <input className="w-full p-4 border rounded-xl" placeholder="ক্যাপ্টেনের ছবি ইউআরএল" value={newTeam.captainImage} onChange={e => setNewTeam({...newTeam, captainImage: e.target.value})} />
                       <button onClick={async () => {
                         if(!newTeam.name) return;
                         const id = push(ref(db, 'upcomingTeams')).key;
                         await set(ref(db, `upcomingTeams/${id}`), { id, ...newTeam, players: [] });
                         setNewTeam({name:'', logo:'', captainName:'', captainImage:'', playersCount:'0'});
                         showSuccess('নতুন দল নিবন্ধিত হয়েছে');
                       }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black">টিম যোগ করুন</button>
                    </div>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                       {upcomingTeams.map(t => (
                         <div key={t.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-4">
                               <img src={t.logo} className="w-12 h-12 rounded-xl object-cover" />
                               <p className="font-black text-slate-800">{t.name}</p>
                            </div>
                            <button onClick={async () => { if(window.confirm('দলটি মুছে ফেলবেন?')) await set(ref(db, `upcomingTeams/${t.id}`), null); }} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.filter(u => u.status === 'pending').map(user => (
                <div key={user.id} className="bg-slate-50 border rounded-3xl p-6 flex flex-col md:flex-row gap-6 shadow-sm">
                  <img src={user.image || DEFAULT_AVATAR} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md" alt={user.name} />
                  <div className="flex-1 space-y-2">
                    <h5 className="font-black text-xl text-slate-800">{user.name}</h5>
                    <div className="text-xs space-y-1 font-bold text-slate-500">
                      <p><i className="fas fa-phone mr-2 text-blue-500"></i> {user.phone}</p>
                      <p><i className="fas fa-envelope mr-2 text-blue-500"></i> {user.email}</p>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button onClick={() => handleApproveUser(user)} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-black text-xs hover:bg-green-700">অনুমোদন</button>
                      <button onClick={async () => { if(window.confirm('বাতিল করবেন?')) await set(ref(db, `users/${user.id}`), null); }} className="px-4 bg-white text-red-500 border border-red-200 py-2.5 rounded-xl font-black text-xs hover:bg-red-50">মুছে ফেলুন</button>
                    </div>
                  </div>
                </div>
              ))}
              {users.filter(u => u.status === 'pending').length === 0 && <p className="col-span-full text-center py-20 text-slate-400 font-bold italic">কোনো নতুন আবেদন নেই।</p>}
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 h-fit">
                  <h4 className="font-black text-xl mb-6"><i className="fas fa-plus-circle text-blue-600 mr-2"></i>গ্যালারিতে ছবি যোগ</h4>
                  <div className="space-y-4">
                    <input className="w-full p-4 border rounded-xl" placeholder="ছবির ইউআরএল (Link)" value={newGalleryImg.url} onChange={e => setNewGalleryImg({...newGalleryImg, url: e.target.value})} />
                    <input className="w-full p-4 border rounded-xl" placeholder="ক্যাপশন" value={newGalleryImg.caption} onChange={e => setNewGalleryImg({...newGalleryImg, caption: e.target.value})} />
                    <button onClick={async () => {
                      if(!newGalleryImg.url) return;
                      const id = push(ref(db, 'gallery')).key;
                      await set(ref(db, `gallery/${id}`), { id, ...newGalleryImg });
                      setNewGalleryImg({url:'', caption:''});
                      showSuccess('ছবি যোগ হয়েছে');
                    }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black shadow-lg">ছবি সেভ করুন</button>
                  </div>
               </div>
               <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gallery.map(img => (
                    <div key={img.id} className="relative group rounded-2xl overflow-hidden border">
                      <img src={img.url} className="w-full h-32 object-cover" />
                      <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `gallery/${img.id}`), null); }} className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><i className="fas fa-trash text-xs"></i></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* People Tab */}
          {activeTab === 'people' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 h-fit">
                 <h4 className="font-black text-2xl mb-8 flex items-center gap-3">
                    <i className="fas fa-user-plus text-blue-600"></i> {editingPersonId ? 'সদস্য তথ্য এডিট' : 'নতুন সদস্য'}
                 </h4>
                 <div className="space-y-5">
                    <input className="w-full p-4 border rounded-xl" placeholder="সদস্যের নাম" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} />
                    <input className="w-full p-4 border rounded-xl" placeholder="পদবী" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})} />
                    <input className="w-full p-4 border rounded-xl" placeholder="ফোন নম্বর" value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})} />
                    <input className="w-full p-4 border rounded-xl" placeholder="ছবির ইউআরএল" value={newPerson.image} onChange={e => setNewPerson({...newPerson, image: e.target.value})} />
                    <select className="w-full p-4 border rounded-xl bg-white" value={newPerson.type} onChange={e => setNewPerson({...newPerson, type: e.target.value as any})}>
                      <option value="member">সাধারণ সদস্য</option><option value="committee">কমিটি মেম্বার</option>
                    </select>
                    <button onClick={async () => {
                        if(!newPerson.name) return; setIsSaving(true);
                        const typePath = newPerson.type === 'member' ? 'members' : 'committee';
                        const id = editingPersonId || push(ref(db, typePath)).key || Date.now().toString();
                        await set(ref(db, `${typePath}/${id}`), { id, ...newPerson, image: newPerson.image || DEFAULT_AVATAR });
                        setEditingPersonId(null); setNewPerson({name:'', role:'', phone:'', image:'', type:'member'});
                        setIsSaving(false); showSuccess('সদস্য তথ্য সেভ হয়েছে');
                     }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black">সেভ মেম্বার</button>
                 </div>
               </div>
               <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2 no-scrollbar">
                  {[...committee, ...members].map(m => (
                    <div key={m.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-md">
                      <div className="flex items-center gap-4">
                        <img src={m.image} className="w-14 h-14 rounded-2xl object-cover" />
                        <div><p className="font-black text-slate-800 leading-tight">{m.name}</p><p className="text-[10px] text-blue-600 font-black">{m.role}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingPersonId(m.id); setNewPerson({ name: m.name, role: m.role, phone: m.phone, image: m.image, type: members.some(mem => mem.id === m.id) ? 'member' : 'committee' }); }} className="text-blue-500 p-2"><i className="fas fa-edit"></i></button>
                        <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `${members.some(mem => mem.id === m.id) ? 'members' : 'committee'}/${m.id}`), null); }} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Site Settings Tab */}
          {activeTab === 'site_settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                  <h4 className="font-black text-xl mb-6">ব্র্যান্ডিং ও কন্টাক্ট</h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">লগো ইউআরএল</label>
                      <input className="w-full p-4 border rounded-xl" placeholder="লগো ইউআরএল" value={localFooter.logoUrl} onChange={e => setLocalFooter({...localFooter, logoUrl: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">ব্যানার ইমেজ ইউআরএল</label>
                      <input className="w-full p-4 border rounded-xl" placeholder="ব্যানার ইউআরএল" value={localFooter.heroImageUrl} onChange={e => setLocalFooter({...localFooter, heroImageUrl: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">ব্রেকিং নিউজ টেক্সট</label>
                      <textarea className="w-full p-4 border rounded-xl" placeholder="ব্রেকিং নিউজ" value={localFooter.urgentNews} onChange={e => setLocalFooter({...localFooter, urgentNews: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">কন্টাক্ট ইমেইল</label>
                      <input className="w-full p-4 border rounded-xl" placeholder="ইমেইল" value={localFooter.email} onChange={e => setLocalFooter({...localFooter, email: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">কন্টাক্ট ফোন</label>
                      <input className="w-full p-4 border rounded-xl" placeholder="ফোন" value={localFooter.phone} onChange={e => setLocalFooter({...localFooter, phone: e.target.value})} />
                    </div>
                    <button onClick={async () => { await set(ref(db, 'footerData'), localFooter); showSuccess('সেটিংস সেভ হয়েছে'); }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black">সেভ ব্র্যান্ডিং সেটিংস</button>
                  </div>
               </div>
               
               {/* About Us Settings */}
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                  <h4 className="font-black text-xl mb-6">সংগঠন ও এবাউট তথ্য</h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">সংগঠনের বিবরণ</label>
                      <textarea className="w-full p-4 border rounded-xl h-24" value={localAbout.description} onChange={e => setLocalAbout({...localAbout, description: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">লক্ষ্য (Mission)</label>
                      <input className="w-full p-4 border rounded-xl" value={localAbout.mission} onChange={e => setLocalAbout({...localAbout, mission: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">উদ্দেশ্য (Vision)</label>
                      <input className="w-full p-4 border rounded-xl" value={localAbout.vision} onChange={e => setLocalAbout({...localAbout, vision: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">সাফল্যের বছর (পরিসংখ্যান)</label>
                      <input className="w-full p-4 border rounded-xl" placeholder="সাফল্যের বছর" value={localAbout.stats[0]?.count} onChange={e => {
                        const newStats = [...localAbout.stats];
                        newStats[0] = { ...newStats[0], count: e.target.value };
                        setLocalAbout({ ...localAbout, stats: newStats });
                      }} />
                    </div>
                    <button onClick={async () => { await set(ref(db, 'aboutData'), localAbout); showSuccess('এবাউট তথ্য সেভ হয়েছে'); }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black">সেভ এবাউট তথ্য</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
