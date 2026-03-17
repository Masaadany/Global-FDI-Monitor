import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-blue-800 mb-4">404</div>
        <h1 className="text-2xl font-black text-white mb-2">Page not found</h1>
        <p className="text-blue-300 text-sm mb-8">The intelligence you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard" className="bg-[#1D4ED8] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-500 transition-colors">
            Go to Dashboard
          </Link>
          <Link href="/" className="border border-blue-700 text-blue-300 font-semibold px-6 py-3 rounded-xl hover:bg-white/5 transition-colors">
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
