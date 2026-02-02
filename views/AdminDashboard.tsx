
import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'feed' | 'notices' | 'people' | 'gallery' | 'cricket' | 'site_settings' | 'requests'>('feed');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const [newPost, setNewPost] = useState({ content: '', mediaUrl: '', mediaType: 'none' as any });
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [newPerson, setNewPerson] = useState({ name: '', role: '', phone: '', image: '', type: 'member' });
  const [newGallery, setNewGallery] = useState({ url: '', caption: '' });

  const handleAddPost = async () => {
    if (!newPost.content) return alert('পোস্টের লেখা লিখুন');
    const postsRef = ref(db, 'posts');
    const newPostRef = push(postsRef);
    const post: Post = {
      id: newPostRef.key || Date.now().toString(),
      content: newPost.content,
      mediaUrl: newPost.mediaUrl,
      mediaType: newPost.mediaType,
      date: new Date().toLocaleDateString('bn-BD'),
      likes: 0
    };
    await set(newPostRef, post);
    setNewPost({ content: '', mediaUrl: '', mediaType: 'none' });
    showSuccess('পোস্টটি সফলভাবে সেভ হয়েছে!');
  };

  const handleDeletePost = async (id: string) => {
    if(!window.confirm('ডিলিট করবেন?')) return;
    await set(ref(db, `posts/${id}`), null);
    showSuccess('পোস্ট মুছে ফেলা হয়েছে');
  };

  const handleUpdateSite = async (type: 'about' | 'footer', field: string, value: any) => {
    const dbPath = type === 'about' ? 'aboutData' : 'footerData';
    await update(ref(db, dbPath), { [field]: value });
    showSuccess('সেটিংস আপডেট হয়েছে');
  };

  const handleUpdateCricket = async (field: string, value: any) => {
    const path = field.includes('.') ? field.replace('.', '/') : field;
    await set(ref(db, `cricketStats/${path}`), value);
    showSuccess('ক্রিকেট হাব আপডেট হয়েছে');
  };

  const handlePersonSubmit = async () => {
    if(!newPerson.name) return alert('নাম আবশ্যক');
    const typePath = newPerson.type === 'member' ? 'members' : 'committee';
    const id = editingPersonId || push(ref(db, typePath)).key || Date.now().toString();
    
    // If updating and changing type, delete from old path
    if (editingPersonId) {
      const oldType = members.find(m => m.id === editingPersonId) ? 'members' : 'committee';
      if (oldType !== typePath) await set(ref(db, `${oldType}/${editingPersonId}`), null);
    }

    await set(ref(db, `${typePath}/${id}`), { ...newPerson, id });
    setEditingPersonId(null);
    setNewPerson({ name: '', role: '', phone: '', image: '', type: 'member' });
    showSuccess('মেম্বার তথ্য সেভ হয়েছে');
  };

  const handleApproveUser = async (userId: string) => {
    const userToApprove = users.find(u => u.id === userId);
    if (!userToApprove) return;

    const updates: any = {};
    updates[`users/${userId}/status`] = 'approved';
    
    const memberId = push(ref(db, 'members')).key || userId;
    updates[`members/${memberId}`] = {
      id: memberId,
      name: userToApprove.name,
      phone: userToApprove.phone,
      role: 'সাধারণ সদস্য',
      image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    };

    await update(ref(db), updates);
    showSuccess(`${userToApprove.name}-কে অনুমোদন করা হয়েছে!`);
  };

  const pendingUsers = users.filter(u => u.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {saveStatus && (
        <div className="fixed top-20 right-4 z-[100] bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce flex items-center gap-3">
          <i className="fas fa-check-circle"></i><span className="font-bold">{saveStatus}</span>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 px-6 py-4 flex flex-wrap gap-2">
          {[
            { id: 'feed', label: 'পোস্ট ফিড', icon: 'fa-rss' },
            { id: 'requests', label: `আবেদন (${pendingUsers.length})`, icon: 'fa-user-clock' },
            { id: 'people', label: 'মেম্বার ও কমিটি', icon: 'fa-users' },
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
          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingUsers.map(user => (
                <div key={user.id} className="bg-slate-50 p-6 rounded-3xl border">
                  <h4 className="font-bold text-lg">{user.name}</h4>
                  <p className="text-sm text-slate-500 mb-4">{user.phone} | {user.email}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveUser(user.id)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold">অনুমোদন</button>
                    <button onClick={() => set(ref(db, `users/${user.id}`), null)} className="px-4 bg-slate-200 py-2 rounded-xl text-slate-500">বাতিল</button>
                  </div>
                </div>
              ))}
              {pendingUsers.length === 0 && <p className="col-span-2 text-center py-10 text-slate-400">কোন আবেদন নেই</p>}
            </div>
          )}

          {activeTab === 'feed' && (
            <div className="space-y-8">
              <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300">
                <textarea className="w-full p-4 rounded-xl mb-4 border" placeholder="নতুন কি পোস্ট করতে চান?" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input className="p-3 border rounded-xl" placeholder="মিডিয়া URL" value={newPost.mediaUrl} onChange={e => setNewPost({...newPost, mediaUrl: e.target.value})} />
                  <select className="p-3 border rounded-xl" value={newPost.mediaType} onChange={e => setNewPost({...newPost, mediaType: e.target.value as any})}>
                    <option value="none">কোন মিডিয়া নেই</option><option value="image">ছবি</option><option value="video">ভিডিও</option>
                  </select>
                </div>
                <button onClick={handleAddPost} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg">পোস্ট করুন</button>
              </div>
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-4 border rounded-2xl flex justify-between items-center">
                    <p className="truncate max-w-md font-medium">{post.content}</p>
                    <button onClick={() => handleDeletePost(post.id)} className="text-red-500 p-2"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'site_settings' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl">
                <h4 className="font-bold mb-4">ব্রেকিং নিউজ ও ব্যানার</h4>
                <input className="w-full p-3 border rounded-xl mb-3" placeholder="ব্রেকিং নিউজ" value={footerData.urgentNews} onChange={e => handleUpdateSite('footer', 'urgentNews', e.target.value)} />
                <input className="w-full p-3 border rounded-xl" placeholder="ব্যানার ছবি URL" value={footerData.heroImageUrl} onChange={e => handleUpdateSite('footer', 'heroImageUrl', e.target.value)} />
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl">
                <h4 className="font-bold mb-4">সংগঠনের বর্ণনা</h4>
                <textarea className="w-full p-3 border rounded-xl" rows={3} value={aboutData.description} onChange={e => handleUpdateSite('about', 'description', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'cricket' && (
            <div className="bg-blue-50 p-6 rounded-3xl space-y-4">
               <div className="grid grid-cols-3 gap-4">
                  <input className="p-3 border rounded-xl" placeholder="বছর" value={cricketStats.year} onChange={e => handleUpdateCricket('year', e.target.value)} />
                  <input className="p-3 border rounded-xl" placeholder="বিজয়ী" value={cricketStats.winner} onChange={e => handleUpdateCricket('winner', e.target.value)} />
                  <input className="p-3 border rounded-xl" placeholder="রানার-আপ" value={cricketStats.runnerUp} onChange={e => handleUpdateCricket('runnerUp', e.target.value)} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-4 rounded-2xl">
                    <h5 className="font-bold mb-2">টপ স্কোরার</h5>
                    <input className="w-full p-2 border rounded mb-2" value={cricketStats.topScorer.name} onChange={e => handleUpdateCricket('topScorer.name', e.target.value)} />
                    <input className="w-full p-2 border rounded" type="number" value={cricketStats.topScorer.runs} onChange={e => handleUpdateCricket('topScorer.runs', Number(e.target.value))} />
                 </div>
                 <div className="bg-white p-4 rounded-2xl">
                    <h5 className="font-bold mb-2">টপ উইকেট শিকারী</h5>
                    <input className="w-full p-2 border rounded mb-2" value={cricketStats.topWicketTaker.name} onChange={e => handleUpdateCricket('topWicketTaker.name', e.target.value)} />
                    <input className="w-full p-2 border rounded" type="number" value={cricketStats.topWicketTaker.wickets} onChange={e => handleUpdateCricket('topWicketTaker.wickets', Number(e.target.value))} />
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'people' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="bg-slate-50 p-6 rounded-3xl h-fit">
                  <h4 className="font-bold mb-4">{editingPersonId ? 'তথ্য আপডেট' : 'নতুন মেম্বার'}</h4>
                  <input className="w-full p-3 border rounded-xl mb-3" placeholder="নাম" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} />
                  <input className="w-full p-3 border rounded-xl mb-3" placeholder="পদবী" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})} />
                  <input className="w-full p-3 border rounded-xl mb-3" placeholder="মোবাইল" value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})} />
                  <select className="w-full p-3 border rounded-xl mb-4" value={newPerson.type} onChange={e => setNewPerson({...newPerson, type: e.target.value})}>
                    <option value="member">সাধারণ মেম্বার</option><option value="committee">কমিটি মেম্বার</option>
                  </select>
                  <button onClick={handlePersonSubmit} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">{editingPersonId ? 'আপডেট করুন' : 'সেভ করুন'}</button>
               </div>
               <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar">
                  {[...committee, ...members].map(m => (
                    <div key={m.id} className="p-3 bg-white border rounded-xl flex justify-between items-center">
                      <div><p className="font-bold">{m.name}</p><p className="text-xs text-blue-600">{m.role}</p></div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingPersonId(m.id); setNewPerson({name: m.name, role: m.role, phone: m.phone, image: m.image, type: members.includes(m) ? 'member' : 'committee'}); }} className="text-blue-500"><i className="fas fa-edit"></i></button>
                        <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `${members.includes(m) ? 'members' : 'committee'}/${m.id}`), null); }} className="text-red-500"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
