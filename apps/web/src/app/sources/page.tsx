import { redirect } from 'next/navigation';
// Data sources are internal-only — redirect public visitors to signals
export default function SourcesPage() {
  redirect('/signals');
}
