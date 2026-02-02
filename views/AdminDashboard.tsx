
import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState<'posts' | 'notices' | 'members' | 'committee' | 'gallery' | 'cricket_stats' | 'about_edit' | 'site_settings' | 'requests'>(
    pendingRequests.length > 0 ? 'requests' : 'posts'
  );

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleApproveUser = async (id: string) => {
    await updateDoc(doc(db, 'users', id), { status: 'approved' });
  };

  const handleRejectUser = async (id: string) => {
    await deleteDoc(doc(db, 'users', id));
  };

  const handleSavePost = async () => {
    const id = editingId || 'post-' + Date.now();
    const newPost: Post = {
      id,
      content: input1,
      mediaUrl: input2,
      mediaType: (input4 || 'none') as any,
      date: new Date().toLocaleDateString('bn-BD'),
      likes: 0
    };
    await setDoc(doc(db, 'posts', id), newPost);
    setInput1(''); setInput2(''); setInput4(''); setEditingId(null);
  };

  const handleSaveGlobal = async (key: string, data: any) => {
    await setDoc(doc(db, 'settings', 'global'), { [key]: data }, { merge: true });
    alert('আপডেট সফল হয়েছে!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <h2 className="text-2xl font-black">ক্লাউড ড্যাশবোর্ড (Firebase)</h2>
            <div className="flex bg-slate-800 p-1.5 rounded-2xl overflow-x-auto max-w-full no-scrollbar">
              {[
                {id: 'posts', label: 'ফিড'},
                {id: 'requests', label: `আবেদন (${pendingRequests.length})`, highlight: pendingRequests.length > 0},
                {id: 'site_settings', label: 'সাইট সেটিংস'}
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : tab.highlight ? 'text-orange-400' : 'text-slate-400'}`}
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
                  <div key={u.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-lg text-slate-800 mb-2">{u.name}</h4>
                    <p className="text-sm text-slate-500 mb-4">{u.email} | {u.phone}</p>
                    <div className="flex gap-3">
                        <button onClick={() => handleApproveUser(u.id)} className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold">অ্যাপ্রুভ</button>
                        <button onClick={() => handleRejectUser(u.id)} className="flex-1 bg-red-500 text-white py-2 rounded-xl font-bold">বাতিল</button>
                    </div>
                  </div>
                ))}
                {pendingRequests.length === 0 && <p className="col-span-full text-center py-20 text-slate-400">নতুন কোনো আবেদন নেই।</p>}
             </div>
          )}

          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 h-fit">
                    <h4 className="font-bold text-lg mb-6">নতুন পোস্ট (গ্লোবাল)</h4>
                    <div className="space-y-4">
                        <textarea className="w-full p-4 rounded-2xl border" placeholder="বিবরণ..." value={input1} onChange={e => setInput1(e.target.value)} rows={4}></textarea>
                        <input className="w-full p-4 rounded-2xl border" placeholder="মিডিয়া URL" value={input2} onChange={e => setInput2(e.target.value)} />
                        <select className="w-full p-4 rounded-2xl border" value={input4} onChange={e => setInput4(e.target.value)}>
                            <option value="none">মিডিয়া টাইপ</option>
                            <option value="image">ছবি</option>
                            <option value="video">ভিডিও</option>
                        </select>
                        <button onClick={handleSavePost} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-xl">পোস্ট করুন</button>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                    {posts.map(p => (
                        <div key={p.id} className="bg-white p-5 border rounded-2xl flex justify-between items-center shadow-sm">
                            <p className="truncate flex-1 font-bold text-slate-700">{p.content}</p>
                            <button onClick={async () => await deleteDoc(doc(db, 'posts', p.id))} className="text-red-500 p-2 ml-4"><i className="fas fa-trash"></i></button>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {activeTab === 'site_settings' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl">
                <label className="block font-bold mb-2">ব্রেকিং নিউজ</label>
                <textarea className="w-full p-4 rounded-xl border" defaultValue={footerData.urgentNews} onBlur={(e) => handleSaveGlobal('footerData', { ...footerData, urgentNews: e.target.value })}></textarea>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl">
                <label className="block font-bold mb-2">হিরো ইমেজ URL</label>
                <input className="w-full p-4 rounded-xl border" defaultValue={footerData.heroImageUrl} onBlur={(e) => handleSaveGlobal('footerData', { ...footerData, heroImageUrl: e.target.value })} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
