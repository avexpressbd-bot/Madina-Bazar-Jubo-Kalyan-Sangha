
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

  // --- Local States ---
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

  useEffect(() => {
    if (cricketStats) setLocalCricketStats(cricketStats);
    if (footerData) setLocalFooter(footerData);
    if (aboutData) setLocalAbout(aboutData);
  }, [cricketStats, footerData, aboutData]);

  // --- Handlers ---
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
      if (!editingPostId && newPost.mediaType === 'image' && newPost.mediaUrl) {
        const gRef = push(ref(db, 'gallery'));
        await set(gRef, { id: gRef.key, url: newPost.mediaUrl, caption: newPost.content.substring(0, 30) });
      }
      setNewPost({content:'', mediaUrl:'', mediaType:'none'}); setEditingPostId(null);
      showSuccess(editingPostId ? 'পোস্ট আপডেট হয়েছে' : 'পাবলিশ হয়েছে');
    } catch (e: any) { alert(e.message); } finally { setIsSaving(false); }
  };

  const startEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setNewPost({
      content: post.content,
      mediaUrl: post.mediaUrl || '',
      mediaType: post.mediaType
    });
    window.scrollTo({ top: 100, behavior: 'smooth' });
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
          {/* Site Settings Tab */}
          {activeTab === 'site_settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-inner">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center"><i className="fas fa-info-circle text-xl"></i></div>
                       <h4 className="font-black text-2xl text-slate-800">এবাউট সেকশন এডিটর</h4>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">সংগঠনের মূল বর্ণনা</label>
                        <textarea className="w-full p-5 border rounded-2xl h-40 outline-none focus:ring-4 focus:ring-purple-100 transition-all text-sm leading-relaxed" placeholder="আমাদের সংঘের গৌরবোজ্জ্বল ইতিহাস লিখুন..." value={localAbout.description} onChange={e => setLocalAbout({...localAbout, description: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">লক্ষ্য (Mission)</label>
                          <textarea className="w-full p-4 border rounded-xl h-24 outline-none focus:ring-4 focus:ring-purple-100 text-xs" value={localAbout.mission} onChange={e => setLocalAbout({...localAbout, mission: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">উদ্দেশ্য (Vision)</label>
                          <textarea className="w-full p-4 border rounded-xl h-24 outline-none focus:ring-4 focus:ring-purple-100 text-xs" value={localAbout.vision} onChange={e => setLocalAbout({...localAbout, vision: e.target.value})} />
                        </div>
                      </div>
                      <div className="pt-6 border-t border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                          <p className="font-black text-xs uppercase tracking-widest text-slate-500">সাফল্যের পরিসংখ্যান (Stats)</p>
                          <button onClick={() => setLocalAbout({...localAbout, stats: [...(localAbout.stats || []), {label:'', count:''}]})} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-100 transition-all"><i className="fas fa-plus mr-1"></i> নতুন স্ট্যাট</button>
                        </div>
                        <div className="space-y-3">
                          {(localAbout.stats || []).map((s, idx) => (
                            <div key={idx} className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200 items-center shadow-sm">
                              <input className="flex-1 p-2 border-b-2 border-transparent focus:border-purple-300 outline-none text-xs font-bold" placeholder="লেবেল (উদা: মেম্বার)" value={s.label} onChange={e => { const ns = [...localAbout.stats]; ns[idx].label = e.target.value; setLocalAbout({...localAbout, stats: ns}); }} />
                              <input className="w-24 p-2 border-b-2 border-transparent focus:border-purple-300 outline-none text-xs font-black text-purple-600" placeholder="সংখ্যা (উদা: ৫০০+)" value={s.count} onChange={e => { const ns = [...localAbout.stats]; ns[idx].count = e.target.value; setLocalAbout({...localAbout, stats: ns}); }} />
                              <button onClick={() => setLocalAbout({...localAbout, stats: localAbout.stats.filter((_, i) => i !== idx)})} className="text-red-400 p-2 hover:bg-red-50 rounded-xl"><i className="fas fa-trash-alt"></i></button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button disabled={isSaving} onClick={async () => { setIsSaving(true); await set(ref(db, 'aboutData'), localAbout); setIsSaving(false); showSuccess('এবাউট তথ্য আপডেট হয়েছে'); }} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl transition-all transform hover:-translate-y-1 active:scale-95">আপডেট এবাউট ডাটা</button>
                    </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 h-fit shadow-inner">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><i className="fas fa-globe text-xl"></i></div>
                       <h4 className="font-black text-2xl text-slate-800">কন্টাক্ট ও সোশ্যাল লিঙ্ক</h4>
                    </div>
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">ওয়েবসাইট লগো (URL)</label>
                        <input className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100" placeholder="লগো ছবির লিঙ্ক..." value={localFooter.logoUrl || ''} onChange={e => setLocalFooter({...localFooter, logoUrl: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">ব্যানার ইমেজ (Home Hero)</label>
                        <input className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100" placeholder="ব্যানার লিঙ্ক..." value={localFooter.heroImageUrl} onChange={e => setLocalFooter({...localFooter, heroImageUrl: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">ব্রেকিং নিউজ</label>
                        <textarea className="w-full p-4 border rounded-xl h-24 outline-none focus:ring-2 focus:ring-blue-100 text-sm" value={localFooter.urgentNews} onChange={e => setLocalFooter({...localFooter, urgentNews: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">ঠিকানা</label>
                          <input className="w-full p-4 border rounded-xl" value={localFooter.address} onChange={e => setLocalFooter({...localFooter, address: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">ফোন</label>
                          <input className="w-full p-4 border rounded-xl" value={localFooter.phone} onChange={e => setLocalFooter({...localFooter, phone: e.target.value})} />
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-slate-200 space-y-4">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">সোশ্যাল মিডিয়া প্রোফাইল লিঙ্ক</p>
                        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200">
                           <i className="fab fa-facebook-square text-2xl text-blue-600"></i>
                           <input className="flex-1 text-xs outline-none" placeholder="ফেসবুক পেজ লিঙ্ক..." value={localFooter.facebook} onChange={e => setLocalFooter({...localFooter, facebook: e.target.value})} />
                        </div>
                        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200">
                           <i className="fab fa-youtube text-2xl text-red-600"></i>
                           <input className="flex-1 text-xs outline-none" placeholder="ইউটিউব চ্যানেল লিঙ্ক..." value={localFooter.youtube} onChange={e => setLocalFooter({...localFooter, youtube: e.target.value})} />
                        </div>
                        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200">
                           <i className="fab fa-instagram text-2xl text-pink-500"></i>
                           <input className="flex-1 text-xs outline-none" placeholder="ইনস্টাগ্রাম প্রোফাইল লিঙ্ক..." value={localFooter.instagram} onChange={e => setLocalFooter({...localFooter, instagram: e.target.value})} />
                        </div>
                      </div>
                      <button onClick={async () => { setIsSaving(true); await set(ref(db, 'footerData'), localFooter); setIsSaving(false); showSuccess('সেটিংস সেভ হয়েছে'); }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl mt-4 hover:bg-black transition-all">সেভ অল সেটিংস</button>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* Other tabs kept as is */}
          {activeTab === 'feed' && (
            <div className="space-y-10">
              <div className={`p-8 rounded-[2.5rem] border-2 transition-all shadow-xl ${editingPostId ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-dashed border-slate-300'}`}>
                <h4 className="font-black text-2xl mb-6 flex items-center gap-3">
                  {editingPostId ? <><i className="fas fa-edit text-blue-600"></i> পোস্ট এডিট করুন</> : <><i className="fas fa-pen-nib text-blue-600"></i> নতুন পোস্ট</>}
                </h4>
                <textarea className="w-full p-6 rounded-3xl mb-6 border-0 outline-none min-h-[160px] focus:ring-4 focus:ring-blue-100 shadow-inner text-lg leading-relaxed" placeholder="সংঘের নতুন আপডেট শেয়ার করুন..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">মিডিয়া লিঙ্ক (Direct URL)</label>
                     <input className="w-full p-4 border rounded-2xl outline-none" placeholder="যেমন: https://image.com/img.jpg" value={newPost.mediaUrl} onChange={e => setNewPost({...newPost, mediaUrl: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">মিডিয়া টাইপ</label>
                     <select className="w-full p-4 border rounded-2xl bg-white outline-none cursor-pointer" value={newPost.mediaType} onChange={e => setNewPost({...newPost, mediaType: e.target.value as any})}>
                       <option value="none">শুধু টেক্সট</option><option value="image">ছবি (গ্যালারিতেও যাবে)</option><option value="video">ভিডিও (Youtube Link)</option>
                     </select>
                   </div>
                </div>
                <div className="flex gap-4">
                  <button disabled={isSaving} onClick={handlePostSubmit} className={`flex-1 py-5 rounded-2xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 ${editingPostId ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'}`}>
                    <i className={editingPostId ? "fas fa-cloud-upload-alt" : "fas fa-paper-plane"}></i> {isSaving ? 'প্রসেসিং...' : (editingPostId ? 'আপডেট পোস্ট' : 'পাবলিশ পোস্ট')}
                  </button>
                  {editingPostId && (
                    <button onClick={() => { setEditingPostId(null); setNewPost({content:'', mediaUrl:'', mediaType:'none'}); }} className="px-10 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl font-black hover:bg-slate-100 transition-all">বাতিল</button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-2">আর্কাইভড পোস্টসমূহ ({posts.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map(p => (
                    <div key={p.id} className="bg-white p-6 border rounded-[2rem] flex justify-between items-center shadow-md hover:shadow-xl transition-all border-slate-100">
                      <div className="flex gap-5 items-center overflow-hidden">
                        <div className="w-16 h-16 shrink-0 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border-2 border-slate-100 shadow-inner">
                          {p.mediaType === 'image' ? <img src={p.mediaUrl} className="w-full h-full object-cover" /> : <i className="fas fa-newspaper text-white text-xl"></i>}
                        </div>
                        <div className="truncate">
                          <p className="truncate font-black text-slate-800 text-lg leading-tight">{p.content}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase"><i className="far fa-calendar-alt mr-1"></i> {p.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                        <button onClick={() => startEditPost(p)} className="bg-blue-50 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-all"><i className="fas fa-edit"></i></button>
                        <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `posts/${p.id}`), null); }} className="bg-red-50 text-red-500 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className={`p-8 rounded-[2.5rem] border-2 h-fit transition-all shadow-xl ${editingNoticeId ? 'bg-orange-50 border-orange-300' : 'bg-slate-50 border-slate-200'}`}>
                 <h4 className="font-black text-2xl mb-8 flex items-center gap-3">
                   {editingNoticeId ? <><i className="fas fa-edit text-orange-600"></i> নোটিশ এডিট</> : <><i className="fas fa-bullhorn text-blue-600"></i> নতুন নোটিশ</>}
                 </h4>
                 <div className="space-y-5">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase ml-1">নোটিশের শিরোনাম</label>
                     <input className="w-full p-4 border rounded-2xl outline-none focus:ring-4 focus:ring-orange-100 transition-all" placeholder="যেমন: জরুরী সভা সংক্রান্ত..." value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase ml-1">বিস্তারিত বর্ণনা</label>
                     <textarea className="w-full p-5 border rounded-2xl h-44 outline-none focus:ring-4 focus:ring-orange-100 transition-all text-sm leading-relaxed" placeholder="নোটিশের বিস্তারিত এখানে লিখুন..." value={newNotice.description} onChange={e => setNewNotice({...newNotice, description: e.target.value})} />
                   </div>
                   <div className="flex gap-4 pt-4">
                     <button onClick={async () => {
                       if(!newNotice.title) return; setIsSaving(true);
                       const id = editingNoticeId || push(ref(db, 'notices')).key;
                       await set(ref(db, `notices/${id}`), { 
                         id, 
                         ...newNotice, 
                         date: editingNoticeId ? notices.find(n => n.id === editingNoticeId)?.date : new Date().toLocaleDateString('bn-BD') 
                       });
                       setEditingNoticeId(null); setNewNotice({title:'', description:'', videoUrl:''});
                       setIsSaving(false); showSuccess(editingNoticeId ? 'নোটিশ আপডেট হয়েছে' : 'পাবলিশ হয়েছে');
                     }} className={`flex-1 py-5 rounded-2xl font-black text-lg shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 ${editingNoticeId ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'}`}>
                       {editingNoticeId ? 'আপডেট নোটিশ' : 'পাবলিশ নোটিশ'}
                     </button>
                     {editingNoticeId && (
                       <button onClick={() => { setEditingNoticeId(null); setNewNotice({title:'', description:'', videoUrl:''}); }} className="px-8 bg-white border-2 border-slate-200 rounded-2xl font-black">বাতিল</button>
                     )}
                   </div>
                 </div>
               </div>
               <div className="space-y-4">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">চলতি নোটিশসমূহ ({notices.length})</h4>
                 <div className="space-y-3">
                   {notices.map(n => (
                     <div key={n.id} className="p-5 bg-white border rounded-2xl flex justify-between items-center shadow-md hover:border-blue-400 transition-all border-slate-100 group">
                       <div className="truncate pr-4">
                          <p className="font-black text-slate-800 truncate text-lg">{n.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1"><i className="far fa-clock mr-1"></i> {n.date}</p>
                       </div>
                       <div className="flex gap-2">
                         <button onClick={() => { setEditingNoticeId(n.id); setNewNotice({title:n.title, description:n.description, videoUrl:n.videoUrl||''}); }} className="bg-blue-50 text-blue-500 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><i className="fas fa-edit"></i></button>
                         <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `notices/${n.id}`), null); }} className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-trash"></i></button>
                       </div>
                     </div>
                   ))}
                   {notices.length === 0 && <p className="text-center py-20 italic text-slate-300 font-bold">কোনো নোটিশ নেই</p>}
                 </div>
               </div>
            </div>
          )}
          
          {activeTab === 'people' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 h-fit shadow-inner">
                 <h4 className="font-black text-2xl mb-8 flex items-center gap-3">
                    <i className="fas fa-user-plus text-blue-600"></i> {editingPersonId ? 'সদস্য তথ্য এডিট' : 'নতুন সদস্য'}
                 </h4>
                 <div className="space-y-5">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="w-full p-4 border rounded-xl outline-none" placeholder="সদস্যের নাম" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} />
                    <input className="w-full p-4 border rounded-xl outline-none" placeholder="পদবী (যেমন: সভাপতি)" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})} />
                   </div>
                   <input className="w-full p-4 border rounded-xl outline-none" placeholder="ফোন নম্বর" value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})} />
                   <input className="w-full p-4 border rounded-xl outline-none" placeholder="ছবির ডিরেক্ট লিঙ্ক (URL)" value={newPerson.image} onChange={e => setNewPerson({...newPerson, image: e.target.value})} />
                   <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">সদস্যের ক্যাটাগরি</label>
                    <select className="w-full p-4 border rounded-xl outline-none bg-white cursor-pointer" value={newPerson.type} onChange={e => setNewPerson({...newPerson, type: e.target.value as any})}>
                      <option value="member">সাধারণ সদস্য</option><option value="committee">কমিটি মেম্বার</option>
                    </select>
                   </div>
                   <div className="flex gap-4 pt-4">
                     <button disabled={isSaving} onClick={async () => {
                        if(!newPerson.name) return; setIsSaving(true);
                        const typePath = newPerson.type === 'member' ? 'members' : 'committee';
                        const id = editingPersonId || push(ref(db, typePath)).key || Date.now().toString();
                        await set(ref(db, `${typePath}/${id}`), { id, ...newPerson, image: newPerson.image || DEFAULT_AVATAR });
                        setEditingPersonId(null); setNewPerson({name:'', role:'', phone:'', image:'', type:'member'});
                        setIsSaving(false); showSuccess('সদস্য তথ্য সেভ হয়েছে');
                     }} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl transform hover:-translate-y-1 transition-all">সেভ মেম্বার</button>
                     {editingPersonId && <button onClick={() => { setEditingPersonId(null); setNewPerson({name:'', role:'', phone:'', image:'', type:'member'}); }} className="px-6 bg-white border rounded-2xl font-bold">বাতিল</button>}
                   </div>
                 </div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">চলতি সদস্য তালিকা</h4>
                  <div className="max-h-[600px] overflow-y-auto pr-2 no-scrollbar space-y-3">
                    {[...committee, ...members].map(m => (
                      <div key={m.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-md border-slate-100 hover:border-blue-300 transition-all">
                        <div className="flex items-center gap-4">
                          <img src={m.image} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-50 shadow-sm" alt="" />
                          <div>
                            <p className="font-black text-slate-800 text-lg leading-tight">{m.name}</p>
                            <p className="text-[10px] text-blue-600 uppercase font-black tracking-widest mt-1">{m.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingPersonId(m.id); setNewPerson({ name: m.name, role: m.role, phone: m.phone, image: m.image, type: members.some(mem => mem.id === m.id) ? 'member' : 'committee' }); }} className="text-blue-500 hover:bg-blue-50 p-3 rounded-xl transition-all"><i className="fas fa-edit"></i></button>
                          <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `${members.some(mem => mem.id === m.id) ? 'members' : 'committee'}/${m.id}`), null); }} className="text-red-400 hover:bg-red-50 p-3 rounded-xl transition-all"><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    ))}
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
