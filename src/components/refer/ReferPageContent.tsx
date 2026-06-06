'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReferFormModal } from './ReferFormModal';

export function ReferPageContent() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      <HeroSection onSubmit={() => setShowForm(true)} />
      <RewardsSection />
      <CTASection onSubmit={() => setShowForm(true)} />
      {showForm && <ReferFormModal onClose={() => setShowForm(false)} />}
    </div>
  );
}

function HeroSection({ onSubmit }: { onSubmit: () => void }) {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50%] h-[70%] opacity-[0.05] rounded-full"
        style={{ background: 'radial-gradient(ellipse at 70% 30%, #1DBF53, transparent 60%)' }} aria-hidden="true" />

      <div className="container py-24 sm:py-32 lg:py-40">
        <div ref={ref} className={`max-w-3xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight text-ink-900 leading-[1.05] mb-6">
            {t('referPage.hero.headline1')}{' '}
            <span className="text-brand-600">{t('referPage.hero.headlineHighlight')}</span>
            {t('referPage.hero.headline2')?.trim() && (
              <> {t('referPage.hero.headline2')}</>
            )}
          </h1>

          <p className="text-xl text-ink-500 leading-relaxed max-w-lg mb-10">
            {t('referPage.hero.subheadline')}
          </p>

          <button onClick={onSubmit}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-bold text-lg transition-all hover:scale-[1.02] shadow-green">
            {t('referPage.hero.ctaPrimary')}
            <ArrowRight size={20} />
          </button>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-8">
            {[t('referPage.hero.chip1'), t('referPage.hero.chip2'), t('referPage.hero.chip3')].map((chip) => (
              <span key={chip} className="flex items-center gap-1.5 text-sm text-ink-500">
                <CheckCircle size={14} className="text-brand-500" />
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RewardsSection() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  function reveal(index: number) {
    setRevealed(prev => ({ ...prev, [index]: true }));
  }

  const allRevealed = revealed[0] && revealed[1];

  return (
    <section className="bg-cream-50 border-y border-stone-100">
      <div className="container py-16 sm:py-20">
        <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-ink-900">
              {t('referPage.rewards.heading1')}{' '}
              <span className="text-brand-600">{t('referPage.rewards.headingHighlight')}</span>
            </h2>
            {!allRevealed && (
              <p className="text-sm text-ink-400 mt-2">Gusa kuona zawadi 👇</p>
            )}
          </div>

          <div className="max-w-sm mx-auto space-y-3">
            {/* Reward 1 */}
            {!revealed[0] ? (
              <button onClick={() => reveal(0)}
                className="w-full flex items-center justify-between rounded-xl bg-white border-2 border-dashed border-brand-200 px-5 py-5 hover:border-brand-400 hover:bg-brand-50/30 transition-all active:scale-[0.98] group cursor-pointer animate-pulse-soft">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 text-sm font-bold flex items-center justify-center group-hover:bg-brand-200 transition-colors">1</span>
                  <span className="text-sm text-ink-500">{t('referPage.rewards.reward1Trigger')}</span>
                </div>
                <span className="text-lg group-hover:scale-125 transition-transform">🎁</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between rounded-xl bg-white border border-brand-200 px-5 py-5 animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold flex items-center justify-center">✓</span>
                  <span className="text-sm text-ink-700">{t('referPage.rewards.reward1Trigger')}</span>
                </div>
                <span className="font-display text-xl font-black text-brand-600">TZS 2,000</span>
              </div>
            )}

            {/* Reward 2 */}
            {!revealed[1] ? (
              <button onClick={() => reveal(1)}
                className="w-full flex items-center justify-between rounded-xl bg-white border-2 border-dashed border-stone-200 px-5 py-5 hover:border-brand-300 hover:bg-brand-50/30 transition-all active:scale-[0.98] group cursor-pointer animate-pulse-soft" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-stone-100 text-ink-500 text-sm font-bold flex items-center justify-center group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors">2</span>
                  <span className="text-sm text-ink-500">{t('referPage.rewards.reward2Trigger')}</span>
                </div>
                <span className="text-lg group-hover:scale-125 transition-transform">🎁</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between rounded-xl bg-white border border-stone-200 px-5 py-5 animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold flex items-center justify-center">✓</span>
                  <span className="text-sm text-ink-700">{t('referPage.rewards.reward2Trigger')}</span>
                </div>
                <span className="font-display text-xl font-black text-ink-900">10% <span className="text-xs font-semibold text-ink-400">(TZS 10-50K)</span></span>
              </div>
            )}

            {/* Total - shows when both revealed */}
            {allRevealed && (
              <div className="flex items-center justify-between rounded-xl bg-brand-50 border border-brand-100 px-5 py-4 animate-fade-in">
                <span className="text-sm font-semibold text-ink-700">{t('referPage.rewards.bonusTitle')}</span>
                <span className="font-display text-base font-bold text-brand-600">TZS 12K - 52K</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection({ onSubmit }: { onSubmit: () => void }) {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <section className="bg-brand-50 border-t border-brand-100">
      <div className="container py-20 sm:py-24">
        <div ref={ref} className={`text-center max-w-2xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-900 mb-4">
            {t('referPage.cta.heading1')}{' '}
            <span className="text-brand-600">{t('referPage.cta.headingHighlight')}</span>
          </h2>
          <p className="text-ink-500 text-lg mb-10">{t('referPage.cta.subheading')}</p>

          <button onClick={onSubmit}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-bold text-lg transition-all hover:scale-[1.02] shadow-green">
            {t('referPage.cta.ctaPrimary')}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
