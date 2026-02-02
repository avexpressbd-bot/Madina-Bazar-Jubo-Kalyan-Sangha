
import React from 'react';
import { View, Post } from '../types';

const Home: React.FC<{ setView: (view: View) => void; posts: Post[]; heroImageUrl: string }> = ({ setView, posts, heroImageUrl }) => {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImageUrl} 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            মদিনা বাজার যুব কল্যাণ সংঘ
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-slate-200">
            ঐক্য, সেবা ও প্রগতির পথে আমরা একসাথে এগিয়ে যাচ্ছি।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setView('auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-xl"
            >
              মেম্বার হিসেবে যোগ দিন
            </button>
          </div>
        </div>
      </section>

      {/* Main Content: News Feed style */}
      <section className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <i className="fas fa-newspaper mr-3 text-blue-600"></i> সর্বশেষ আপডেট
            </h2>
            <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              {posts.length} টি পোস্ট
            </div>
          </div>

          <div className="space-y-8">
            {posts.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-slate-100">
                <i className="fas fa-ghost text-4xl text-slate-200 mb-4"></i>
                <p className="text-slate-500 italic">এখনও কোনো পোস্ট করা হয়নি।</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
                      <i className="fas fa-users"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">মদিনা বাজার যুব কল্যাণ সংঘ</h4>
                      <p className="text-xs text-slate-500">{post.date}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-4">
                    <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Media */}
                  {post.mediaUrl && (
                    <div className="bg-slate-100 max-h-[500px] overflow-hidden flex items-center justify-center">
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
                  <div className="p-4 border-t border-slate-50 flex justify-between items-center text-slate-500 text-sm">
                    <button className="flex items-center hover:text-blue-600 transition-colors">
                      <i className="far fa-thumbs-up mr-2"></i> ভালো লেগেছে
                    </button>
                    <button className="flex items-center hover:text-blue-600 transition-colors">
                      <i className="far fa-comment mr-2"></i> মন্তব্য
                    </button>
                    <button className="flex items-center hover:text-blue-600 transition-colors">
                      <i className="fas fa-share mr-2"></i> শেয়ার
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
