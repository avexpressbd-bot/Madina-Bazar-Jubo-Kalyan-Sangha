
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
import { View, Member, Notice, TournamentStats, Team, GalleryImage, User, Post } from './types';

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
    { id: '1', name: 'মোঃ করিম উদ্দিন', phone: '01711223344', role: 'সাধারণ মেম্বার', image: 'https://picsum.photos/seed/p1/200/200' },
  ]));

  const [committee, setCommittee] = useState<Member[]>(() => loadState('mbjks_committee', [
    { id: 'c1', name: 'মোঃ করিম উদ্দিন', role: 'সভাপতি', phone: '01711223344', image: 'https://picsum.photos/seed/c1/300/300' },
    { id: 'c2', name: 'আব্দুল হামিদ', role: 'সাধারণ সম্পাদক', phone: '01811223344', image: 'https://picsum.photos/seed/c2/300/300' },
  ]));

  const [notices, setNotices] = useState<Notice[]>(() => loadState('mbjks_notices', [
    { id: '1', title: 'বার্ষিক সাধারণ সভা ২০২৪', description: 'আগামী শুক্রবার ক্লাবের সভা কক্ষে বার্ষিক সাধারণ সভা অনুষ্ঠিত হবে।', date: '২০২৪-০৫-২০', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  ]));

  const [gallery, setGallery] = useState<GalleryImage[]>(() => loadState('mbjks_gallery', []));

  const [cricketStats, setCricketStats] = useState<TournamentStats>(() => loadState('mbjks_cricketStats', {
    year: '২০২৩',
    winner: 'মদিনা বাজার রাইডার্স',
    runnerUp: 'সেবা সংঘ স্পার্টানস',
    topScorer: { name: 'সাব্বির আহমেদ', runs: 342, image: 'https://picsum.photos/seed/cs1/200/200' },
    topWicketTaker: { name: 'মিজানুর রহমান', wickets: 14, image: 'https://picsum.photos/seed/cs2/200/200' },
    participatingTeams: ['রাইডার্স', 'স্পার্টানস', 'টাইটানস', 'ওয়ারিয়র্স']
  }));

  const [upcomingTeams, setUpcomingTeams] = useState<Team[]>(() => loadState('mbjks_upcomingTeams', []));

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
  }, [currentView, isLoggedIn, isAdmin, users, posts, members, committee, notices, gallery, cricketStats, upcomingTeams]);

  const handleLogin = (role: 'user' | 'admin') => {
    setIsLoggedIn(true);
    setIsAdmin(role === 'admin');
    setCurrentView(role === 'admin' ? 'admin' : 'home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentView('home');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home setView={setCurrentView} posts={posts} />;
      case 'about': return <About />;
      case 'members': return <Members members={members} />;
      case 'committee': return <Committee members={committee} />;
      case 'gallery': return <Gallery images={gallery} />;
      case 'notice': return <NoticeBoard notices={notices} />;
      case 'contact': return <Contact />;
      case 'cricket': return <CricketHub stats={cricketStats} upcomingTeams={upcomingTeams} />;
      case 'auth': return <Auth onLogin={handleLogin} users={users} setUsers={setUsers} />;
      case 'admin': 
        if (!isAdmin) {
          setCurrentView('auth');
          return null;
        }
        return <AdminDashboard 
          members={members} setMembers={setMembers} 
          committee={committee} setCommittee={setCommittee}
          notices={notices} setNotices={setNotices}
          gallery={gallery} setGallery={setGallery}
          upcomingTeams={upcomingTeams} setUpcomingTeams={setUpcomingTeams}
          cricketStats={cricketStats} setCricketStats={setCricketStats}
          users={users} setUsers={setUsers}
          posts={posts} setPosts={setPosts}
        />;
      default: return <Home setView={setCurrentView} posts={posts} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentView={currentView} setView={setCurrentView} isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />
      <main className="flex-grow pt-20">{renderView()}</main>
      <Footer setView={setCurrentView} />
    </div>
  );
};

export default App;
