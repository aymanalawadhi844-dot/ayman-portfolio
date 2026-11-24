export interface SiteSettings {
  siteName: string;
  fullName: string;
  fullNameEn: string;
  email: string;
  whatsapp: string;
  githubUrl: string;
  linkedinUrl: string;
  profileImageUrl: string;
  heroTitles: string[];
  heroBio: string;
  heroBadge: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  statsProjects: string;
  statsSkills: string;
  statsField: string;
  footerDescription: string;
  copyrightName: string;
}

export interface Project {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  githubUrl: string;
  imageUrl: string;
  preview: 'code' | 'database' | 'network' | 'web' | 'image';
  icon: string;
  color: string;
  accent: string;
  order: number;
}

export interface SkillItem {
  name: string;
  icon: string;
}

export interface SkillCard {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  hoverColor: string;
  skills: SkillItem[];
  span: string;
  order: number;
}

export interface FeatureCard {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  bg: string;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: { toDate?: () => Date } | string;
}
