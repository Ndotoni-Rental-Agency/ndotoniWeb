'use client';

import { ArrowRight, ArrowDown, CheckCircle } from 'lucide-react';
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
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold text-lg transition-all hover:scale-[1.02] shadow-green">
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

  return (
    <section className="bg-cream-50 border-y border-stone-100">
      <div className="container py-20 sm:py-24">
        <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-900 mb-3">
              {t('referPage.rewards.heading1')}{' '}
              <span className="text-brand-600">{t('referPage.rewards.headingHighlight')}</span>
            </h2>
          </div>

          {/* Single card showing both rewards as a sequence */}
          <div className="max-w-2xl mx-auto rounded-2xl bg-white border border-stone-100 shadow-soft overflow-hidden">
            {/* Step 1 */}
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-brand-700">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-ink-500 mb-1">{t('referPage.rewards.reward1Trigger')}</p>
                  <p className="font-display text-3xl font-black text-brand-600">TZS 2,000</p>
                  <p className="text-sm text-ink-500 mt-1">{t('referPage.rewards.reward1Description')}</p>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex items-center justify-center py-2 bg-cream-50 border-y border-stone-100">
              <ArrowDown size={16} className="text-ink-300" />
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-brand-700">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-ink-500 mb-1">{t('referPage.rewards.reward2Trigger')}</p>
                  <p className="font-display text-3xl font-black text-brand-600">
                    10% <span className="text-base font-semibold text-ink-400">= TZS 10,000 - 50,000</span>
                  </p>
                  <p className="text-sm text-ink-500 mt-1">{t('referPage.rewards.reward2Description')}</p>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="px-6 sm:px-8 py-5 bg-brand-50 border-t border-brand-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-700">{t('referPage.rewards.bonusTitle')}</p>
                  <p className="text-xs text-ink-500">{t('referPage.rewards.bonusDescription')}</p>
                </div>
                <p className="font-display text-lg font-black text-brand-600">TZS 12,000 - 52,000</p>
              </div>
            </div>
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
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold text-lg transition-all hover:scale-[1.02] shadow-green">
            {t('referPage.cta.ctaPrimary')}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
