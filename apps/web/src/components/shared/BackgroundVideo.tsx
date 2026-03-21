'use client'
export function BackgroundVideo() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-background-offwhite/90 to-white/95" />
      <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 20% 50%, rgba(46,204,113,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(26,44,62,0.03) 0%, transparent 50%)'}} />
    </div>
  )
}
