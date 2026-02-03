
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
  const [localCricketStats, setLocalCricketStats] = useState<TournamentStats>(cricketStats);
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

  const handleRejectUser = async (userId: string) => {
    if (!window.confirm('আবেদনটি বাতিল করবেন?')) return;
    setIsSaving(true);
    try {
      await set(ref(db, `users/${userId}`), null);
      showSuccess('আবেদন মুছে ফেলা হয়েছে');
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
          {activeTab === 'requests' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-black text-2xl text-slate-800">নতুন মেম্বারশিপ আবেদন</h4>
                <p className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black">{users.filter(u => u.status === 'pending').length}টি আবেদন পেন্ডিং</p>
              </div>
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
                        <button onClick={() => handleApproveUser(user)} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-black text-xs hover:bg-green-700 transition-all shadow-md">অনুমোদন দিন</button>
                        <button onClick={() => handleRejectUser(user.id)} className="px-4 bg-white text-red-500 border border-red-200 py-2.5 rounded-xl font-black text-xs">বাতিল</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'site_settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-inner">
                    <h4 className="font-black text-xl text-slate-800 mb-8"><i className="fas fa-image mr-3 text-blue-500"></i>ব্র্যান্ডিং ও লগো</h4>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase">ওয়েবসাইট লগো ইউআরএল</label>
                        <input className="w-full p-4 border rounded-xl" placeholder="https://example.com/logo.png" value={localFooter.logoUrl} onChange={e => setLocalFooter({...localFooter, logoUrl: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase">ব্যানার ইমেজ ইউআরএল (Hero Image)</label>
                        <input className="w-full p-4 border rounded-xl" placeholder="https://example.com/hero.jpg" value={localFooter.heroImageUrl} onChange={e => setLocalFooter({...localFooter, heroImageUrl: e.target.value})} />
                      </div>
                      <button onClick={async () => { setIsSaving(true); await set(ref(db, 'footerData'), localFooter); setIsSaving(false); showSuccess('সেটিংস সেভ হয়েছে'); }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl mt-4">সেভ অল সেটিংস</button>
                    </div>
                  </div>
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
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="w-full p-4 border rounded-xl" placeholder="সদস্যের নাম" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} />
                    <input className="w-full p-4 border rounded-xl" placeholder="পদবী" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})} />
                   </div>
                   <input className="w-full p-4 border rounded-xl" placeholder="ফোন নম্বর" value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})} />
                   <input className="w-full p-4 border rounded-xl" placeholder="ছবির ইউআরএল (লিংক)" value={newPerson.image} onChange={e => setNewPerson({...newPerson, image: e.target.value})} />
                   <select className="w-full p-4 border rounded-xl bg-white" value={newPerson.type} onChange={e => setNewPerson({...newPerson, type: e.target.value as any})}>
                      <option value="member">সাধারণ সদস্য</option><option value="committee">কমিটি মেম্বার</option>
                   </select>
                   <div className="flex gap-4 pt-4">
                     <button disabled={isSaving} onClick={async () => {
                        if(!newPerson.name) return; setIsSaving(true);
                        const typePath = newPerson.type === 'member' ? 'members' : 'committee';
                        const id = editingPersonId || push(ref(db, typePath)).key || Date.now().toString();
                        await set(ref(db, `${typePath}/${id}`), { id, ...newPerson, image: newPerson.image || DEFAULT_AVATAR });
                        setEditingPersonId(null); setNewPerson({name:'', role:'', phone:'', image:'', type:'member'});
                        setIsSaving(false); showSuccess('সদস্য তথ্য সেভ হয়েছে');
                     }} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl">সেভ মেম্বার</button>
                     {editingPersonId && <button onClick={() => { setEditingPersonId(null); setNewPerson({name:'', role:'', phone:'', image:'', type:'member'}); }} className="px-6 bg-white border rounded-2xl font-bold">বাতিল</button>}
                   </div>
                 </div>
               </div>
               <div className="space-y-4">
                  <div className="max-h-[600px] overflow-y-auto no-scrollbar space-y-3">
                    {[...committee, ...members].map(m => (
                      <div key={m.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-4">
                          <img src={m.image} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-50" />
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
