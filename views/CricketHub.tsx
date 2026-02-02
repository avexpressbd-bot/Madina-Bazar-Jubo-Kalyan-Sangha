
import React from 'react';
import { TournamentStats, Team } from '../types';

interface CricketHubProps {
  stats: TournamentStats;
  upcomingTeams: Team[];
}

const CricketHub: React.FC<CricketHubProps> = ({ stats, upcomingTeams }) => {
  // Safe defaults to prevent blank screen
  const safeStats = stats || {
    year: '২০২৪',
    winner: 'ঘোষণা করা হয়নি',
    runnerUp: 'ঘোষণা করা হয়নি',
    topScorer: { name: '-', runs: 0, image: 'https://cdn-icons-png.flaticon.com/512/3221/3221841.png' },
    topWicketTaker: { name: '-', wickets: 0, image: 'https://cdn-icons-png.flaticon.com/512/3221/3221841.png' },
    participatingTeams: []
  };

  const topScorerImg = safeStats.topScorer?.image || 'https://cdn-icons-png.flaticon.com/512/3221/3221841.png';
  const topWicketImg = safeStats.topWicketTaker?.image || 'https://cdn-icons-png.flaticon.com/512/3221/3221841.png';
  const participatingTeams = safeStats.participatingTeams || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="bg-blue-600 rounded-3xl p-10 mb-12 text-white text-center shadow-2xl overflow-hidden relative border-4 border-white/10">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <i className="fas fa-cricket-bat-ball text-[12rem] transform rotate-12"></i>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">মদিনা বাজার প্রিমিয়ার লিগ</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto font-light">এলাকার সবচেয়ে রোমাঞ্চকর ক্রিকেট উৎসবের আর্কাইভ ও লাইভ আপডেট</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Past Year Stats */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="bg-blue-100 p-2 rounded-xl text-blue-600"><i className="fas fa-trophy"></i></span>
              বিগত টুর্নামেন্টের ফলাফল ({safeStats.year || '২০২৪'})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-[2rem] border border-yellow-100 flex items-center shadow-inner">
                <div className="w-16 h-16 bg-yellow-400 text-white rounded-2xl flex items-center justify-center mr-5 shadow-lg">
                  <i className="fas fa-crown text-3xl"></i>
                </div>
                <div>
                  <p className="text-xs text-orange-600 font-black uppercase tracking-widest mb-1">চ্যাম্পিয়ন</p>
                  <p className="text-2xl font-black text-slate-800 leading-tight">{safeStats.winner || 'ঘোষণা হয়নি'}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-[2rem] border border-slate-100 flex items-center shadow-inner">
                <div className="w-16 h-16 bg-slate-400 text-white rounded-2xl flex items-center justify-center mr-5 shadow-lg">
                  <i className="fas fa-medal text-3xl"></i>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-black uppercase tracking-widest mb-1">রানার-আপ</p>
                  <p className="text-2xl font-black text-slate-800 leading-tight">{safeStats.runnerUp || 'ঘোষণা হয়নি'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex flex-col items-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                  <h4 className="font-black text-slate-500 text-xs uppercase tracking-widest mb-6">টপ স্কোরার</h4>
                  <div className="relative mb-6">
                    <img src={topScorerImg} className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white">S</div>
                  </div>
                  <p className="font-black text-xl text-slate-800">{safeStats.topScorer?.name || '-'}</p>
                  <div className="mt-2 bg-blue-100 px-4 py-1 rounded-full text-blue-700 font-bold text-sm">
                    {safeStats.topScorer?.runs || 0} রান
                  </div>
               </div>
               <div className="flex flex-col items-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                  <h4 className="font-black text-slate-500 text-xs uppercase tracking-widest mb-6">টপ উইকেট শিকারী</h4>
                  <div className="relative mb-6">
                    <img src={topWicketImg} className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" />
                    <div className="absolute -bottom-2 -right-2 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white">W</div>
                  </div>
                  <p className="font-black text-xl text-slate-800">{safeStats.topWicketTaker?.name || '-'}</p>
                  <div className="mt-2 bg-red-100 px-4 py-1 rounded-full text-red-700 font-bold text-sm">
                    {safeStats.topWicketTaker?.wickets || 0} উইকেট
                  </div>
               </div>
            </div>
          </div>

          {participatingTeams.length > 0 && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="bg-purple-100 p-2 rounded-xl text-purple-600"><i className="fas fa-users"></i></span>
                অংশগ্রহণকারী সকল দল
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {participatingTeams.map((team, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl text-center font-bold text-slate-700 hover:bg-blue-600 hover:text-white transition-all border border-slate-100 shadow-sm cursor-default">
                    {team}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Upcoming Tournament */}
        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-600/10 pointer-events-none"></div>
            <h3 className="text-2xl font-black mb-4 relative z-10">সিজন ২০২৫</h3>
            <div className="space-y-4 relative z-10">
              <p className="text-slate-400 font-light leading-relaxed">খুব শীঘ্রই শুরু হতে যাচ্ছে নতুন সিজন। আপনার দল নিবন্ধন করতে এখনই যোগাযোগ করুন।</p>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">নিবন্ধন শেষ তারিখ</p>
                <p className="font-black text-xl">১৫ জানুয়ারি, ২০২৫</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h3 className="text-xl font-bold mb-8 border-b pb-4">নিবন্ধিত দলসমূহ</h3>
            {upcomingTeams.length === 0 ? (
              <div className="text-center py-10">
                <i className="fas fa-clipboard-list text-slate-100 text-5xl mb-4"></i>
                <p className="text-slate-400 italic">এখনও কোনো দল নিবন্ধিত হয়নি</p>
              </div>
            ) : (
              <div className="space-y-5">
                {upcomingTeams.map((team) => (
                  <div key={team.id} className="flex items-center p-4 bg-slate-50 rounded-3xl border border-transparent hover:border-blue-200 transition-all group">
                    <img src={team.logo} className="w-14 h-14 rounded-2xl object-cover mr-4 shadow-sm group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-black text-slate-800 text-lg leading-tight">{team.name}</p>
                      <p className="text-xs text-blue-600 font-bold mt-1 uppercase tracking-tighter">{team.players?.length || 0} জন সদস্য</p>
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
