import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { BlogExplorer } from '@/components/blog/BlogExplorer';
import { Cover } from '@/components/blog/Cover';
import { blogPosts, getPostBySlug, readingMinutes } from './posts';
import { photography } from './photography';

export const metadata: Metadata = {
  title: 'Blog – Ndotoni | Miongozo ya kupanga nyumba Tanzania',
  description: 'Miongozo ya vitendo ya kupanga nyumba Tanzania: bajeti, maeneo ya Dar es Salaam, maswali ya kuuliza, mkataba, kuepuka matapeli na kuhamia.',
  keywords: ['kupanga nyumba dar es salaam', 'nyumba za kupanga', 'mwongozo wa mpangaji', 'mkataba wa kupanga', 'rental tips Tanzania'],
  openGraph: {
    title: 'Blog – Ndotoni',
    description: 'Miongozo ya vitendo ya kupanga nyumba Tanzania',
    url: 'https://www.ndotoni.com/blog',
    images: [{ url: photography[0].src, alt: photography[0].alt }],
  },
  alternates: { canonical: 'https://www.ndotoni.com/blog' },
};

const JOURNEY = [
  ['Panga bajeti', 'gharama-za-kupanga-nyumba'],
  ['Chagua eneo', 'nyumba-za-kupanga-dar-es-salaam-2026'],
  ['Tembelea na uliza', 'maswali-kabla-ya-kupanga-nyumba'],
  ['Soma mkataba', 'mkataba-wa-kupanga-nyumba'],
  ['Hamia', 'orodha-ya-kuhamia-nyumba-mpya'],
] as const;

export default function BlogPage() {
  const lead = getPostBySlug('nyumba-za-kupanga-dar-es-salaam-2026')!;
  const rest = blogPosts.filter(p => p !== lead);
  return <div className="bg-ink-50 pb-20 text-ink-900">
    <header className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Blog ya Ndotoni</p>
      <div className="mt-4 grid gap-4 md:grid-cols-[1.5fr_1fr] md:items-end">
        <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-6xl">Kupanga nyumba,<span className="block text-brand-600">bila kubahatisha.</span></h1>
        <p className="max-w-md text-base leading-7 text-ink-500 md:justify-self-end">Miongozo ya vitendo kutoka kwa timu ya Ndotoni — kuanzia bajeti hadi siku ya kuhamia.</p>
      </div>

      <Link href={`/blog/${lead.slug}`} className="group mt-10 grid overflow-hidden rounded-3xl bg-white ring-1 ring-ink-100 transition-shadow hover:shadow-xl hover:shadow-ink-900/5 lg:grid-cols-[1.4fr_1fr]">
        <Cover photo={photography[lead.photo!]} label={lead.category} index={0} priority sizes="(max-width: 1023px) 100vw, 60vw" className="aspect-[16/10] rounded-none lg:aspect-auto lg:min-h-[420px]" />
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Makala teule · {lead.category}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight group-hover:text-brand-700 sm:text-4xl">{lead.title}</h2>
          <p className="mt-4 leading-7 text-ink-500">{lead.description}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-brand-600">Soma mwongozo <ArrowRight size={16} aria-hidden="true" /></span>
        </div>
      </Link>

      <nav aria-label="Safari ya mpangaji" className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-ink-100 sm:p-6">
        <p className="mb-4 text-sm font-semibold text-ink-900">Unaanza? Fuata hatua hizi tano.</p>
        <ol className="grid gap-2 sm:grid-cols-5">
          {JOURNEY.map(([label, slug], i) => <li key={slug}><Link href={`/blog/${slug}`} className="group flex h-full items-center gap-3 rounded-2xl px-3 py-3 hover:bg-brand-50">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 group-hover:bg-brand-500 group-hover:text-white">{i + 1}</span>
            <span className="text-sm font-semibold text-ink-800">{label}</span>
          </Link></li>)}
        </ol>
      </nav>
    </header>

    <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">Makala zote</h2>
      <BlogExplorer posts={rest.map(p => ({ slug: p.slug, title: p.title, description: p.description, category: p.category, date: p.updated || p.date, minutes: readingMinutes(p), photo: p.photo === undefined ? undefined : photography[p.photo] }))} />

      <aside className="mt-20 flex flex-col gap-6 rounded-3xl bg-brand-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-200">Kutoka kusoma hadi kuhamia</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Nyumba yako inayofuata inakusubiri.</h2>
        </div>
        <Link href="/search" className="inline-flex w-fit flex-none items-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 font-semibold text-white hover:bg-brand-400">Angalia nyumba <ArrowRight size={18} aria-hidden="true" /></Link>
      </aside>
      <a href="https://www.ndotonistays.com/blog" className="mt-8 inline-flex items-center gap-2 text-sm text-ink-500 hover:text-brand-700">Unasafiri kwa siku chache? Soma miongozo ya Ndotoni Stays <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>
  </div>;
}
