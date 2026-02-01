
import React from 'react';
import { TournamentStats, Team } from '../types';

interface CricketHubProps {
  stats: TournamentStats;
  upcomingTeams: Team[];
}

const CricketHub: React.FC<CricketHubProps> = ({ stats, upcomingTeams }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="bg-blue-600 rounded-3xl p-8 mb-12 text-white text-center shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <i className="fas fa-cricket-bat-ball text-9xl transform rotate-12"></i>
        </div>
        <h2 className="text-4xl font-extrabold mb-4">বার্ষিক ক্রিকেট টুর্নামেন্ট</h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">মদিনা বাজার এলাকার সবচেয়ে বড় ক্রীড়া উৎসবের বিস্তারিত এখানে পাবেন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Past Year Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <i className="fas fa-history mr-3 text-blue-500"></i>
              বিগত টুর্নামেন্টের ফলাফল ({stats.year})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-center">
                <div className="w-16 h-16 bg-green-200 text-green-700 rounded-full flex items-center justify-center mr-4 shrink-0">
                  <i className="fas fa-trophy text-3xl"></i>
                </div>
                <div>
                  <p className="text-sm text-green-600 font-bold uppercase tracking-wider">চ্যাম্পিয়ন</p>
                  <p className="text-xl font-bold text-slate-800">{stats.winner}</p>
                </div>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex items-center">
                <div className="w-16 h-16 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center mr-4 shrink-0">
                  <i className="fas fa-award text-3xl"></i>
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-bold uppercase tracking-wider">রানার-আপ</p>
                  <p className="text-xl font-bold text-slate-800">{stats.runnerUp}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl">
                  <h4 className="font-bold text-slate-700 mb-4">সর্বোচ্চ রান সংগ্রাহক</h4>
                  <img src={stats.topScorer.image} className="w-32 h-32 rounded-full border-4 border-white shadow-md mb-4 object-cover" />
                  <p className="font-bold text-lg">{stats.topScorer.name}</p>
                  <p className="text-blue-600 font-bold">{stats.topScorer.runs} রান</p>
               </div>
               <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl">
                  <h4 className="font-bold text-slate-700 mb-4">সর্বোচ্চ উইকেট শিকারী</h4>
                  <img src={stats.topWicketTaker.image} className="w-32 h-32 rounded-full border-4 border-white shadow-md mb-4 object-cover" />
                  <p className="font-bold text-lg">{stats.topWicketTaker.name}</p>
                  <p className="text-red-600 font-bold">{stats.topWicketTaker.wickets} উইকেট</p>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <i className="fas fa-users-rays mr-3 text-blue-500"></i>
              বিগত আসরের দলসমূহ
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.participatingTeams.map((team, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg text-center font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-slate-100">
                  {team}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Upcoming Tournament */}
        <div className="space-y-8">
          <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <h3 className="text-2xl font-bold mb-4">আসন্ন টুর্নামেন্ট ২০২৫</h3>
            <div className="space-y-4 relative z-10">
              <p className="text-slate-300">খুব শীঘ্রই শুরু হতে যাচ্ছে নতুন সিজন। আপনার দল নিবন্ধন করতে এখনই যোগাযোগ করুন।</p>
              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <p className="text-xs uppercase text-slate-400">নিবন্ধন শেষ তারিখ</p>
                <p className="font-bold">১৫ জানুয়ারি, ২০২৫</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-500">
            <h3 className="text-xl font-bold mb-6">নিবন্ধিত দলসমূহ</h3>
            {upcomingTeams.length === 0 ? (
              <p className="text-slate-500 italic text-center py-8">এখনও কোনো দল নিবন্ধিত হয়নি</p>
            ) : (
              <div className="space-y-4">
                {upcomingTeams.map((team) => (
                  <div key={team.id} className="flex items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <img src={team.logo} className="w-12 h-12 rounded-lg object-cover mr-4" />
                    <div>
                      <p className="font-bold text-slate-800">{team.name}</p>
                      <p className="text-xs text-slate-500">{team.players.length} জন প্লেয়ার</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CricketHub;
