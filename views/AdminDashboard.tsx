
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
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const [newNotice, setNewNotice] = useState({ title: '', description: '', videoUrl: '' });
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);

  const [newGalleryImg, setNewGalleryImg] = useState({ url: '', caption: '' });
  const [localCricketStats, setLocalCricketStats] = useState<TournamentStats>(cricketStats);
  const [newTeam, setNewTeam] = useState({ name: '', logo: '', captainName: '', captainImage: '', playersCount: '0' });
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

  // --- Post Functions ---
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

      // Auto Gallery only for NEW image posts
      if (!editingPostId && newPost.mediaType === 'image' && newPost.mediaUrl) {
        const galleryRef = push(ref(db, 'gallery'));
        await set(galleryRef, {
          id: galleryRef.key,
          url: newPost.mediaUrl,
          caption: newPost.content.substring(0, 30) + '...'
        });
      }

      setNewPost({content:'', mediaUrl:'', mediaType:'none'});
      setEditingPostId(null);
      showSuccess(editingPostId ? 'পোস্ট আপডেট করা হয়েছে' : 'পোস্ট পাবলিশ করা হয়েছে');
    } catch (e: any) { alert(e.message); } finally { setIsSaving(false); }
  };

  const startEditPost = (post: Post) => {
    setNewPost({ content: post.content, mediaUrl: post.mediaUrl || '', mediaType: post.mediaType });
    setEditingPostId(post.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Cricket Functions ---
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
          {/* --- POST FEED (NOW WITH EDIT) --- */}
          {activeTab === 'feed' && (
            <div className="space-y-8">
              <div className={`p-8 rounded-[2rem] border-2 transition-all ${editingPostId ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-dashed border-slate-300'}`}>
                <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                  {editingPostId ? <><i className="fas fa-edit text-blue-600"></i> পোস্ট এডিট করুন</> : 'নতুন পোস্ট করুন'}
                </h4>
                <textarea className="w-full p-5 rounded-2xl mb-4 border outline-none min-h-[140px] focus:ring-4 focus:ring-blue-100" placeholder="মদিনা বাজার সংঘের আজকের আপডেট..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">মিডিয়া লিংক (ছবি/ভিডিও)</label>
                     <input className="w-full p-4 border rounded-xl outline-none" placeholder="ইন্টারনেট থেকে সরাসরি লিংক দিন" value={newPost.mediaUrl} onChange={e => setNewPost({...newPost, mediaUrl: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">মিডিয়া টাইপ</label>
                     <select className="w-full p-4 border rounded-xl bg-white outline-none" value={newPost.mediaType} onChange={e => setNewPost({...newPost, mediaType: e.target.value as any})}>
                       <option value="none">মিডিয়া ছাড়া পোস্ট</option><option value="image">ছবি</option><option value="video">ইউটিউব ভিডিও</option>
                     </select>
                   </div>
                </div>
                <div className="flex gap-4">
                  <button disabled={isSaving} onClick={handlePostSubmit} className={`flex-1 py-5 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all ${editingPostId ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'}`}>
                    <i className={editingPostId ? "fas fa-sync" : "fas fa-paper-plane"}></i> {isSaving ? 'প্রসেসিং...' : (editingPostId ? 'আপডেট করুন' : 'পাবলিশ করুন')}
                  </button>
                  {editingPostId && (
                    <button onClick={() => { setEditingPostId(null); setNewPost({content:'', mediaUrl:'', mediaType:'none'}); }} className="px-8 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all">বাতিল</button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">পুরনো পোস্টসমূহ ({posts.length})</h4>
                <div className="grid grid-cols-1 gap-4">
                  {posts.map(p => (
                    <div key={p.id} className="bg-white p-5 border rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex gap-4 items-center overflow-hidden">
                        {p.mediaType === 'image' && <img src={p.mediaUrl} className="w-12 h-12 rounded-lg object-cover border" />}
                        {p.mediaType === 'video' && <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-white"><i className="fas fa-play text-[10px]"></i></div>}
                        <div className="truncate">
                          <p className="truncate font-bold text-slate-700">{p.content}</p>
                          <p className="text-[10px] text-slate-400">{p.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                        <button onClick={() => startEditPost(p)} className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-100 transition-all"><i className="fas fa-edit"></i></button>
                        <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `posts/${p.id}`), null); }} className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100 transition-all"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- NOTICE BOARD (ENHANCED EDIT) --- */}
          {activeTab === 'notices' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className={`p-8 rounded-[2rem] border-2 h-fit transition-all ${editingNoticeId ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
                 <h4 className="font-bold text-xl mb-6 flex items-center gap-2">
                   {editingNoticeId ? <><i className="fas fa-bullhorn text-orange-600"></i> নোটিশ এডিট করুন</> : 'নতুন নোটিশ'}
                 </h4>
                 <div className="space-y-4">
                   <input className="w-full p-4 border rounded-xl outline-none" placeholder="শিরোনাম" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                   <textarea className="w-full p-4 border rounded-xl h-32 outline-none" placeholder="বিস্তারিত বর্ণনা" value={newNotice.description} onChange={e => setNewNotice({...newNotice, description: e.target.value})} />
                   <div className="flex gap-4">
                     <button onClick={async () => {
                       if(!newNotice.title) return; setIsSaving(true);
                       const id = editingNoticeId || push(ref(db, 'notices')).key;
                       await set(ref(db, `notices/${id}`), { 
                         id, 
                         ...newNotice, 
                         date: editingNoticeId ? notices.find(n => n.id === editingNoticeId)?.date : new Date().toLocaleDateString('bn-BD') 
                       });
                       setEditingNoticeId(null); setNewNotice({title:'', description:'', videoUrl:''});
                       setIsSaving(false); showSuccess(editingNoticeId ? 'নোটিশ আপডেট হয়েছে' : 'নোটিশ পাবলিশ হয়েছে');
                     }} className={`flex-1 py-4 rounded-xl font-bold shadow-lg transition-all ${editingNoticeId ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'}`}>
                       {editingNoticeId ? 'আপডেট করুন' : 'সেভ করুন'}
                     </button>
                     {editingNoticeId && (
                       <button onClick={() => { setEditingNoticeId(null); setNewNotice({title:'', description:'', videoUrl:''}); }} className="px-6 bg-white border border-slate-200 rounded-xl font-bold">বাতিল</button>
                     )}
                   </div>
                 </div>
               </div>
               <div className="space-y-3">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">চলতি নোটিশসমূহ ({notices.length})</h4>
                 {notices.map(n => (
                   <div key={n.id} className="p-4 bg-white border rounded-xl flex justify-between items-center shadow-sm hover:border-blue-200 transition-all">
                     <div className="truncate pr-4">
                        <p className="font-bold truncate text-slate-800">{n.title}</p>
                        <p className="text-[10px] text-slate-400">{n.date}</p>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => { setEditingNoticeId(n.id); setNewNotice({title:n.title, description:n.description, videoUrl:n.videoUrl||''}); }} className="bg-slate-50 text-blue-500 p-2.5 rounded-lg hover:bg-blue-50 transition-all"><i className="fas fa-edit"></i></button>
                       <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `notices/${n.id}`), null); }} className="bg-slate-50 text-red-400 p-2.5 rounded-lg hover:bg-red-50 transition-all"><i className="fas fa-trash"></i></button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Other Tabs (People, Cricket, site_settings, Requests, Gallery) kept from previous state */}
          {activeTab === 'people' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div id="member-form" className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 h-fit">
                 <h4 className="font-bold text-2xl mb-6">{editingPersonId ? 'সদস্য তথ্য এডিট' : 'নতুন সদস্য'}</h4>
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
                        <button onClick={() => { setEditingPersonId(m.id); setNewPerson({ name: m.name, role: m.role, phone: m.phone, image: m.image, type: members.some(mem => mem.id === m.id) ? 'member' : 'committee' }); }} className="text-blue-500 p-2"><i className="fas fa-edit"></i></button>
                        <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `${members.some(mem => mem.id === m.id) ? 'members' : 'committee'}/${m.id}`), null); }} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'cricket' && (
            <div className="space-y-12">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                <h4 className="font-bold text-2xl mb-8 flex items-center gap-3"><i className="fas fa-trophy text-yellow-600"></i> বিগত টুর্নামেন্ট আর্কাইভ এডিটর</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">টুর্নামেন্ট বছর</label>
                    <input className="w-full p-4 border rounded-2xl" value={localCricketStats.year} onChange={e => setLocalCricketStats({...localCricketStats, year: e.target.value})} />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block">চ্যাম্পিয়ন দল</label>
                      <input className="w-full p-4 border rounded-2xl" placeholder="দলের নাম" value={localCricketStats.winner} onChange={e => setLocalCricketStats({...localCricketStats, winner: e.target.value})} />
                      <input className="w-full p-3 border rounded-xl text-xs" placeholder="দলের লোগো/বড় ছবি URL" value={localCricketStats.winnerImage} onChange={e => setLocalCricketStats({...localCricketStats, winnerImage: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block">রানার-আপ দল</label>
                      <input className="w-full p-4 border rounded-2xl" placeholder="দলের নাম" value={localCricketStats.runnerUp} onChange={e => setLocalCricketStats({...localCricketStats, runnerUp: e.target.value})} />
                      <input className="w-full p-3 border rounded-xl text-xs" placeholder="দলের লোগো/বড় ছবি URL" value={localCricketStats.runnerUpImage} onChange={e => setLocalCricketStats({...localCricketStats, runnerUpImage: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="p-6 bg-white rounded-3xl border border-slate-200">
                    <p className="font-bold mb-4 text-blue-600">টপ স্কোরার তথ্য</p>
                    <div className="space-y-3">
                      <input className="w-full p-3 border rounded-xl" placeholder="নাম" value={localCricketStats.topScorer.name} onChange={e => setLocalCricketStats({...localCricketStats, topScorer: {...localCricketStats.topScorer, name: e.target.value}})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="রান" type="number" value={localCricketStats.topScorer.runs} onChange={e => setLocalCricketStats({...localCricketStats, topScorer: {...localCricketStats.topScorer, runs: parseInt(e.target.value)}})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="ছবির URL" value={localCricketStats.topScorer.image} onChange={e => setLocalCricketStats({...localCricketStats, topScorer: {...localCricketStats.topScorer, image: e.target.value}})} />
                    </div>
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-slate-200">
                    <p className="font-bold mb-4 text-red-600">টপ উইকেট শিকারী তথ্য</p>
                    <div className="space-y-3">
                      <input className="w-full p-3 border rounded-xl" placeholder="নাম" value={localCricketStats.topWicketTaker.name} onChange={e => setLocalCricketStats({...localCricketStats, topWicketTaker: {...localCricketStats.topWicketTaker, name: e.target.value}})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="উইকেট" type="number" value={localCricketStats.topWicketTaker.wickets} onChange={e => setLocalCricketStats({...localCricketStats, topWicketTaker: {...localCricketStats.topWicketTaker, wickets: parseInt(e.target.value)}})} />
                      <input className="w-full p-3 border rounded-xl" placeholder="ছবির URL" value={localCricketStats.topWicketTaker.image} onChange={e => setLocalCricketStats({...localCricketStats, topWicketTaker: {...localCricketStats.topWicketTaker, image: e.target.value}})} />
                    </div>
                  </div>
                </div>
                <button disabled={isSaving} onClick={handleCricketSubmit} className="w-full bg-blue-700 text-white py-5 rounded-2xl font-bold text-lg shadow-xl">আর্কাইভ সেভ করুন</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 h-fit">
                   <h4 className="font-bold text-xl mb-6">নতুন দল ও ক্যাপ্টেন নিবন্ধন</h4>
                   <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                       <input className="w-full p-4 border rounded-2xl outline-none" placeholder="দলের নাম" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} />
                       <input className="w-full p-4 border rounded-2xl outline-none" placeholder="টিম লোগো" value={newTeam.logo} onChange={e => setNewTeam({...newTeam, logo: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <input className="w-full p-4 border rounded-2xl outline-none" placeholder="ক্যাপ্টেনের নাম" value={newTeam.captainName} onChange={e => setNewTeam({...newTeam, captainName: e.target.value})} />
                       <input className="w-full p-4 border rounded-2xl outline-none" placeholder="ক্যাপ্টেনের ছবি" value={newTeam.captainImage} onChange={e => setNewTeam({...newTeam, captainImage: e.target.value})} />
                     </div>
                     <button onClick={async () => {
                       if(!newTeam.name) return; setIsSaving(true);
                       const newRef = push(ref(db, 'upcomingTeams'));
                       await set(newRef, { id: newRef.key, ...newTeam, players: [] });
                       setNewTeam({name:'', logo:'', captainName:'', captainImage:'', playersCount:'0'}); 
                       setIsSaving(false); showSuccess('দল নিবন্ধিত হয়েছে');
                     }} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg">নিবন্ধন করুন</button>
                   </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-400 uppercase text-xs">নিবন্ধিত দলসমূহ ({upcomingTeams.length})</h4>
                  <div className="max-h-[500px] overflow-y-auto pr-2 no-scrollbar space-y-3">
                    {upcomingTeams.map(t => (
                      <div key={t.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3"><img src={t.logo} className="w-10 h-10 rounded-lg shadow-sm" /><p className="font-bold">{t.name}</p></div>
                        <button onClick={async () => await set(ref(db, `upcomingTeams/${t.id}`), null)} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                  </div>
                </div>
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

          {activeTab === 'site_settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                    <h4 className="font-bold text-xl mb-6 flex items-center gap-2 text-purple-600"><i className="fas fa-info-circle"></i> এবাউট এডিটর</h4>
                    <div className="space-y-4">
                      <textarea className="w-full p-4 border rounded-xl h-32" placeholder="সংগঠনের বর্ণনা" value={localAbout.description} onChange={e => setLocalAbout({...localAbout, description: e.target.value})} />
                      <button onClick={async () => { setIsSaving(true); await set(ref(db, 'aboutData'), localAbout); setIsSaving(false); showSuccess('এবাউট ডাটা সেভ হয়েছে'); }} className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold">আপডেট করুন</button>
                    </div>
                  </div>
               </div>
               <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 h-fit">
                  <h4 className="font-bold text-xl mb-6 flex items-center gap-2 text-blue-600"><i className="fas fa-cog"></i> কন্টাক্ট সেটিংস</h4>
                  <div className="space-y-4">
                    <input className="w-full p-4 border rounded-xl" placeholder="ব্যানার ছবি URL" value={localFooter.heroImageUrl} onChange={e => setLocalFooter({...localFooter, heroImageUrl: e.target.value})} />
                    <textarea className="w-full p-4 border rounded-xl h-20" placeholder="ব্রেকিং নিউজ" value={localFooter.urgentNews} onChange={e => setLocalFooter({...localFooter, urgentNews: e.target.value})} />
                    <input className="w-full p-4 border rounded-xl" placeholder="ঠিকানা" value={localFooter.address} onChange={e => setLocalFooter({...localFooter, address: e.target.value})} />
                    <button onClick={async () => { setIsSaving(true); await set(ref(db, 'footerData'), localFooter); setIsSaving(false); showSuccess('সেটিংস আপডেট হয়েছে'); }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">সেভ অল সেটিংস</button>
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
