
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
  // Navigation & Auth local state
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // App Data State (Synced with Firebase)
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [committee, setCommittee] = useState<Member[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [upcomingTeams, setUpcomingTeams] = useState<Team[]>([]);
  const [footerData, setFooterData] = useState<FooterData>({
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
    topScorer: { name: '-', runs: 0, image: 'https://picsum.photos/seed/cs1/200/200' },
    topWicketTaker: { name: '-', wickets: 0, image: 'https://picsum.photos/seed/cs2/200/200' },
    participatingTeams: []
  });

  // Sync with Firebase on mount
  useEffect(() => {
    const refs = {
      users: ref(db, 'users'),
      posts: ref(db, 'posts'),
      members: ref(db, 'members'),
      committee: ref(db, 'committee'),
      notices: ref(db, 'notices'),
      gallery: ref(db, 'gallery'),
      upcomingTeams: ref(db, 'upcomingTeams'),
      footerData: ref(db, 'footerData'),
      aboutData: ref(db, 'aboutData'),
      cricketStats: ref(db, 'cricketStats'),
    };

    const unsubscribers = Object.entries(refs).map(([key, dbRef]) => {
      return onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedData = (key === 'footerData' || key === 'aboutData' || key === 'cricketStats') 
            ? data 
            : Object.values(data);
          
          switch(key) {
            case 'users': setUsers(formattedData as User[]); break;
            case 'posts': setPosts((formattedData as Post[]).reverse()); break;
            case 'members': setMembers(formattedData as Member[]); break;
            case 'committee': setCommittee(formattedData as Member[]); break;
            case 'notices': setNotices(formattedData as Notice[]); break;
            case 'gallery': setGallery(formattedData as GalleryImage[]); break;
            case 'upcomingTeams': setUpcomingTeams(formattedData as Team[]); break;
            case 'footerData': setFooterData(formattedData as FooterData); break;
            case 'aboutData': setAboutData(formattedData as AboutData); break;
            case 'cricketStats': setCricketStats(formattedData as TournamentStats); break;
          }
        }
      });
    });

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

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
      case 'auth': return <Auth onLogin={(role) => { setIsLoggedIn(true); setIsAdmin(role === 'admin'); setCurrentView(role === 'admin' ? 'admin' : 'home'); }} users={users} />;
      case 'admin': 
        if (!isAdmin) return null;
        return <AdminDashboard 
          members={members} committee={committee} notices={notices} gallery={gallery}
          upcomingTeams={upcomingTeams} cricketStats={cricketStats} users={users} posts={posts}
          footerData={footerData} aboutData={aboutData}
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
