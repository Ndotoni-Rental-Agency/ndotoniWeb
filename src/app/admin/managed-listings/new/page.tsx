import { redirect } from 'next/navigation';

// The flow moved to its own full page.
export default function ManagedListingNewRedirect() {
  redirect('/managed/new');
}
