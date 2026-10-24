export type Category = 'about' | 'career' | 'portfolio' | 'artworks' | 'contact';

export type Lang = 'ko' | 'en';

export interface ViewState {
  cat: Category | null;
  type: number | null;
  course: number | null;
  slide: number;
}

export interface SiteData {
  title: string;
  name_ko: string;
  name_en: string;
  headline: string;
  headline_en: string;
  keywords: string[];
  copyright: string;
  menu: Record<Category, { ko: string; en: string }>;
}

export interface AboutData {
  ko: { tag: string; sections: { title: string; text: string }[] };
  en: { tag: string; sections: { title: string; text: string }[] };
}

export interface CareerData {
  intro: string;
  timeline: { when: string; role: string; org: string; desc: string; highlight?: boolean }[];
  projects: { name: string; meta: string }[];
  skills: { group: string; chips: { text: string; accent?: boolean }[] }[];
  graduation?: { title: string; meta: string; video?: string };
}

export interface ContactData {
  intro: string;
  rows: { label: string; value: string; email?: boolean; link?: string; link_text?: string }[];
}

export interface ArtworksData {
  intro: string;
  works: { title: string; en?: string; year?: string; medium?: string; description?: string; link: string; thumbnail?: string }[];
}

export interface PortfolioData {
  intro: string;
  types: {
    name: string;
    en: string;
    summary: string;
    description: string;
    courses: { title: string; folder: string }[];
  }[];
}

export interface WorkType extends Omit<PortfolioData['types'][number], 'courses'> {
  courses: { title: string; folder: string; imgs: string[] }[];
}
