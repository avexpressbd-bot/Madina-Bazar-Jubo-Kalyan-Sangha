
import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState<'posts' | 'notices' | 'members' | 'committee' | 'gallery' | 'cricket_stats' | 'about_edit' | 'site_settings' | 'requests'>('posts');
  
  // Site Settings States
  const [siteHero, setSiteHero] = useState(footerData.heroImageUrl);
  const [siteNews, setSiteNews] = useState(footerData.urgentNews);
  
  // About Page States
  const [aboutDesc, setAboutDesc] = useState(aboutData.description);
  const [aboutMission, setAboutMission] = useState(aboutData.mission);
  const [aboutVision, setAboutVision] = useState(aboutData.vision);
  const [aboutStats, setAboutStats] = useState(aboutData.stats);

  // Cricket Hub States
  const [cStats, setCStats] = useState(cricketStats);

  // General Input States
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetInputs = () => {
    setInput1(''); setInput2(''); setInput3(''); setInput4('');
    setEditingId(null);
  };

  const handleSaveAbout = () => {
    setAboutData({
      description: aboutDesc,
      mission: aboutMission,
      vision: aboutVision,
      stats: aboutStats
    });
    alert('এবাউট পেজ আপডেট করা হয়েছে!');
  };

  const handleSaveCricket = () => {
    setCricketStats(cStats);
    alert('ক্রিকেট তথ্য আপডেট করা হয়েছে!');
  };

  const handleSaveSite = () => {
    setFooterData({...footerData, heroImageUrl: siteHero, urgentNews: siteNews});
    alert('সাইট সেটিংস আপডেট করা হয়েছে!');
  };

  const pendingRequests = users.filter(u => u.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg shadow-blue-900/50">
                <i className="fas fa-user-shield text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black">মাস্টার ড্যাশবোর্ড</h2>
                <p className="text-slate-400 text-sm">সব তথ্য এখান থেকে পরিচালনা করুন</p>
              </div>
            </div>
            <div className="flex bg-slate-800 p-1.5 rounded-2xl overflow-x-auto max-w-full no-scrollbar">
              {[
                {id: 'posts', label: 'ফিড'},
                {id: 'notices', label: 'নোটিশ'},
                {id: 'members', label: 'মেম্বার'},
                {id: 'committee', label: 'কমিটি'},
                {id: 'gallery', label: 'গ্যালারি'},
                {id: 'cricket_stats', label: 'ক্রিকেট'},
                {id: 'about_edit', label: 'এবাউট'},
                {id: 'site_settings', label: 'সাইট'},
                {id: 'requests', label: `আবেদন (${pendingRequests.length})`}
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'about_edit' && (
            <div className="space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <i className="fas fa-info-circle mr-3 text-blue-600"></i> এবাউট পেজ এডিট
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">সংগঠনের মূল বর্ণনা</label>
                  <textarea className="w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-100" rows={5} value={aboutDesc} onChange={e => setAboutDesc(e.target.value)}></textarea>
                  
                  <label className="block text-sm font-bold text-slate-700">আমাদের লক্ষ্য (Mission)</label>
                  <input className="w-full p-4 rounded-2xl border outline-none" value={aboutMission} onChange={e => setAboutMission(e.target.value)} />
                  
                  <label className="block text-sm font-bold text-slate-700">আমাদের উদ্দেশ্য (Vision)</label>
                  <input className="w-full p-4 rounded-2xl border outline-none" value={aboutVision} onChange={e => setAboutVision(e.target.value)} />
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 border-b pb-2">পরিসংখ্যান (Stats)</h4>
                  {aboutStats.map((stat, idx) => (
                    <div key={idx} className="flex gap-4">
                      <input className="flex-1 p-3 rounded-xl border" placeholder="Label" value={stat.label} onChange={e => {
                        const newStats = [...aboutStats];
                        newStats[idx].label = e.target.value;
                        setAboutStats(newStats);
                      }} />
                      <input className="w-32 p-3 rounded-xl border" placeholder="Count" value={stat.count} onChange={e => {
                        const newStats = [...aboutStats];
                        newStats[idx].count = e.target.value;
                        setAboutStats(newStats);
                      }} />
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleSaveAbout} className="bg-blue-600 text-white font-bold py-4 px-12 rounded-2xl shadow-xl hover:bg-blue-700 transition-all">এবাউট আপডেট করুন</button>
            </div>
          )}

          {activeTab === 'cricket_stats' && (
            <div className="space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
               <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <i className="fas fa-cricket-bat-ball mr-3 text-blue-600"></i> ক্রিকেট টুর্নামেন্ট ডাটা এডিট
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold border-b pb-2">টুর্নামেন্ট ফলাফল</h4>
                  <input className="w-full p-3 rounded-xl border" placeholder="বছর" value={cStats.year} onChange={e => setCStats({...cStats, year: e.target.value})} />
                  <input className="w-full p-3 rounded-xl border" placeholder="চ্যাম্পিয়ন" value={cStats.winner} onChange={e => setCStats({...cStats, winner: e.target.value})} />
                  <input className="w-full p-3 rounded-xl border" placeholder="রানার-আপ" value={cStats.runnerUp} onChange={e => setCStats({...cStats, runnerUp: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold border-b pb-2">সর্বোচ্চ রান সংগ্রাহক</h4>
                  <input className="w-full p-3 rounded-xl border" placeholder="নাম" value={cStats.topScorer.name} onChange={e => setCStats({...cStats, topScorer: {...cStats.topScorer, name: e.target.value}})} />
                  <input className="w-full p-3 rounded-xl border" placeholder="রান" type="number" value={cStats.topScorer.runs} onChange={e => setCStats({...cStats, topScorer: {...cStats.topScorer, runs: parseInt(e.target.value)}})} />
                  <input className="w-full p-3 rounded-xl border" placeholder="ছবির ইউআরএল" value={cStats.topScorer.image} onChange={e => setCStats({...cStats, topScorer: {...cStats.topScorer, image: e.target.value}})} />
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold border-b pb-2">সর্বোচ্চ উইকেট শিকারী</h4>
                  <input className="w-full p-3 rounded-xl border" placeholder="নাম" value={cStats.topWicketTaker.name} onChange={e => setCStats({...cStats, topWicketTaker: {...cStats.topWicketTaker, name: e.target.value}})} />
                  <input className="w-full p-3 rounded-xl border" placeholder="উইকেট" type="number" value={cStats.topWicketTaker.wickets} onChange={e => setCStats({...cStats, topWicketTaker: {...cStats.topWicketTaker, wickets: parseInt(e.target.value)}})} />
                  <input className="w-full p-3 rounded-xl border" placeholder="ছবির ইউআরএল" value={cStats.topWicketTaker.image} onChange={e => setCStats({...cStats, topWicketTaker: {...cStats.topWicketTaker, image: e.target.value}})} />
                </div>
              </div>
              <button onClick={handleSaveCricket} className="bg-blue-600 text-white font-bold py-4 px-12 rounded-2xl shadow-xl hover:bg-blue-700 transition-all">ক্রিকেট ডাটা সেভ করুন</button>
            </div>
          )}

          {activeTab === 'site_settings' && (
            <div className="space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
               <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <i className="fas fa-sliders mr-3 text-blue-600"></i> সাইট সেটিংস ও নিউজ টিংকার
              </h3>
              <div className="max-w-3xl space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">হোম পেজ বড় ছবি (Hero Image URL)</label>
                  <input className="w-full p-4 rounded-2xl border" value={siteHero} onChange={e => setSiteHero(e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">জরুরী নিউজ (ব্রেকিং নিউজ লেখা)</label>
                  <textarea className="w-full p-4 rounded-2xl border" rows={3} value={siteNews} onChange={e => setSiteNews(e.target.value)} placeholder="ব্রেকিং নিউজ এখানে লিখুন..."></textarea>
                </div>
                <button onClick={handleSaveSite} className="bg-blue-600 text-white font-bold py-4 px-12 rounded-2xl shadow-xl">সাইট আপডেট করুন</button>
              </div>
            </div>
          )}

          {/* Existing tabs for Posts, Members etc. (Keep their functionality but style like above) */}
          {(activeTab === 'posts' || activeTab === 'notices' || activeTab === 'members' || activeTab === 'committee' || activeTab === 'gallery') && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form column */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 h-fit">
                    <h4 className="font-bold text-lg mb-6">{editingId ? 'এডিট করুন' : 'নতুন যোগ করুন'}</h4>
                    <div className="space-y-4">
                        <textarea className="w-full p-3 rounded-xl border" placeholder="মূল লেখা/বিবরণ" value={input1} onChange={e => setInput1(e.target.value)} rows={4}></textarea>
                        <input className="w-full p-3 rounded-xl border" placeholder="অতিরিক্ত তথ্য/লিঙ্ক ১" value={input2} onChange={e => setInput2(e.target.value)} />
                        <input className="w-full p-3 rounded-xl border" placeholder="অতিরিক্ত তথ্য/লিঙ্ক ২" value={input3} onChange={e => setInput3(e.target.value)} />
                        {activeTab === 'posts' && (
                            <select className="w-full p-3 rounded-xl border" value={input4} onChange={e => setInput4(e.target.value)}>
                                <option value="none">None</option>
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                            </select>
                        )}
                        <button 
                            onClick={() => {
                                // Logic for saving based on activeTab
                                if(activeTab === 'posts') {
                                    const newPost = {id: editingId || Date.now().toString(), content: input1, mediaUrl: input2, mediaType: (input4 || 'none') as any, date: new Date().toLocaleDateString('bn-BD'), likes: 0};
                                    if(editingId) setPosts(posts.map(p => p.id === editingId ? newPost : p));
                                    else setPosts([newPost, ...posts]);
                                }
                                resetInputs();
                            }} 
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl"
                        >
                            সেভ করুন
                        </button>
                    </div>
                </div>
                {/* List column */}
                <div className="lg:col-span-2 space-y-4">
                    <h4 className="font-bold text-lg mb-4">বিদ্যমান লিস্ট</h4>
                    {activeTab === 'posts' && posts.map(p => (
                        <div key={p.id} className="bg-white p-4 border rounded-2xl flex justify-between items-center shadow-sm">
                            <p className="truncate pr-4 flex-1">{p.content}</p>
                            <div className="flex gap-2">
                                <button onClick={() => {setInput1(p.content); setInput2(p.mediaUrl || ''); setInput4(p.mediaType); setEditingId(p.id)}} className="text-blue-600 p-2"><i className="fas fa-edit"></i></button>
                                <button onClick={() => setPosts(posts.filter(x => x.id !== p.id))} className="text-red-500 p-2"><i className="fas fa-trash"></i></button>
                            </div>
                        </div>
                    ))}
                    {/* Add lists for other tabs similarly */}
                </div>
            </div>
          )}
          
          {activeTab === 'requests' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingRequests.map(u => (
                  <div key={u.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-lg">{u.name}</h4>
                        <p className="text-sm text-slate-500 mb-4">{u.email} | {u.phone}</p>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={() => setUsers(users.map(x => x.id === u.id ? {...x, status: 'approved'} : x))} className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold">অ্যাপ্রুভ</button>
                        <button onClick={() => setUsers(users.filter(x => x.id !== u.id))} className="flex-1 bg-red-100 text-red-600 py-2 rounded-xl font-bold">বাতিল</button>
                    </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
