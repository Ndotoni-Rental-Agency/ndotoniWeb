'use client';

import { useState } from 'react';
import {
  TrendingUp,
  Users,
  Shield,
  ArrowRight,
  Mail,
  FileText,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Smartphone,
  Globe,
  Target,
  Code,
  Megaphone,
  HeadphonesIcon,
  BarChart3,
  Palette,
} from 'lucide-react';

const STRIPE_LINKS: Record<number, string> = {
  50: 'https://buy.stripe.com/dRm14mcL1cBzbZi67FcQU00',
  100: 'https://buy.stripe.com/3cIdR85iz453d3m67FcQU01',
  300: 'https://buy.stripe.com/aFa6oGbGX597fbuanVcQU02',
  500: 'https://buy.stripe.com/cNi9AS4ev1WV7J22VtcQU03',
  1000: 'https://buy.stripe.com/5kQ3cucL1eJH4wQcw3cQU04',
};

const MPESA_NUMBER = '+255 782 267 121';

const TEAM = [
  {
    name: 'Emmanuel Makoye',
    role: 'Founder & CEO',
    focus: 'Software Engineer at Amazon (Seattle). BS Computer Science, Case Western Reserve University \'25. Oversees all Ndotoni activities and builds the platform.',
    initials: 'EM',
    grad: 'from-brand-500 to-emerald-600',
    image: null,
    linkedin: 'https://www.linkedin.com/in/emmanuel-makoye-63a7611b7/',
    email: 'makoye224@gmail.com',
  },
  {
    name: 'Robinson Jackson',
    role: 'COO',
    focus: 'Operations, coordination, customer oversight',
    initials: 'RJ',
    grad: 'from-blue-500 to-indigo-600',
    image: null,
    linkedin: null,
    email: null,
  },
  {
    name: 'Akil Khatri',
    role: 'Development',
    focus: 'Referral systems, fraud prevention, tracking',
    initials: 'AK',
    grad: 'from-cyan-500 to-blue-600',
    image: null,
    linkedin: null,
    email: null,
  },
  {
    name: 'Adam Nzinza',
    role: 'Marketing',
    focus: 'Content, distribution, demand generation',
    initials: 'AN',
    grad: 'from-purple-500 to-pink-600',
    image: null,
    linkedin: null,
    email: null,
  },
  {
    name: 'Paul Lukindo',
    role: 'Marketing',
    focus: 'Social media, university outreach',
    initials: 'PL',
    grad: 'from-teal-500 to-emerald-600',
    image: null,
    linkedin: null,
    email: null,
  },
  {
    name: 'Raymond Maohei',
    role: 'Customer Relations',
    focus: 'Lead conversion, landlord onboarding',
    initials: 'RM',
    grad: 'from-orange-500 to-red-600',
    image: null,
    linkedin: null,
    email: null,
  },
  {
    name: 'Kelvin Makoye',
    role: 'Customer Relations',
    focus: 'Landlord engagement, follow-ups',
    initials: 'KM',
    grad: 'from-rose-500 to-pink-600',
    image: null,
    linkedin: null,
    email: null,
  },
  {
    name: 'Japhet Kabegeje',
    role: 'Customer Relations',
    focus: 'Agent onboarding, pipeline management',
    initials: 'JK',
    grad: 'from-amber-500 to-orange-600',
    image: null,
    linkedin: null,
    email: null,
  },
];

