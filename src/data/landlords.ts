// Mock data for the Landlords landing page

export interface Stat {
  value: string;
  label: string;
  description: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
  highlight?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  location: string;
  quote: string;
  initials: string;
  color: string;
  propertiesListed: number;
}

export const STATS: Stat[] = [
  {
    value: '1,200+',
    label: 'Properties Listed',
    description: 'Active rental listings across Tanzania',
  },
  {
    value: '8,500+',
    label: 'Tenants Matched',
    description: 'Successful tenant placements to date',
  },
  {
    value: '25+',
    label: 'Areas Served',
    description: 'Districts and towns covered nationwide',
  },
  {
    value: '94%',
    label: 'Occupancy Rate',
    description: 'Average for landlords on our platform',
  },
];

export const HOW_IT_WORKS: Step[] = [
  {
    number: '01',
    title: 'Submit Your Property',
    description:
      'Tell us about your property — location, size, price, and photos. Our simple form takes less than 10 minutes to complete.',
    icon: 'building',
  },
  {
    number: '02',
    title: 'We Market It',
    description:
      'Your property is published across Ndotoni, promoted to qualified tenants searching in your area. No extra effort from you.',
    icon: 'megaphone',
  },
  {
    number: '03',
    title: 'Find Tenants',
    description:
      'Receive enquiries from serious, vetted tenants. Review applications, connect via WhatsApp, and confirm your preferred tenant.',
    icon: 'users',
  },
];

export const BENEFITS: Benefit[] = [
  {
    title: 'Faster Occupancy',
    description:
      'Most landlords fill vacancies in under 2 weeks. Our targeted reach connects you with tenants who are actively searching now.',
    icon: 'zap',
    highlight: true,
  },
  {
    title: 'Less Marketing Effort',
    description:
      'Stop posting in WhatsApp groups and waiting for calls. Ndotoni handles distribution to thousands of active house-seekers.',
    icon: 'trending-down',
  },
  {
    title: 'Better Visibility',
    description:
      'Your listings appear in targeted search results and location-based feeds. Reach tenants searching in your exact neighbourhood.',
    icon: 'eye',
  },
  {
    title: 'Dedicated Support',
    description:
      'Our team is available via WhatsApp to help you list, update prices, or handle any questions along the way.',
    icon: 'headphones',
  },
  {
    title: 'Full Control',
    description:
      'Update availability, adjust prices, and manage photos anytime from your landlord dashboard. You stay in charge.',
    icon: 'settings',
  },
  {
    title: 'No Hidden Fees',
    description:
      'Transparent, straightforward pricing with no surprise commissions or percentage cuts on your rental income.',
    icon: 'shield',
  },
];

export const FAQS: FAQ[] = [
  {
    question: 'How much does it cost to list my property on Ndotoni?',
    answer:
      'Listing your property is free to get started. We offer flexible subscription plans for landlords who want enhanced visibility, priority placement, and access to tenant analytics. Contact our team for a plan that fits your portfolio size.',
  },
  {
    question: 'How long does it take to get my first enquiry?',
    answer:
      'Most properties receive their first tenant enquiry within 48–72 hours of going live. Properties with high-quality photos and accurate pricing tend to attract enquiries even faster.',
  },
  {
    question: 'Do I need to be tech-savvy to use Ndotoni?',
    answer:
      'Not at all. Our team can help you list your property over a simple WhatsApp conversation. You provide the details, we handle the rest. No accounts or apps are required to get started.',
  },
  {
    question: 'Can I list multiple properties?',
    answer:
      'Absolutely. Ndotoni is built for landlords with multiple units. You can manage all your listings from a single dashboard, track enquiries, and update availability for each property independently.',
  },
  {
    question: 'How does Ndotoni screen tenants?',
    answer:
      'Tenants on Ndotoni must provide verified contact details and submit applications with personal information. We surface serious enquiries and let you review applicant profiles before responding, so you stay in control of who rents your property.',
  },
  {
    question: 'What types of properties can I list?',
    answer:
      'We support all residential property types — single rooms, apartments, full houses, and short-stay units. Both long-term leases (monthly) and short-term stays are supported on the platform.',
  },
  {
    question: 'Is there a contract or lock-in period?',
    answer:
      'No long-term commitment required. You can list, pause, or remove your property at any time. Our subscription plans are billed monthly and can be cancelled whenever you need.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Amina Juma',
    location: 'Dar es Salaam',
    quote:
      'I used to spend weeks searching for tenants on WhatsApp groups. With Ndotoni, my apartment was occupied in just 5 days. The process was so smooth.',
    initials: 'AJ',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    propertiesListed: 3,
  },
  {
    name: 'Hassan Mwangi',
    location: 'Arusha',
    quote:
      'I manage 6 properties across Arusha. Ndotoni keeps all my listings organised and I rarely have a vacant unit anymore. Their support team is excellent.',
    initials: 'HM',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    propertiesListed: 6,
  },
  {
    name: 'Grace Kiondo',
    location: 'Mwanza',
    quote:
      'As a first-time landlord, I was nervous about finding reliable tenants. Ndotoni made the whole process simple and gave me confidence. Highly recommend.',
    initials: 'GK',
    color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    propertiesListed: 1,
  },
];
