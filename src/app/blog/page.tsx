import { Metadata } from 'next';
import Link from 'next/link';
import { BlogExplorer } from '@/components/blog/BlogExplorer';
import { blogPosts } from './posts';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { photography } from './photography';

export const metadata: Metadata = {
  title: 'Blog – Ndotoni | Mwongozo wa Makazi Tanzania',
  description:
    'Vidokezo, miongozo, na habari kuhusu kupanga nyumba Tanzania. Jifunze jinsi ya kupata makazi bora kwa bei nafuu.',
  keywords: [
    'nyumba Tanzania blog',
    'kupanga nyumba dar es salaam',
    'mwongozo makazi',
    'rental tips Tanzania',
  ],
  openGraph: {
    title: 'Blog – Ndotoni',
    description: 'Miongozo na vidokezo vya kupanga nyumba Tanzania',
    url: 'https://www.ndotoni.com/blog',
  },
  alternates: {
    canonical: 'https://www.ndotoni.com/blog',
  },
};

export default function BlogPage() {
  const lead = blogPosts.find(p => p.slug === 'nyumba-za-kupanga-dar-es-salaam-2026')!;
  return <div className="bg-[#f5f3ed] pb-16 text-ink-900">
    <header className="mx-auto max-w-7xl px-5 pt-9 sm:px-8 lg:pt-12">
      <div className="flex items-center justify-between border-b border-stone-300 pb-4 text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-xs"><span>Ndotoni / Maisha & makazi</span><span>Tanzania, nyumbani.</span></div>
      <div className="grid items-end gap-6 py-8 md:grid-cols-[1.4fr_1fr] lg:py-10"><h1 className="font-serif text-6xl leading-[0.95] tracking-[-0.045em] sm:text-8xl lg:text-[104px]">Nyumbani,<br/><em className="font-normal text-brand-900">huanzia hapa.</em></h1><p className="max-w-sm pb-2 text-base leading-7 text-stone-600 md:justify-self-end">Maeneo ya kuishi. Maamuzi ya kupanga. Miongozo ya kukusaidia kupata sehemu yako Tanzania.</p></div>
      <div className="grid lg:grid-cols-[1.65fr_1fr]">
        <figure className="relative min-w-0"><Link href={`/blog/${lead.slug}`} className="group relative block aspect-[4/3] overflow-hidden sm:aspect-[16/10]"><Image src={photography[0].src} alt={photography[0].alt} fill priority unoptimized sizes="(max-width: 1023px) 100vw, 65vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none"/></Link><figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-4 pt-12 text-[11px] text-white"><a href={`/property/${photography[0].id}`} className="underline underline-offset-4">Picha: {photography[0].alt}</a></figcaption></figure>
        <div className="flex flex-col justify-center bg-[#183e31] px-7 py-10 text-white sm:px-10"><p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d5debe]">Makala teule / Dar es Salaam</p><Link href={`/blog/${lead.slug}`} className="group"><h2 className="font-serif text-4xl leading-[1.12] tracking-tight text-white sm:text-5xl">Eneo jipya.<br/>Mwanzo mpya.</h2><p className="mt-5 text-sm leading-7 text-white/75">{lead.descriptionSw}</p><span className="mt-8 inline-flex items-center gap-3 border-b border-white/50 pb-2 text-sm font-semibold">Soma mwongozo wa Dar <ArrowUpRight size={18}/></span></Link></div>
      </div>
    </header>
    <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8"><div className="mb-7 flex items-baseline justify-between border-b border-stone-300 pb-5"><h2 className="font-serif text-4xl tracking-tight sm:text-5xl">Kabla ya kuhamia.</h2><span className="hidden text-xs uppercase tracking-widest text-stone-500 sm:block">Maarifa ya kuishi vizuri</span></div>
      <BlogExplorer sw posts={blogPosts.map((p,i) => ({ slug: p.slug, title: p.titleSw, description: p.descriptionSw, category: p.category, date: p.date, image: photography[i % photography.length].src, imageAlt: photography[i % photography.length].alt }))}/>
      <aside className="mt-16 grid gap-6 border-y border-stone-300 py-9 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-800">Kutoka kusoma hadi kuhamia</p><h2 className="font-serif text-3xl sm:text-4xl">Nyumba yako inayofuata inakusubiri.</h2></div><Link href="/search" className="inline-flex items-center gap-4 font-semibold text-brand-900">Angalia nyumba <ArrowUpRight size={20}/></Link></aside>
      <a href="https://www.ndotonistays.com/blog" className="mt-8 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-brand-900">Kwa safari za siku chache, tembelea Ndotoni Stays <ArrowUpRight size={16}/></a>
    </div>
  </div>;
}
