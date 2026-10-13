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
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';
import { GraphQLClient } from '@/lib/graphql-client';
import { submitLandlordRegistration } from '@/graphql/mutations';
import {
  PosterHero,
  posterButton,
  optionalText,
} from '@/components/marketing/PosterHero';

const WHATSAPP = '255790720329';
const whatsappHref = (sw: boolean) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(sw ? 'Habari, nina nyumba ya kupangisha.' : 'Hello, I have a property to rent out.')}`;

export function LandlordsPageContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HowItWorks />
        <WhyUs />
        <RegisterForm />
        <ContactCTA />
      </div>
    </div>
  );
}

function HeroSection() {
  const { t, language } = useLanguage();
  const sw = language === 'sw';

  return (
    <PosterHero
      lead={t('landlordsPage.hero.headline1')}
      sticker={t('landlordsPage.hero.headlineHighlight')}
      tail={optionalText(t, 'landlordsPage.hero.headline2')}
      subheadline={t('landlordsPage.hero.subheadline')}
      chips={[
        t('landlordsPage.hero.chip1'),
        t('landlordsPage.hero.chip2'),
        t('landlordsPage.hero.chip3'),
      ]}
      actions={
        <>
          <a href="#register" className={posterButton.onGreen}>
            {t('landlordsPage.hero.ctaPrimary')}
            <ArrowRight size={19} strokeWidth={2.5} aria-hidden="true" />
          </a>
          <a
            href={whatsappHref(sw)}
            target="_blank"
            rel="noopener noreferrer"
            className={posterButton.onGreenSecondary}
          >
            <MessageCircle size={19} strokeWidth={2.25} aria-hidden="true" />
            WhatsApp
          </a>
          <a
            href="mailto:info@ndotoni.com"
            className={posterButton.onGreenSecondary}
          >
            <Mail size={19} strokeWidth={2.25} aria-hidden="true" />
            Email
          </a>
        </>
      }
    />
  );
}

function SectionHeading({
  id,
  lead,
  highlight,
  sub,
}: {
  id: string;
  lead: string;
  highlight: string;
  sub?: string;
}) {
  return (
    <div className="mb-10">
      <h2 id={id} className="poster-heading max-w-3xl">
        {lead}{' '}
        <span className="text-brand-700 dark:text-brand-300">{highlight}</span>
      </h2>
      {sub && (
        <p className="mt-2 max-w-xl text-base text-ink-500 sm:text-lg dark:text-gray-400">
          {sub}
        </p>
      )}
    </div>
  );
}

function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Phone,
      title: t('landlordsPage.howItWorks.step1Title'),
      desc: t('landlordsPage.howItWorks.step1Description'),
    },
    {
      icon: Camera,
      title: t('landlordsPage.howItWorks.step2Title'),
      desc: t('landlordsPage.howItWorks.step2Description'),
    },
    {
      icon: Users,
      title: t('landlordsPage.howItWorks.step3Title'),
      desc: t('landlordsPage.howItWorks.step3Description'),
    },
  ];

  return (
    <section className="py-14 sm:py-20" aria-labelledby="landlord-steps">
      <SectionHeading
        id="landlord-steps"
        lead={t('landlordsPage.howItWorks.heading1')}
        highlight={t('landlordsPage.howItWorks.headingHighlight')}
        sub={t('landlordsPage.howItWorks.subheading')}
      />
      <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <li key={i} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-ink-900"
              >
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-ink-900 dark:text-white">
                  <span className="sr-only">{i + 1}. </span>
                  {step.title}
                  <Icon
                    size={18}
                    className="text-brand-700 dark:text-brand-300"
                    aria-hidden="true"
                  />
                </h3>
                <p className="mt-1 text-base leading-relaxed text-ink-500 dark:text-gray-400">
                  {step.desc}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function WhyUs() {
  const { t } = useLanguage();

  const points = [
    {
      icon: CheckCircle,
      title: t('landlordsPage.benefits.benefit6Title'),
      desc: t('landlordsPage.benefits.benefit6Description'),
    },
    {
      icon: Camera,
      title: t('landlordsPage.benefits.benefit2Title'),
      desc: t('landlordsPage.benefits.benefit2Description'),
    },
    {
      icon: Building2,
      title: t('landlordsPage.benefits.benefit3Title'),
      desc: t('landlordsPage.benefits.benefit3Description'),
    },
    {
      icon: Users,
      title: t('landlordsPage.benefits.benefit5Title'),
      desc: t('landlordsPage.benefits.benefit5Description'),
    },
  ];

  return (
    <section
      className="border-t border-stone-200 py-14 sm:py-20 dark:border-gray-800"
      aria-labelledby="landlord-why"
    >
      <SectionHeading
        id="landlord-why"
        lead={t('landlordsPage.benefits.heading1')}
        highlight={t('landlordsPage.benefits.headingHighlight')}
        sub={t('landlordsPage.benefits.subheading')}
      />
      <dl className="grid grid-cols-1 border-t border-stone-200 sm:grid-cols-2 sm:gap-x-12 dark:border-gray-800">
        {points.map((point, i) => {
          const Icon = point.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-4 border-b border-stone-200 py-5 dark:border-gray-800"
            >
              <Icon
                size={22}
                strokeWidth={2}
                className="mt-0.5 shrink-0 text-brand-700 dark:text-brand-300"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <dt className="font-bold text-ink-900 dark:text-white">
                  {point.title}
                </dt>
                <dd className="mt-1 text-base leading-relaxed text-ink-500 dark:text-gray-400">
                  {point.desc}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

function RegisterForm() {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const [form, setForm] = useState({
    name: '',
    phone: '',
    area: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function isValidPhone(v: string) {
    return /^[+\d][\d\s\-]{6,}$/.test(v.trim());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim())
      errs.name = sw ? 'Tafadhali weka jina lako' : 'Please enter your name';
    if (!form.phone.trim())
      errs.phone = sw
        ? 'Tafadhali weka namba ya simu'
        : 'Please enter a phone number';
    else if (!isValidPhone(form.phone))
      errs.phone = sw
        ? 'Namba ya simu si sahihi'
        : 'That phone number looks wrong';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);

    try {
      await GraphQLClient.executePublic(submitLandlordRegistration, {
        name: form.name,
        phone: form.phone,
        area: form.area || undefined,
        notes: form.notes || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      const errors = err?.errors || [];
      const isSerializationOnly =
        errors.length > 0 &&
        errors.every(
          (e: any) =>
            e?.message?.includes("Can't serialize") ||
            e?.message?.includes('serialize value'),
        );
      if (isSerializationOnly || err?.data?.submitLandlordRegistration) {
        setSubmitted(true);
      } else {
        console.error('Landlord registration error:', err);
        setErrors({
          phone: sw
            ? 'Imeshindikana kutuma. Jaribu tena.'
            : 'Could not send. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section
        id="register"
        className="scroll-mt-24 border-t border-stone-200 py-14 sm:py-20 dark:border-gray-800"
      >
        <div>
          <div
            className="mx-auto max-w-lg space-y-4 rounded-3xl bg-brand-50 p-8 text-center dark:bg-brand-900/20"
            role="status"
          >
            <CheckCircle
              size={40}
              className="mx-auto text-brand-700 dark:text-brand-300"
            />
            <h3 className="font-poster text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white">
              {sw ? 'Tumepokea taarifa zako' : 'We received your details'}
            </h3>
            <p className="text-ink-700 dark:text-gray-300">
              {sw
                ? 'Tutakupigia simu hivi karibuni ili kutembelea nyumba yako.'
                : 'We will call you soon to schedule a visit to your property.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="register"
      className="scroll-mt-24 border-t border-stone-200 py-14 sm:py-20 dark:border-gray-800"
      aria-labelledby="landlord-register"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <div className="lg:sticky lg:top-28">
            <h2 id="landlord-register" className="poster-heading max-w-md">
              {sw ? 'Acha taarifa zako, ' : 'Leave your details, '}
              <span className="text-brand-700 dark:text-brand-300">
                {sw ? 'tutakupigia' : "we'll call you"}
              </span>
            </h2>
            <p className="mt-3 max-w-md text-base text-ink-500 sm:text-lg dark:text-gray-400">
              {sw
                ? 'Tuma taarifa zako hapa, au tutumie WhatsApp au barua pepe. Tutawasiliana nawe.'
                : 'Submit your details here, or message us on WhatsApp or email. We will reach out.'}
            </p>
            <p className="mt-6 text-sm text-ink-500 dark:text-gray-400">
              {sw ? 'Au tutumie moja kwa moja:' : 'Or reach us directly:'}{' '}
              <a
                href={whatsappHref(sw)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-800 hover:underline dark:text-brand-300"
              >
                WhatsApp
              </a>
              {' · '}
              <a
                href="mailto:info@ndotoni.com"
                className="font-semibold text-brand-800 hover:underline dark:text-brand-300"
              >
                info@ndotoni.com
              </a>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_24px_48px_-28px_rgba(17,24,39,0.35)] sm:p-8 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-ink-700 dark:text-gray-200">
              {sw ? 'Jina lako' : 'Your name'} *
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none"
              />
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  setErrors((er) => ({ ...er, name: undefined }));
                }}
                placeholder={sw ? 'Jina kamili' : 'Full name'}
                className={cn(
                  'w-full min-h-12 pl-10 pr-4 rounded-xl border bg-stone-50 text-base text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white',
                  errors.name
                    ? 'border-red-400 focus:ring-red-500'
                    : 'border-stone-200 focus:ring-ink-900 dark:border-gray-600',
                )}
              />
            </div>
            {errors.name && (
              <p
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-ink-700 dark:text-gray-200">
              {sw ? 'Namba ya simu' : 'Phone number'} *
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none"
              />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => {
                  setForm((f) => ({ ...f, phone: e.target.value }));
                  setErrors((er) => ({ ...er, phone: undefined }));
                }}
                placeholder="+255 7XX XXX XXX"
                className={cn(
                  'w-full min-h-12 pl-10 pr-4 rounded-xl border bg-stone-50 text-base text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white',
                  errors.phone
                    ? 'border-red-400 focus:ring-red-500'
                    : 'border-stone-200 focus:ring-ink-900 dark:border-gray-600',
                )}
              />
            </div>
            {errors.phone && (
              <p
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-ink-700 dark:text-gray-200">
              {sw ? 'Eneo la nyumba' : 'Property location'}
            </label>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none"
              />
              <input
                type="text"
                value={form.area}
                onChange={(e) =>
                  setForm((f) => ({ ...f, area: e.target.value }))
                }
                placeholder={
                  sw
                    ? 'k.m. Kinondoni, Dar es Salaam'
                    : 'e.g. Kinondoni, Dar es Salaam'
                }
                className="w-full min-h-12 pl-10 pr-4 rounded-xl border border-stone-200 bg-stone-50 text-base text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-900 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-ink-700 dark:text-gray-200">
              {sw ? 'Taarifa nyingine' : 'Additional details'}
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder={
                sw
                  ? 'Aina ya nyumba, idadi ya vyumba, nk.'
                  : 'Type of home, number of rooms, etc.'
              }
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-base text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-900 resize-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <p className="text-xs text-ink-500 dark:text-gray-400">
            {language === 'sw'
              ? 'Kwa kutuma, unakubali '
              : 'By submitting, you agree to our '}
            <a
              href="/terms"
              target="_blank"
              className="underline hover:text-ink-900 dark:hover:text-white"
            >
              {language === 'sw'
                ? 'vigezo na masharti'
                : 'terms and conditions of service'}
            </a>
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              posterButton.primary,
              'w-full min-h-14 disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />{' '}
                {sw ? 'Inatuma…' : 'Sending…'}
              </>
            ) : (
              <>
                {sw ? 'Tuma taarifa' : 'Send details'}{' '}
                <ArrowRight size={18} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function ContactCTA() {
  const { t, language } = useLanguage();
  const sw = language === 'sw';

  return (
    <section className="pb-16 sm:pb-20" aria-labelledby="landlord-contact">
      <div className="rounded-3xl bg-ink-900 p-8 sm:p-12 dark:bg-gray-800">
        <h2
          id="landlord-contact"
          className="max-w-2xl font-poster text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl"
          style={{ fontStretch: '90%' }}
        >
          {t('landlordsPage.cta.heading1')}{' '}
          <span className="text-brand-400">
            {t('landlordsPage.cta.headlineHighlight')}
          </span>
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg">
          {t('landlordsPage.cta.subheading')}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="tel:+255785842148" className={posterButton.primary}>
            <Phone size={19} strokeWidth={2.25} aria-hidden="true" />
            +255 785 842 148
          </a>
          <a
            href={whatsappHref(sw)}
            target="_blank"
            rel="noopener noreferrer"
            className={posterButton.onDark}
          >
            <MessageCircle size={19} strokeWidth={2.25} aria-hidden="true" />
            +255 790 720 329
          </a>
          <a
            href="mailto:info@ndotoni.com"
            className="inline-flex min-h-12 items-center px-2 text-base font-semibold text-white underline-offset-4 hover:underline"
          >
            info@ndotoni.com
          </a>
        </div>
      </div>
    </section>
  );
}
