'use client';
import { useEffect, useRef, useCallback } from 'react';

interface GlobePoint {
  lat: number;
  lng: number;
  country: string;
  gosa: number;
  fdi: string;
}

const HOTSPOTS: GlobePoint[] = [
  {lat:1.3,  lng:103.8, country:'Singapore',    gosa:88.4, fdi:'$91B'},
  {lat:3.1,  lng:101.7, country:'Malaysia',     gosa:81.2, fdi:'$22B'},
  {lat:13.7, lng:100.5, country:'Thailand',     gosa:80.7, fdi:'$14B'},
  {lat:21.0, lng:105.8, country:'Vietnam',      gosa:79.4, fdi:'$24B'},
  {lat:24.4, lng:54.4,  country:'UAE',          gosa:82.1, fdi:'$23B'},
  {lat:24.7, lng:46.7,  country:'Saudi Arabia', gosa:79.1, fdi:'$36B'},
  {lat:20.6, lng:78.9,  country:'India',        gosa:73.2, fdi:'$71B'},
  {lat:-6.2, lng:106.8, country:'Indonesia',    gosa:77.8, fdi:'$22B'},
  {lat:37.6, lng:127.0, country:'South Korea',  gosa:84.1, fdi:'$17B'},
  {lat:35.7, lng:139.7, country:'Japan',        gosa:81.4, fdi:'$16B'},
  {lat:51.5, lng:-0.1,  country:'UK',           gosa:82.5, fdi:'$50B'},
  {lat:40.7, lng:-74.0, country:'United States',gosa:83.9, fdi:'$349B'},
  {lat:-15.8,lng:-47.9, country:'Brazil',       gosa:71.3, fdi:'$74B'},
  {lat:31.8, lng:-7.1,  country:'Morocco',      gosa:66.8, fdi:'$4B'},
  {lat:55.8, lng:37.6,  country:'Russia',       gosa:58.2, fdi:'$19B'},
];

function latLngToXYZ(lat: number, lng: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
}

function scoreToColor(score: number): string {
  if(score >= 80) return '#00ffc8';
  if(score >= 70) return '#00b4d8';
  if(score >= 60) return '#ffd700';
  return '#ff8c00';
}

