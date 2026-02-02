
import React from 'react';
import { View, Post } from '../types';

const Home: React.FC<{ setView: (view: View) => void; posts: Post[]; heroImageUrl: string; urgentNews: string }> = ({ setView, posts, heroImageUrl, urgentNews }) => {
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

      {/* Main Content Feed */}
      <section className="py-16 bg-slate-50 min-h-screen">
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
                  {/* Post Header */}
                  <div className="p-6 flex items-center border-b border-slate-50">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-white mr-4 shadow-inner">
                      <i className="fas fa-users text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">মদিনা বাজার যুব কল্যাণ সংঘ</h4>
                      <p className="text-sm text-slate-400 font-medium">{post.date}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <p className="text-slate-800 text-lg whitespace-pre-wrap leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Media */}
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

                  {/* Post Interaction */}
                  <div className="px-6 py-4 flex justify-between items-center text-slate-400 font-bold text-sm">
                    <button className="flex items-center hover:text-blue-600 transition-colors group">
                      <i className="far fa-thumbs-up mr-2 text-lg group-hover:scale-125 transition-transform"></i> ভালো লেগেছে
                    </button>
                    <button className="flex items-center hover:text-blue-600 transition-colors group">
                      <i className="far fa-comment-dots mr-2 text-lg"></i> মন্তব্য
                    </button>
                    <button className="flex items-center hover:text-blue-600 transition-colors group">
                      <i className="fas fa-share-nodes mr-2 text-lg"></i> শেয়ার
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
