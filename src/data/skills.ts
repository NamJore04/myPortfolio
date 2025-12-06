import type { Skill } from '@/types';

export const skills: Skill[] = [
  // Languages - Proficient
  { name: 'Python', color: '#3776ab', category: 'language' },
  { name: 'JavaScript', color: '#f7df1e', category: 'language' },
  { name: 'TypeScript', color: '#3178c6', category: 'language' },
  
  // Frontend
  { name: 'React', color: '#61dafb', category: 'frontend' },
  { name: 'Next.js', color: '#000000', category: 'frontend' },
  { name: 'Tailwind', color: '#06b6d4', category: 'frontend' },
  
  // Backend
  { name: 'Node.js', color: '#339933', category: 'backend' },
  { name: 'Express', color: '#000000', category: 'backend' },
  
  // AI/ML
  { name: 'PyTorch', color: '#ee4c2c', category: 'ai' },
  { name: 'TensorFlow', color: '#ff6f00', category: 'ai' },
  { name: 'Scikit-learn', color: '#f7931e', category: 'ai' },
  { name: 'OpenCV', color: '#5c3ee8', category: 'ai' },
  
  // Database
  { name: 'MongoDB', color: '#47a248', category: 'database' },
  { name: 'MySQL', color: '#4479a1', category: 'database' },
  
  // DevOps
  { name: 'Docker', color: '#2496ed', category: 'devops' },
  { name: 'Git', color: '#f05032', category: 'devops' },
  { name: 'Vercel', color: '#000000', category: 'devops' },
  
  // Mobile
  { name: 'Flutter', color: '#02569b', category: 'mobile' },
  { name: 'Dart', color: '#0175c2', category: 'mobile' },
];

export const skillsByCategory = {
  proficient: ['Python', 'JavaScript'],
  intermediate: ['TypeScript', 'Dart', 'C#', 'Java', 'SQL', 'PHP'],
  frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'Flutter'],
  ai: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'YOLO', 'OpenCV'],
  tools: ['Git', 'Docker', 'Vercel', 'Firebase'],
};
