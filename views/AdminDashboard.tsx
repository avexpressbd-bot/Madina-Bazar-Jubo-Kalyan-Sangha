
import React, { useState } from 'react';
import { Member, Notice, Team, TournamentStats, GalleryImage, User, Post, FooterData, AboutData } from '../types';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

interface AdminDashboardProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  committee: Member[];
  setCommittee: React.Dispatch<React.SetStateAction<Member[]>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  gallery: GalleryImage[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
  upcomingTeams: Team[];
  setUpcomingTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  cricketStats: TournamentStats;
  setCricketStats: React.Dispatch<React.SetStateAction<TournamentStats>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  footerData: FooterData;
  setFooterData: React.Dispatch<React.SetStateAction<FooterData>>;
  aboutData: AboutData;
  setAboutData: React.Dispatch<React.SetStateAction<AboutData>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  members, setMembers, 
  committee, setCommittee,
  notices, setNotices,
  gallery, setGallery,
  upcomingTeams, setUpcomingTeams,
  cricketStats, setCricketStats,
  users, setUsers,
  posts, setPosts,
  footerData, setFooterData,
  aboutData, setAboutData
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'notices' | 'members' | 'committee' | 'gallery' | 'cricket_stats' | 'site_settings'>('posts');

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
  const handleAddPost = () => {
    if (!postContent) return alert('পোস্টের কন্টেন্ট দিন');
    const newPost: Post = {
      id: 'post-' + Date.now(),
      content: postContent,
      mediaUrl: postMedia,
      mediaType: postMediaType,
      date: new Date().toLocaleDateString('bn-BD'),
      likes: 0
    };
    setPosts([newPost, ...posts]);
    setPostContent(''); setPostMedia(''); setPostMediaType('none');
    alert('পোস্ট সফলভাবে করা হয়েছে!');
  };

  const handleAddNotice = () => {
    if (!noticeTitle) return alert('নোটিশের টাইটেল দিন');
    const newNotice: Notice = {
      id: 'notice-' + Date.now(),
      title: noticeTitle,
      description: noticeDesc,
      videoUrl: noticeVideo,
      date: new Date().toLocaleDateString('bn-BD')
    };
    setNotices([newNotice, ...notices]);
    setNoticeTitle(''); setNoticeDesc(''); setNoticeVideo('');
    alert('নোটিশ পাবলিশ হয়েছে!');
  };

  const handleAddPerson = (collection: 'members' | 'committee') => {
    if (!memberName) return alert('নাম দিন');
    const newPerson: Member = {
      id: collection + '-' + Date.now(),
      name: memberName,
      role: memberRole,
      image: memberImg || 'https://via.placeholder.com/150',
      phone: memberPhone
    };
    if (collection === 'members') setMembers([...members, newPerson]);
    else setCommittee([...committee, newPerson]);
    setMemberName(''); setMemberRole(''); setMemberImg(''); setMemberPhone('');
    alert('সফলভাবে যোগ হয়েছে!');
  };

  const handleAddGallery = () => {
    if (!galleryUrl) return alert('ছবির URL দিন');
    const newImg: GalleryImage = {
      id: 'gallery-' + Date.now(),
      url: galleryUrl,
      caption: galleryCap
    };
    setGallery([...gallery, newImg]);
    setGalleryUrl(''); setGalleryCap('');
    alert('গ্যালারিতে যোগ হয়েছে!');
  };

  const handleDelete = (type: string, id: string) => {
    if(!window.confirm('আপনি কি নিশ্চিত যে এটি ডিলিট করতে চান?')) return;
    if(type === 'posts') setPosts(posts.filter(p => p.id !== id));
    if(type === 'notices') setNotices(notices.filter(n => n.id !== id));
    if(type === 'members') setMembers(members.filter(m => m.id !== id));
    if(type === 'committee') setCommittee(committee.filter(c => c.id !== id));
    if(type === 'gallery') setGallery(gallery.filter(g => g.id !== id));
  };

  const handleUpdateSettings = (newData: Partial<FooterData>) => {
    setFooterData({ ...footerData, ...newData });
    alert('সেটিংস আপডেট হয়েছে!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 min-h-[70vh]">
        <div className="bg-slate-900 px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <h2 className="text-2xl font-black text-white flex items-center">
              <i className="fas fa-user-shield mr-3 text-blue-500"></i> এডমিন প্যানেল
            </h2>
            <div className="flex flex-wrap bg-slate-800 p-1.5 rounded-2xl gap-1">
              {[
                {id: 'posts', label: 'ফিড', icon: 'fa-rss'},
                {id: 'notices', label: 'নোটিশ', icon: 'fa-bullhorn'},
                {id: 'members', label: 'মেম্বার', icon: 'fa-users'},
                {id: 'committee', label: 'কমিটি', icon: 'fa-user-tie'},
                {id: 'gallery', label: 'গ্যালারি', icon: 'fa-images'},
                {id: 'site_settings', label: 'সাইট', icon: 'fa-cog'},
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                  <i className={`fas ${tab.icon}`}></i> {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 h-fit">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center"><i className="fas fa-plus-circle mr-2 text-blue-600"></i> নতুন পোস্ট</h4>
                <div className="space-y-4">
                  <textarea className="w-full p-4 text-sm rounded-2xl border" rows={4} placeholder="কি লিখতে চান?" value={postContent} onChange={e => setPostContent(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border" placeholder="মিডিয়া URL" value={postMedia} onChange={e => setPostMedia(e.target.value)} />
                  <select className="w-full p-4 text-sm rounded-2xl border" value={postMediaType} onChange={e => setPostMediaType(e.target.value as any)}>
                    <option value="none">কোনো মিডিয়া নেই</option>
                    <option value="image">ছবি</option>
                    <option value="video">ভিডিও</option>
                  </select>
                  <button onClick={handleAddPost} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg">পাবলিশ করুন</button>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto no-scrollbar pr-4">
                {posts.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between group">
                    <p className="text-sm font-medium text-slate-700 truncate flex-1 mr-4">{p.content}</p>
                    <button onClick={() => handleDelete('posts', p.id)} className="text-red-500 p-2"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 h-fit">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center"><i className="fas fa-plus-circle mr-2 text-orange-600"></i> নতুন নোটিশ</h4>
                <div className="space-y-4">
                  <input className="w-full p-4 text-sm rounded-2xl border" placeholder="টাইটেল" value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} />
                  <textarea className="w-full p-4 text-sm rounded-2xl border" rows={4} placeholder="বর্ণনা" value={noticeDesc} onChange={e => setNoticeDesc(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border" placeholder="ভিডিও URL" value={noticeVideo} onChange={e => setNoticeVideo(e.target.value)} />
                  <button onClick={handleAddNotice} className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg">নোটিশ ছাড়ুন</button>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto no-scrollbar pr-4">
                 {notices.map(n => (
                  <div key={n.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between">
                    <h5 className="font-bold text-sm">{n.title}</h5>
                    <button onClick={() => handleDelete('notices', n.id)} className="text-red-500"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'members' || activeTab === 'committee') && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 h-fit">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center"><i className="fas fa-plus-circle mr-2 text-green-600"></i> নতুন {activeTab === 'members' ? 'মেম্বার' : 'কমিটি মেম্বার'}</h4>
                <div className="space-y-4">
                  <input className="w-full p-4 text-sm rounded-2xl border" placeholder="নাম" value={memberName} onChange={e => setMemberName(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border" placeholder="পদবী" value={memberRole} onChange={e => setMemberRole(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border" placeholder="মোবাইল নম্বর" value={memberPhone} onChange={e => setMemberPhone(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border" placeholder="ছবির URL" value={memberImg} onChange={e => setMemberImg(e.target.value)} />
                  <button onClick={() => handleAddPerson(activeTab)} className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg">সেভ করুন</button>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto no-scrollbar">
                 {(activeTab === 'members' ? members : committee).map(m => (
                  <div key={m.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={m.image} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-sm">{m.name}</p>
                        <p className="text-[10px] text-blue-600 font-bold">{m.role}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(activeTab, m.id)} className="text-red-500"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 h-fit">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center"><i className="fas fa-plus-circle mr-2 text-purple-600"></i> গ্যালারিতে যোগ</h4>
                <div className="space-y-4">
                  <input className="w-full p-4 text-sm rounded-2xl border" placeholder="ছবির URL" value={galleryUrl} onChange={e => setGalleryUrl(e.target.value)} />
                  <input className="w-full p-4 text-sm rounded-2xl border" placeholder="ক্যাপশন" value={galleryCap} onChange={e => setGalleryCap(e.target.value)} />
                  <button onClick={handleAddGallery} className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg">ছবি যোগ করুন</button>
                </div>
              </div>
              <div className="lg:col-span-2 grid grid-cols-3 gap-4 overflow-y-auto no-scrollbar">
                {gallery.map(g => (
                  <div key={g.id} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={g.url} className="w-full h-full object-cover" />
                    <button onClick={() => handleDelete('gallery', g.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100"><i className="fas fa-trash text-xs"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'site_settings' && (
            <div className="max-w-2xl mx-auto space-y-10">
               <div className="bg-slate-50 p-6 rounded-3xl border">
                 <h4 className="font-bold mb-4">ব্রেকিং নিউজ আপডেট</h4>
                 <div className="flex gap-4">
                   <input className="flex-1 p-4 rounded-2xl border" defaultValue={footerData.urgentNews} id="siteNews" />
                   <button onClick={() => handleUpdateSettings({ urgentNews: (document.getElementById('siteNews') as HTMLInputElement).value })} className="bg-slate-900 text-white px-6 rounded-xl font-bold">আপডেট</button>
                 </div>
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl border">
                 <h4 className="font-bold mb-4">হিরো ইমেজ URL</h4>
                 <div className="flex gap-4">
                   <input className="flex-1 p-4 rounded-2xl border" defaultValue={footerData.heroImageUrl} id="siteHero" />
                   <button onClick={() => handleUpdateSettings({ heroImageUrl: (document.getElementById('siteHero') as HTMLInputElement).value })} className="bg-slate-900 text-white px-6 rounded-xl font-bold">আপডেট</button>
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
