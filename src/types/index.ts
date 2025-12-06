// Project Types
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  timeline: string;
  role: string;
  description: string;
  techStack: string[];
  highlights: Highlight[];
  github?: string;
  live?: string;
  islandType: IslandType;
  position: [number, number, number];
}

export interface Highlight {
  metric: string;
  description: string;
}

export type IslandType = 'ai' | 'fullstack' | 'vision' | 'mobile' | 'academic';

// Profile Types
export interface Profile {
  name: string;
  nameEn: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  education: Education;
  links: Links;
}

export interface Education {
  school: string;
  major: string;
  year: string;
  gpa: string;
}

export interface Links {
  github: string;
  linkedin: string;
  portfolio: string;
}

// Skill Types
export interface Skill {
  name: string;
  icon?: string;
  color: string;
  category: SkillCategory;
}

export type SkillCategory = 
  | 'language' 
  | 'frontend' 
  | 'backend' 
  | 'ai' 
  | 'database' 
  | 'devops' 
  | 'mobile';
