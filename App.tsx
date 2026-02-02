
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
import { db } from './firebase';
import { doc, onSnapshot, collection, setDoc } from 'firebase/firestore';

const App: React.FC = () => {
  // Initialize states from localStorage to persist login
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('mbjks_isLoggedIn') === 'true';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('mbjks_isAdmin') === 'true';
  });
  const [currentView, setCurrentView] = useState<View>(() => {
    const savedAdmin = localStorage.getItem('mbjks_isAdmin') === 'true';
    return savedAdmin ? 'admin' : 'home';
  });
  
  // States to be synced with Firestore
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
    facebook: '#',
    youtube: '#',
    instagram: '#'
  });

  const [aboutData, setAboutData] = useState<AboutData>({
    description: 'মদিনা বাজার যুব কল্যাণ সংঘ একটি অরাজনৈতিক ও সেবামূলক সংগঠন।',
    mission: 'সুশিক্ষিত ও আদর্শ যুব সমাজ গড়ে তোলা।',
    vision: 'মাদক মুক্ত সমাজ গঠন।',
    stats: [
      { label: 'সেবা গ্রহীতা', count: '৫০০+' },
      { label: 'সাফল্যের বছর', count: '১০+' },
      { label: 'ক্রিকেট টুর্নামেন্ট', count: '৫+' },
      { label: 'স্বেচ্ছাসেবী', count: '৫০+' }
    ]
  });

  const [cricketStats, setCricketStats] = useState<TournamentStats>({
    year: '২০২৩',
    winner: 'মদিনা বাজার রাইডার্স',
    runnerUp: 'সেবা সংঘ স্পার্টানস',
    topScorer: { name: 'সাব্বির আহমেদ', runs: 342, image: 'https://picsum.photos/seed/cs1/200/200' },
    topWicketTaker: { name: 'মিজানুর রহমান', wickets: 14, image: 'https://picsum.photos/seed/cs2/200/200' },
    participatingTeams: ['রাইডার্স', 'স্পার্টানস', 'টাইটানস', 'ওয়ারিয়র্স']
  });

  // Real-time synchronization for all collections
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(doc => doc.data() as User));
    });

    const unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
      setPosts(snap.docs.map(doc => doc.data() as Post).sort((a,b) => b.id.localeCompare(a.id)));
    });

    const unsubMembers = onSnapshot(collection(db, 'members'), (snap) => {
      setMembers(snap.docs.map(doc => doc.data() as Member));
    });

    const unsubCommittee = onSnapshot(collection(db, 'committee'), (snap) => {
      setCommittee(snap.docs.map(doc => doc.data() as Member));
    });

    const unsubNotices = onSnapshot(collection(db, 'notices'), (snap) => {
      setNotices(snap.docs.map(doc => doc.data() as Notice));
    });

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snap) => {
      setGallery(snap.docs.map(doc => doc.data() as GalleryImage));
    });

    const unsubUpcomingTeams = onSnapshot(collection(db, 'upcomingTeams'), (snap) => {
      setUpcomingTeams(snap.docs.map(doc => doc.data() as Team));
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.footerData) setFooterData(data.footerData);
        if (data.aboutData) setAboutData(data.aboutData);
        if (data.cricketStats) setCricketStats(data.cricketStats);
      }
    });

    return () => {
      unsubUsers(); unsubPosts(); unsubMembers(); unsubCommittee();
      unsubNotices(); unsubGallery(); unsubUpcomingTeams(); unsubSettings();
    };
  }, []);

  const handleLogin = (role: 'user' | 'admin') => {
    setIsLoggedIn(true);
    const isAdminRole = role === 'admin';
    setIsAdmin(isAdminRole);
    
    // Save to localStorage
    localStorage.setItem('mbjks_isLoggedIn', 'true');
    localStorage.setItem('mbjks_isAdmin', isAdminRole ? 'true' : 'false');
    
    setCurrentView(isAdminRole ? 'admin' : 'home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    
    // Clear localStorage
    localStorage.removeItem('mbjks_isLoggedIn');
    localStorage.removeItem('mbjks_isAdmin');
    
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
      case 'auth': return <Auth onLogin={handleLogin} users={users} />;
      case 'admin': 
        if (!isAdmin) return <Home setView={setCurrentView} posts={posts} heroImageUrl={footerData.heroImageUrl} urgentNews={footerData.urgentNews} />;
        return <AdminDashboard 
          members={members} committee={committee}
          notices={notices} gallery={gallery}
          upcomingTeams={upcomingTeams} cricketStats={cricketStats}
          users={users} posts={posts}
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
