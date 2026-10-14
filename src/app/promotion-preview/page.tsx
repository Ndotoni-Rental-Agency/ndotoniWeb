import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import StayPromotionWorkspace from '@/components/admin/StayPromotionWorkspace';
export const dynamic = 'force-dynamic';
/** Dev-only dry run. Private sample inventory stays out of source control. */
export default async function PreviewPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  const file = path.resolve(process.cwd(), '../ndotoniBackend/scripts/social-publisher/data/previews/inventory.json');
  try { return <StayPromotionWorkspace previewProperties={JSON.parse(await readFile(file, 'utf8'))} />; }
  catch { return <p className="p-8">No local preview inventory. Follow the social publisher README to prepare the dev sample.</p>; }
}
