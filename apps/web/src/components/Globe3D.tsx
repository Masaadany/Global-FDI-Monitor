'use client';
import { useEffect, useRef } from 'react';

type Signal = { lat: number; lon: number; grade?: string };

export default function Globe3D({ signals = [] as Signal[], height = 300 }: { signals?: Signal[]; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef(0);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-label','FDI Monitor — 3D globe visualization');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (ref.current?.clientWidth || 400) * dpr;
    canvas.height = height * dpr;
    canvas.style.width = '100%';
    canvas.style.height = `${height}px`;
    ref.current?.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width; const H = canvas.height;
    const cx = W/2; const cy = H/2;
    const R = Math.min(W, H) * 0.38;

    function draw() {
      ctx.clearRect(0,0,W,H);
      const a = angleRef.current;

      // Background glow
      const grd = ctx.createRadialGradient(cx,cy,R*0.2,cx,cy,R*1.4);
      grd.addColorStop(0,'rgba(116,187,101,0.08)');
      grd.addColorStop(1,'rgba(226,242,223,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0,0,W,H);

      // Globe sphere
      const sphereGrd = ctx.createRadialGradient(cx-R*0.3,cy-R*0.3,R*0.1,cx,cy,R);
      sphereGrd.addColorStop(0,'rgba(15,53,56,0.9)');
      sphereGrd.addColorStop(1,'rgba(226,242,223,0.8)');
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.fillStyle = sphereGrd; ctx.fill();
      ctx.strokeStyle = 'rgba(116,187,101,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();

      // Grid lines
      ctx.strokeStyle = 'rgba(10,61,98,0.1)'; ctx.lineWidth = 0.5;
      for (let lat = -60; lat <= 60; lat += 30) {
        const latRad = (lat * Math.PI) / 180;
        const y2 = cy + R * Math.sin(latRad);
        const rx = R * Math.cos(latRad);
        ctx.beginPath(); ctx.ellipse(cx, y2, rx, rx * 0.2, 0, 0, Math.PI*2);
        ctx.stroke();
      }
      ctx.beginPath(); ctx.ellipse(cx, cy, R, R * 0.3, a, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy, R, R * 0.3, a + Math.PI/2, 0, Math.PI*2); ctx.stroke();

      // Signal hotspots
      const GRADE_COLORS: Record<string,string> = {PLATINUM:'#0A3D62',GOLD:'#74BB65',SILVER:'#696969',BRONZE:'#696969'};
      signals.forEach(s => {
        const lon3d = s.lon * Math.PI / 180 + a;
        const lat3d = s.lat * Math.PI / 180;
        const visible = Math.cos(lon3d) > -0.3;
        if (!visible) return;
        const x3 = cx + R * Math.cos(lat3d) * Math.sin(lon3d);
        const y3 = cy - R * Math.sin(lat3d);
        const c = GRADE_COLORS[s.grade||'GOLD'] || '#74BB65';
        ctx.beginPath(); ctx.arc(x3, y3, 4, 0, Math.PI*2);
        ctx.fillStyle = c; ctx.fill();
        ctx.beginPath(); ctx.arc(x3, y3, 8, 0, Math.PI*2);
        ctx.fillStyle = c.replace('#','rgba(').replace(/([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i,
          (_, r, g, b) => `${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)}`)+',0.2)';
        ctx.fill();
      });

      angleRef.current += 0.003;
      animRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animRef.current); canvas.remove(); };
  }, [signals, height]);

  return <div ref={ref} style={{borderRadius:12,overflow:'hidden',background:'#E2F2DF'}}/>;
}
