
import React from 'react';
import { View, Post, TournamentStats, Team } from '../types';

const Home: React.FC<{ 
  setView: (view: View) => void; 
  posts: Post[]; 
  heroImageUrl: string; 
  urgentNews: string;
  cricketStats: TournamentStats;
  upcomingTeams: Team[];
}> = ({ setView, posts, heroImageUrl, urgentNews, cricketStats, upcomingTeams }) => {
  const newsText = urgentNews || "স্বাগতম! মদিনা বাজার যুব কল্যাণ সংঘের ওয়েবসাইটে আপনাকে স্বাগতম।";

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImageUrl} 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
            মদিনা বাজার যুব কল্যাণ সংঘ
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-slate-200">
            ঐক্য, সেবা ও প্রগতির পথে আমরা একসাথে এগিয়ে যাচ্ছি।
          </p>
          <button 
            onClick={() => setView('auth')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-2xl transform hover:scale-105 active:scale-95"
          >
            মেম্বার হিসেবে যোগ দিন
          </button>
        </div>
      </section>

      {/* Breaking News Ticker */}
      <div className="bg-slate-900 text-white py-3 overflow-hidden border-b border-slate-800 flex items-center shadow-xl sticky top-16 z-40">
        <div className="bg-red-600 px-6 py-1.5 font-black text-sm uppercase italic shrink-0 z-10 ml-4 rounded-md shadow-lg flex items-center">
          <i className="fas fa-bolt mr-2 animate-pulse text-yellow-400"></i> ব্রেকিং নিউজ
        </div>
        <div className="relative flex overflow-hidden whitespace-nowrap ml-4 flex-1">
          <div className="animate-marquee flex">
            <span className="text-lg font-medium px-10 tracking-wide flex items-center">
              {newsText} <i className="fas fa-star mx-6 text-blue-500 text-[10px]"></i>
            </span>
            <span className="text-lg font-medium px-10 tracking-wide flex items-center">
              {newsText} <i className="fas fa-star mx-6 text-blue-500 text-[10px]"></i>
            </span>
            <span className="text-lg font-medium px-10 tracking-wide flex items-center">
              {newsText} <i className="fas fa-star mx-6 text-blue-500 text-[10px]"></i>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Tournament Highlights Section */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">অর্কাইভ ও সাফল্য</span>
            <h2 className="text-4xl font-black text-slate-800 mt-2 flex items-center justify-center gap-3">
              <i className="fas fa-trophy text-yellow-500"></i> {cricketStats.year} টুর্নামেন্ট হাইলাইটস
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[3rem] p-1 shadow-2xl overflow-hidden group">
               <div className="bg-white h-full w-full rounded-[2.9rem] p-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="relative shrink-0">
                    <img src={cricketStats.winnerImage || 'https://cdn-icons-png.flaticon.com/512/3221/3221841.png'} className="w-40 h-40 rounded-3xl object-cover border-4 border-yellow-100 shadow-xl group-hover:scale-105 transition-transform" />
                    <div className="absolute -top-4 -left-4 bg-yellow-500 text-white p-3 rounded-2xl shadow-lg border-2 border-white">
                      <i className="fas fa-crown text-xl"></i>
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-yellow-600 font-black text-xs uppercase tracking-[0.3em] mb-2">বিজয়ী দল</p>
                    <h3 className="text-4xl font-black text-slate-800 leading-tight">{cricketStats.winner}</h3>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-slate-300 to-slate-500 rounded-[3rem] p-1 shadow-2xl overflow-hidden group">
               <div className="bg-white h-full w-full rounded-[2.9rem] p-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="relative shrink-0">
                    <img src={cricketStats.runnerUpImage || 'https://cdn-icons-png.flaticon.com/512/3221/3221841.png'} className="w-40 h-40 rounded-3xl object-cover border-4 border-slate-100 shadow-xl group-hover:scale-105 transition-transform" />
                    <div className="absolute -top-4 -left-4 bg-slate-500 text-white p-3 rounded-2xl shadow-lg border-2 border-white">
                      <i className="fas fa-medal text-xl"></i>
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] mb-2">রানার-আপ দল</p>
                    <h3 className="text-4xl font-black text-slate-800 leading-tight">{cricketStats.runnerUp}</h3>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-xl relative overflow-hidden group">
               <div className="flex items-center gap-6 relative z-10">
                 <img src={cricketStats.topScorer.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-400/50 shadow-lg" />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">সেরা ব্যাটার</p>
                   <h4 className="text-2xl font-black">{cricketStats.topScorer.name}</h4>
                 </div>
               </div>
               <div className="text-right relative z-10">
                 <p className="text-5xl font-black leading-none">{cricketStats.topScorer.runs}</p>
                 <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mt-1">মোট রান</p>
               </div>
            </div>

            <div className="bg-red-600 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-xl relative overflow-hidden group">
               <div className="flex items-center gap-6 relative z-10">
                 <img src={cricketStats.topWicketTaker.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} className="w-24 h-24 rounded-2xl object-cover border-4 border-red-400/50 shadow-lg" />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-red-200 mb-1">সেরা বোলার</p>
                   <h4 className="text-2xl font-black">{cricketStats.topWicketTaker.name}</h4>
                 </div>
               </div>
               <div className="text-right relative z-10">
                 <p className="text-5xl font-black leading-none">{cricketStats.topWicketTaker.wickets}</p>
                 <p className="text-xs font-bold uppercase tracking-widest text-red-200 mt-1">মোট উইকেট</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Feed */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <i className="fas fa-rss mr-3 text-blue-600"></i> আপডেট ফিড
            </h2>
          </div>

          <div className="space-y-10">
            {posts.length === 0 ? (
              <div className="bg-white p-20 rounded-3xl text-center shadow-sm border border-slate-100">
                <i className="fas fa-stream text-5xl text-slate-200 mb-6"></i>
                <p className="text-slate-500 text-lg">এখনও কোনো পোস্ট করা হয়নি।</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white rounded-3xl shadow-xl border border-slate-50 overflow-hidden transition-all hover:shadow-2xl">
                  <div className="p-6 flex items-center border-b border-slate-50">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-white mr-4">
                      <i className="fas fa-users text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">মদিনা বাজার যুব কল্যাণ সংঘ</h4>
                      <p className="text-sm text-slate-400 font-medium">{post.date}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-800 text-lg whitespace-pre-wrap leading-relaxed">{post.content}</p>
                  </div>
                  {post.mediaUrl && (
                    <div className="bg-slate-100 max-h-[600px] overflow-hidden flex items-center justify-center border-y border-slate-50">
                      {post.mediaType === 'image' ? (
                        <img src={post.mediaUrl} className="w-full object-contain" alt="Post media" />
                      ) : post.mediaType === 'video' ? (
                        <div className="aspect-video w-full">
                           {post.mediaUrl.includes('youtube.com') || post.mediaUrl.includes('youtu.be') ? (
                             <iframe className="w-full h-full" src={post.mediaUrl.replace('watch?v=', 'embed/')} allowFullScreen></iframe>
                           ) : (
                             <video src={post.mediaUrl} controls className="w-full h-full"></video>
                           )}
                        </div>
                      ) : null}
                    </div>
                  )}
                  <div className="px-6 py-4 flex justify-between items-center text-slate-400 font-bold text-sm">
                    <button className="flex items-center hover:text-blue-600 transition-colors"><i className="far fa-thumbs-up mr-2 text-lg"></i> ভালো লেগেছে</button>
                    <button className="flex items-center hover:text-blue-600 transition-colors"><i className="far fa-comment-dots mr-2 text-lg"></i> মন্তব্য</button>
                    <button className="flex items-center hover:text-blue-600 transition-colors"><i className="fas fa-share-nodes mr-2 text-lg"></i> শেয়ার</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Captains Panel - Moved to BOTTOM */}
      <section className="py-16 bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-4">
             <div>
               <h2 className="text-2xl font-black text-white">টিম ক্যাপ্টেনস</h2>
               <p className="text-slate-400 text-sm">সিজন ২০২৫ এর দলনেতৃত্ব</p>
             </div>
             <i className="fas fa-id-badge text-3xl text-blue-500 opacity-50"></i>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
            {upcomingTeams.map((team) => (
              <div key={team.id} className="min-w-[280px] bg-slate-800 p-6 rounded-[2rem] border border-slate-700 snap-center hover:border-blue-500 transition-colors group">
                 <div className="flex items-center gap-4 mb-4">
                    <img src={team.captainImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} className="w-16 h-16 rounded-full object-cover border-2 border-slate-600 group-hover:border-blue-500 transition-all" />
                    <div>
                      <h4 className="font-bold text-white text-lg">{team.captainName || 'নাম নেই'}</h4>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">দলনেতা</p>
                    </div>
                 </div>
                 <div className="bg-slate-900 p-4 rounded-2xl flex items-center justify-between border border-slate-700">
                    <div className="flex items-center gap-2">
                      <img src={team.logo} className="w-8 h-8 rounded-md" />
                      <p className="text-sm font-bold text-slate-300">{team.name}</p>
                    </div>
                    <i className="fas fa-chevron-right text-slate-600 text-xs"></i>
                 </div>
              </div>
            ))}
            {upcomingTeams.length === 0 && (
              <p className="text-slate-500 italic py-4">এখনও কোনো দল নিবন্ধিত হয়নি।</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
