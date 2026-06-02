// Mock data for the Landlords landing page
// Strings that need translation are referenced via translation keys.
// Only numeric values and non-translatable data (icons, colors, etc.) live here.

export interface Stat {
  value: string;
  labelKey: string;      // translation key suffix under landlordsPage.stats.*
  descriptionKey: string;
}

export interface Step {
  numberKey: string;     // e.g. 'step1Number'
  titleKey: string;
  descriptionKey: string;
  icon: string;
  stepIndex: number;
}

export interface Benefit {
  titleKey: string;
  descriptionKey: string;
  icon: string;
  highlight?: boolean;
}

export interface FAQ {
  questionKey: string;
  answerKey: string;
}

export interface Testimonial {
  name: string;
  location: string;
  quoteKey: string;
  initials: string;
  color: string;
  propertiesListed: number;
}

export const STATS: Stat[] = [
  {
    value: '1,200+',
    labelKey: 'stat1Label',
    descriptionKey: 'stat1Description',
  },
  {
    value: '8,500+',
    labelKey: 'stat2Label',
    descriptionKey: 'stat2Description',
  },
  {
    value: '25+',
    labelKey: 'stat3Label',
    descriptionKey: 'stat3Description',
  },
  {
    value: '94%',
    labelKey: 'stat4Label',
    descriptionKey: 'stat4Description',
  },
];

export const HOW_IT_WORKS: Step[] = [
  {
    numberKey: 'step1Number',
    titleKey: 'step1Title',
    descriptionKey: 'step1Description',
    icon: 'building',
    stepIndex: 0,
  },
  {
    numberKey: 'step2Number',
    titleKey: 'step2Title',
    descriptionKey: 'step2Description',
    icon: 'megaphone',
    stepIndex: 1,
  },
  {
    numberKey: 'step3Number',
    titleKey: 'step3Title',
    descriptionKey: 'step3Description',
    icon: 'users',
    stepIndex: 2,
  },
];

export const BENEFITS: Benefit[] = [
  {
    titleKey: 'benefit1Title',
    descriptionKey: 'benefit1Description',
    icon: 'zap',
    highlight: true,
  },
  {
    titleKey: 'benefit2Title',
    descriptionKey: 'benefit2Description',
    icon: 'trending-down',
  },
  {
    titleKey: 'benefit3Title',
    descriptionKey: 'benefit3Description',
    icon: 'eye',
  },
  {
    titleKey: 'benefit4Title',
    descriptionKey: 'benefit4Description',
    icon: 'headphones',
  },
  {
    titleKey: 'benefit5Title',
    descriptionKey: 'benefit5Description',
    icon: 'settings',
  },
  {
    titleKey: 'benefit6Title',
    descriptionKey: 'benefit6Description',
    icon: 'shield',
  },
];

export const FAQS: FAQ[] = [
  { questionKey: 'faq1Question', answerKey: 'faq1Answer' },
  { questionKey: 'faq2Question', answerKey: 'faq2Answer' },
  { questionKey: 'faq3Question', answerKey: 'faq3Answer' },
  { questionKey: 'faq4Question', answerKey: 'faq4Answer' },
  { questionKey: 'faq5Question', answerKey: 'faq5Answer' },
  { questionKey: 'faq6Question', answerKey: 'faq6Answer' },
  { questionKey: 'faq7Question', answerKey: 'faq7Answer' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Amina Juma',
    location: 'Dar es Salaam',
    quoteKey: 'testimonial1Quote',
    initials: 'AJ',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    propertiesListed: 3,
  },
  {
    name: 'Hassan Mwangi',
    location: 'Arusha',
    quoteKey: 'testimonial2Quote',
    initials: 'HM',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    propertiesListed: 6,
  },
  {
    name: 'Grace Kiondo',
    location: 'Mwanza',
    quoteKey: 'testimonial3Quote',
    initials: 'GK',
    color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    propertiesListed: 1,
  },
];
