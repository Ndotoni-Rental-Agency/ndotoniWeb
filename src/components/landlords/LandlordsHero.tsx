'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useFadeIn } from '@/hooks/useFadeIn';

const TRUST_CHIPS = [
  'No lock-in contracts',
  'WhatsApp support',
  'Free to get started',
];

export function LandlordsHero() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Green gradient glow — top right */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle, #00CD54 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative container py-20 sm:py-28 lg:py-32">
        <div
          ref={ref}
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left — copy */}
          <div className="flex-1 text-center lg:text-left space-y-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700/40 text-brand-700 dark:text-brand-400 rounded-full text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              For Landlords
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink-900 dark:text-white leading-[1.1]">
              Get Reliable Tenants{' '}
              <span className="text-brand-600 dark:text-brand-400">Faster</span>{' '}
              with Ndotoni
            </h1>

            {/* Subheadline */}
            <p className="text-ink-500 dark:text-gray-400 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Tanzania&apos;s dedicated rental platform markets your property to thousands of
              pre-qualified tenants — so you spend less time searching and more time earning.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <Link
                href="/landlord/properties/create"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold text-sm transition-all hover:scale-[1.02] shadow-green-sm hover:shadow-green focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                List Your Property
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white dark:bg-gray-900 border border-stone-200 dark:border-gray-700 text-ink-900 dark:text-white rounded-full font-semibold text-sm transition-all hover:bg-stone-50 dark:hover:bg-gray-800 hover:scale-[1.02] shadow-soft focus:outline-none focus:ring-2 focus:ring-ink-300 focus:ring-offset-2"
              >
                Talk to Us
              </Link>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start pt-1">
              {TRUST_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 text-sm text-ink-500 dark:text-gray-400"
                >
                  <CheckCircle size={14} className="text-brand-500 flex-shrink-0" />
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Right — visual */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <div className="relative">
      {/* Main card */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-editorial border border-stone-100 dark:border-gray-800 overflow-hidden p-6 sm:p-8">
        {/* Property image placeholder */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 aspect-[16/9] flex items-center justify-center mb-5">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop"
            alt="Modern rental property"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Property details */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-ink-900 dark:text-white text-base">
                2-Bedroom Apartment
              </h3>
              <p className="text-sm text-ink-500 dark:text-gray-400 mt-0.5">
                Kinondoni, Dar es Salaam
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full text-xs font-semibold whitespace-nowrap">
              Listed ✓
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-gray-800">
            <span className="text-ink-900 dark:text-white font-semibold text-sm">
              TZS 450,000 / mo
            </span>
            <span className="text-sm text-ink-500 dark:text-gray-400">
              4 enquiries today
            </span>
          </div>
        </div>
      </div>

      {/* Floating enquiry notification */}
      <div className="absolute -bottom-4 -left-4 sm:-left-8 bg-white dark:bg-gray-900 rounded-2xl shadow-editorial border border-stone-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 animate-bounce-gentle">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          MK
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-900 dark:text-white">New Enquiry</p>
          <p className="text-xs text-ink-500 dark:text-gray-400">Mary K. wants to view</p>
        </div>
      </div>

      {/* Floating stats chip */}
      <div className="absolute -top-4 -right-4 sm:-right-6 bg-brand-600 rounded-2xl shadow-green px-4 py-3 text-white">
        <p className="text-xs font-medium opacity-80">Occupancy rate</p>
        <p className="text-xl font-bold mt-0.5">94%</p>
      </div>
    </div>
  );
}
