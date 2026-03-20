import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen" style={{background:'#0F0A0A'}}>
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <Skeleton variant="card" className="h-32 mb-6"/>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[1,2,3].map(i=><Skeleton key={i} variant="card" className="h-24"/>)}
        </div>
        <Skeleton variant="table"/>
      </div>
    </div>
  );
}
