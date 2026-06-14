import type { FooterLinkItem } from './FooterLinkColumn';

type TranslateFn = (key: string) => string;

const searchType = (type: string) => `/search?propertyType=${type}&region=Dar%20es%20Salaam`;

export function getFooterLinks(t: TranslateFn) {
  const company: FooterLinkItem[] = [
    { name: t('nav.home'), href: '/' },
    { name: t('footer.aboutUs'), href: '/about' },
    { name: 'Invest', href: '/invest' },
    { name: t('footer.contactUs'), href: '/contact' },
    { name: t('footer.blog'), href: '/blog' },
    { name: t('footer.privacyPolicy'), href: '/privacy' },
    { name: t('footer.termsOfService'), href: '/terms' },
  ];

  const renters: FooterLinkItem[] = [
    { name: t('footer.browseProperties'), href: '/search' },
    { name: t('properties.propertyTypes.apartment'), href: searchType('APARTMENT') },
    { name: t('properties.propertyTypes.house'), href: searchType('HOUSE') },
    { name: t('properties.propertyTypes.room'), href: searchType('ROOM') },
    { name: t('properties.propertyTypes.studio'), href: searchType('STUDIO') },
  ];

  const landlords: FooterLinkItem[] = [
    { name: t('footer.listProperty'), href: '/landlord' },
    { name: t('footer.pricing'), href: '/host/subscription' },
    { name: t('footer.landlordGuide'), href: '/about' },
    { name: t('footer.propertyVerification'), href: '/about' },
  ];

  return { company, renters, landlords };
}
