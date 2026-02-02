
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

  // --- People Management ---
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [newPerson, setNewPerson] = useState({ name: '', role: '', phone: '', image: '', type: 'member' });

  // --- Post Management ---
  const [newPost, setNewPost] = useState({ content: '', mediaUrl: '', mediaType: 'none' as any });

  // --- Notice Management ---
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [newNotice, setNewNotice] = useState({ title: '', description: '', videoUrl: '' });

  // --- Gallery ---
  const [newGalleryImg, setNewGalleryImg] = useState({ url: '', caption: '' });

  // --- Cricket Hub ---
  const [localCricketStats, setLocalCricketStats] = useState<TournamentStats>(cricketStats);
  useEffect(() => { setLocalCricketStats(cricketStats); }, [cricketStats]);
  const [newTeam, setNewTeam] = useState({ name: '', logo: '', playersCount: '0' });

  // --- Site Settings & About ---
  const [localFooter, setLocalFooter] = useState<FooterData>(footerData);
  const [localAbout, setLocalAbout] = useState<AboutData>(aboutData);
  useEffect(() => { setLocalFooter(footerData); setLocalAbout(aboutData); }, [footerData, aboutData]);

  const handlePersonSubmit = async () => {
    if(!newPerson.name) return alert('নাম লিখুন');
    setIsSaving(true);
    try {
      const typePath = newPerson.type === 'member' ? 'members' : 'committee';
      const id = editingPersonId || push(ref(db, typePath)).key || Date.now().toString();
      if (editingPersonId) {
        const wasMember = members.some(m => m.id === editingPersonId);
        if (wasMember && newPerson.type === 'committee') await set(ref(db, `members/${editingPersonId}`), null);
        else if (!wasMember && newPerson.type === 'member') await set(ref(db, `committee/${editingPersonId}`), null);
      }
      await set(ref(db, `${typePath}/${id}`), { id, ...newPerson, image: newPerson.image || DEFAULT_AVATAR });
      setEditingPersonId(null);
      setNewPerson({ name: '', role: '', phone: '', image: '', type: 'member' });
      showSuccess('সদস্য তথ্য আপডেট হয়েছে');
    } catch (e: any) { alert(e.message); } finally { setIsSaving(false); }
  };

  const handleNoticeSubmit = async () => {
    if(!newNotice.title) return alert('শিরোনাম দিন');
    setIsSaving(true);
    try {
      const id = editingNoticeId || push(ref(db, 'notices')).key || Date.now().toString();
      await set(ref(db, `notices/${id}`), {
        id, ...newNotice, date: new Date().toLocaleDateString('bn-BD')
      });
      setEditingNoticeId(null);
      setNewNotice({ title: '', description: '', videoUrl: '' });
      showSuccess('নোটিশ পাবলিশ হয়েছে');
    } catch (e: any) { alert(e.message); } finally { setIsSaving(false); }
  };

  const addAboutStat = () => {
    setLocalAbout({
      ...localAbout,
      stats: [...(localAbout.stats || []), { label: '', count: '' }]
    });
  };

  const updateAboutStat = (index: number, field: 'label' | 'count', value: string) => {
    const newStats = [...localAbout.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setLocalAbout({ ...localAbout, stats: newStats });
  };

  const removeAboutStat = (index: number) => {
    setLocalAbout({
      ...localAbout,
      stats: localAbout.stats.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {saveStatus && (
        <div className="fixed top-24 right-4 z-[100] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce flex items-center gap-3 border-2 border-green-400">
          <i className="fas fa-check-circle text-xl"></i>
          <span className="font-bold text-lg">{saveStatus}</span>
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
          {/* --- PEOPLE MANAGEMENT --- */}
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
                   <button disabled={isSaving} onClick={handlePersonSubmit} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl">সেভ করুন</button>
                   {editingPersonId && <button onClick={() => { setEditingPersonId(null); setNewPerson({name:'', role:'', phone:'', image:'', type:'member'}); }} className="w-full bg-slate-200 text-slate-600 py-3 rounded-2xl mt-2">বাতিল</button>}
                 </div>
               </div>
               <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 no-scrollbar">
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

          {/* --- NOTICE BOARD --- */}
          {activeTab === 'notices' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div id="notice-form" className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 h-fit">
                 <h4 className="font-bold text-2xl mb-6">{editingNoticeId ? 'নোটিশ এডিট' : 'নতুন নোটিশ'}</h4>
                 <div className="space-y-4">
                   <input className="w-full p-4 border rounded-2xl" placeholder="নোটিশের শিরোনাম" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                   <textarea className="w-full p-4 border rounded-2xl h-40" placeholder="বিস্তারিত লিখুন..." value={newNotice.description} onChange={e => setNewNotice({...newNotice, description: e.target.value})} />
                   <input className="w-full p-4 border rounded-2xl" placeholder="ইউটিউব ভিডিও লিংক (ঐচ্ছিক)" value={newNotice.videoUrl} onChange={e => setNewNotice({...newNotice, videoUrl: e.target.value})} />
                   <button onClick={handleNoticeSubmit} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl">নোটিশ পাবলিশ করুন</button>
                   {editingNoticeId && <button onClick={() => { setEditingNoticeId(null); setNewNotice({title:'', description:'', videoUrl:''}); }} className="w-full bg-slate-200 py-3 rounded-2xl mt-2">বাতিল</button>}
                 </div>
               </div>
               <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 no-scrollbar">
                  {notices.map(n => (
                    <div key={n.id} className="p-5 bg-white border rounded-2xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-lg text-slate-800">{n.title}</h5>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingNoticeId(n.id); setNewNotice({title: n.title, description: n.description, videoUrl: n.videoUrl || ''}); document.getElementById('notice-form')?.scrollIntoView({behavior:'smooth'}); }} className="text-blue-500"><i className="fas fa-edit"></i></button>
                          <button onClick={async () => { if(window.confirm('ডিলিট?')) await set(ref(db, `notices/${n.id}`), null); }} className="text-red-400"><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 truncate">{n.description}</p>
                      <p className="text-[10px] text-slate-400 mt-3">{n.date}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* --- SITE SETTINGS & ABOUT MANAGEMENT --- */}
          {activeTab === 'site_settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="bg-slate-50 p-8 rounded-[2rem] border">
                    <h4 className="font-bold text-xl mb-6 flex items-center gap-2"><i className="fas fa-info-circle text-purple-500"></i> এবাউট আস (About Us)</h4>
                    <div className="space-y-4">
                      <div><label className="text-xs font-bold block mb-1">বিস্তারিত বর্ণনা</label><textarea className="w-full p-3 border rounded-xl h-32" value={localAbout.description} onChange={e => setLocalAbout({...localAbout, description: e.target.value})} /></div>
                      <div><label className="text-xs font-bold block mb-1">আমাদের লক্ষ্য (Mission)</label><input className="w-full p-3 border rounded-xl" value={localAbout.mission} onChange={e => setLocalAbout({...localAbout, mission: e.target.value})} /></div>
                      <div><label className="text-xs font-bold block mb-1">আমাদের উদ্দেশ্য (Vision)</label><input className="w-full p-3 border rounded-xl" value={localAbout.vision} onChange={e => setLocalAbout({...localAbout, vision: e.target.value})} /></div>
                      
                      <div className="pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-sm font-bold">অর্জিত সাফল্যসমূহ (Stats)</label>
                          <button onClick={addAboutStat} className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:underline"><i className="fas fa-plus"></i> নতুন স্ট্যাটাস</button>
                        </div>
                        <div className="space-y-3">
                          {localAbout.stats.map((stat, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-white p-3 rounded-xl border">
                              <input className="flex-1 p-2 border rounded-lg text-xs" placeholder="যেমন: সাফল্যের বছর" value={stat.label} onChange={e => updateAboutStat(idx, 'label', e.target.value)} />
                              <input className="w-24 p-2 border rounded-lg text-xs font-bold" placeholder="যেমন: ১০+" value={stat.count} onChange={e => updateAboutStat(idx, 'count', e.target.value)} />
                              <button onClick={() => removeAboutStat(idx)} className="text-red-400 hover:text-red-600"><i className="fas fa-times-circle"></i></button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button onClick={async () => { setIsSaving(true); await set(ref(db, 'aboutData'), localAbout); setIsSaving(false); showSuccess('এবাউট ডাটা আপডেট হয়েছে'); }} className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold shadow-lg mt-4">এবাউট আপডেট করুন</button>
                    </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-slate-50 p-8 rounded-[2rem] border">
                    <h4 className="font-bold text-xl mb-6 flex items-center gap-2"><i className="fas fa-home text-blue-500"></i> হোমপেজ ও কন্টাক্ট সেটিংস</h4>
                    <div className="space-y-4">
                      <div><label className="text-xs font-bold block mb-1">ব্যানার ছবি (URL)</label><input className="w-full p-3 border rounded-xl" value={localFooter.heroImageUrl} onChange={e => setLocalFooter({...localFooter, heroImageUrl: e.target.value})} /></div>
                      <div><label className="text-xs font-bold block mb-1">ব্রেকিং নিউজ</label><textarea className="w-full p-3 border rounded-xl h-20" value={localFooter.urgentNews} onChange={e => setLocalFooter({...localFooter, urgentNews: e.target.value})} /></div>
                      <div><label className="text-xs font-bold block mb-1">ঠিকানা</label><input className="w-full p-3 border rounded-xl" value={localFooter.address} onChange={e => setLocalFooter({...localFooter, address: e.target.value})} /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold block mb-1">ফোন</label><input className="w-full p-3 border rounded-xl" value={localFooter.phone} onChange={e => setLocalFooter({...localFooter, phone: e.target.value})} /></div>
                        <div><label className="text-xs font-bold block mb-1">ইমেইল</label><input className="w-full p-3 border rounded-xl" value={localFooter.email} onChange={e => setLocalFooter({...localFooter, email: e.target.value})} /></div>
                      </div>
                      <button onClick={async () => { setIsSaving(true); await set(ref(db, 'footerData'), localFooter); setIsSaving(false); showSuccess('সেটিংস সেভ হয়েছে'); }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg">সব সেটিংস সেভ করুন</button>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* --- GALLERY, FEED, CRICKET & REQUESTS (Remaining Tabs keep their logic) --- */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="bg-slate-50 p-8 rounded-[2rem] border h-fit">
                  <h4 className="font-bold text-xl mb-6">গ্যালারিতে ছবি যোগ করুন</h4>
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
                    <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm border">
                      <img src={img.url} className="w-full h-32 object-cover" alt="" />
                      <button onClick={async () => { if(window.confirm('ডিলিট?')) await set(ref(db, `gallery/${img.id}`), null); }} className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><i className="fas fa-trash text-[10px]"></i></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Feed and Cricket Tabs remain as they were in the previous version for brevity but are fully functional */}
          {activeTab === 'feed' && (
             <div className="space-y-8">
               <div className="bg-slate-50 p-8 rounded-[2rem] border border-dashed border-slate-300">
                 <textarea className="w-full p-5 rounded-2xl mb-4 border outline-none min-h-[120px]" placeholder="কি পোস্ট করতে চান?" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input className="p-4 border rounded-xl" placeholder="মিডিয়া লিংক (ছবি/ভিডিও)" value={newPost.mediaUrl} onChange={e => setNewPost({...newPost, mediaUrl: e.target.value})} />
                    <select className="p-4 border rounded-xl bg-white" value={newPost.mediaType} onChange={e => setNewPost({...newPost, mediaType: e.target.value as any})}>
                      <option value="none">মিডিয়া ছাড়া</option><option value="image">ছবি</option><option value="video">ভিডিও</option>
                    </select>
                 </div>
                 <button disabled={isSaving} onClick={async () => {
                   if(!newPost.content) return; setIsSaving(true);
                   const newRef = push(ref(db, 'posts'));
                   await set(newRef, { id: newRef.key, ...newPost, date: new Date().toLocaleDateString('bn-BD'), likes: 0 });
                   setNewPost({content:'', mediaUrl:'', mediaType:'none'}); setIsSaving(false); showSuccess('পোস্ট করা হয়েছে');
                 }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">পোস্ট করুন</button>
               </div>
               <div className="space-y-3">
                 {posts.map(p => (
                   <div key={p.id} className="bg-white p-4 border rounded-2xl flex justify-between items-center">
                     <p className="truncate max-w-lg font-bold text-slate-700">{p.content}</p>
                     <button onClick={async () => { if(window.confirm('ডিলিট?')) await set(ref(db, `posts/${p.id}`), null); }} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'cricket' && (
             <div className="space-y-12">
               <div className="bg-slate-50 p-8 rounded-[2rem] border">
                 <h4 className="font-bold text-xl mb-6">টুর্নামেন্ট স্ট্যাটাস ({localCricketStats.year})</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                   <div><label className="text-xs font-bold block mb-1">টুর্নামেন্ট বছর</label><input className="w-full p-3 border rounded-xl" value={localCricketStats.year} onChange={e => setLocalCricketStats({...localCricketStats, year: e.target.value})} /></div>
                   <div><label className="text-xs font-bold block mb-1">চ্যাম্পিয়ন দল</label><input className="w-full p-3 border rounded-xl" value={localCricketStats.winner} onChange={e => setLocalCricketStats({...localCricketStats, winner: e.target.value})} /></div>
                   <div><label className="text-xs font-bold block mb-1">রানার-আপ দল</label><input className="w-full p-3 border rounded-xl" value={localCricketStats.runnerUp} onChange={e => setLocalCricketStats({...localCricketStats, runnerUp: e.target.value})} /></div>
                 </div>
                 <button disabled={isSaving} onClick={async () => { setIsSaving(true); await set(ref(db, 'cricketStats'), localCricketStats); setIsSaving(false); showSuccess('ক্রিকেট হাব আপডেট হয়েছে'); }} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">সব তথ্য সেভ করুন</button>
               </div>
             </div>
          )}

          {activeTab === 'requests' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {users.filter(u => u.status === 'pending').map(user => (
                 <div key={user.id} className="bg-slate-50 p-6 rounded-3xl border flex flex-col justify-between shadow-sm">
                   <div><h4 className="font-bold text-xl">{user.name}</h4><p className="text-sm text-slate-500 mt-1 mb-6">{user.phone} | {user.email}</p></div>
                   <div className="flex gap-3">
                     <button disabled={isSaving} onClick={async () => {
                       setIsSaving(true); const memberId = push(ref(db, 'members')).key || user.id;
                       const updates: any = {}; updates[`users/${user.id}/status`] = 'approved';
                       updates[`members/${memberId}`] = { id: memberId, name: user.name, phone: user.phone, role: 'সদস্য', image: DEFAULT_AVATAR };
                       await update(ref(db), updates); setIsSaving(false); showSuccess('অনুমোদিত হয়েছে');
                     }} className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-bold">অনুমোদন</button>
                     <button disabled={isSaving} onClick={async () => { if(window.confirm('বাতিল?')) await set(ref(db, `users/${user.id}`), null); }} className="px-5 bg-white border py-3 rounded-2xl text-slate-400 font-bold hover:text-red-500">বাতিল</button>
                   </div>
                 </div>
               ))}
               {users.filter(u => u.status === 'pending').length === 0 && <div className="col-span-2 text-center py-20 text-slate-400 font-bold">নতুন কোনো আবেদন নেই।</div>}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
