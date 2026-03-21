'use client'
interface Props { code: string; size?: number; showName?: boolean; name?: string; className?: string }
export function CountryFlag({ code, size=24, showName=false, name, className='' }: Props) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${code.toUpperCase()}.svg`}
        alt={`${code} flag`} width={size} height={Math.round(size*0.67)}
        className="rounded-sm shadow-sm object-cover flex-shrink-0"
        onError={(e)=>{(e.target as any).style.display='none'}} />
      {showName && name && <span className="text-sm font-medium text-text-primary">{name}</span>}
    </div>
  )
}
