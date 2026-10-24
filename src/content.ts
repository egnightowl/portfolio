// Reads the editable text files in /content and the work images in /content/works.
import site from '../content/site.yml';
import about from '../content/about.yml';
import career from '../content/career.yml';
import contact from '../content/contact.yml';
import portfolio from '../content/portfolio.yml';
import artworks from '../content/artworks.yml';
import type { SiteData, AboutData, CareerData, ContactData, PortfolioData, WorkType, ArtworksData } from './types/content';

export const SITE = site as SiteData;
export const ABOUT = about as AboutData;
export const CAREER = career as CareerData;
export const CONTACT = contact as ContactData;

// Every image under content/works/<type>/<course>/, grouped by folder and sorted by file name (01, 02, ... 10).
const files = import.meta.glob('../content/works/**/*.{png,jpg,jpeg,webp,gif,PNG,JPG,JPEG,WEBP,GIF}', {
  eager: true, query: '?url', import: 'default',
}) as Record<string, string>;

const byFolder: Record<string, { name: string; url: string }[]> = {};
for (const [file, url] of Object.entries(files)) {
  const rel = file.replace('../content/works/', '').normalize('NFC');
  const cut = rel.lastIndexOf('/');
  (byFolder[rel.slice(0, cut)] ??= []).push({ name: rel.slice(cut + 1), url });
}
const collator = new Intl.Collator('ko', { numeric: true });
const imagesIn = (folder: string) =>
  (byFolder[folder.replace(/^\/+|\/+$/g, '').normalize('NFC')] ?? [])
    .sort((a, b) => collator.compare(a.name, b.name))
    .map((f) => f.url);

export const WORK: { intro: string; types: WorkType[] } = {
  intro: (portfolio as PortfolioData).intro,
  types: (portfolio as PortfolioData).types.map((t) => ({
    ...t,
    courses: (t.courses ?? []).map((c) => ({ ...c, imgs: imagesIn(c.folder) })).filter((c) => c.imgs.length > 0),
  })),
};

// Art works: thumbnails live next to the list in content/artworks/, internal links get the site's base path.
const thumbs = import.meta.glob('../content/artworks/*.{png,jpg,jpeg,webp,gif}', {
  eager: true, query: '?url', import: 'default',
}) as Record<string, string>;
const thumbUrl = (name?: string) => (name ? thumbs[`../content/artworks/${name}`] ?? '' : '');
const linkUrl = (link: string) => (/^https?:\/\//.test(link) ? link : import.meta.env.BASE_URL + link.replace(/^\/+/, ''));

export const ART = {
  intro: (artworks as ArtworksData).intro,
  works: ((artworks as ArtworksData).works ?? []).map((w) => ({
    ...w, href: linkUrl(w.link), thumb: thumbUrl(w.thumbnail), external: /^https?:\/\//.test(w.link),
  })),
};

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Text marks used in the content files: **bold**, ==accent colour==, and line breaks.
export const fmt = (s: string | undefined) =>
  escape((s ?? '').trim())
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/==(.+?)==/g, '<span class="em">$1</span>')
    .replace(/\n/g, '<br/>');
