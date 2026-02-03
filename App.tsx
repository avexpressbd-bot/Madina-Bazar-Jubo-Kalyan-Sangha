
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
import { db, ref, onValue } from './firebase';
import { View, Member, Notice, TournamentStats, Team, GalleryImage, User, Post, FooterData, AboutData } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(() => {
    return (localStorage.getItem('mbjks_currentView') as View) || 'home';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('mbjks_isLoggedIn') === 'true';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('mbjks_isAdmin') === 'true';
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [committee, setCommittee] = useState<Member[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [upcomingTeams, setUpcomingTeams] = useState<Team[]>([]);
  
  const [footerData, setFooterData] = useState<FooterData>({
    logoUrl: '',
    heroImageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000',
    urgentNews: 'স্বাগতম! মদিনা বাজার যুব কল্যাণ সংঘের নতুন ওয়েবসাইট এখন লাইভ।',
    description: 'একটি সামাজিক সংগঠন যা যুবদের উন্নয়ন ও সমাজসেবায় নিবেদিত।',
    address: 'মদিনা বাজার, সিলেট, বাংলাদেশ',
    phone: '+৮৮০ ১৭০০ ০০০০০০',
    email: 'info@mbjks.org',
    facebook: '#', youtube: '#', instagram: '#'
  });

  const [aboutData, setAboutData] = useState<AboutData>({
    description: 'মদিনা বাজার যুব কল্যাণ সংঘ একটি অরাজনৈতিক ও সেবামূলক সংগঠন।',
    mission: 'সুশিক্ষিত ও আদর্শ যুব সমাজ গড়ে তোলা।',
    vision: 'মাদক মুক্ত সমাজ গঠন।',
    stats: [{ label: 'সাফল্যের বছর', count: '১০+' }]
  });

  const [cricketStats, setCricketStats] = useState<TournamentStats>({
    year: '২০২৪', winner: '-', runnerUp: '-',
    winnerImage: 'https://cdn-icons-png.flaticon.com/512/3221/3221841.png',
    runnerUpImage: 'https://cdn-icons-png.flaticon.com/512/3221/3221841.png',
    topScorer: { name: '-', runs: 0, image: 'https://cdn-icons-png.flaticon.com/512/3221/3221841.png' },
    topWicketTaker: { name: '-', wickets: 0, image: 'https://cdn-icons-png.flaticon.com/512/3221/3221841.png' },
    participatingTeams: []
  });

  useEffect(() => {
    localStorage.setItem('mbjks_isLoggedIn', String(isLoggedIn));
    localStorage.setItem('mbjks_isAdmin', String(isAdmin));
    localStorage.setItem('mbjks_currentView', currentView);
  }, [isLoggedIn, isAdmin, currentView]);

  useEffect(() => {
    if (!db) return;

    const dataPaths = {
      users: 'users',
      posts: 'posts',
      members: 'members',
      committee: 'committee',
      notices: 'notices',
      gallery: 'gallery',
      upcomingTeams: 'upcomingTeams',
      footerData: 'footerData',
      aboutData: 'aboutData',
      cricketStats: 'cricketStats',
    };

    const unsubscribers = Object.entries(dataPaths).map(([key, path]) => {
      return onValue(ref(db, path), (snapshot) => {
        const data = snapshot.val();
        const isCollection = !['footerData', 'aboutData', 'cricketStats'].includes(key);

        if (!data) {
          if (isCollection) {
            switch(key) {
              case 'users': setUsers([]); break;
              case 'posts': setPosts([]); break;
              case 'members': setMembers([]); break;
              case 'committee': setCommittee([]); break;
              case 'notices': setNotices([]); break;
              case 'gallery': setGallery([]); break;
              case 'upcomingTeams': setUpcomingTeams([]); break;
            }
          }
          return;
        }

        const formatted = isCollection ? Object.values(data) : data;

        switch(key) {
          case 'users': setUsers(formatted as User[]); break;
          case 'posts': setPosts((formatted as Post[]).sort((a, b) => b.id.localeCompare(a.id))); break;
          case 'members': setMembers(formatted as Member[]); break;
          case 'committee': setCommittee(formatted as Member[]); break;
          case 'notices': setNotices(formatted as Notice[]); break;
          case 'gallery': setGallery(formatted as GalleryImage[]); break;
          case 'upcomingTeams': setUpcomingTeams(formatted as Team[]); break;
          case 'footerData': setFooterData(formatted as FooterData); break;
          case 'aboutData': setAboutData(formatted as AboutData); break;
          case 'cricketStats': setCricketStats(formatted as TournamentStats); break;
        }
      });
    });

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentView('home');
    localStorage.clear();
  };

  const renderView = () => {
    // Corrected padding-top logic in the main app to accommodate the double-height navbar
    const ptClass = "pt-[104px]"; // 40px top bar + 64px main nav

    switch (currentView) {
      case 'home': return <div className={ptClass}><Home setView={setCurrentView} posts={posts} heroImageUrl={footerData.heroImageUrl} urgentNews={footerData.urgentNews} cricketStats={cricketStats} upcomingTeams={upcomingTeams} /></div>;
      case 'about': return <div className={ptClass}><About data={aboutData} /></div>;
      case 'members': return <div className={ptClass}><Members members={members} /></div>;
      case 'committee': return <div className={ptClass}><Committee members={committee} /></div>;
      case 'gallery': return <div className={ptClass}><Gallery images={gallery} /></div>;
      case 'notice': return <div className={ptClass}><NoticeBoard notices={notices} /></div>;
      case 'contact': return <div className={ptClass}><Contact footerData={footerData} /></div>;
      case 'cricket': return <div className={ptClass}><CricketHub stats={cricketStats} upcomingTeams={upcomingTeams} /></div>;
      case 'auth': return <div className={ptClass}><Auth onLogin={(role) => { setIsLoggedIn(true); setIsAdmin(role === 'admin'); setCurrentView(role === 'admin' ? 'admin' : 'home'); }} users={users} /></div>;
      case 'admin': 
        if (!isAdmin) {
          setCurrentView('home');
          return null;
        }
        return <div className={ptClass}><AdminDashboard 
          members={members} committee={committee} notices={notices} gallery={gallery}
          upcomingTeams={upcomingTeams} cricketStats={cricketStats} users={users} posts={posts}
          footerData={footerData} aboutData={aboutData}
        /></div>;
      default: return <div className={ptClass}><Home setView={setCurrentView} posts={posts} heroImageUrl={footerData.heroImageUrl} urgentNews={footerData.urgentNews} cricketStats={cricketStats} upcomingTeams={upcomingTeams} /></div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentView={currentView} setView={setCurrentView} isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} users={users} footerData={footerData} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer setView={setCurrentView} footerData={footerData} />
    </div>
  );
};

export default App;
