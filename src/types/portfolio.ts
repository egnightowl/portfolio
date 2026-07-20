export type Category = 'about' | 'career' | 'portfolio' | 'contact';

export type Lang = 'ko' | 'en';

export interface ViewState {
  cat: Category | null;
  type: number | null;
  course: number | null;
  slide: number;
}

export interface AboutSection {
  h: string;
  p: string;
}

export interface AboutData {
  tag: string;
  secs: AboutSection[];
}

export interface TimelineItem {
  when: string;
  role: string;
  org: string;
  desc: string;
  hl?: boolean;
}

export interface ProjectItem {
  n: string;
  m: string;
}

export interface SkillItem {
  h: string;
  chips: [string, boolean][];
}

export interface CareerData {
  now: string;
  timeline: TimelineItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
}

export interface CourseItem {
  label: string;
  count: number;
  imgs: string[];
}

export interface PortfolioType {
  kr: string;
  description: string;
  en: string;
  courses: CourseItem[];
}

export interface ContactItem {
  k: string;
  v: string;
  big?: boolean;
}