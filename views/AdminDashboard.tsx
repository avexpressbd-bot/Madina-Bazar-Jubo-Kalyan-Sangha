
import React, { useState, useEffect } from 'react';
import { db, ref, set, push, update } from '../firebase';
import { Member, Notice, Team, TournamentStats, GalleryImage, User, Post, FooterData, AboutData } from '../types';

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
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  members, committee, notices, gallery, upcomingTeams, cricketStats, users, posts, footerData, aboutData
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'notices' | 'people' | 'gallery' | 'cricket' | 'site_settings' | 'requests'>('people');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const showSuccess = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // --- Local States for Editing ---
  const [newPerson, setNewPerson] = useState({ name: '', role: '', phone: '', image: '', type: 'member' });
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ content: '', mediaUrl: '', mediaType: 'none' as any });
  const [newNotice, setNewNotice] = useState({ title: '', description: '', videoUrl: '' });
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [newGalleryImg, setNewGalleryImg] = useState({ url: '', caption: '' });
  const [localCricketStats, setLocalCricketStats] = useState<TournamentStats>(cricketStats);
  const [newTeam, setNewTeam] = useState({ name: '', logo: '', playersCount: '0' });
  const [newParticipatingTeam, setNewParticipatingTeam] = useState('');
  const [localFooter, setLocalFooter] = useState<FooterData>(footerData);
  const [localAbout, setLocalAbout] = useState<AboutData>(aboutData);

  useEffect(() => {
    setLocalCricketStats(cricketStats || {
      year: '', winner: '', winnerImage: '', runnerUp: '', runnerUpImage: '',
      topScorer: { name: '', runs: 0, image: '' },
      topWicketTaker: { name: '', wickets: 0, image: '' },
      participatingTeams: []
    });
    setLocalFooter(footerData);
    setLocalAbout(aboutData || { description: '', mission: '', vision: '', stats: [] });
  }, [cricketStats, footerData, aboutData]);

  // --- Functions ---
  const handlePostSubmit = async () => {
    if(!newPost.content) return alert('পোস্টের লেখা লিখুন');
    setIsSaving(true);
    try {
      const postsRef = ref(db, 'posts');
      const newPostRef = push(postsRef);
      const postId = newPostRef.key;
      
      const postData = {
        id: postId,
        ...newPost,
        date: new Date().toLocaleDateString('bn-BD'),
        likes: 0
      };
      
      await set(newPostRef, postData);

      // AUTO GALLERY: If it's an image, save it to gallery too
      if (newPost.mediaType === 'image' && newPost.mediaUrl) {
        const galleryRef = push(ref(db, 'gallery'));
        await set(galleryRef, {
          id: galleryRef.key,
          url: newPost.mediaUrl,
          caption: newPost.content.substring(0, 30) + '...'
        });
      }

      setNewPost({content:'', mediaUrl:'', mediaType:'none'});
      showSuccess('পোস্ট করা হয়েছে (এবং গ্যালারিতে ছবি যুক্ত হয়েছে)');
    } catch (e: any) { alert(e.message); } finally { setIsSaving(false); }
  };

  const handleCricketSubmit = async () => {
    setIsSaving(true);
    try {
      await set(ref(db, 'cricketStats'), localCricketStats);
      showSuccess('ক্রিকেট হাবের তথ্য আপডেট হয়েছে');
    } catch (e: any) { alert(e.message); } finally { setIsSaving(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {saveStatus && (
        <div className="fixed top-24 right-4 z-[100] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
          <i className="fas fa-check-circle text-xl"></i>
          <span className="font-bold">{saveStatus}</span>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 px-6 py-4 flex flex-wrap gap-2">
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
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <i className={`fas ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 lg:p-12">
          {/* --- CRICKET HUB MANAGEMENT --- */}
          {activeTab === 'cricket' && (
            <div className="space-y-12">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                <h4 className="font-bold text-2xl mb-8 flex items-center gap-3"><i className="fas fa-trophy text-yellow-600"></i> বিগত টুর্নামেন্ট এডিটর</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">টুর্নামেন্ট বছর</label>
                    <input className="w-full p-4 border rounded-2xl" value={localCricketStats.year} onChange={e => setLocalCricketStats({...localCricketStats, year: e.target.value})} />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block">চ্যাম্পিয়ন দল</label>
                      <input className="w-full p-4 border rounded-2xl" placeholder="দলের নাম" value={localCricketStats.winner} onChange={e => setLocalCricketStats({...localCricketStats, winner: e.target.value})} />
                      <input className="w-full p-3 border rounded-xl text-xs" placeholder="দলের লোগো/ছবি URL" value={localCricketStats.winnerImage} onChange={e => setLocalCricketStats({...localCricketStats, winnerImage: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block">রানার-আপ দল</label>
                      <input className="w-full p-4 border rounded-2xl" placeholder="দলের নাম" value={localCricketStats.runnerUp} onChange={e => setLocalCricketStats({...localCricketStats, runnerUp: e.target.value})} />
                      <input className="w-full p-3 border rounded-xl text-xs" placeholder="দলের লোগো/ছবি URL" value={localCricketStats.runnerUpImage} onChange={e => setLocalCricketStats({...localCricketStats, runnerUpImage: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="p-6 bg-white rounded-3xl border border-slate-200">
                    <p className="font-bold mb-4 text-blue-600">টপ স্কোরার তথ্য</p>
                    <div className="space-y-3">
                      <input className="w-full p-3 border rounded-xl" placeholder="নাম" value={localCricketStats.topScorer.name} onChange={e => setLocalCricketStats({...localCricketStats, topScorer: {...localCricketStats.topScorer, name: e.target.value}})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="রান" type="number" value={localCricketStats.topScorer.runs} onChange={e => setLocalCricketStats({...localCricketStats, topScorer: {...localCricketStats.topScorer, runs: parseInt(e.target.value)}})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="প্লেয়ারের ছবি URL" value={localCricketStats.topScorer.image} onChange={e => setLocalCricketStats({...localCricketStats, topScorer: {...localCricketStats.topScorer, image: e.target.value}})} />
                    </div>
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-slate-200">
                    <p className="font-bold mb-4 text-red-600">টপ উইকেট টেকার তথ্য</p>
                    <div className="space-y-3">
                      <input className="w-full p-3 border rounded-xl" placeholder="নাম" value={localCricketStats.topWicketTaker.name} onChange={e => setLocalCricketStats({...localCricketStats, topWicketTaker: {...localCricketStats.topWicketTaker, name: e.target.value}})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="উইকেট" type="number" value={localCricketStats.topWicketTaker.wickets} onChange={e => setLocalCricketStats({...localCricketStats, topWicketTaker: {...localCricketStats.topWicketTaker, wickets: parseInt(e.target.value)}})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="প্লেয়ারের ছবি URL" value={localCricketStats.topWicketTaker.image} onChange={e => setLocalCricketStats({...localCricketStats, topWicketTaker: {...localCricketStats.topWicketTaker, image: e.target.value}})} />
                    </div>
                  </div>
                </div>

                <div className="mb-8 p-6 bg-white rounded-3xl border border-slate-200">
                  <p className="font-bold mb-4">বিগত আসরের দলসমূহ</p>
                  <div className="flex gap-2 mb-4">
                    <input className="flex-1 p-3 border rounded-xl" placeholder="দলের নাম লিখুন" value={newParticipatingTeam} onChange={e => setNewParticipatingTeam(e.target.value)} />
                    <button onClick={() => { if(newParticipatingTeam) { setLocalCricketStats({...localCricketStats, participatingTeams: [...(localCricketStats.participatingTeams || []), newParticipatingTeam]}); setNewParticipatingTeam(''); } }} className="bg-blue-600 text-white px-6 rounded-xl font-bold">যোগ করুন</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(localCricketStats.participatingTeams || []).map((t, i) => (
                      <span key={i} className="bg-slate-100 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border">
                        {t} <button onClick={() => setLocalCricketStats({...localCricketStats, participatingTeams: localCricketStats.participatingTeams.filter((_, idx) => idx !== i)})} className="text-red-500"><i className="fas fa-times"></i></button>
                      </span>
                    ))}
                  </div>
                </div>

                <button disabled={isSaving} onClick={handleCricketSubmit} className="w-full bg-blue-700 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-800 transition-all">সেভ করুন (Save All Hub Stats)</button>
              </div>

              {/* Upcoming Teams Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 h-fit">
                   <h4 className="font-bold text-xl mb-6">আসন্ন টুর্নামেন্টের দল নিবন্ধন</h4>
                   <div className="space-y-4">
                     <input className="w-full p-4 border rounded-2xl outline-none" placeholder="দলের নাম" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} />
                     <input className="w-full p-4 border rounded-2xl outline-none" placeholder="টিম লোগো (URL)" value={newTeam.logo} onChange={e => setNewTeam({...newTeam, logo: e.target.value})} />
                     <input className="w-full p-4 border rounded-2xl outline-none" placeholder="প্লেয়ার সংখ্যা" type="number" value={newTeam.playersCount} onChange={e => setNewTeam({...newTeam, playersCount: e.target.value})} />
                     <button onClick={async () => {
                       if(!newTeam.name) return; setIsSaving(true);
                       const newRef = push(ref(db, 'upcomingTeams'));
                       await set(newRef, { id: newRef.key, name: newTeam.name, logo: newTeam.logo || 'https://cdn-icons-png.flaticon.com/512/3221/3221841.png', players: new Array(parseInt(newTeam.playersCount) || 11).fill('Player') });
                       setNewTeam({name:'', logo:'', playersCount:'0'}); setIsSaving(false); showSuccess('নতুন দল নিবন্ধিত হয়েছে');
                     }} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg">দল সেভ করুন</button>
                   </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-400 uppercase text-xs">নিবন্ধিত দলসমূহ ({upcomingTeams.length})</h4>
                  <div className="max-h-[400px] overflow-y-auto pr-2 no-scrollbar space-y-3">
                    {upcomingTeams.map(t => (
                      <div key={t.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3"><img src={t.logo} className="w-10 h-10 rounded-lg shadow-sm" /><p className="font-bold">{t.name}</p></div>
                        <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `upcomingTeams/${t.id}`), null); }} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- POST FEED (with Auto Gallery) --- */}
          {activeTab === 'feed' && (
            <div className="space-y-8">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-dashed border-slate-300">
                <h4 className="font-bold text-xl mb-4">নতুন পোস্ট করুন</h4>
                <textarea className="w-full p-5 rounded-2xl mb-4 border outline-none min-h-[140px] focus:ring-4 focus:ring-blue-100" placeholder="মদিনা বাজার সংঘের আজকের আপডেট..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">মিডিয়া লিংক (ছবি/ভিডিও)</label>
                     <input className="w-full p-4 border rounded-xl outline-none" placeholder="ইন্টারনেট থেকে সরাসরি লিংক দিন" value={newPost.mediaUrl} onChange={e => setNewPost({...newPost, mediaUrl: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">মিডিয়া টাইপ</label>
                     <select className="w-full p-4 border rounded-xl bg-white outline-none" value={newPost.mediaType} onChange={e => setNewPost({...newPost, mediaType: e.target.value as any})}>
                       <option value="none">মিডিয়া ছাড়া পোস্ট</option><option value="image">ছবি (অটো গ্যালারিতে যাবে)</option><option value="video">ইউটিউব ভিডিও</option>
                     </select>
                   </div>
                </div>
                <button disabled={isSaving} onClick={handlePostSubmit} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3">
                  <i className="fas fa-paper-plane"></i> {isSaving ? 'পোস্ট হচ্ছে...' : 'পাবলিশ করুন'}
                </button>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">পুরনো পোস্টসমূহ ({posts.length})</h4>
                {posts.map(p => (
                  <div key={p.id} className="bg-white p-5 border rounded-2xl flex justify-between items-center shadow-sm">
                    <div className="flex gap-4 items-center overflow-hidden">
                      {p.mediaType === 'image' && <img src={p.mediaUrl} className="w-12 h-12 rounded-lg object-cover" />}
                      <p className="truncate font-bold text-slate-700">{p.content}</p>
                    </div>
                    <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `posts/${p.id}`), null); }} className="text-red-400 hover:bg-red-50 p-3 rounded-xl"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SITE SETTINGS & ABOUT STATS --- */}
          {activeTab === 'site_settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                    <h4 className="font-bold text-xl mb-6 flex items-center gap-2 text-purple-600"><i className="fas fa-info-circle"></i> এবাউট ও অর্জন এডিটর</h4>
                    <div className="space-y-4">
                      <textarea className="w-full p-4 border rounded-xl h-32" placeholder="সংগঠনের সংক্ষিপ্ত বর্ণনা" value={localAbout.description} onChange={e => setLocalAbout({...localAbout, description: e.target.value})} />
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <p className="font-bold text-sm">অর্জিত সাফল্যসমূহ (Stats)</p>
                          <button onClick={() => setLocalAbout({...localAbout, stats: [...(localAbout.stats || []), {label:'', count:''}]})} className="text-blue-600 text-xs font-bold"><i className="fas fa-plus mr-1"></i> নতুন স্ট্যাটাস</button>
                        </div>
                        <div className="space-y-3">
                          {(localAbout.stats || []).map((s, idx) => (
                            <div key={idx} className="flex gap-2 bg-white p-3 rounded-xl border border-slate-100 items-center">
                              <input className="flex-1 p-2 border rounded-lg text-xs" placeholder="যেমন: সাফল্যের বছর" value={s.label} onChange={e => { const ns = [...localAbout.stats]; ns[idx].label = e.target.value; setLocalAbout({...localAbout, stats: ns}); }} />
                              <input className="w-20 p-2 border rounded-lg text-xs font-bold" placeholder="যেমন: ১০+" value={s.count} onChange={e => { const ns = [...localAbout.stats]; ns[idx].count = e.target.value; setLocalAbout({...localAbout, stats: ns}); }} />
                              <button onClick={() => setLocalAbout({...localAbout, stats: localAbout.stats.filter((_, i) => i !== idx)})} className="text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button onClick={async () => { setIsSaving(true); await set(ref(db, 'aboutData'), localAbout); setIsSaving(false); showSuccess('এবাউট ডাটা সেভ হয়েছে'); }} className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold mt-4">আপডেট করুন</button>
                    </div>
                  </div>
               </div>
               <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 h-fit">
                  <h4 className="font-bold text-xl mb-6 flex items-center gap-2 text-blue-600"><i className="fas fa-cog"></i> কন্টাক্ট ও ব্যানার সেটিংস</h4>
                  <div className="space-y-4">
                    <input className="w-full p-4 border rounded-xl" placeholder="ব্যানার ছবি (URL)" value={localFooter.heroImageUrl} onChange={e => setLocalFooter({...localFooter, heroImageUrl: e.target.value})} />
                    <textarea className="w-full p-4 border rounded-xl h-20" placeholder="ব্রেকিং নিউজ" value={localFooter.urgentNews} onChange={e => setLocalFooter({...localFooter, urgentNews: e.target.value})} />
                    <input className="w-full p-4 border rounded-xl" placeholder="ঠিকানা" value={localFooter.address} onChange={e => setLocalFooter({...localFooter, address: e.target.value})} />
                    <input className="w-full p-4 border rounded-xl" placeholder="ফোন" value={localFooter.phone} onChange={e => setLocalFooter({...localFooter, phone: e.target.value})} />
                    <input className="w-full p-4 border rounded-xl" placeholder="ইমেইল" value={localFooter.email} onChange={e => setLocalFooter({...localFooter, email: e.target.value})} />
                    <button onClick={async () => { setIsSaving(true); await set(ref(db, 'footerData'), localFooter); setIsSaving(false); showSuccess('সেটিংস আপডেট হয়েছে'); }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">সেভ অল সেটিংস</button>
                  </div>
               </div>
            </div>
          )}

          {/* Remaining Tabs (People, Notices, Gallery, Requests) */}
          {activeTab === 'people' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div id="member-form" className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 h-fit">
                 <h4 className="font-bold text-2xl mb-6">{editingPersonId ? 'তথ্য এডিট' : 'নতুন সদস্য'}</h4>
                 <div className="space-y-4">
                   <input className="w-full p-4 border rounded-2xl outline-none" placeholder="নাম" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} />
                   <input className="w-full p-4 border rounded-2xl outline-none" placeholder="পদবী" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})} />
                   <input className="w-full p-4 border rounded-2xl outline-none" placeholder="ফোন" value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})} />
                   <input className="w-full p-4 border rounded-2xl outline-none" placeholder="ছবি URL" value={newPerson.image} onChange={e => setNewPerson({...newPerson, image: e.target.value})} />
                   <select className="w-full p-4 border rounded-2xl outline-none bg-white" value={newPerson.type} onChange={e => setNewPerson({...newPerson, type: e.target.value as any})}>
                     <option value="member">সাধারণ সদস্য</option><option value="committee">কমিটি মেম্বার</option>
                   </select>
                   <button disabled={isSaving} onClick={async () => {
                      if(!newPerson.name) return; setIsSaving(true);
                      const typePath = newPerson.type === 'member' ? 'members' : 'committee';
                      const id = editingPersonId || push(ref(db, typePath)).key || Date.now().toString();
                      await set(ref(db, `${typePath}/${id}`), { id, ...newPerson, image: newPerson.image || DEFAULT_AVATAR });
                      setEditingPersonId(null); setNewPerson({name:'', role:'', phone:'', image:'', type:'member'});
                      setIsSaving(false); showSuccess('সদস্য তথ্য সেভ হয়েছে');
                   }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl">সেভ করুন</button>
                 </div>
               </div>
               <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 no-scrollbar">
                  {[...committee, ...members].map(m => (
                    <div key={m.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-4">
                        <img src={m.image} className="w-12 h-12 rounded-full object-cover border" alt="" />
                        <div><p className="font-bold">{m.name}</p><p className="text-[10px] text-blue-500 uppercase font-bold">{m.role}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingPersonId(m.id); setNewPerson({ name: m.name, role: m.role, phone: m.phone, image: m.image, type: members.some(mem => mem.id === m.id) ? 'member' : 'committee' }); document.getElementById('member-form')?.scrollIntoView({behavior:'smooth'}); }} className="text-blue-500 p-2"><i className="fas fa-edit"></i></button>
                        <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `${members.some(mem => mem.id === m.id) ? 'members' : 'committee'}/${m.id}`), null); }} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 h-fit">
                  <h4 className="font-bold text-xl mb-6">গ্যালারিতে সরাসরি ছবি যোগ করুন</h4>
                  <div className="space-y-4">
                    <input className="w-full p-4 border rounded-xl" placeholder="ছবির ডিরেক্ট লিংক (URL)" value={newGalleryImg.url} onChange={e => setNewGalleryImg({...newGalleryImg, url: e.target.value})} />
                    <input className="w-full p-4 border rounded-xl" placeholder="ক্যাপশন" value={newGalleryImg.caption} onChange={e => setNewGalleryImg({...newGalleryImg, caption: e.target.value})} />
                    <button onClick={async () => {
                      if(!newGalleryImg.url) return; setIsSaving(true);
                      const newRef = push(ref(db, 'gallery'));
                      await set(newRef, { id: newRef.key, ...newGalleryImg });
                      setNewGalleryImg({url:'', caption:''}); setIsSaving(false); showSuccess('ছবি যোগ হয়েছে');
                    }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">গ্যালারিতে সেভ করুন</button>
                  </div>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                  {gallery.map(img => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm border h-32">
                      <img src={img.url} className="w-full h-full object-cover" alt="" />
                      <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `gallery/${img.id}`), null); }} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><i className="fas fa-trash text-[10px]"></i></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 h-fit">
                 <h4 className="font-bold text-xl mb-6">{editingNoticeId ? 'নোটিশ এডিট' : 'নতুন নোটিশ'}</h4>
                 <div className="space-y-4">
                   <input className="w-full p-4 border rounded-xl" placeholder="শিরোনাম" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                   <textarea className="w-full p-4 border rounded-xl h-32" placeholder="বিস্তারিত বর্ণনা" value={newNotice.description} onChange={e => setNewNotice({...newNotice, description: e.target.value})} />
                   <button onClick={async () => {
                     if(!newNotice.title) return; setIsSaving(true);
                     const id = editingNoticeId || push(ref(db, 'notices')).key;
                     await set(ref(db, `notices/${id}`), { id, ...newNotice, date: new Date().toLocaleDateString('bn-BD') });
                     setEditingNoticeId(null); setNewNotice({title:'', description:'', videoUrl:''});
                     setIsSaving(false); showSuccess('নোটিশ পাবলিশ হয়েছে');
                   }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">সেভ করুন</button>
                 </div>
               </div>
               <div className="space-y-3">
                 {notices.map(n => (
                   <div key={n.id} className="p-4 bg-white border rounded-xl flex justify-between items-center shadow-sm">
                     <p className="font-bold truncate max-w-xs">{n.title}</p>
                     <div className="flex gap-2">
                       <button onClick={() => { setEditingNoticeId(n.id); setNewNotice({title:n.title, description:n.description, videoUrl:n.videoUrl||''}); }} className="text-blue-500"><i className="fas fa-edit"></i></button>
                       <button onClick={async () => await set(ref(db, `notices/${n.id}`), null)} className="text-red-400"><i className="fas fa-trash"></i></button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
          
          {activeTab === 'requests' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {users.filter(u => u.status === 'pending').map(user => (
                 <div key={user.id} className="bg-slate-50 p-6 rounded-3xl border flex flex-col justify-between shadow-sm">
                   <div><h4 className="font-bold text-xl">{user.name}</h4><p className="text-sm text-slate-500 mt-1 mb-6">{user.phone}</p></div>
                   <div className="flex gap-3">
                     <button onClick={async () => {
                       setIsSaving(true); const memberId = push(ref(db, 'members')).key || user.id;
                       const updates: any = {}; updates[`users/${user.id}/status`] = 'approved';
                       updates[`members/${memberId}`] = { id: memberId, name: user.name, phone: user.phone, role: 'সদস্য', image: DEFAULT_AVATAR };
                       await update(ref(db), updates); setIsSaving(false); showSuccess('অনুমোদিত হয়েছে');
                     }} className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-bold">অনুমোদন</button>
                     <button onClick={async () => await set(ref(db, `users/${user.id}`), null)} className="px-5 bg-white border py-3 rounded-2xl text-slate-400 font-bold hover:text-red-500 transition-all">বাতিল</button>
                   </div>
                 </div>
               ))}
               {users.filter(u => u.status === 'pending').length === 0 && <div className="col-span-2 text-center py-20 text-slate-400 font-bold italic">নতুন কোনো আবেদন নেই।</div>}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
