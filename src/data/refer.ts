// Mock data for the Referral Program landing page
// Strings that need translation are referenced via translation keys.
// Only non-translatable data (icons, colors, numeric values) live here.

export interface ReferStat {
  value: string;
  labelKey: string;
  descriptionKey: string;
}

export interface ReferStep {
  stepIndex: number;
  numberKey: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
}

export interface Reward {
  id: string;
  amountDisplay: string;
  triggerKey: string;
  descriptionKey: string;
  icon: string;
  highlight?: boolean;
}

export interface ReferFAQ {
  questionKey: string;
  answerKey: string;
}

export interface ReferralExample {
  name: string;
  initials: string;
  color: string;
  location: string;
  rewardEarned: string;
  quoteKey: string;
}

export const REFER_STATS: ReferStat[] = [
  {
    value: '340+',
    labelKey: 'stat1Label',
    descriptionKey: 'stat1Description',
  },
  {
    value: '180+',
    labelKey: 'stat2Label',
    descriptionKey: 'stat2Description',
  },
  {
    value: 'TZS 2,400,000+',
    labelKey: 'stat3Label',
    descriptionKey: 'stat3Description',
  },
  {
    value: '72h',
    labelKey: 'stat4Label',
    descriptionKey: 'stat4Description',
  },
];

export const REFER_HOW_IT_WORKS: ReferStep[] = [
  {
    stepIndex: 0,
    numberKey: 'step1Number',
    titleKey: 'step1Title',
    descriptionKey: 'step1Description',
    icon: 'search',
  },
  {
    stepIndex: 1,
    numberKey: 'step2Number',
    titleKey: 'step2Title',
    descriptionKey: 'step2Description',
    icon: 'send',
  },
  {
    stepIndex: 2,
    numberKey: 'step3Number',
    titleKey: 'step3Title',
    descriptionKey: 'step3Description',
    icon: 'phone',
  },
  {
    stepIndex: 3,
    numberKey: 'step4Number',
    titleKey: 'step4Title',
    descriptionKey: 'step4Description',
    icon: 'gift',
  },
];

export const REWARDS: Reward[] = [
  {
    id: 'listing',
    amountDisplay: 'TZS 2,000',
    triggerKey: 'reward1Trigger',
    descriptionKey: 'reward1Description',
    icon: 'building',
    highlight: false,
  },
  {
    id: 'rental',
    amountDisplay: '10%',
    triggerKey: 'reward2Trigger',
    descriptionKey: 'reward2Description',
    icon: 'percent',
    highlight: true,
  },
];

export const REFER_FAQS: ReferFAQ[] = [
  { questionKey: 'faq1Question', answerKey: 'faq1Answer' },
  { questionKey: 'faq2Question', answerKey: 'faq2Answer' },
  { questionKey: 'faq3Question', answerKey: 'faq3Answer' },
  { questionKey: 'faq4Question', answerKey: 'faq4Answer' },
  { questionKey: 'faq5Question', answerKey: 'faq5Answer' },
  { questionKey: 'faq6Question', answerKey: 'faq6Answer' },
];

export const REFERRAL_EXAMPLES: ReferralExample[] = [
  {
    name: 'Zawadi Mwamba',
    initials: 'ZM',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    location: 'Dar es Salaam',
    rewardEarned: 'TZS 2,000',
    quoteKey: 'example1Quote',
  },
  {
    name: 'Brian Ochieng',
    initials: 'BO',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    location: 'Arusha',
    rewardEarned: 'TZS 8,500',
    quoteKey: 'example2Quote',
  },
  {
    name: 'Neema Salehe',
    initials: 'NS',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600',
    location: 'Mwanza',
    rewardEarned: 'TZS 2,000',
    quoteKey: 'example3Quote',
  },
];
