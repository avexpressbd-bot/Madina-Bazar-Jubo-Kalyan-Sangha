
export interface Member {
  id: string;
  name: string;
  phone: string;
  role: string;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  status: 'pending' | 'approved';
  role: 'user' | 'admin';
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  videoUrl?: string;
}

export interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'none';
  date: string;
  likes: number;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  players: string[];
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface TournamentStats {
  year: string;
  winner: string;
  runnerUp: string;
  topScorer: { name: string; runs: number; image: string };
  topWicketTaker: { name: string; wickets: number; image: string };
  participatingTeams: string[];
}

export type View = 'home' | 'about' | 'members' | 'committee' | 'gallery' | 'notice' | 'contact' | 'cricket' | 'auth' | 'admin';
