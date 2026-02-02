
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './views/Home';
import About from './views/About';
import Members from './views/Members';
import Committee from './views/Committee';
import Gallery from './views/Gallery';
import NoticeBoard from './views/NoticeBoard';
import Contact from './views/Contact';
import CricketHub from './views/CricketHub';
import Auth from './views/Auth';
import AdminDashboard from './views/AdminDashboard';
import { View, Member, Notice, TournamentStats, Team, GalleryImage, User, Post, FooterData, AboutData } from './types';

const App: React.FC = () => {
  const loadState = (key: string, defaultValue: any) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const [currentView, setCurrentView] = useState<View>(() => loadState('mbjks_currentView', 'home'));
  const [isLoggedIn, setIsLoggedIn] = useState(() => loadState('mbjks_isLoggedIn', false));
  const [isAdmin, setIsAdmin] = useState(() => loadState('mbjks_isAdmin', false));
  const [users, setUsers] = useState<User[]>(() => loadState('mbjks_users', []));
  const [posts, setPosts] = useState<Post[]>(() => loadState('mbjks_posts', []));
  const [members, setMembers] = useState<Member[]>(() => loadState('mbjks_members', [
    { id: '1', name: 'মোঃ করিম উদ্দিন', phone: '01711223344', role: 'সভাপতি', image: 'https://picsum.photos/seed/p1/200/200' },
  ]));
  const [committee, setCommittee] = useState<Member[]>(() => loadState('mbjks_committee', [
    { id: 'c1', name: 'মোঃ করিম উদ্দিন', role: 'সভাপতি', phone: '01711223344', image: 'https://picsum.photos/seed/c1/300/300' },
    { id: 'c2', name: 'আব্দুল হামিদ', role: 'সাধারণ সম্পাদক', phone: '01811223344', image: 'https://picsum.photos/seed/c2/300/300' },
  ]));
  const [notices, setNotices] = useState<Notice[]>(() => loadState('mbjks_notices', []));
  const [gallery, setGallery] = useState<GalleryImage[]>(() => loadState('mbjks_gallery', []));
  const [upcomingTeams, setUpcomingTeams] = useState<Team[]>(() => loadState('mbjks_upcomingTeams', []));

  const defaultFooter: FooterData = {
    heroImageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000',
    urgentNews: 'স্বাগতম! মদিনা বাজার যুব কল্যাণ সংঘের নতুন ওয়েবসাইট এখন লাইভ। সকল মেম্বারদের রেজিস্ট্রেশন করার অনুরোধ করা হচ্ছে।',
    description: 'একটি সামাজিক সংগঠন যা যুবদের উন্নয়ন ও সমাজসেবায় নিবেদিত। আমরা শিক্ষা, ক্রীড়া ও সমাজসেবামূলক কর্মকাণ্ডের মাধ্যমে আমাদের এলাকাকে সমৃদ্ধ করতে চাই।',
    address: 'মদিনা বাজার, সিলেট, বাংলাদেশ',
    phone: '+৮৮০ ১৭০০ ০০০০০০',
    email: 'info@mbjks.org',
    facebook: '#',
    youtube: '#',
    instagram: '#'
  };

  const [footerData, setFooterData] = useState<FooterData>(() => {
    const saved = loadState('mbjks_footer', null);
    return saved ? { ...defaultFooter, ...saved } : defaultFooter;
  });

  const defaultAbout: AboutData = {
    description: 'মদিনা বাজার যুব কল্যাণ সংঘ একটি অরাজনৈতিক ও সেবামূলক সংগঠন। এলাকার যুবকদের সঠিক পথে পরিচালনা করা এবং সমাজের অবহেলিত মানুষের পাশে দাঁড়ানোর লক্ষ্য নিয়ে আমাদের এই পথচলা শুরু হয়।',
    mission: 'সুশিক্ষিত ও আদর্শ যুব সমাজ গড়ে তোলা যারা দেশের উন্নয়নে অবদান রাখবে।',
    vision: 'মাদক মুক্ত সমাজ গঠন এবং অসহায়দের শিক্ষা ও চিকিৎসায় সহায়তা করা।',
    stats: [
      { label: 'সেবা গ্রহীতা', count: '৫০০+' },
      { label: 'সাফল্যের বছর', count: '১০+' },
      { label: 'ক্রিকেট টুর্নামেন্ট', count: '৫+' },
      { label: 'স্বেচ্ছাসেবী', count: '৫০+' }
    ]
  };

  const [aboutData, setAboutData] = useState<AboutData>(() => {
    const saved = loadState('mbjks_about', null);
    return saved ? { ...defaultAbout, ...saved } : defaultAbout;
  });

  const [cricketStats, setCricketStats] = useState<TournamentStats>(() => loadState('mbjks_cricketStats', {
    year: '২০২৩',
    winner: 'মদিনা বাজার রাইডার্স',
    runnerUp: 'সেবা সংঘ স্পার্টানস',
    topScorer: { name: 'সাব্বির আহমেদ', runs: 342, image: 'https://picsum.photos/seed/cs1/200/200' },
    topWicketTaker: { name: 'মিজানুর রহমান', wickets: 14, image: 'https://picsum.photos/seed/cs2/200/200' },
    participatingTeams: ['রাইডার্স', 'স্পার্টানস', 'টাইটানস', 'ওয়ারিয়র্স']
  }));

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mbjks_posts') setPosts(JSON.parse(e.newValue || '[]'));
      if (e.key === 'mbjks_members') setMembers(JSON.parse(e.newValue || '[]'));
      if (e.key === 'mbjks_committee') setCommittee(JSON.parse(e.newValue || '[]'));
      if (e.key === 'mbjks_notices') setNotices(JSON.parse(e.newValue || '[]'));
      if (e.key === 'mbjks_gallery') setGallery(JSON.parse(e.newValue || '[]'));
      if (e.key === 'mbjks_cricketStats') setCricketStats(JSON.parse(e.newValue || 'null'));
      if (e.key === 'mbjks_footer') setFooterData(JSON.parse(e.newValue || 'null'));
      if (e.key === 'mbjks_about') setAboutData(JSON.parse(e.newValue || 'null'));
      if (e.key === 'mbjks_users') setUsers(JSON.parse(e.newValue || '[]'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('mbjks_currentView', JSON.stringify(currentView));
    localStorage.setItem('mbjks_isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('mbjks_isAdmin', JSON.stringify(isAdmin));
    localStorage.setItem('mbjks_users', JSON.stringify(users));
    localStorage.setItem('mbjks_posts', JSON.stringify(posts));
    localStorage.setItem('mbjks_members', JSON.stringify(members));
    localStorage.setItem('mbjks_committee', JSON.stringify(committee));
    localStorage.setItem('mbjks_notices', JSON.stringify(notices));
    localStorage.setItem('mbjks_gallery', JSON.stringify(gallery));
    localStorage.setItem('mbjks_cricketStats', JSON.stringify(cricketStats));
    localStorage.setItem('mbjks_upcomingTeams', JSON.stringify(upcomingTeams));
    localStorage.setItem('mbjks_footer', JSON.stringify(footerData));
    localStorage.setItem('mbjks_about', JSON.stringify(aboutData));
  }, [currentView, isLoggedIn, isAdmin, users, posts, members, committee, notices, gallery, cricketStats, upcomingTeams, footerData, aboutData]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentView('home');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home setView={setCurrentView} posts={posts} heroImageUrl={footerData.heroImageUrl} urgentNews={footerData.urgentNews} />;
      case 'about': return <About data={aboutData} />;
      case 'members': return <Members members={members} />;
      case 'committee': return <Committee members={committee} />;
      case 'gallery': return <Gallery images={gallery} />;
      case 'notice': return <NoticeBoard notices={notices} />;
      case 'contact': return <Contact footerData={footerData} />;
      case 'cricket': return <CricketHub stats={cricketStats} upcomingTeams={upcomingTeams} />;
      case 'auth': return <Auth onLogin={(role) => { setIsLoggedIn(true); setIsAdmin(role === 'admin'); setCurrentView(role === 'admin' ? 'admin' : 'home'); }} setUsers={setUsers} />;
      case 'admin': 
        if (!isAdmin) return null;
        return <AdminDashboard 
          members={members} setMembers={setMembers} 
          committee={committee} setCommittee={setCommittee}
          notices={notices} setNotices={setNotices}
          gallery={gallery} setGallery={setGallery}
          upcomingTeams={upcomingTeams} setUpcomingTeams={setUpcomingTeams}
          cricketStats={cricketStats} setCricketStats={setCricketStats}
          users={users} setUsers={setUsers}
          posts={posts} setPosts={setPosts}
          footerData={footerData} setFooterData={setFooterData}
          aboutData={aboutData} setAboutData={setAboutData}
        />;
      default: return <Home setView={setCurrentView} posts={posts} heroImageUrl={footerData.heroImageUrl} urgentNews={footerData.urgentNews} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentView={currentView} setView={setCurrentView} isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} users={users} />
      <main className="flex-grow pt-16">{renderView()}</main>
      <Footer setView={setCurrentView} footerData={footerData} />
    </div>
  );
};

export default App;
