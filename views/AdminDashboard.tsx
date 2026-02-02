
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

  // Add the 10 members as requested
  const seedMembers = async () => {
    const names = [
      'সাগর সরকার', 'জুম্মান বেপারী', 'জিকু মোল্লা', 'রেদোয়ান', 'রাব্বি',
      'মারফত আলি', 'দোহা', 'দিনইসলাম', 'এমরান', 'সিয়াম'
    ];
    
    if(!window.confirm('আপনি কি এই ১০ জন মেম্বারকে এক সাথে ডাটাবেসে যোগ করতে চান?')) return;
    
    setIsSaving(true);
    try {
      for (const name of names) {
        // Check if member already exists to prevent duplicates
        if (members.some(m => m.name === name)) continue;

        const newRef = push(ref(db, 'members'));
        const personData: Member = {
          id: newRef.key || Date.now().toString() + Math.random(),
          name,
          role: 'সদস্য',
          phone: 'প্রযোজ্য নয়',
          image: DEFAULT_AVATAR
        };
        await set(newRef, personData);
      }
      showSuccess('১০ জন সদস্য সফলভাবে যোগ করা হয়েছে!');
    } catch (e) {
      alert('Error: ' + e);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePersonSubmit = async () => {
    if(!newPerson.name) return alert('দয়া করে নাম লিখুন');
    setIsSaving(true);
    
    try {
      const typePath = newPerson.type === 'member' ? 'members' : 'committee';
      
      // If we are editing, we use the existing ID
      const id = editingPersonId || push(ref(db, typePath)).key || Date.now().toString();
      
      // If we changed the type (member to committee or vice versa), remove from old path
      if (editingPersonId) {
        const oldPath = members.some(m => m.id === editingPersonId) ? 'members' : 'committee';
        if (oldPath !== typePath) {
          await set(ref(db, `${oldPath}/${editingPersonId}`), null);
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
      showSuccess(editingPersonId ? 'তথ্য সফলভাবে আপডেট হয়েছে' : 'মেম্বার সেভ হয়েছে');
    } catch (error) {
      alert('সেভ করতে সমস্যা হয়েছে। দয়া করে ইন্টারনেট কানেকশন চেক করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if(!window.confirm('এই পোস্টটি কি ডিলিট করতে চান?')) return;
    await set(ref(db, `posts/${id}`), null);
    showSuccess('পোস্ট ডিলিট করা হয়েছে');
  };

  const handleAddPost = async () => {
    if (!newPost.content) return alert('কিছু লিখুন');
    setIsSaving(true);
    try {
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
      showSuccess('পোস্ট সফল হয়েছে');
    } catch (e) {
      alert('পোস্ট করা সম্ভব হয়নি');
    } finally {
      setIsSaving(false);
    }
  };

  const pendingUsers = users.filter(u => u.status === 'pending');

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
            { id: 'requests', label: `আবেদন (${pendingUsers.length})`, icon: 'fa-user-clock' },
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
               {/* Form Section */}
               <div id="member-form" className="bg-slate-50 p-8 rounded-[2rem] h-fit border border-slate-200 shadow-inner">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="font-bold text-2xl text-slate-800">
                      {editingPersonId ? 'মেম্বার তথ্য এডিট করুন' : 'নতুন মেম্বার যোগ করুন'}
                    </h4>
                    {!editingPersonId && (
                      <button 
                        disabled={isSaving}
                        onClick={seedMembers} 
                        className="bg-orange-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-md active:scale-95 text-sm">
                        ১০ মেম্বার এক সাথে যোগ করুন
                      </button>
                    )}
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1 uppercase">পুরো নাম</label>
                      <input className="w-full p-4 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="যেমন: সাগর সরকার" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1 uppercase">পদবী</label>
                      <input className="w-full p-4 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="যেমন: সাধারণ সদস্য" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1 uppercase">মোবাইল</label>
                      <input className="w-full p-4 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="মোবাইল নম্বর" value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1 uppercase">ছবি (URL)</label>
                      <input className="w-full p-4 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="ছবির লিংক (ঐচ্ছিক)" value={newPerson.image} onChange={e => setNewPerson({...newPerson, image: e.target.value})} />
                      <p className="text-[10px] text-slate-400 mt-2 ml-1 italic">* ছবি পরে এডিট করে লিংক বসাতে পারবেন।</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1 uppercase">লিস্ট ক্যাটাগরি</label>
                      <select className="w-full p-4 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none bg-white" value={newPerson.type} onChange={e => setNewPerson({...newPerson, type: e.target.value})}>
                        <option value="member">সাধারণ সদস্য (Members List)</option>
                        <option value="committee">কমিটি মেম্বার (Committee List)</option>
                      </select>
                    </div>
                    <div className="pt-4 space-y-3">
                      <button 
                        disabled={isSaving}
                        onClick={handlePersonSubmit} 
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all disabled:bg-slate-300 flex items-center justify-center gap-3">
                        {isSaving ? (
                          <> <i className="fas fa-spinner animate-spin"></i> কাজ চলছে... </>
                        ) : (
                          <> <i className={`fas ${editingPersonId ? 'fa-save' : 'fa-plus-circle'}`}></i> {editingPersonId ? 'তথ্য আপডেট করুন' : 'নতুন সদস্য সেভ করুন'} </>
                        )}
                      </button>
                      {editingPersonId && (
                        <button 
                          onClick={() => { setEditingPersonId(null); setNewPerson({name:'', role:'', phone:'', image:'', type:'member'}); }} 
                          className="w-full bg-slate-200 text-slate-600 py-3 rounded-2xl font-bold hover:bg-slate-300 transition-all">
                          বাতিল করুন
                        </button>
                      )}
                    </div>
                  </div>
               </div>

               {/* List Section */}
               <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">বর্তমান সদস্য তালিকা ({[...committee, ...members].length})</h4>
                  </div>
                  <div className="space-y-4 max-h-[800px] overflow-y-auto no-scrollbar pr-2 pb-20">
                    {[...committee, ...members].map(m => (
                      <div key={m.id} className="p-5 bg-white border border-slate-100 rounded-[1.5rem] flex justify-between items-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all group animate-fadeIn">
                        <div className="flex items-center gap-5">
                          <img src={m.image} className="w-14 h-14 rounded-full object-cover bg-slate-100 border-2 border-slate-50 shadow-sm" alt={m.name} />
                          <div>
                            <p className="font-bold text-slate-800 text-lg leading-tight">{m.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${committee.some(c => c.id === m.id) ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                 {committee.some(c => c.id === m.id) ? 'কমিটি' : 'সাধারণ সদস্য'}
                               </span>
                               <span className="text-xs text-slate-400">| {m.role}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            title="এডিট করুন"
                            onClick={() => { 
                              setEditingPersonId(m.id); 
                              setNewPerson({
                                name: m.name, 
                                role: m.role, 
                                phone: m.phone, 
                                image: m.image === DEFAULT_AVATAR ? '' : m.image, 
                                type: members.some(mem => mem.id === m.id) ? 'member' : 'committee'
                              }); 
                              document.getElementById('member-form')?.scrollIntoView({ behavior: 'smooth' });
                            }} 
                            className="bg-blue-50 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            title="ডিলিট করুন"
                            onClick={async () => { 
                              if(window.confirm(`${m.name}-কে কি নিশ্চিতভাবে মুছে ফেলতে চান?`)) {
                                 const path = members.some(mem => mem.id === m.id) ? 'members' : 'committee';
                                 await set(ref(db, `${path}/${m.id}`), null);
                                 showSuccess('সফলভাবে মুছে ফেলা হয়েছে');
                              }
                            }} 
                            className="bg-red-50 text-red-400 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    {[...committee, ...members].length === 0 && (
                      <div className="text-center py-32 bg-slate-50 rounded-3xl border border-dashed">
                        <i className="fas fa-user-friends text-6xl text-slate-200 mb-4 block"></i>
                        <p className="text-slate-400 font-bold">এখনও কোনো সদস্য যোগ করা হয়নি</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingUsers.map(user => (
                <div key={user.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm">
                  <div>
                    <h4 className="font-bold text-xl text-slate-800">{user.name}</h4>
                    <div className="space-y-1 mt-2 mb-6">
                      <p className="text-sm text-slate-500 flex items-center gap-2"><i className="fas fa-phone text-blue-400"></i> {user.phone}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-2"><i className="fas fa-envelope text-blue-400"></i> {user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button disabled={isSaving} onClick={async () => {
                      setIsSaving(true);
                      const memberId = push(ref(db, 'members')).key || user.id;
                      const updates: any = {};
                      updates[`users/${user.id}/status`] = 'approved';
                      updates[`members/${memberId}`] = { id: memberId, name: user.name, phone: user.phone, role: 'সদস্য', image: DEFAULT_AVATAR };
                      await update(ref(db), updates);
                      setIsSaving(false);
                      showSuccess('অনুমোদিত এবং মেম্বার লিস্টে যোগ হয়েছে');
                    }} className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:bg-slate-300">অনুমোদন</button>
                    <button disabled={isSaving} onClick={async () => {
                       if(window.confirm('আবেদনটি কি বাতিল করতে চান?')) {
                         await set(ref(db, `users/${user.id}`), null);
                         showSuccess('আবেদন বাতিল করা হয়েছে');
                       }
                    }} className="px-5 bg-white border border-slate-200 py-3 rounded-2xl text-slate-400 font-bold hover:text-red-500 transition-all">বাতিল</button>
                  </div>
                </div>
              ))}
              {pendingUsers.length === 0 && (
                <div className="col-span-2 text-center py-20 text-slate-400">
                  <i className="fas fa-inbox text-5xl mb-4 block opacity-20"></i>
                  কোন নতুন মেম্বারশিপ আবেদন নেই
                </div>
              )}
            </div>
          )}

          {activeTab === 'feed' && (
            <div className="space-y-10">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-dashed border-slate-300 shadow-inner">
                <h4 className="font-bold text-xl mb-6 text-slate-700 flex items-center gap-2"><i className="fas fa-edit"></i> নতুন পোস্ট</h4>
                <textarea className="w-full p-5 rounded-2xl mb-5 border outline-none focus:ring-4 focus:ring-blue-100 transition-all min-h-[150px]" placeholder="কি বলতে চান আপনার মেম্বারদের?" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-2 block">মিডিয়া URL (ছবি/ভিডিও)</label>
                    <input className="w-full p-4 border rounded-2xl outline-none" placeholder="লিংক কপি করে দিন" value={newPost.mediaUrl} onChange={e => setNewPost({...newPost, mediaUrl: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-2 block">মিডিয়া টাইপ</label>
                    <select className="w-full p-4 border rounded-2xl outline-none appearance-none bg-white" value={newPost.mediaType} onChange={e => setNewPost({...newPost, mediaType: e.target.value as any})}>
                      <option value="none">কোন মিডিয়া নেই</option>
                      <option value="image">ছবি (Image)</option>
                      <option value="video">ভিডিও (YouTube/Direct)</option>
                    </select>
                  </div>
                </div>
                <button disabled={isSaving} onClick={handleAddPost} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all disabled:bg-slate-300">পোস্ট পাবলিশ করুন</button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-slate-400 uppercase text-xs tracking-widest ml-2">পূর্ববর্তী পোস্টসমূহ ({posts.length})</h4>
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-5 border border-slate-100 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 truncate">
                       <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                         <i className={`fas ${post.mediaType === 'image' ? 'fa-image' : post.mediaType === 'video' ? 'fa-video' : 'fa-align-left'}`}></i>
                       </div>
                       <div className="truncate">
                         <p className="truncate max-w-lg font-bold text-slate-700">{post.content}</p>
                         <p className="text-[10px] text-slate-400">{post.date}</p>
                       </div>
                    </div>
                    <button onClick={() => handleDeletePost(post.id)} className="bg-red-50 text-red-400 w-10 h-10 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {['gallery', 'cricket', 'site_settings'].includes(activeTab) && (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <i className="fas fa-tools text-4xl text-blue-300"></i>
              </div>
              <p className="text-slate-500 font-bold text-lg">এই সেকশনটি বর্তমানে ডেভেলপ করা হচ্ছে...</p>
              <p className="text-slate-400 text-sm mt-2">খুব শীঘ্রই এখানে গ্যালারি ও সেটিংস ম্যানেজ করার সুবিধা পাবেন।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
