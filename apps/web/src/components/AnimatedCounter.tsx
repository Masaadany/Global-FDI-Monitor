'use client';
import { useEffect, useState, useRef } from 'react';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function AnimatedCounter({ value, prefix='', suffix='', duration=2000, decimals=0, style, className }: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setDisplay(+(value * ease).toFixed(decimals));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, decimals]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}
