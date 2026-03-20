import { redirect } from 'next/navigation';

// /fic redirects to intelligence credits page
export default function FICPage() {
  redirect('/fic/credits');
}
