
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
  const pendingRequests = users.filter(u => u.status === 'pending');
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'posts' | 'notices' | 'members' | 'committee' | 'gallery' | 'cricket_stats' | 'about_edit' | 'site_settings' | 'requests'>('posts');

  // Switch to requests tab automatically if there are pending requests when dashboard is opened
  useEffect(() => {
    if (pendingRequests.length > 0) {
      setActiveTab('requests');
    }
  }, [pendingRequests.length]);
  
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
  const [newParticipatingTeam, setNewParticipatingTeam] = useState('');
  
  // Upcoming Team Form
  const [teamForm, setTeamForm] = useState({
    id: '',
    name: '',
    logo: '',
    players: '' 
  });

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

  const handleApproveUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'approved' } : u));
  };

  const handleRejectUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
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
    alert('টুর্নামেন্টের সাধারণ তথ্য সেভ করা হয়েছে!');
  };

  const handleSaveTeam = () => {
    const playersArr = teamForm.players.split(',').map(p => p.trim()).filter(p => p !== '');
    const teamObj: Team = {
      id: teamForm.id || Date.now().toString(),
      name: teamForm.name,
      logo: teamForm.logo || 'https://via.placeholder.com/150',
      players: playersArr
    };

    if (teamForm.id) {
      setUpcomingTeams(upcomingTeams.map(t => t.id === teamForm.id ? teamObj : t));
    } else {
      setUpcomingTeams([...upcomingTeams, teamObj]);
    }
    setTeamForm({ id: '', name: '', logo: '', players: '' });
  };

  const handleSaveSite = () => {
    setFooterData({...footerData, heroImageUrl: siteHero, urgentNews: siteNews});
    alert('সাইট সেটিংস আপডেট করা হয়েছে!');
  };

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
                {id: 'requests', label: `আবেদন (${pendingRequests.length})`, highlight: pendingRequests.length > 0}
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : tab.highlight ? 'text-orange-400 bg-orange-500/10' : 'text-slate-400 hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'requests' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {pendingRequests.map(u => (
                  <div key={u.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between shadow-sm">
                    <div className="mb-4">
                        <div className="flex items-center mb-3">
                           <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">{u.name[0]}</div>
                           <h4 className="font-bold text-lg text-slate-800">{u.name}</h4>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-500 flex items-center"><i className="fas fa-envelope mr-2 w-4 text-blue-400"></i> {u.email}</p>
                          <p className="text-sm text-slate-500 flex items-center"><i className="fas fa-phone mr-2 w-4 text-blue-400"></i> {u.phone}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => handleApproveUser(u.id)} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold transition-all hover:bg-green-700 active:scale-95 shadow-md">অ্যাপ্রুভ</button>
                        <button onClick={() => handleRejectUser(u.id)} className="flex-1 bg-white border-2 border-red-500 text-red-500 py-2.5 rounded-xl font-bold transition-all hover:bg-red-50 active:scale-95">বাতিল</button>
                    </div>
                  </div>
                ))}
                {pendingRequests.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-check text-slate-300 text-3xl"></i>
                    </div>
                    <p className="text-slate-400 italic">নতুন কোনো আবেদন নেই</p>
                  </div>
                )}
             </div>
          )}

          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 h-fit">
                    <h4 className="font-bold text-lg mb-6">{editingId ? 'পোস্ট এডিট করুন' : 'নতুন পোস্ট করুন'}</h4>
                    <div className="space-y-4">
                        <textarea className="w-full p-3 rounded-xl border" placeholder="পোস্টের বিবরণ..." value={input1} onChange={e => setInput1(e.target.value)} rows={4}></textarea>
                        <input className="w-full p-3 rounded-xl border" placeholder="ছবি/ভিডিও URL" value={input2} onChange={e => setInput2(e.target.value)} />
                        <select className="w-full p-3 rounded-xl border" value={input4} onChange={e => setInput4(e.target.value)}>
                            <option value="none">মিডিয়া টাইপ সিলেক্ট করুন</option>
                            <option value="image">ছবি (Image)</option>
                            <option value="video">ভিডিও (Video)</option>
                        </select>
                        <button 
                            onClick={() => {
                                const newPost = {id: editingId || Date.now().toString(), content: input1, mediaUrl: input2, mediaType: (input4 || 'none') as any, date: new Date().toLocaleDateString('bn-BD'), likes: 0};
                                if(editingId) setPosts(posts.map(p => p.id === editingId ? newPost : p));
                                else setPosts([newPost, ...posts]);
                                resetInputs();
                            }} 
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg"
                        >
                            পোস্ট পাবলিশ করুন
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                    <h4 className="font-bold text-lg mb-4">বিদ্যমান পোস্টসমূহ</h4>
                    {posts.map(p => (
                        <div key={p.id} className="bg-white p-4 border rounded-2xl flex justify-between items-center shadow-sm">
                            <p className="truncate pr-4 flex-1 text-slate-700">{p.content}</p>
                            <div className="flex gap-2">
                                <button onClick={() => {setInput1(p.content); setInput2(p.mediaUrl || ''); setInput4(p.mediaType); setEditingId(p.id)}} className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg"><i className="fas fa-edit"></i></button>
                                <button onClick={() => setPosts(posts.filter(x => x.id !== p.id))} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><i className="fas fa-trash"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* Site Settings Tab */}
          {activeTab === 'site_settings' && (
            <div className="space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
               <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <i className="fas fa-sliders mr-3 text-blue-600"></i> সাইট সেটিংস ও নিউজ টিংকার
              </h3>
              <div className="max-w-3xl space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">হোম পেজ হিরো ইমেজ URL</label>
                  <input className="w-full p-4 rounded-2xl border" value={siteHero} onChange={e => setSiteHero(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">জরুরী ব্রেকিং নিউজ</label>
                  <textarea className="w-full p-4 rounded-2xl border" rows={3} value={siteNews} onChange={e => setSiteNews(e.target.value)}></textarea>
                </div>
                <button onClick={handleSaveSite} className="bg-blue-600 text-white font-bold py-4 px-12 rounded-2xl shadow-xl">সাইট আপডেট করুন</button>
              </div>
            </div>
          )}

          {/* Rest of the tabs (Notices, Cricket, Members etc.) - Similar logic as above */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
