
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
  const pendingRequests = users.filter(u => u.status === 'pending');
  const [activeTab, setActiveTab] = useState<'posts' | 'notices' | 'members' | 'committee' | 'gallery' | 'requests' | 'site_settings'>('posts');

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');

  // Universal Save Function
  const handleAddItem = async (collectionName: string) => {
    if (!input1) return alert('অনুগ্রহ করে নাম বা টাইটেল দিন');
    const id = collectionName + '-' + Date.now();
    let data: any = { id };

    switch(collectionName) {
      case 'posts':
        data = { ...data, content: input1, mediaUrl: input2, mediaType: input4 || 'none', date: new Date().toLocaleDateString('bn-BD'), likes: 0 };
        break;
      case 'notices':
        data = { ...data, title: input1, description: input2, videoUrl: input3, date: new Date().toLocaleDateString('bn-BD') };
        break;
      case 'members':
      case 'committee':
        data = { ...data, name: input1, role: input2, image: input3, phone: input4 };
        break;
      case 'gallery':
        data = { ...data, url: input1, caption: input2 };
        break;
    }

    try {
      await setDoc(doc(db, collectionName, id), data);
      setInput1(''); setInput2(''); setInput3(''); setInput4('');
      alert('সফলভাবে ডাটাবেসে যোগ হয়েছে!');
    } catch (e) {
      alert('এরর: ডাটা সেভ হয়নি।');
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if(window.confirm('আপনি কি নিশ্চিত যে এটি ডিলিট করতে চান?')) {
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  const handleApproveUser = async (id: string) => {
    await updateDoc(doc(db, 'users', id), { status: 'approved' });
  };

  const handleSaveGlobal = async (key: string, data: any) => {
    await setDoc(doc(db, 'settings', 'global'), { [key]: data }, { merge: true });
    alert('সেটিংস আপডেট হয়েছে!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-6 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-black flex items-center">
              <i className="fas fa-database mr-3 text-blue-500"></i> এডমিন প্যানেল
            </h2>
            <div className="flex bg-slate-800 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-full">
              {[
                {id: 'posts', label: 'ফিড'},
                {id: 'notices', label: 'নোটিশ'},
                {id: 'members', label: 'মেম্বার'},
                {id: 'committee', label: 'কমিটি'},
                {id: 'gallery', label: 'গ্যালারি'},
                {id: 'requests', label: `আবেদন (${pendingRequests.length})`},
                {id: 'site_settings', label: 'সাইট'},
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map(u => (
                <div key={u.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-slate-800">{u.name}</h4>
                  <p className="text-xs text-slate-500 mb-4">{u.email} | {u.phone}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveUser(u.id)} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold">অ্যাপ্রুভ</button>
                    <button onClick={() => handleDelete('users', u.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-xs font-bold">বাতিল</button>
                  </div>
                </div>
              ))}
              {pendingRequests.length === 0 && <p className="col-span-full text-center py-10 text-slate-400">নতুন কোনো আবেদন নেই।</p>}
            </div>
          )}

          {/* Other Tabs Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Column */}
            {activeTab !== 'requests' && activeTab !== 'site_settings' && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 h-fit">
                <h4 className="font-bold mb-4 capitalize">{activeTab} যোগ করুন</h4>
                <div className="space-y-3">
                  <input className="w-full p-3 text-sm rounded-xl border" placeholder={activeTab === 'posts' ? 'কন্টেন্ট' : 'টাইটেল/নাম'} value={input1} onChange={e => setInput1(e.target.value)} />
                  <input className="w-full p-3 text-sm rounded-xl border" placeholder={activeTab === 'posts' ? 'মিডিয়া URL' : 'রোল/ডেসক্রিপশন'} value={input2} onChange={e => setInput2(e.target.value)} />
                  {activeTab !== 'posts' && <input className="w-full p-3 text-sm rounded-xl border" placeholder="Image/Video URL" value={input3} onChange={e => setInput3(e.target.value)} />}
                  {activeTab !== 'gallery' && <input className="w-full p-3 text-sm rounded-xl border" placeholder={activeTab === 'posts' ? 'মিডিয়া টাইপ (image/video)' : 'মোবাইল নং'} value={input4} onChange={e => setInput4(e.target.value)} />}
                  <button onClick={() => handleAddItem(activeTab)} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg">ডাটাবেসে পাঠান</button>
                </div>
              </div>
            )}

            {/* List Column */}
            <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
              {activeTab === 'posts' && posts.map(i => (
                <div key={i.id} className="p-4 bg-white border rounded-xl flex justify-between items-center shadow-sm">
                  <p className="text-sm truncate flex-1">{i.content}</p>
                  <button onClick={() => handleDelete('posts', i.id)} className="text-red-500 ml-4"><i className="fas fa-trash"></i></button>
                </div>
              ))}
              {activeTab === 'members' && members.map(i => (
                <div key={i.id} className="p-4 bg-white border rounded-xl flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={i.image} className="w-8 h-8 rounded-full object-cover" />
                    <p className="text-sm font-bold">{i.name}</p>
                  </div>
                  <button onClick={() => handleDelete('members', i.id)} className="text-red-500"><i className="fas fa-trash"></i></button>
                </div>
              ))}
              {activeTab === 'notices' && notices.map(i => (
                <div key={i.id} className="p-4 bg-white border rounded-xl flex justify-between items-center shadow-sm">
                  <p className="text-sm font-bold">{i.title}</p>
                  <button onClick={() => handleDelete('notices', i.id)} className="text-red-500"><i className="fas fa-trash"></i></button>
                </div>
              ))}
              {activeTab === 'gallery' && gallery.map(i => (
                <div key={i.id} className="p-4 bg-white border rounded-xl flex justify-between items-center shadow-sm">
                  <img src={i.url} className="w-10 h-10 rounded object-cover" />
                  <p className="text-sm truncate flex-1 ml-4">{i.caption}</p>
                  <button onClick={() => handleDelete('gallery', i.id)} className="text-red-500"><i className="fas fa-trash"></i></button>
                </div>
              ))}
              {activeTab === 'site_settings' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <label className="text-xs font-bold text-slate-500 uppercase">ব্রেকিং নিউজ</label>
                    <textarea className="w-full p-3 mt-2 rounded-lg border text-sm" defaultValue={footerData.urgentNews} onBlur={e => handleSaveGlobal('footerData', {...footerData, urgentNews: e.target.value})} />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <label className="text-xs font-bold text-slate-500 uppercase">হিরো ইমেজ URL</label>
                    <input className="w-full p-3 mt-2 rounded-lg border text-sm" defaultValue={footerData.heroImageUrl} onBlur={e => handleSaveGlobal('footerData', {...footerData, heroImageUrl: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
