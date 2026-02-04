
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

  // --- Local States ---
  const [newPerson, setNewPerson] = useState({ name: '', role: '', phone: '', image: '', type: 'member' });
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ content: '', mediaUrl: '', mediaType: 'none' as any });
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newNotice, setNewNotice] = useState({ title: '', description: '', videoUrl: '' });
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

  const handlePostSubmit = async () => {
    if(!newPost.content) return alert('পোস্টের লেখা লিখুন');
    setIsSaving(true);
    try {
      const id = editingPostId || push(ref(db, 'posts')).key;
      const postData = {
        id,
        ...newPost,
        date: editingPostId ? posts.find(p => p.id === editingPostId)?.date : new Date().toLocaleDateString('bn-BD'),
        likes: posts.find(p => p.id === editingPostId)?.likes || 0
      };
      await set(ref(db, `posts/${id}`), postData);
      setNewPost({content:'', mediaUrl:'', mediaType:'none'}); setEditingPostId(null);
      showSuccess(editingPostId ? 'পোস্ট আপডেট হয়েছে' : 'পাবলিশ হয়েছে');
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
          {/* Cricket Hub Tab */}
          {activeTab === 'cricket' && (
            <div className="space-y-12">
               {/* Special Match High Voltage Editor */}
               <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
                  <h4 className="font-black text-2xl mb-8 flex items-center gap-3"><i className="fas fa-bolt text-yellow-400"></i> হাইভোল্টেজ ম্যাচ এডিটর (সিনিয়র vs জুনিয়র)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase">ম্যাচ শিরোনাম</label>
                       <input className="w-full p-4 border border-white/10 rounded-xl bg-white/5" value={localSpecialMatch.title} onChange={e => setLocalSpecialMatch({...localSpecialMatch, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase">ম্যাচ তারিখ/স্ট্যাটাস</label>
                       <input className="w-full p-4 border border-white/10 rounded-xl bg-white/5" value={localSpecialMatch.date} onChange={e => setLocalSpecialMatch({...localSpecialMatch, date: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Team 1 Edit */}
                    <div className="space-y-6">
                       <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <label className="text-[10px] font-black text-blue-400 uppercase mb-2 block">টিম ১ নাম</label>
                          <input className="w-full p-3 border border-white/10 rounded-xl bg-white/10 mb-6 font-bold" value={localSpecialMatch.team1Name} onChange={e => setLocalSpecialMatch({...localSpecialMatch, team1Name: e.target.value})} />
                          
                          <p className="text-xs font-black text-slate-500 uppercase mb-3">প্লেয়ার লিস্ট (১১ জন)</p>
                          <div className="space-y-2">
                            {localSpecialMatch.team1Players.map((p, i) => (
                              <input key={i} className="w-full p-2 text-sm border border-white/5 rounded-lg bg-white/5" placeholder={`খেলোয়াড় ${i+1}`} value={p} onChange={e => {
                                 const newList = [...localSpecialMatch.team1Players];
                                 newList[i] = e.target.value;
                                 setLocalSpecialMatch({...localSpecialMatch, team1Players: newList});
                              }} />
                            ))}
                          </div>

                          <p className="text-xs font-black text-red-400 uppercase mt-6 mb-3">অতিরিক্ত প্লেয়ার (৩ জন)</p>
                          <div className="space-y-2">
                            {localSpecialMatch.team1Subs.map((p, i) => (
                              <input key={i} className="w-full p-2 text-sm border border-white/5 rounded-lg bg-red-900/10" placeholder={`অতিরিক্ত ${i+1}`} value={p} onChange={e => {
                                 const newList = [...localSpecialMatch.team1Subs];
                                 newList[i] = e.target.value;
                                 setLocalSpecialMatch({...localSpecialMatch, team1Subs: newList});
                              }} />
                            ))}
                          </div>
                       </div>
                    </div>

                    {/* Team 2 Edit */}
                    <div className="space-y-6">
                       <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <label className="text-[10px] font-black text-yellow-400 uppercase mb-2 block">টিম ২ নাম</label>
                          <input className="w-full p-3 border border-white/10 rounded-xl bg-white/10 mb-6 font-bold" value={localSpecialMatch.team2Name} onChange={e => setLocalSpecialMatch({...localSpecialMatch, team2Name: e.target.value})} />
                          
                          <p className="text-xs font-black text-slate-500 uppercase mb-3">প্লেয়ার লিস্ট (১১ জন)</p>
                          <div className="space-y-2">
                            {localSpecialMatch.team2Players.map((p, i) => (
                              <input key={i} className="w-full p-2 text-sm border border-white/5 rounded-lg bg-white/5" placeholder={`খেলোয়াড় ${i+1}`} value={p} onChange={e => {
                                 const newList = [...localSpecialMatch.team2Players];
                                 newList[i] = e.target.value;
                                 setLocalSpecialMatch({...localSpecialMatch, team2Players: newList});
                              }} />
                            ))}
                          </div>

                          <p className="text-xs font-black text-red-400 uppercase mt-6 mb-3">অতিরিক্ত প্লেয়ার (৩ জন)</p>
                          <div className="space-y-2">
                            {localSpecialMatch.team2Subs.map((p, i) => (
                              <input key={i} className="w-full p-2 text-sm border border-white/5 rounded-lg bg-red-900/10" placeholder={`অতিরিক্ত ${i+1}`} value={p} onChange={e => {
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
                  }} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl mt-8 shadow-2xl hover:bg-blue-700 transition-all">ম্যাচ সেটিংস সেভ করুন</button>
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

          {activeTab === 'feed' && (
            <div className="space-y-8">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-inner">
                <textarea className="w-full p-6 rounded-3xl mb-6 border-0 outline-none min-h-[160px] focus:ring-4 focus:ring-blue-100 shadow-inner text-lg" placeholder="পোস্টের লেখা লিখুন..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                   <input className="w-full p-4 border rounded-xl" placeholder="মিডিয়া ইউআরএল" value={newPost.mediaUrl} onChange={e => setNewPost({...newPost, mediaUrl: e.target.value})} />
                   <select className="w-full p-4 border rounded-xl bg-white" value={newPost.mediaType} onChange={e => setNewPost({...newPost, mediaType: e.target.value as any})}>
                     <option value="none">শুধু টেক্সট</option><option value="image">ছবি</option><option value="video">ভিডিও (Youtube)</option>
                   </select>
                </div>
                <button disabled={isSaving} onClick={handlePostSubmit} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl">পোস্ট করুন</button>
              </div>
              <div className="space-y-4">
                 {posts.map(p => (
                   <div key={p.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-md">
                      <p className="font-bold text-slate-800 truncate pr-4">{p.content}</p>
                      <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `posts/${p.id}`), null); }} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                 <h4 className="font-black text-xl mb-6">নতুন নোটিশ</h4>
                 <div className="space-y-4">
                   <input className="w-full p-4 border rounded-xl" placeholder="শিরোনাম" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                   <textarea className="w-full p-4 border rounded-xl h-40" placeholder="বিস্তারিত" value={newNotice.description} onChange={e => setNewNotice({...newNotice, description: e.target.value})} />
                   <button onClick={async () => {
                     if(!newNotice.title) return;
                     const id = push(ref(db, 'notices')).key;
                     await set(ref(db, `notices/${id}`), { id, ...newNotice, date: new Date().toLocaleDateString('bn-BD') });
                     setNewNotice({title:'', description:'', videoUrl:''});
                     showSuccess('নোটিশ পাবলিশ হয়েছে');
                   }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black">পাবলিশ করুন</button>
                 </div>
               </div>
               <div className="space-y-3">
                 {notices.map(n => (
                   <div key={n.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-md">
                      <p className="font-black text-slate-800">{n.title}</p>
                      <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `notices/${n.id}`), null); }} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                   </div>
                 ))}
               </div>
            </div>
          )}

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
