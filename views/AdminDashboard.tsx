
import React, { useState } from 'react';
import { Member, Notice, Team, TournamentStats, GalleryImage, User, Post, FooterData, AboutData } from '../types';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

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
  const [activeTab, setActiveTab] = useState<'posts' | 'notices' | 'members' | 'committee' | 'gallery' | 'requests' | 'site_settings'>('posts');
  const pendingRequests = users.filter(u => u.status === 'pending');

  // Form States
  const [postContent, setPostContent] = useState('');
  const [postMedia, setPostMedia] = useState('');
  const [postMediaType, setPostMediaType] = useState<'image' | 'video' | 'none'>('none');

  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticeVideo, setNoticeVideo] = useState('');

  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberImg, setMemberImg] = useState('');
  const [memberPhone, setMemberPhone] = useState('');

  const [galleryUrl, setGalleryUrl] = useState('');
  const [galleryCap, setGalleryCap] = useState('');

  // Save Functions
  const handleAddPost = async () => {
    if (!postContent) return alert('পোস্টের কন্টেন্ট দিন');
    const id = 'post-' + Date.now();
    await setDoc(doc(db, 'posts', id), {
      id, content: postContent, mediaUrl: postMedia, mediaType: postMediaType,
      date: new Date().toLocaleDateString('bn-BD'), likes: 0
    });
    setPostContent(''); setPostMedia(''); setPostMediaType('none');
    alert('পোস্ট পাবলিশ হয়েছে!');
  };

  const handleAddNotice = async () => {
    if (!noticeTitle) return alert('নোটিশের টাইটেল দিন');
    const id = 'notice-' + Date.now();
    await setDoc(doc(db, 'notices', id), {
      id, title: noticeTitle, description: noticeDesc, videoUrl: noticeVideo,
      date: new Date().toLocaleDateString('bn-BD')
    });
    setNoticeTitle(''); setNoticeDesc(''); setNoticeVideo('');
    alert('নোটিশ পাবলিশ হয়েছে!');
  };

  const handleAddPerson = async (collectionName: 'members' | 'committee') => {
    if (!memberName) return alert('নাম দিন');
    const id = collectionName + '-' + Date.now();
    await setDoc(doc(db, collectionName, id), {
      id, name: memberName, role: memberRole, image: memberImg, phone: memberPhone
    });
    setMemberName(''); setMemberRole(''); setMemberImg(''); setMemberPhone('');
    alert('সফলভাবে যোগ হয়েছে!');
  };

  const handleAddGallery = async () => {
    if (!galleryUrl) return alert('ছবির URL দিন');
    const id = 'gallery-' + Date.now();
    await setDoc(doc(db, 'gallery', id), { id, url: galleryUrl, caption: galleryCap });
    setGalleryUrl(''); setGalleryCap('');
    alert('গ্যালারিতে যোগ হয়েছে!');
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if(window.confirm('আপনি কি নিশ্চিত যে এটি ডিলিট করতে চান?')) {
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  const handleApproveUser = async (id: string) => {
    await updateDoc(doc(db, 'users', id), { status: 'approved' });
  };

  const handleUpdateSettings = async (newData: Partial<FooterData>) => {
    await setDoc(doc(db, 'settings', 'global'), { footerData: { ...footerData, ...newData } }, { merge: true });
    alert('আপডেট হয়েছে!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Dashboard Card */}
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 min-h-[70vh]">
        
        {/* Header & Tabs */}
        <div className="bg-slate-900 px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <h2 className="text-2xl font-black text-white flex items-center">
              <i className="fas fa-user-shield mr-3 text-blue-500"></i>
              এডমিন ড্যাশবোর্ড
            </h2>
            <div className="flex flex-wrap bg-slate-800 p-1.5 rounded-2xl gap-1">
              {[
                {id: 'posts', label: 'ফিড', icon: 'fa-rss'},
                {id: 'notices', label: 'নোটিশ', icon: 'fa-bullhorn'},
                {id: 'members', label: 'মেম্বার', icon: 'fa-users'},
                {id: 'committee', label: 'কমিটি', icon: 'fa-user-tie'},
                {id: 'gallery', label: 'গ্যালারি', icon: 'fa-images'},
                {id: 'requests', label: `আবেদন (${pendingRequests.length})`, icon: 'fa-user-plus'},
                {id: 'site_settings', label: 'সাইট', icon: 'fa-cog'},
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                  <i className={`fas ${tab.icon}`}></i>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          
          {/* POSTS PANEL */}
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center"><i className="fas fa-plus-circle mr-2 text-blue-600"></i> নতুন পোস্ট</h4>
                <div className="space-y-4">
                  <textarea className="w-full p-4 text-sm rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" rows={4} placeholder="কি লিখতে চান?" value={postContent} onChange={e => setPostContent(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="মিডিয়া URL (ছবি বা ভিডিও)" value={postMedia} onChange={e => setPostMedia(e.target.value)} />
                  <select className="w-full p-4 text-sm rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" value={postMediaType} onChange={e => setPostMediaType(e.target.value as any)}>
                    <option value="none">কোন মিডিয়া নেই</option>
                    <option value="image">ছবি (Image)</option>
                    <option value="video">ভিডিও (Video)</option>
                  </select>
                  <button onClick={handleAddPost} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all">পাবলিশ করুন</button>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-4 no-scrollbar">
                <h4 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">সাম্প্রতিক পোস্টসমূহ</h4>
                {posts.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <i className={`fas ${p.mediaType === 'image' ? 'fa-image' : p.mediaType === 'video' ? 'fa-video' : 'fa-align-left'} text-blue-500`}></i>
                      </div>
                      <p className="text-sm font-medium text-slate-700 truncate">{p.content}</p>
                    </div>
                    <button onClick={() => handleDelete('posts', p.id)} className="p-2 text-red-100 group-hover:text-red-500 transition-colors"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTICES PANEL */}
          {activeTab === 'notices' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center"><i className="fas fa-plus-circle mr-2 text-orange-600"></i> নতুন নোটিশ</h4>
                <div className="space-y-4">
                  <input className="w-full p-4 text-sm rounded-2xl border border-slate-200" placeholder="নোটিশ টাইটেল" value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} />
                  <textarea className="w-full p-4 text-sm rounded-2xl border border-slate-200" rows={4} placeholder="বিস্তারিত তথ্য" value={noticeDesc} onChange={e => setNoticeDesc(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border border-slate-200" placeholder="ভিডিও URL (যদি থাকে)" value={noticeVideo} onChange={e => setNoticeVideo(e.target.value)} />
                  <button onClick={handleAddNotice} className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-orange-700 transition-all">নোটিশ ছাড়ুন</button>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-4 no-scrollbar">
                 {notices.map(n => (
                  <div key={n.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                    <div>
                      <h5 className="font-bold text-slate-800">{n.title}</h5>
                      <p className="text-xs text-slate-400 mt-1">{n.date}</p>
                    </div>
                    <button onClick={() => handleDelete('notices', n.id)} className="p-2 text-red-500"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MEMBERS / COMMITTEE PANEL */}
          {(activeTab === 'members' || activeTab === 'committee') && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center"><i className="fas fa-plus-circle mr-2 text-green-600"></i> নতুন {activeTab === 'members' ? 'মেম্বার' : 'কমিটি মেম্বার'}</h4>
                <div className="space-y-4">
                  <input className="w-full p-4 text-sm rounded-2xl border border-slate-200" placeholder="নাম" value={memberName} onChange={e => setMemberName(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border border-slate-200" placeholder="পদবী / রোল" value={memberRole} onChange={e => setMemberRole(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border border-slate-200" placeholder="মোবাইল নম্বর" value={memberPhone} onChange={e => setMemberPhone(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border border-slate-200" placeholder="ছবির URL" value={memberImg} onChange={e => setMemberImg(e.target.value)} />
                  <button onClick={() => handleAddPerson(activeTab)} className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-green-700 transition-all">সেভ করুন</button>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-4 no-scrollbar">
                 {(activeTab === 'members' ? members : committee).map(m => (
                  <div key={m.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <img src={m.image || 'https://via.placeholder.com/150'} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" />
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm">{m.name}</h5>
                        <p className="text-[10px] text-blue-600 font-bold uppercase">{m.role}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(activeTab, m.id)} className="p-2 text-red-500"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALLERY PANEL */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center"><i className="fas fa-plus-circle mr-2 text-purple-600"></i> গ্যালারিতে যোগ</h4>
                <div className="space-y-4">
                  <input className="w-full p-4 text-sm rounded-2xl border border-slate-200" placeholder="ছবির URL" value={galleryUrl} onChange={e => setGalleryUrl(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border border-slate-200" placeholder="ক্যাপশন (সংক্ষিপ্ত বর্ণনা)" value={galleryCap} onChange={e => setGalleryCap(e.target.value)} />
                  <button onClick={handleAddGallery} className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-purple-700 transition-all">ছবি যোগ করুন</button>
                </div>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto no-scrollbar">
                {gallery.map(g => (
                  <div key={g.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                    <img src={g.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-2 text-center">
                      <p className="text-white text-[10px] mb-2">{g.caption}</p>
                      <button onClick={() => handleDelete('gallery', g.id)} className="bg-red-500 text-white p-2 rounded-lg text-xs"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REQUESTS PANEL */}
          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map(u => (
                <div key={u.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{u.name}</h4>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveUser(u.id)} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-green-700 transition-all">অ্যাপ্রুভ</button>
                    <button onClick={() => handleDelete('users', u.id)} className="flex-1 bg-red-50 text-red-500 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all">বাতিল</button>
                  </div>
                </div>
              ))}
              {pendingRequests.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <i className="fas fa-check-circle text-4xl text-slate-200 mb-4"></i>
                  <p className="text-slate-400 font-medium">কোনো পেন্ডিং আবেদন নেই।</p>
                </div>
              )}
            </div>
          )}

          {/* SITE SETTINGS PANEL */}
          {activeTab === 'site_settings' && (
            <div className="max-w-3xl mx-auto space-y-10">
               <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                 <h4 className="font-bold text-slate-800 mb-6 flex items-center"><i className="fas fa-bolt mr-2 text-yellow-500"></i> ব্রেকিং নিউজ আপডেট</h4>
                 <div className="flex gap-4">
                   <input className="flex-1 p-4 rounded-2xl border border-slate-200 text-sm" defaultValue={footerData.urgentNews} id="urgentNewsInput" />
                   <button onClick={() => handleUpdateSettings({ urgentNews: (document.getElementById('urgentNewsInput') as HTMLInputElement).value })} className="bg-slate-900 text-white px-8 rounded-2xl font-bold text-sm">আপডেট</button>
                 </div>
               </div>

               <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                 <h4 className="font-bold text-slate-800 mb-6 flex items-center"><i className="fas fa-image mr-2 text-blue-500"></i> হিরো ইমেজ (হোম পেজ ব্যানার)</h4>
                 <div className="flex gap-4">
                   <input className="flex-1 p-4 rounded-2xl border border-slate-200 text-sm" defaultValue={footerData.heroImageUrl} id="heroImageInput" />
                   <button onClick={() => handleUpdateSettings({ heroImageUrl: (document.getElementById('heroImageInput') as HTMLInputElement).value })} className="bg-slate-900 text-white px-8 rounded-2xl font-bold text-sm">আপডেট</button>
                 </div>
                 <div className="mt-6 rounded-2xl overflow-hidden shadow-sm h-32 border border-white">
                   <img src={footerData.heroImageUrl} className="w-full h-full object-cover" />
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
