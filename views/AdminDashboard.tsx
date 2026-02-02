
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
  const [activeTab, setActiveTab] = useState<'feed' | 'notices' | 'people' | 'gallery' | 'cricket' | 'site_settings' | 'requests'>('people');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const showSuccess = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const [newPost, setNewPost] = useState({ content: '', mediaUrl: '', mediaType: 'none' as any });
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [newPerson, setNewPerson] = useState({ name: '', role: '', phone: '', image: '', type: 'member' });

  // Function to seed the 10 members requested by user
  const seedTenMembers = async () => {
    const names = [
      'সাগর সরকার', 'জুম্মান বেপারী', 'জিকু মোল্লা', 'রেদোয়ান', 'রাব্বি',
      'মারফত আলি', 'দোহা', 'দিনইসলাম', 'এমরান', 'সিয়াম'
    ];
    
    if(!window.confirm('আপনি কি এই ১০ জন মেম্বারকে অটোমেটিক এড করতে চান? (এটি পারমিশন এরর থাকলে কাজ করবে না, আগে ফায়ারবেস রুলস চেক করুন)')) return;
    
    setIsSaving(true);
    try {
      for (const name of names) {
        // Only add if not already in the list to avoid clutter
        if (!members.some(m => m.name === name)) {
          const membersRef = ref(db, 'members');
          const newRef = push(membersRef);
          const personData: Member = {
            id: newRef.key || Date.now().toString() + Math.random(),
            name,
            role: 'সাধারণ সদস্য',
            phone: 'যোগ করা হয়নি',
            image: DEFAULT_AVATAR
          };
          await set(newRef, personData);
        }
      }
      showSuccess('সফলভাবে ১০ জন সদস্য যোগ করা হয়েছে!');
    } catch (e: any) {
      alert('Error: ' + e.message + '\nদয়া করে ফায়ারবেস রুলস চেক করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePersonSubmit = async () => {
    if(!newPerson.name) return alert('দয়া করে নাম লিখুন');
    setIsSaving(true);
    
    try {
      const typePath = newPerson.type === 'member' ? 'members' : 'committee';
      
      // Use existing ID if editing, otherwise generate a new one
      const id = editingPersonId || push(ref(db, typePath)).key || Date.now().toString();
      
      // If we are switching categories (member to committee), remove from old list
      if (editingPersonId) {
        const wasMember = members.some(m => m.id === editingPersonId);
        const wasCommittee = committee.some(c => c.id === editingPersonId);
        if (wasMember && newPerson.type === 'committee') {
           await set(ref(db, `members/${editingPersonId}`), null);
        } else if (wasCommittee && newPerson.type === 'member') {
           await set(ref(db, `committee/${editingPersonId}`), null);
        }
      }

      const personData: Member = {
        id,
        name: newPerson.name,
        role: newPerson.role || 'সদস্য',
        phone: newPerson.phone || 'প্রযোজ্য নয়',
        image: newPerson.image || DEFAULT_AVATAR
      };

      await set(ref(db, `${typePath}/${id}`), personData);
      
      setEditingPersonId(null);
      setNewPerson({ name: '', role: '', phone: '', image: '', type: 'member' });
      showSuccess(editingPersonId ? 'মেম্বার আপডেট হয়েছে' : 'মেম্বার সেভ হয়েছে');
    } catch (error: any) {
      alert('সেভ করা সম্ভব হয়নি: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (m: Member, type: 'member' | 'committee') => {
    setEditingPersonId(m.id);
    setNewPerson({
      name: m.name,
      role: m.role,
      phone: m.phone,
      image: m.image === DEFAULT_AVATAR ? '' : m.image,
      type
    });
    // Scroll to form
    document.getElementById('member-form-top')?.scrollIntoView({ behavior: 'smooth' });
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
          {activeTab === 'people' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               {/* Member Form */}
               <div id="member-form-top" className="bg-slate-50 p-8 rounded-[2rem] h-fit border border-slate-200">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="font-bold text-2xl text-slate-800">
                      {editingPersonId ? 'মেম্বার তথ্য এডিট করুন' : 'নতুন সদস্য যোগ করুন'}
                    </h4>
                    {!editingPersonId && (
                       <button 
                        onClick={seedTenMembers}
                        className="bg-orange-600 text-white text-[10px] px-3 py-2 rounded-lg font-bold hover:bg-orange-700 transition-all flex items-center gap-2"
                       >
                         <i className="fas fa-magic"></i> ১০ জন মেম্বার এড করুন
                       </button>
                    )}
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">পুরো নাম</label>
                      <input className="w-full p-4 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-100" placeholder="সদস্যের নাম" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">পদবী</label>
                      <input className="w-full p-4 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-100" placeholder="যেমন: সাধারণ সদস্য" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">ফোন</label>
                      <input className="w-full p-4 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-100" placeholder="ফোন নম্বর" value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">ছবি URL</label>
                      <input className="w-full p-4 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-100" placeholder="ইন্টারনেট থেকে ছবির লিংক" value={newPerson.image} onChange={e => setNewPerson({...newPerson, image: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">ক্যাটাগরি</label>
                      <select className="w-full p-4 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 bg-white" value={newPerson.type} onChange={e => setNewPerson({...newPerson, type: e.target.value as any})}>
                        <option value="member">সাধারণ সদস্য</option>
                        <option value="committee">কমিটি মেম্বার</option>
                      </select>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button 
                        disabled={isSaving}
                        onClick={handlePersonSubmit} 
                        className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-blue-700 disabled:bg-slate-300 transition-all">
                        {isSaving ? 'কাজ চলছে...' : (editingPersonId ? 'আপডেট করুন' : 'মেম্বার সেভ করুন')}
                      </button>
                      {editingPersonId && (
                        <button 
                          onClick={() => { setEditingPersonId(null); setNewPerson({name:'', role:'', phone:'', image:'', type:'member'}); }}
                          className="px-6 bg-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-300">
                          বাতিল
                        </button>
                      )}
                    </div>
                  </div>
               </div>

               {/* Member List */}
               <div className="space-y-6">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">বর্তমান সদস্যবৃন্দ ({members.length + committee.length})</h4>
                  <div className="space-y-4 max-h-[700px] overflow-y-auto no-scrollbar pr-2">
                    {/* Committee First */}
                    {committee.map(m => (
                      <div key={m.id} className="p-4 bg-white border-l-4 border-l-purple-500 border rounded-2xl flex justify-between items-center shadow-sm group">
                        <div className="flex items-center gap-4">
                          <img src={m.image} className="w-12 h-12 rounded-full object-cover border-2 border-slate-50 shadow-sm" alt="" />
                          <div>
                            <p className="font-bold text-slate-800">{m.name}</p>
                            <p className="text-[10px] text-purple-600 font-bold uppercase">{m.role} (কমিটি)</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => startEditing(m, 'committee')} className="text-blue-500 hover:bg-blue-50 w-9 h-9 rounded-lg flex items-center justify-center transition-colors"><i className="fas fa-edit"></i></button>
                          <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `committee/${m.id}`), null); }} className="text-red-400 hover:bg-red-50 w-9 h-9 rounded-lg flex items-center justify-center transition-colors"><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    ))}
                    {/* General Members */}
                    {members.map(m => (
                      <div key={m.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex justify-between items-center shadow-sm group">
                        <div className="flex items-center gap-4">
                          <img src={m.image} className="w-12 h-12 rounded-full object-cover border-2 border-slate-50 shadow-sm" alt="" />
                          <div>
                            <p className="font-bold text-slate-800">{m.name}</p>
                            <p className="text-[10px] text-blue-600 font-bold uppercase">{m.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => startEditing(m, 'member')} className="text-blue-500 hover:bg-blue-50 w-9 h-9 rounded-lg flex items-center justify-center transition-colors"><i className="fas fa-edit"></i></button>
                          <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await set(ref(db, `members/${m.id}`), null); }} className="text-red-400 hover:bg-red-50 w-9 h-9 rounded-lg flex items-center justify-center transition-colors"><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.filter(u => u.status === 'pending').map(user => (
                <div key={user.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm">
                  <div>
                    <h4 className="font-bold text-xl text-slate-800">{user.name}</h4>
                    <p className="text-sm text-slate-500 mt-1 mb-6">{user.phone} | {user.email}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={async () => {
                      setIsSaving(true);
                      const memberId = push(ref(db, 'members')).key || user.id;
                      const updates: any = {};
                      updates[`users/${user.id}/status`] = 'approved';
                      updates[`members/${memberId}`] = { id: memberId, name: user.name, phone: user.phone, role: 'সদস্য', image: DEFAULT_AVATAR };
                      await update(ref(db), updates);
                      setIsSaving(false);
                      showSuccess('অনুমোদিত হয়েছে');
                    }} className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-bold shadow-lg">অনুমোদন</button>
                    <button onClick={async () => await set(ref(db, `users/${user.id}`), null)} className="px-5 bg-white border border-slate-200 py-3 rounded-2xl text-slate-400 font-bold hover:text-red-500">বাতিল</button>
                  </div>
                </div>
              ))}
              {users.filter(u => u.status === 'pending').length === 0 && (
                <div className="col-span-2 text-center py-20 text-slate-400">নতুন কোনো মেম্বারশিপ আবেদন নেই।</div>
              )}
            </div>
          )}

          {activeTab === 'feed' && (
            <div className="space-y-10">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-dashed border-slate-300">
                <textarea className="w-full p-5 rounded-2xl mb-5 border outline-none focus:ring-4 focus:ring-blue-100 min-h-[120px]" placeholder="নতুন পোস্ট লিখুন..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                <button disabled={isSaving} onClick={async () => {
                   if(!newPost.content) return;
                   setIsSaving(true);
                   const postsRef = ref(db, 'posts');
                   const newPostRef = push(postsRef);
                   await set(newPostRef, {
                     id: newPostRef.key,
                     content: newPost.content,
                     date: new Date().toLocaleDateString('bn-BD'),
                     mediaType: 'none',
                     likes: 0
                   });
                   setNewPost({content:'', mediaUrl:'', mediaType:'none'});
                   setIsSaving(false);
                   showSuccess('পোস্ট করা হয়েছে');
                }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl disabled:bg-slate-300">পোস্ট করুন</button>
              </div>
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-5 border rounded-2xl flex justify-between items-center shadow-sm">
                    <p className="truncate max-w-lg font-medium text-slate-700">{post.content}</p>
                    <button onClick={async () => await set(ref(db, `posts/${post.id}`), null)} className="text-red-400 hover:bg-red-50 w-10 h-10 rounded-xl flex items-center justify-center"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {['gallery', 'cricket', 'site_settings', 'notices'].includes(activeTab) && (
            <div className="text-center py-20 text-slate-400">এই ট্যাবটির কাজ চলছে...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
