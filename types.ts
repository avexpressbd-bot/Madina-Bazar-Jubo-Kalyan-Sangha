
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
  image?: string;
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

export interface AboutData {
  description: string;
  mission: string;
  vision: string;
  stats: {
    label: string;
    count: string;
  }[];
}

export interface FooterData {
  logoUrl?: string;
  heroImageUrl: string;
  urgentNews: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  facebook: string;
  youtube: string;
  instagram: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  captainName?: string;
  captainImage?: string;
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
  winnerImage?: string;
  runnerUp: string;
  runnerUpImage?: string;
  topScorer: { name: string; runs: number; image: string };
  topWicketTaker: { name: string; wickets: number; image: string };
  participatingTeams: []
}

export type View = 'home' | 'about' | 'members' | 'committee' | 'gallery' | 'notice' | 'contact' | 'cricket' | 'auth' | 'admin';