export function InvestPageContent() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Investment Inquiry – Ndotoni');
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\n${contactForm.message}`
    );
    window.open(`mailto:invest@ndotoni.com?subject=${subject}&body=${body}`, '_blank');
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ===================== TOP: SIMPLE — GIVE US MONEY ===================== */}

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-800 py-16 sm:py-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Invest in Ndotoni
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            Help us build Tanzania&apos;s most trusted rental housing platform.
          </p>
          <div className="mt-6 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 inline-block">
            <div className="text-4xl font-bold text-white">$200,000</div>
            <p className="text-white/70 text-sm mt-1">Seed · 10–20% Equity · 12–18mo Runway</p>
          </div>
          <div className="mt-6">
            <a href="#back-us" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-brand-700 font-bold shadow-lg hover:scale-[1.02] transition-all">
              Back Us Now <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </section>

      {/* Back Us — payment */}
      <section id="back-us" className="py-10 sm:py-14 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-brand-200 dark:border-brand-800 shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-ink-900 dark:text-white text-center mb-1">Back Us</h2>
          <p className="text-sm text-ink-500 dark:text-gray-400 text-center mb-6">
            Card, Apple Pay, Google Pay, or M-Pesa.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
            {[50, 100, 300, 500, 1000].map((amt) => (
              <a
                key={amt}
                href={STRIPE_LINKS[amt]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 border-stone-200 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all text-center group"
              >
                <span className="text-lg font-bold text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300">
                  ${amt}
                </span>
              </a>
            ))}
          </div>

          <a
            href={STRIPE_LINKS[100]}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all mb-4"
          >
            <CreditCard size={16} strokeWidth={2} />
            Pay with Card / Apple Pay / Google Pay
          </a>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-stone-200 dark:bg-gray-700" />
            <span className="text-xs text-ink-400 dark:text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-gray-700" />
          </div>

          <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
              <Smartphone size={20} className="text-brand-600 dark:text-brand-400" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-white">M-Pesa (Tanzania)</p>
              <p className="text-lg font-bold text-brand-700 dark:text-brand-300">{MPESA_NUMBER}</p>
              <p className="text-xs text-ink-500 dark:text-gray-400">Send any amount · Name: Kelvin Makoye</p>
            </div>
          </div>

          <p className="text-xs text-ink-400 dark:text-gray-500 text-center mt-5">
            🔒 Secure payments via Stripe. M-Pesa is direct transfer.
          </p>
        </div>

        {/* Quick links */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <a href="#why" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Why invest? ↓</a>
          <a href="#pitch-deck" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Pitch Deck ↓</a>
          <a href="https://wa.me/255782267121?text=Hi%2C%20I'm%20interested%20in%20investing%20in%20Ndotoni" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">WhatsApp →</a>
        </div>
      </section>

      {/* ===================== BOTTOM: FULL DETAILS ===================== */}

      {/* Why — The Problem */}
      <section id="why" className="py-14 bg-stone-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-center mb-4">The Problem We&apos;re Solving</h2>
          <p className="text-ink-500 dark:text-gray-400 text-center max-w-2xl mx-auto mb-10">
            600,000+ rental moves per year across Tanzania&apos;s largest cities — a $60M+ market — and it&apos;s still running on trust, luck, and WhatsApp groups.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: 'No Trust',
                text: 'Fake listings, misleading photos, dishonest agents. Renters get scammed regularly with zero accountability.',
              },
              {
                icon: Target,
                title: 'No Transparency',
                text: 'Prices hidden, fees unclear. You pay agents just to view a property — and it often doesn\'t match what was described.',
              },
              {
                icon: Globe,
                title: 'No Technology',
                text: 'No searchable database. No verified listings. No real-time availability. The entire market runs on word of mouth.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-gray-800 rounded-xl border border-stone-100 dark:border-gray-700 p-5">
                <item.icon size={22} className="text-red-500 mb-3" strokeWidth={1.75} />
                <h3 className="font-bold text-ink-900 dark:text-white mb-1.5">{item.title}</h3>
                <p className="text-sm text-ink-500 dark:text-gray-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-center mb-4">Our Solution</h2>
        <p className="text-ink-500 dark:text-gray-400 text-center max-w-2xl mx-auto mb-10">
          Ndotoni physically inspects every property, takes real photos, lists it for free, and matches tenants. We earn a first-month commission on successful rentals. No middlemen for the renter.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            'We visit and verify every property with real photos',
            'Free for landlords — they get tenants faster',
            'Tenants search verified listings and connect directly',
            'Revenue: 100% of first month\'s rent on match',
            'Multi-platform: web, mobile app, WhatsApp bot',
            'Already live with real traction (see below)',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-brand-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span className="text-sm text-ink-700 dark:text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why We Win */}
      <section className="py-14 bg-stone-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-center mb-4">Why We&apos;re the Right Team</h2>
          <p className="text-ink-500 dark:text-gray-400 text-center max-w-2xl mx-auto mb-10">
            8 people. Builders, marketers, and operators who live in Tanzania, understand the problem first-hand, and move fast.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TEAM.map((m) => (
              <div key={m.name} className="bg-white dark:bg-gray-800 rounded-xl border border-stone-100 dark:border-gray-700 p-4 text-center">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="w-14 h-14 mx-auto rounded-full object-cover mb-2" />
                ) : (
                  <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${m.grad} flex items-center justify-center text-white text-sm font-bold mb-2`}>
                    {m.initials}
                  </div>
                )}
                <p className="text-sm font-bold text-ink-900 dark:text-white leading-tight">{m.name}</p>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-0.5">{m.role}</p>
                <p className="text-xs text-ink-400 dark:text-gray-500 mt-1 leading-snug">{m.focus}</p>
                {(m.linkedin || m.email) && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" aria-label={`${m.name} LinkedIn`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" aria-label={`Email ${m.name}`}>
                        <Mail size={14} strokeWidth={2} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-stone-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-ink-900 dark:text-white mb-3">How We Work</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-ink-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-brand-500">•</span> 2-week sprints
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-500">•</span> Monthly check-ins & pivots
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-500">•</span> Ship fast, stay careful
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traction */}
      <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-center mb-2">Traction</h2>
        <p className="text-sm text-brand-600 dark:text-brand-400 text-center mb-8">Launched 8 days ago</p>
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { value: '40', label: 'Landlords onboarded' },
            { value: '800+', label: 'Weekly visitors' },
            { value: '160+', label: 'WhatsApp inquiries' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">{s.value}</div>
              <div className="text-xs text-ink-500 dark:text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <h3 className="font-bold text-ink-900 dark:text-white mb-4">What We&apos;ve Built</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Live platform: ndotoni.com (long-term rentals)',
            'Live platform: ndotonistays.com (short-term stays)',
            'Android mobile app (Expo/React Native)',
            'WhatsApp bot for landlord outreach & management',
            'Automated booking & payment system (Stripe + M-Pesa)',
            'Full backend on AWS (AppSync, DynamoDB, Lambda)',
            'Admin dashboard for property verification',
            'Referral system for user acquisition',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-ink-700 dark:text-gray-300">
              <CheckCircle2 size={14} className="text-brand-500 flex-shrink-0" strokeWidth={2} />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Market + Projections */}
      <section className="py-14 bg-stone-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-center mb-8">Market & Projections</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { stat: '65M+', label: 'Population' },
              { stat: '$60M+', label: 'Addressable market' },
              { stat: '600K+', label: 'Rental moves/year' },
              { stat: '0', label: 'Dominant competitor' },
            ].map((item) => (
              <div key={item.label} className="bg-white dark:bg-gray-800 rounded-xl border border-stone-100 dark:border-gray-700 p-4 text-center">
                <div className="text-xl font-bold text-brand-600 dark:text-brand-400">{item.stat}</div>
                <div className="text-xs text-ink-500 dark:text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-stone-100 dark:border-gray-700 p-5">
              <h3 className="font-bold text-ink-900 dark:text-white mb-3 text-sm">Annual Rentals (5-year)</h3>
              {[
                { year: 'Y1', val: '500', w: '2%' },
                { year: 'Y2', val: '2,000', w: '10%' },
                { year: 'Y3', val: '5,800', w: '28%' },
                { year: 'Y4', val: '11,800', w: '56%' },
                { year: 'Y5', val: '21,000', w: '100%' },
              ].map((r) => (
                <div key={r.year} className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-ink-400 dark:text-gray-500 w-5">{r.year}</span>
                  <div className="flex-1 h-5 bg-stone-100 dark:bg-gray-700 rounded">
                    <div className="h-full bg-brand-500 rounded" style={{ width: r.w }} />
                  </div>
                  <span className="text-xs font-bold text-ink-700 dark:text-gray-300 w-14 text-right">{r.val}</span>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-stone-100 dark:border-gray-700 p-5">
              <h3 className="font-bold text-ink-900 dark:text-white mb-3 text-sm">Revenue (5-year)</h3>
              {[
                { year: 'Y1', val: '$50K', w: '2%' },
                { year: 'Y2', val: '$200K', w: '10%' },
                { year: 'Y3', val: '$580K', w: '28%' },
                { year: 'Y4', val: '$1.2M', w: '57%' },
                { year: 'Y5', val: '$2.1M', w: '100%' },
              ].map((r) => (
                <div key={r.year} className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-ink-400 dark:text-gray-500 w-5">{r.year}</span>
                  <div className="flex-1 h-5 bg-stone-100 dark:bg-gray-700 rounded">
                    <div className="h-full bg-emerald-500 rounded" style={{ width: r.w }} />
                  </div>
                  <span className="text-xs font-bold text-ink-700 dark:text-gray-300 w-14 text-right">{r.val}</span>
                </div>
              ))}
              <p className="text-xs text-ink-400 dark:text-gray-500 mt-2">ndotoni.com only. Stays revenue is additional upside.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use of Funds */}
      <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white text-center mb-8">Use of Funds</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: 'Landlord Acquisition', amount: '$80K', percent: '40%' },
            { title: 'Marketing', amount: '$50K', percent: '25%' },
            { title: 'Product', amount: '$40K', percent: '20%' },
            { title: 'Operations', amount: '$30K', percent: '15%' },
          ].map((item) => (
            <div key={item.title} className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-brand-700 dark:text-brand-300">{item.amount}</div>
              <div className="text-xs text-ink-600 dark:text-gray-400 mt-1 font-medium">{item.title}</div>
              <div className="text-xs text-ink-400 dark:text-gray-500">{item.percent}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pitch Deck */}
      <section id="pitch-deck" className="py-12 bg-stone-50 dark:bg-gray-900 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-3">Pitch Deck</h2>
          <p className="text-sm text-ink-500 dark:text-gray-400 mb-5">Full details on market, model, traction, and roadmap.</p>
          <a
            href="https://docs.google.com/presentation/d/YOUR_PITCH_DECK_ID/view"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all"
          >
            <ExternalLink size={16} strokeWidth={2.5} /> View Pitch Deck
          </a>
          <p className="text-xs text-ink-400 dark:text-gray-500 mt-3">Or email invest@ndotoni.com</p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 max-w-lg mx-auto px-4 sm:px-6">
        <h2 className="text-xl font-bold text-ink-900 dark:text-white text-center mb-6">Questions?</h2>
        {formSubmitted ? (
          <div className="text-center py-6">
            <CheckCircle2 size={36} className="text-brand-500 mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-bold text-ink-900 dark:text-white">Sent!</p>
            <p className="text-sm text-ink-500 dark:text-gray-400 mt-1">We&apos;ll reply within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleContact} className="space-y-3">
            <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full rounded-lg bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-gray-700 px-4 py-2.5 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Name" aria-label="Name" />
            <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full rounded-lg bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-gray-700 px-4 py-2.5 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Email" aria-label="Email" />
            <textarea rows={3} required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="w-full rounded-lg bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-gray-700 px-4 py-2.5 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="Your message..." aria-label="Message" />
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm">
              <Mail size={15} strokeWidth={2.5} /> Send
            </button>
          </form>
        )}
        <div className="mt-6 text-center text-sm">
          <a href="mailto:invest@ndotoni.com" className="text-brand-600 dark:text-brand-400 font-medium">invest@ndotoni.com</a>
          <span className="text-ink-300 dark:text-gray-600 mx-2">·</span>
          <a href="https://wa.me/255782267121?text=Hi%2C%20I'm%20interested%20in%20investing%20in%20Ndotoni" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 font-medium">WhatsApp →</a>
        </div>
      </section>

      <footer className="py-6 border-t border-stone-100 dark:border-gray-800 text-center">
        <p className="text-xs text-ink-400 dark:text-gray-500">Ndotoni Online Traders · Registered in Tanzania · ndotoni.com</p>
      </footer>
    </div>
  );
}
