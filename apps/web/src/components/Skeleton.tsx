type SkeletonProps = {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
};

export function Skeleton({ width='100%', height='16px', rounded='8px', className='' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        width, height,
        borderRadius: rounded,
        background: 'rgba(10,61,98,0.1)',
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div aria-label="Skeleton component" className="gfm-card p-5 space-y-3">
      <Skeleton height="12px" width="60%"/>
      <Skeleton height="32px" width="40%"/>
      <Skeleton height="8px" width="80%"/>
      <Skeleton height="8px" width="60%"/>
    </div>
  );
}

export function SkeletonTable({ rows=5 }: { rows?: number }) {
  return (
    <div className="gfm-card overflow-hidden">
      <div className="px-5 py-3 border-b" style={{borderBottomColor:'rgba(10,61,98,0.1)'}}>
        <Skeleton height="12px" width="30%"/>
      </div>
      <div className="divide-y" style={{borderColor:'rgba(10,61,98,0.06)'}}>
        {Array.from({length:rows}).map((_,i)=>(
          <div key={i} className="px-5 py-3 flex items-center gap-3">
            <Skeleton width="32px" height="32px" rounded="50%"/>
            <div className="flex-1 space-y-1.5">
              <Skeleton height="10px" width="40%"/>
              <Skeleton height="8px" width="25%"/>
            </div>
            <Skeleton width="60px" height="10px"/>
            <Skeleton width="50px" height="20px" rounded="99px"/>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonSignal() {
  return (
    <div className="signal-card space-y-2">
      <div className="flex justify-between">
        <Skeleton width="70px" height="18px" rounded="99px"/>
        <Skeleton width="60px" height="12px"/>
      </div>
      <Skeleton height="12px" width="70%"/>
      <Skeleton height="10px" width="50%"/>
    </div>
  );
}

export default Skeleton;
