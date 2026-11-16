import type { Metadata } from 'next';
import FilterLandingPage, { filterMetadata } from '@/components/seo/FilterLanding';

interface Props {
  params: { region: string; district: string; filter: string };
}

export const revalidate = 3600;
export const dynamicParams = true;

export function generateMetadata({ params }: Props): Promise<Metadata> {
  return filterMetadata(params.region, params.district, params.filter);
}

export default function AreaFilterPage({ params }: Props) {
  return <FilterLandingPage regionSlug={params.region} areaSlug={params.district} filterSlug={params.filter} />;
}
