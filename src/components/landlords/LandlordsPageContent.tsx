'use client';

import {
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
  Camera,
  Users,
  CheckCircle,
  Building2,
  User,
  MapPin,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';

export function LandlordsPageContent() {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <HeroSection />
      <HowItWorks />
      <WhyUs />
      <RegisterForm />
      <ContactCTA />
    </div>
  );
}

function HeroSection() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50%] h-[70%] opacity-[0.05] rounded-full"
        style={{ background: 'radial-gradient(ellipse at 70% 30%, #1DBF53, transparent 60%)' }} aria-hidden="true" />

      <div className="container py-24 sm:py-32 lg:py-40">
        <div ref={ref} className={`max-w-3xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight text-ink-900 leading-[1.05] mb-6">
            {t('landlordsPage.hero.headline1')}{' '}
            <span className="text-brand-600">{t('landlordsPage.hero.headlineHighlight')}</span>
          </h1>

          <p className="text-xl text-ink-500 leading-relaxed max-w-lg mb-10">
            {t('landlordsPage.hero.subheadline')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a href="#register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-bold text-lg transition-all hover:scale-[1.02] shadow-green">
              {t('landlordsPage.hero.ctaPrimary')}
            </a>
            <a href="https://wa.me/255790720329?text=Habari%2C%20nina%20nyumba%20ya%20kupangisha"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-brand-200 text-brand-700 rounded-full font-bold text-lg transition-all hover:bg-brand-50 hover:scale-[1.02]">
              <MessageCircle size={20} />
              WhatsApp
            </a>
            <a href="mailto:info@ndotoni.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-stone-200 text-ink-700 rounded-full font-bold text-lg transition-all hover:bg-stone-50 hover:scale-[1.02]">
              <Mail size={20} />
              Email
            </a>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {[t('landlordsPage.hero.chip1'), t('landlordsPage.hero.chip2'), t('landlordsPage.hero.chip3')].map((chip) => (
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

function HowItWorks() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  const steps = [
    { icon: Phone, title: t('landlordsPage.howItWorks.step1Title'), desc: t('landlordsPage.howItWorks.step1Description') },
    { icon: Camera, title: t('landlordsPage.howItWorks.step2Title'), desc: t('landlordsPage.howItWorks.step2Description') },
    { icon: Users, title: t('landlordsPage.howItWorks.step3Title'), desc: t('landlordsPage.howItWorks.step3Description') },
  ];

  return (
    <section className="bg-cream-50 border-y border-stone-100">
      <div className="container py-20 sm:py-24">
        <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-900 mb-3">
              {t('landlordsPage.howItWorks.heading1')}{' '}
              <span className="text-brand-600">{t('landlordsPage.howItWorks.headingHighlight')}</span>
            </h2>
            <p className="text-ink-500 text-lg">{t('landlordsPage.howItWorks.subheading')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="text-center">
                  <div className="font-display text-6xl font-black text-brand-100 leading-none mb-4">{i + 1}</div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-ink-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  const points = [
    { icon: CheckCircle, text: t('landlordsPage.benefits.benefit6Title') + '. ' + t('landlordsPage.benefits.benefit6Description') },
    { icon: Camera, text: t('landlordsPage.benefits.benefit2Title') + '. ' + t('landlordsPage.benefits.benefit2Description') },
    { icon: Building2, text: t('landlordsPage.benefits.benefit3Title') + '. ' + t('landlordsPage.benefits.benefit3Description') },
    { icon: Users, text: t('landlordsPage.benefits.benefit5Title') + '. ' + t('landlordsPage.benefits.benefit5Description') },
  ];

  return (
    <section>
      <div className="container py-20 sm:py-24">
        <div ref={ref} className={`max-w-3xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-900 text-center mb-12">
            {t('landlordsPage.benefits.heading1')}{' '}
            <span className="text-brand-600">{t('landlordsPage.benefits.headingHighlight')}</span>
          </h2>

          <div className="space-y-5">
            {points.map((point, i) => {
              const Icon = point.icon;
              return (
                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-cream-50 border border-stone-100">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={16} className="text-brand-600" />
                  </div>
                  <p className="text-ink-700 leading-relaxed">{point.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function RegisterForm() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { language } = useLanguage();
  const sw = language === 'sw';
  const [form, setForm] = useState({ name: '', phone: '', area: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function isValidPhone(v: string) { return /^[+\d][\d\s\-]{6,}$/.test(v.trim()); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    else if (!isValidPhone(form.phone)) errs.phone = 'Invalid phone';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section id="register" className="border-t border-stone-100">
        <div className="container py-20 sm:py-24">
          <div className="max-w-lg mx-auto text-center space-y-4">
            <CheckCircle size={40} className="text-brand-600 mx-auto" />
            <h3 className="font-display text-2xl font-bold text-ink-900">{sw ? 'Tumepokea taarifa zako' : 'We received your details'}</h3>
            <p className="text-ink-500">{sw ? 'Tutakupigia simu hivi karibuni ili kutembelea nyumba yako.' : 'We will call you soon to schedule a visit to your property.'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="border-t border-stone-100">
      <div className="container py-20 sm:py-24">
        <div ref={ref} className={`max-w-lg mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-900 mb-3">
              {sw ? 'Acha taarifa zako, ' : 'Leave your details, '}<span className="text-brand-600">{sw ? 'tutakupigia' : "we'll call you"}</span>
            </h2>
            <p className="text-ink-500">{sw ? 'Tuma taarifa zako hapa, au tutumie WhatsApp au barua pepe. Tutawasiliana nawe.' : 'Submit your details here, or message us on WhatsApp or email. We will reach out.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-stone-100 bg-white p-6 sm:p-8 shadow-soft space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink-700">{sw ? 'Jina lako' : 'Your name'} *</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none" />
                <input type="text" value={form.name} onChange={(e) => { setForm(f => ({...f, name: e.target.value})); setErrors(er => ({...er, name: undefined})); }}
                  placeholder={sw ? 'Jina kamili' : 'Full name'} className={cn('w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-ink-900 placeholder:text-ink-300 text-sm focus:outline-none focus:ring-2 focus:border-transparent', errors.name ? 'border-red-300 focus:ring-red-500' : 'border-stone-200 focus:ring-brand-500')} />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink-700">{sw ? 'Namba ya simu' : 'Phone number'} *</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none" />
                <input type="tel" value={form.phone} onChange={(e) => { setForm(f => ({...f, phone: e.target.value})); setErrors(er => ({...er, phone: undefined})); }}
                  placeholder="+255 7XX XXX XXX" className={cn('w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-ink-900 placeholder:text-ink-300 text-sm focus:outline-none focus:ring-2 focus:border-transparent', errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-stone-200 focus:ring-brand-500')} />
              </div>
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink-700">{sw ? 'Eneo la nyumba' : 'Property location'}</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none" />
                <input type="text" value={form.area} onChange={(e) => setForm(f => ({...f, area: e.target.value}))}
                  placeholder="k.m. Kinondoni, Dar es Salaam" className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-ink-900 placeholder:text-ink-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink-700">{sw ? 'Taarifa nyingine' : 'Additional details'}</label>
              <textarea rows={2} value={form.notes} onChange={(e) => setForm(f => ({...f, notes: e.target.value}))}
                placeholder="Aina ya nyumba, idadi ya vyumba, nk."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-ink-900 placeholder:text-ink-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-400 text-white rounded-full font-semibold text-sm transition-all shadow-green-sm">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Inatuma...</> : <>Tuma Taarifa <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-ink-400 mt-6">
            Au tutumie moja kwa moja:{' '}
            <a href="https://wa.me/255790720329?text=Habari%2C%20nina%20nyumba%20ya%20kupangisha" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-semibold hover:underline">WhatsApp</a>
            {' · '}
            <a href="mailto:info@ndotoni.com" className="text-brand-600 font-semibold hover:underline">info@ndotoni.com</a>
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactCTA() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <section className="bg-brand-50 border-t border-brand-100">
      <div className="container py-20 sm:py-24">
        <div ref={ref} className={`text-center max-w-2xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-900 mb-4">
            {t('landlordsPage.cta.heading1')}{' '}
            <span className="text-brand-600">{t('landlordsPage.cta.headlineHighlight')}</span>
          </h2>
          <p className="text-ink-500 text-lg mb-10">{t('landlordsPage.cta.subheading')}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a href="tel:+255785842148"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-bold text-lg transition-all hover:scale-[1.02] shadow-green">
              <Phone size={20} />
              +255 785 842 148
            </a>
            <a href="https://wa.me/255790720329?text=Habari%2C%20nina%20nyumba%20ya%20kupangisha"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-brand-200 text-brand-700 rounded-full font-bold text-lg transition-all hover:bg-white hover:scale-[1.02]">
              <MessageCircle size={20} />
              +255 790 720 329
            </a>
          </div>

          <a href="mailto:info@ndotoni.com" className="text-brand-600 font-semibold hover:underline underline-offset-2">
            info@ndotoni.com
          </a>
        </div>
      </div>
    </section>
  );
}
