import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'compact' | 'white';
  href?: string;
  className?: string;
}

export default function Logo({ variant = 'full', href = '/', className = '' }: LogoProps) {
  const navy  = variant === 'white' ? '#FFFFFF' : '#0A3D62';
  const green = '#74BB65';
  const size  = variant === 'compact' ? '16px' : '20px';

  const mark = (
    <span className={className} style={{display:'flex',alignItems:'baseline',gap:'2px',textDecoration:'none'}} aria-label="Global FDI Monitor">
      <span style={{fontSize:size,fontWeight:'900',color:navy,letterSpacing:'-0.5px',fontFamily:"Inter,-apple-system,sans-serif"}}>GLOBAL</span>
      <span style={{fontSize:size,fontWeight:'900',color:green,letterSpacing:'-0.5px',fontFamily:"Inter,-apple-system,sans-serif",marginLeft:'4px'}}>FDI</span>
      <span style={{fontSize:size,fontWeight:'900',color:navy,letterSpacing:'-0.5px',fontFamily:"Inter,-apple-system,sans-serif",marginLeft:'4px'}}>MONITOR</span>
    </span>
  );

  if (!href) return mark;
  return <Link href={href} style={{textDecoration:'none'}} aria-label="Global FDI Monitor home">{mark}</Link>;
}
