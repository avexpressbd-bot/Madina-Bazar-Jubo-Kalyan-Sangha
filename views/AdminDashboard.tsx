
import React, { useState } from 'react';
import { Member, Notice, Team, TournamentStats, GalleryImage, User, Post, FooterData, AboutData } from '../types';

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
  members, setMembers, committee, setCommittee, notices, setNotices, gallery, setGallery,
  upcomingTeams, setUpcomingTeams, cricketStats, setCricketStats, users, setUsers,
  posts, setPosts, footerData, setFooterData, aboutData, setAboutData
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'notices' | 'people' | 'gallery' | 'cricket' | 'site_settings'>('feed');

  // Local states for forms
  const [newPost, setNewPost] = useState({ content: '', mediaUrl: '', mediaType: 'none' as any });
  const [newNotice, setNewNotice] = useState({ title: '', description: '', videoUrl: '' });
  const [newPerson, setNewPerson] = useState({ name: '', role: '', phone: '', image: '', type: 'member' });
  const [newGallery, setNewGallery] = useState({ url: '', caption: '' });

  const handleAddPost = () => {
    if (!newPost.content) return alert('পোস্টের লেখা লিখুন');
    const post: Post = {
      id: Date.now().toString(),
      content: newPost.content,
      mediaUrl: newPost.mediaUrl,
      mediaType: newPost.mediaType,
      date: new Date().toLocaleDateString('bn-BD'),
      likes: 0
    };
    setPosts([post, ...posts]);
    setNewPost({ content: '', mediaUrl: '', mediaType: 'none' });
    alert('পোস্টটি পাবলিশ করা হয়েছে!');
  };

  const handleUpdateAbout = (field: keyof AboutData, value: any) => {
    setAboutData({ ...aboutData, [field]: value });
  };

  const handleUpdateCricket = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCricketStats({ ...cricketStats, [parent]: { ...(cricketStats as any)[parent], [child]: value } });
    } else {
      setCricketStats({ ...cricketStats, [field]: value });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        {/* Navigation Sidebar/Header */}
        <div className="bg-slate-900 px-6 py-4 flex flex-wrap gap-2 justify-center lg:justify-start">
          {[
            { id: 'feed', label: 'পোস্ট ফিড', icon: 'fa-rss' },
            { id: 'notices', label: 'নোটিশ বোর্ড', icon: 'fa-bullhorn' },
            { id: 'people', label: 'মেম্বার ও কমিটি', icon: 'fa-users' },
            { id: 'gallery', label: 'গ্যালারি', icon: 'fa-images' },
            { id: 'cricket', label: 'ক্রিকেট হাব', icon: 'fa-bat-ball' },
            { id: 'site_settings', label: 'সাইট সেটিংস', icon: 'fa-cog' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <i className={`fas ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 lg:p-12">
          {/* FEED MANAGEMENT */}
          {activeTab === 'feed' && (
            <div className="space-y-10">
              <div className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-300">
                <h3 className="text-xl font-bold mb-6 flex items-center"><i className="fas fa-edit mr-3 text-blue-600"></i> নতুন কি পোস্ট করতে চান?</h3>
                <div className="space-y-4">
                  <textarea 
                    className="w-full p-5 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 text-lg" 
                    rows={4} 
                    placeholder="ফেসবুকের মতো এখানে আপনার বার্তা লিখুন..."
                    value={newPost.content}
                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      className="w-full p-4 rounded-xl border border-slate-200" 
                      placeholder="মিডিয়া URL (ছবি বা ভিডিও লিংক)" 
                      value={newPost.mediaUrl}
                      onChange={e => setNewPost({...newPost, mediaUrl: e.target.value})}
                    />
                    <select 
                      className="w-full p-4 rounded-xl border border-slate-200"
                      value={newPost.mediaType}
                      onChange={e => setNewPost({...newPost, mediaType: e.target.value as any})}
                    >
                      <option value="none">কোন মিডিয়া নেই</option>
                      <option value="image">ছবি (Image)</option>
                      <option value="video">ভিডিও (Video Link)</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleAddPost}
                    className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all"
                  >
                    পোস্ট পাবলিশ করুন
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-400 uppercase text-xs tracking-widest">সাম্প্রতিক পোস্টসমূহ</h4>
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <i className={`fas ${post.mediaType === 'image' ? 'fa-image' : post.mediaType === 'video' ? 'fa-video' : 'fa-align-left'}`}></i>
                      </div>
                      <p className="text-sm font-medium text-slate-700 truncate max-w-md">{post.content}</p>
                    </div>
                    <button 
                      onClick={() => setPosts(posts.filter(p => p.id !== post.id))}
                      className="text-red-100 group-hover:text-red-500 transition-colors p-2"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTICES */}
          {activeTab === 'notices' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-slate-50 p-6 rounded-3xl h-fit">
                <h3 className="font-bold mb-6">নতুন নোটিশ যোগ করুন</h3>
                <div className="space-y-4">
                  <input className="w-full p-3 rounded-xl border" placeholder="নোটিশ টাইটেল" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                  <textarea className="w-full p-3 rounded-xl border" rows={4} placeholder="বিস্তারিত" value={newNotice.description} onChange={e => setNewNotice({...newNotice, description: e.target.value})} />
                  <button 
                    onClick={() => {
                      if(!newNotice.title) return;
                      setNotices([{...newNotice, id: Date.now().toString(), date: new Date().toLocaleDateString('bn-BD')}, ...notices]);
                      setNewNotice({title: '', description: '', videoUrl: ''});
                    }}
                    className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl"
                  >
                    নোটিশ ছাড়ুন
                  </button>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {notices.map(n => (
                  <div key={n.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center">
                    <span className="font-bold">{n.title}</span>
                    <button onClick={() => setNotices(notices.filter(item => item.id !== n.id))} className="text-red-500"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SITE SETTINGS (ABOUT & FOOTER) */}
          {activeTab === 'site_settings' && (
            <div className="space-y-12">
              <div className="bg-slate-50 p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-bold mb-8 flex items-center"><i className="fas fa-info-circle mr-3 text-blue-600"></i> এবাউট পেজ ও পরিসংখ্যান</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">সংগঠনের বর্ণনা</label>
                    <textarea 
                      className="w-full p-4 rounded-xl border" 
                      rows={3} 
                      value={aboutData.description} 
                      onChange={e => handleUpdateAbout('description', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">আমাদের লক্ষ্য</label>
                      <textarea className="w-full p-4 rounded-xl border" value={aboutData.mission} onChange={e => handleUpdateAbout('mission', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">আমাদের উদ্দেশ্য</label>
                      <textarea className="w-full p-4 rounded-xl border" value={aboutData.vision} onChange={e => handleUpdateAbout('vision', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-bold mb-8 flex items-center"><i className="fas fa-sliders mr-3 text-green-600"></i> সাইট কনফিগারেশন</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold mb-2">ব্যানার ইমেজ (Hero URL)</label>
                    <input className="w-full p-4 rounded-xl border" value={footerData.heroImageUrl} onChange={e => setFooterData({...footerData, heroImageUrl: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">ব্রেকিং নিউজ টেক্সট</label>
                    <input className="w-full p-4 rounded-xl border" value={footerData.urgentNews} onChange={e => setFooterData({...footerData, urgentNews: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">অফিস ঠিকানা</label>
                    <input className="w-full p-4 rounded-xl border" value={footerData.address} onChange={e => setFooterData({...footerData, address: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">ফোন নম্বর</label>
                    <input className="w-full p-4 rounded-xl border" value={footerData.phone} onChange={e => setFooterData({...footerData, phone: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CRICKET STATS */}
          {activeTab === 'cricket' && (
            <div className="space-y-8">
              <div className="bg-blue-50 p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-bold mb-8">টুর্নামেন্ট ফলাফল আপডেট</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">বছর</label>
                    <input className="w-full p-3 rounded-xl border" value={cricketStats.year} onChange={e => handleUpdateCricket('year', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">বিজয়ী দল</label>
                    <input className="w-full p-3 rounded-xl border" value={cricketStats.winner} onChange={e => handleUpdateCricket('winner', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">রানার্স-আপ</label>
                    <input className="w-full p-3 rounded-xl border" value={cricketStats.runnerUp} onChange={e => handleUpdateCricket('runnerUp', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                  <div className="bg-white p-6 rounded-2xl border">
                    <h4 className="font-bold mb-4">টপ স্কোরার</h4>
                    <input className="w-full p-3 mb-3 rounded-lg border" placeholder="নাম" value={cricketStats.topScorer.name} onChange={e => handleUpdateCricket('topScorer.name', e.target.value)} />
                    <input className="w-full p-3 mb-3 rounded-lg border" placeholder="রান" type="number" value={cricketStats.topScorer.runs} onChange={e => handleUpdateCricket('topScorer.runs', Number(e.target.value))} />
                    <input className="w-full p-3 rounded-lg border" placeholder="ছবির URL" value={cricketStats.topScorer.image} onChange={e => handleUpdateCricket('topScorer.image', e.target.value)} />
                  </div>
                  <div className="bg-white p-6 rounded-2xl border">
                    <h4 className="font-bold mb-4">টপ উইকেট টেকার</h4>
                    <input className="w-full p-3 mb-3 rounded-lg border" placeholder="নাম" value={cricketStats.topWicketTaker.name} onChange={e => handleUpdateCricket('topWicketTaker.name', e.target.value)} />
                    <input className="w-full p-3 mb-3 rounded-lg border" placeholder="উইকেট" type="number" value={cricketStats.topWicketTaker.wickets} onChange={e => handleUpdateCricket('topWicketTaker.wickets', Number(e.target.value))} />
                    <input className="w-full p-3 rounded-lg border" placeholder="ছবির URL" value={cricketStats.topWicketTaker.image} onChange={e => handleUpdateCricket('topWicketTaker.image', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS (PEOPLE/GALLERY) would follow similar patterns */}
          {activeTab === 'people' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-slate-50 p-6 rounded-3xl">
                  <h3 className="font-bold mb-6">নতুন মেম্বার/কমিটি মেম্বার যোগ</h3>
                  <div className="space-y-4">
                    <input className="w-full p-3 rounded-xl border" placeholder="নাম" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} />
                    <input className="w-full p-3 rounded-xl border" placeholder="পদবী" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})} />
                    <input className="w-full p-3 rounded-xl border" placeholder="মোবাইল" value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})} />
                    <input className="w-full p-3 rounded-xl border" placeholder="ছবির URL" value={newPerson.image} onChange={e => setNewPerson({...newPerson, image: e.target.value})} />
                    <select className="w-full p-3 rounded-xl border" value={newPerson.type} onChange={e => setNewPerson({...newPerson, type: e.target.value})}>
                      <option value="member">সাধারণ মেম্বার</option>
                      <option value="committee">কমিটি মেম্বার</option>
                    </select>
                    <button 
                      onClick={() => {
                        if(!newPerson.name) return;
                        const p = { ...newPerson, id: Date.now().toString() };
                        if(newPerson.type === 'member') setMembers([...members, p]);
                        else setCommittee([...committee, p]);
                        setNewPerson({name: '', role: '', phone: '', image: '', type: 'member'});
                        alert('সফলভাবে যোগ করা হয়েছে');
                      }}
                      className="w-full bg-green-600 text-white font-bold py-3 rounded-xl"
                    >
                      সেভ করুন
                    </button>
                  </div>
                </div>
                <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
                  <h4 className="font-bold text-slate-400">বর্তমান মেম্বার ও কমিটি</h4>
                  {[...committee, ...members].map(m => (
                    <div key={m.id} className="p-3 bg-white border rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={m.image} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium">{m.name} ({m.role})</span>
                      </div>
                      <button onClick={() => {
                        setMembers(members.filter(item => item.id !== m.id));
                        setCommittee(committee.filter(item => item.id !== m.id));
                      }} className="text-red-400"><i className="fas fa-trash-can"></i></button>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {activeTab === 'gallery' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-slate-50 p-6 rounded-3xl h-fit">
                   <h3 className="font-bold mb-6">গ্যালারিতে ছবি যোগ</h3>
                   <input className="w-full p-3 mb-4 rounded-xl border" placeholder="ছবির URL" value={newGallery.url} onChange={e => setNewGallery({...newGallery, url: e.target.value})} />
                   <input className="w-full p-3 mb-4 rounded-xl border" placeholder="ক্যাপশন" value={newGallery.caption} onChange={e => setNewGallery({...newGallery, caption: e.target.value})} />
                   <button 
                    onClick={() => {
                      if(!newGallery.url) return;
                      setGallery([...gallery, {...newGallery, id: Date.now().toString()}]);
                      setNewGallery({url: '', caption: ''});
                      alert('গ্যালারিতে যোগ হয়েছে');
                    }}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl"
                   >
                     ছবি যোগ করুন
                   </button>
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto no-scrollbar">
                   {gallery.map(g => (
                     <div key={g.id} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={g.url} className="w-full h-full object-cover" />
                        <button onClick={() => setGallery(gallery.filter(item => item.id !== g.id))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><i className="fas fa-trash"></i></button>
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