export default function Globe3D({ width = 420, height = 420, onCountryClick }: {
  width?: number;
  height?: number;
  onCountryClick?: (country: GlobePoint) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotY = useRef(0);
  const rotX = useRef(0.2);
  const velY = useRef(0.003);
  const velX = useRef(0);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const hovered = useRef<GlobePoint|null>(null);
  const animFrame = useRef<number>(0);
  const time = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) * 0.41;

    ctx.clearRect(0, 0, W, H);

    // ── DEEP SPACE BACKGROUND ───────────────────────────────
    const bgGrad = ctx.createRadialGradient(cx, cy, R*0.3, cx, cy, R*1.4);
    bgGrad.addColorStop(0, 'rgba(10,22,40,0)');
    bgGrad.addColorStop(0.7, 'rgba(0,212,255,0.03)');
    bgGrad.addColorStop(1, 'rgba(0,255,200,0.05)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ── ATMOSPHERE GLOW ──────────────────────────────────────
    const atmoGrad = ctx.createRadialGradient(cx, cy, R, cx, cy, R*1.35);
    atmoGrad.addColorStop(0, 'rgba(0,212,255,0.12)');
    atmoGrad.addColorStop(0.4, 'rgba(0,255,200,0.05)');
    atmoGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R*1.35, 0, Math.PI*2);
    ctx.fillStyle = atmoGrad;
    ctx.fill();

    // ── GLOBE BASE ───────────────────────────────────────────
    const globeGrad = ctx.createRadialGradient(cx-R*0.3, cy-R*0.3, R*0.1, cx, cy, R);
    globeGrad.addColorStop(0, '#1a3a5c');
    globeGrad.addColorStop(0.4, '#0d2140');
    globeGrad.addColorStop(0.8, '#081828');
    globeGrad.addColorStop(1, '#04101c');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI*2);
    ctx.fillStyle = globeGrad;
    ctx.fill();

    // ── LATITUDE LINES ───────────────────────────────────────
    ctx.strokeStyle = 'rgba(0,180,216,0.08)';
    ctx.lineWidth = 0.5;
    for(let lat = -60; lat <= 60; lat += 30) {
      const y0 = cy - R * Math.sin(lat * Math.PI/180);
      const rr = R * Math.cos(lat * Math.PI/180);
      ctx.beginPath();
      ctx.ellipse(cx, y0, rr, rr * Math.abs(Math.sin(rotX.current))*0.35 + rr*0.05, 0, 0, Math.PI*2);
      ctx.stroke();
    }

    // ── LONGITUDE LINES ─────────────────────────────────────
    for(let lng = 0; lng < 180; lng += 30) {
      const angle = (lng * Math.PI/180) + rotY.current;
      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * Math.abs(sinA), R, 0, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(0,180,216,${Math.abs(sinA)*0.06 + 0.03})`;
      ctx.stroke();
    }

    // ── EQUATOR ──────────────────────────────────────────────
    ctx.beginPath();
    ctx.ellipse(cx, cy, R, R * 0.08, 0, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(0,255,200,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── ORBIT RING ───────────────────────────────────────────
    ctx.beginPath();
    ctx.ellipse(cx, cy, R*1.15, R*0.15, 0, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(0,212,255,0.2)';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Orbiting dot
    const orbitAngle = time.current * 0.8;
    const ox = cx + R*1.15 * Math.cos(orbitAngle);
    const oy = cy + R*0.15 * Math.sin(orbitAngle);
    ctx.beginPath();
    ctx.arc(ox, oy, 3, 0, Math.PI*2);
    ctx.fillStyle = '#00d4ff';
    ctx.fill();
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00d4ff';
    ctx.fill();
    ctx.shadowBlur = 0;

    // ── HOTSPOT POINTS ───────────────────────────────────────
    const visible: Array<{pt: GlobePoint, px: number, py: number, scale: number}> = [];

    for(const pt of HOTSPOTS) {
      const pos = latLngToXYZ(pt.lat, pt.lng, R);
      // Apply rotation
      const cosY = Math.cos(rotY.current), sinY = Math.sin(rotY.current);
      const cosX = Math.cos(rotX.current), sinX = Math.sin(rotX.current);
      const x1 = pos.x * cosY - pos.z * sinY;
      const z1 = pos.x * sinY + pos.z * cosY;
      const y1 = pos.y * cosX - z1 * sinX;
      const z2 = pos.y * sinX + z1 * cosX;

      if(z2 < -R*0.1) continue; // back side
      const scale = (z2 + R) / (2*R);
      const px = cx + x1;
      const py = cy - y1;

      visible.push({pt, px, py, scale});

      // Connection lines to nearby points
      for(const pt2 of visible.slice(-3)) {
        if(pt2.pt === pt) continue;
        if(pt.gosa >= 78 && pt2.pt.gosa >= 78) {
          const grad = ctx.createLinearGradient(px, py, pt2.px, pt2.py);
          const col = scoreToColor(Math.min(pt.gosa, pt2.pt.gosa));
          grad.addColorStop(0, `${col}00`);
          grad.addColorStop(0.5, `${col}20`);
          grad.addColorStop(1, `${col}00`);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(pt2.px, pt2.py);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      const color = scoreToColor(pt.gosa);
      const isHov = hovered.current?.country === pt.country;
      const dotR = (4 + (pt.gosa - 60) * 0.08) * scale + (isHov ? 2 : 0);

      // Outer ring
      if(isHov || pt.gosa >= 80) {
        ctx.beginPath();
        ctx.arc(px, py, dotR*2.5 + (time.current % 1)*3, 0, Math.PI*2);
        ctx.strokeStyle = `${color}${Math.floor((1-(time.current%1))*80).toString(16).padStart(2,'0')}`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Dot glow
      ctx.shadowBlur = isHov ? 20 : 10;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(px, py, dotR, 0, Math.PI*2);
      const dotGrad = ctx.createRadialGradient(px-dotR*0.3, py-dotR*0.3, 0, px, py, dotR);
      dotGrad.addColorStop(0, '#ffffff');
      dotGrad.addColorStop(0.3, color);
      dotGrad.addColorStop(1, `${color}80`);
      ctx.fillStyle = dotGrad;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label on hover
      if(isHov) {
        ctx.fillStyle = 'rgba(6,15,26,0.92)';
        const tw = ctx.measureText(pt.country).width + 100;
        ctx.beginPath();
        ctx.roundRect(px + 10, py - 28, tw, 38, 6);
        ctx.fill();
        ctx.strokeStyle = `${color}50`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = `bold 10px 'JetBrains Mono', monospace`;
        ctx.fillText(pt.country, px + 16, py - 14);
        ctx.fillStyle = 'rgba(232,244,248,0.7)';
        ctx.font = `9px 'Inter', sans-serif`;
        ctx.fillText(`GOSA ${pt.gosa} · FDI ${pt.fdi}`, px + 16, py);
      }
    }

    // ── GLOBE SHINE ──────────────────────────────────────────
    const shineGrad = ctx.createRadialGradient(cx-R*0.35, cy-R*0.35, 0, cx, cy, R);
    shineGrad.addColorStop(0, 'rgba(200,240,255,0.08)');
    shineGrad.addColorStop(0.4, 'rgba(100,200,255,0.02)');
    shineGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI*2);
    ctx.fillStyle = shineGrad;
    ctx.fill();

    // ── HUD CORNERS ─────────────────────────────────────────
    const cornerSize = 20;
    ctx.strokeStyle = 'rgba(0,255,200,0.3)';
    ctx.lineWidth = 1.5;
    [[0,0],[1,0],[0,1],[1,1]].forEach(([fx,fy])=>{
      const bx = fx===0 ? 2 : W-2;
      const by = fy===0 ? 2 : H-2;
      const dx = fx===0 ? cornerSize : -cornerSize;
      const dy = fy===0 ? cornerSize : -cornerSize;
      ctx.beginPath();
      ctx.moveTo(bx+dx, by);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx, by+dy);
      ctx.stroke();
    });

    time.current += 0.016;
  }, []);

  useEffect(() => {
    const loop = () => {
      if(!isDragging.current) {
        rotY.current += velY.current;
        rotX.current += velX.current;
        velX.current *= 0.98;
        rotX.current = Math.max(-0.5, Math.min(0.5, rotX.current));
      }
      draw();
      animFrame.current = requestAnimationFrame(loop);
    };
    animFrame.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame.current);
  }, [draw]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if(isDragging.current) {
      const dx = mx - lastMouse.current.x;
      const dy = my - lastMouse.current.y;
      rotY.current += dx * 0.006;
      rotX.current += dy * 0.004;
      velY.current = dx * 0.003;
      velX.current = dy * 0.002;
      lastMouse.current = {x:mx, y:my};
    }

    // Hit test
    const cx = canvas.width/2, cy = canvas.height/2, R = Math.min(canvas.width, canvas.height)*0.41;
    let found: GlobePoint|null = null;
    for(const pt of HOTSPOTS) {
      const pos = latLngToXYZ(pt.lat, pt.lng, R);
      const cosY = Math.cos(rotY.current), sinY = Math.sin(rotY.current);
      const cosX = Math.cos(rotX.current), sinX = Math.sin(rotX.current);
      const x1 = pos.x*cosY - pos.z*sinY;
      const z1 = pos.x*sinY + pos.z*cosY;
      const y1 = pos.y*cosX - z1*sinX;
      const z2 = pos.y*sinX + z1*cosX;
      if(z2 < 0) continue;
      const px = cx+x1, py = cy-y1;
      if(Math.hypot(mx-px, my-py) < 12) { found = pt; break; }
    }
    hovered.current = found;
    canvas.style.cursor = found ? 'pointer' : 'grab';
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onMouseDown={e=>{isDragging.current=true;velY.current=0;velX.current=0;lastMouse.current={x:e.clientX-canvasRef.current!.getBoundingClientRect().left,y:e.clientY-canvasRef.current!.getBoundingClientRect().top};}}
      onMouseUp={()=>{isDragging.current=false;}}
      onMouseLeave={()=>{isDragging.current=false;hovered.current=null;}}
      onClick={()=>{if(hovered.current&&onCountryClick)onCountryClick(hovered.current);}}
      style={{cursor:'grab', display:'block'}}
    />
  );
}
