'use client'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

// ─── FDI INVESTMENT NODES ────────────────────────────────────────────────────
const FDI_NODES = [
  // Asia Pacific — GREEN (TOP tier)
  { lat:1.35,   lng:103.82, label:'Singapore',    gosa:88.4, tier:'TOP',   fdi:'$91B',  pulse:true  },
  { lat:37.56,  lng:126.97, label:'South Korea',  gosa:84.1, tier:'TOP',   fdi:'$17B',  pulse:false },
  { lat:35.68,  lng:139.69, label:'Japan',        gosa:81.4, tier:'TOP',   fdi:'$30B',  pulse:false },
  { lat:3.15,   lng:101.69, label:'Malaysia',     gosa:81.2, tier:'HIGH',  fdi:'$22B',  pulse:true  },
  { lat:13.75,  lng:100.51, label:'Thailand',     gosa:80.7, tier:'HIGH',  fdi:'$14B',  pulse:true  },
  { lat:10.82,  lng:106.63, label:'Vietnam',      gosa:79.4, tier:'HIGH',  fdi:'$24B',  pulse:true  },
  { lat:28.61,  lng:77.21,  label:'India',        gosa:73.2, tier:'HIGH',  fdi:'$71B',  pulse:true  },
  { lat:-6.21,  lng:106.85, label:'Indonesia',    gosa:77.8, tier:'HIGH',  fdi:'$22B',  pulse:false },
  // Middle East — TEAL
  { lat:24.45,  lng:54.38,  label:'UAE',          gosa:82.1, tier:'TOP',   fdi:'$23B',  pulse:true  },
  { lat:24.68,  lng:46.72,  label:'Saudi Arabia', gosa:79.1, tier:'HIGH',  fdi:'$36B',  pulse:true  },
  // Europe — BLUE
  { lat:55.67,  lng:12.57,  label:'Denmark',      gosa:85.3, tier:'TOP',   fdi:'$22B',  pulse:false },
  { lat:51.51,  lng:-0.13,  label:'UK',           gosa:82.5, tier:'TOP',   fdi:'$50B',  pulse:false },
  { lat:52.37,  lng:4.90,   label:'Netherlands',  gosa:87.4, tier:'TOP',   fdi:'$40B',  pulse:false },
  { lat:48.86,  lng:2.35,   label:'France',       gosa:81.6, tier:'TOP',   fdi:'$40B',  pulse:false },
  // Americas
  { lat:40.71,  lng:-74.01, label:'United States',gosa:83.9, tier:'TOP',   fdi:'$349B', pulse:true  },
  { lat:-15.78, lng:-47.93, label:'Brazil',       gosa:71.3, tier:'HIGH',  fdi:'$74B',  pulse:false },
  // Africa
  { lat:33.99,  lng:-6.85,  label:'Morocco',      gosa:66.8, tier:'HIGH',  fdi:'$4B',   pulse:true  },
  // Oceania
  { lat:-36.86, lng:174.76, label:'New Zealand',  gosa:86.7, tier:'TOP',   fdi:'$9B',   pulse:false },
  { lat:-33.87, lng:151.21, label:'Australia',    gosa:82.8, tier:'TOP',   fdi:'$68B',  pulse:false },
]

// ─── FDI CORRIDORS (arcs) ───────────────────────────────────────────────────
const CORRIDORS = [
  { from:[1.35,103.82],  to:[3.15,101.69],   strength:3 }, // SG→MY
  { from:[3.15,101.69],  to:[13.75,100.51],  strength:2 }, // MY→TH
  { from:[13.75,100.51], to:[10.82,106.63],  strength:3 }, // TH→VN
  { from:[1.35,103.82],  to:[28.61,77.21],   strength:2 }, // SG→IN
  { from:[40.71,-74.01], to:[1.35,103.82],   strength:3 }, // US→SG
  { from:[51.51,-0.13],  to:[24.45,54.38],   strength:3 }, // UK→UAE
  { from:[48.86,2.35],   to:[33.99,-6.85],   strength:2 }, // FR→MA
  { from:[24.45,54.38],  to:[3.15,101.69],   strength:2 }, // UAE→MY
  { from:[37.56,126.97], to:[1.35,103.82],   strength:2 }, // KR→SG
  { from:[28.61,77.21],  to:[10.82,106.63],  strength:2 }, // IN→VN
]

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  )
}

function buildArc(
  fromLatLng: [number,number],
  toLatLng:   [number,number],
  r = 1.0,
  segments = 80,
  height = 0.35
): THREE.BufferGeometry {
  const start = latLngToVec3(fromLatLng[0], fromLatLng[1], r)
  const end   = latLngToVec3(toLatLng[0],   toLatLng[1],   r)
  const mid   = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(r + height)
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t  = i / segments
    const t1 = 1 - t
    const p  = new THREE.Vector3()
      .addScaledVector(start, t1 * t1)
      .addScaledVector(mid,   2 * t1 * t)
      .addScaledVector(end,   t * t)
    pts.push(p)
  }
  return new THREE.BufferGeometry().setFromPoints(pts)
}

export function Globe3D({ onSelect }: { onSelect?: (code: string) => void }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const hoveredRef = useRef<string | null>(null)
  hoveredRef.current = hovered

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const W = el.clientWidth
    const H = el.clientHeight

    // ── RENDERER ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // ── SCENE / CAMERA ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(0, 0, 3.2)

    // ── STARS ────────────────────────────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry()
    const starCount = 1800
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 40 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      starPos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      starPos[i*3+1] = r * Math.cos(phi)
      starPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta)
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat  = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.7 })
    scene.add(new THREE.Points(starGeo, starMat))

    // ── EARTH SPHERE ─────────────────────────────────────────────────────────
    const loader = new THREE.TextureLoader()
    const earthGeo = new THREE.SphereGeometry(1, 80, 80)

    // Start with a nice-looking procedural sphere while texture loads
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x1a3a5c,
      emissive: 0x112233,
      shininess: 12,
      specular: new THREE.Color(0x334455),
    })
    const earth = new THREE.Mesh(earthGeo, earthMat)
    scene.add(earth)

    // Load texture async — apply when ready (CORS-safe URL)
    loader.load(
      'https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg',
      (tex) => {
        earthMat.map = tex
        earthMat.color.set(0xffffff)
        earthMat.emissive.set(0x000000)
        earthMat.needsUpdate = true
      },
      undefined,
      () => { /* texture failed — keep procedural fallback */ }
    )

    // ── CLOUDS ───────────────────────────────────────────────────────────────
    const cloudMat = new THREE.MeshPhongMaterial({
      transparent: true, opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
    })
    loader.load(
      'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
      (tex) => { cloudMat.map = tex; cloudMat.needsUpdate = true },
      undefined, () => {}
    )
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.012, 64, 64), cloudMat)
    scene.add(clouds)

    // ── ATMOSPHERE GLOW ──────────────────────────────────────────────────────
    const atmMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0.08, 0.42, 0.98),
      transparent: true, opacity: 0.13,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.18, 64, 64), atmMat))

    // Outer glow ring
    const haloMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0.02, 0.3, 0.85),
      transparent: true, opacity: 0.06,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.35, 64, 64), haloMat))

    // ── LIGHTING ─────────────────────────────────────────────────────────────
    const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.4)
    sunLight.position.set(4, 2, 4)
    scene.add(sunLight)
    scene.add(new THREE.AmbientLight(0x223355, 0.8))

    // ── FDI NODE MARKERS ─────────────────────────────────────────────────────
    const nodeGroup = new THREE.Group()
    scene.add(nodeGroup)

    const tierColor: Record<string, THREE.Color> = {
      TOP:  new THREE.Color(0.17, 0.86, 0.44),  // #2ECC71
      HIGH: new THREE.Color(0.20, 0.60, 0.86),  // #3498DB
      DEV:  new THREE.Color(0.95, 0.77, 0.06),  // #F1C40F
    }

    const markerMeshes: { mesh: THREE.Mesh; node: typeof FDI_NODES[0]; ring: THREE.Mesh }[] = []

    FDI_NODES.forEach(node => {
      const pos  = latLngToVec3(node.lat, node.lng, 1.015)
      const col  = tierColor[node.tier] ?? tierColor.HIGH

      // Dot
      const dotGeo = new THREE.SphereGeometry(0.016, 12, 12)
      const dotMat = new THREE.MeshBasicMaterial({ color: col })
      const dot    = new THREE.Mesh(dotGeo, dotMat)
      dot.position.copy(pos)
      dot.userData = node
      nodeGroup.add(dot)

      // Pulse ring
      const ringGeo = new THREE.RingGeometry(0.022, 0.032, 24)
      const ringMat = new THREE.MeshBasicMaterial({
        color: col, side: THREE.DoubleSide,
        transparent: true, opacity: 0.7,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.copy(pos)
      ring.lookAt(new THREE.Vector3(0, 0, 0))
      nodeGroup.add(ring)

      markerMeshes.push({ mesh: dot, node, ring })
    })

    // ── FDI CORRIDORS ────────────────────────────────────────────────────────
    const arcGroup = new THREE.Group()
    scene.add(arcGroup)
    CORRIDORS.forEach(c => {
      const geo = buildArc(
        c.from as [number,number],
        c.to   as [number,number],
        1.0, 80, 0.28 + c.strength * 0.04
      )
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(0.17, 0.86, 0.44),
        transparent: true, opacity: 0.3 + c.strength * 0.05,
        blending: THREE.AdditiveBlending,
        linewidth: 1,
      })
      arcGroup.add(new THREE.Line(geo, mat))
    })

    // ── RAYCASTER (hover) ────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-9, -9)
    const allDots = markerMeshes.map(m => m.mesh)

    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = el.getBoundingClientRect()
      let cx: number, cy: number
      if ('touches' in e) { cx = e.touches[0].clientX; cy = e.touches[0].clientY }
      else                { cx = (e as MouseEvent).clientX; cy = (e as MouseEvent).clientY }
      mouse.x =  ((cx - rect.left)  / rect.width)  * 2 - 1
      mouse.y = -((cy - rect.top)   / rect.height) * 2 + 1
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('touchmove', onMove, { passive: true })

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(allDots)
      if (hits.length > 0) {
        const node = hits[0].object.userData as typeof FDI_NODES[0]
        onSelect?.(node.label)
      }
    }
    el.addEventListener('click', onClick)

    // ── DRAG ROTATION ────────────────────────────────────────────────────────
    let isDragging = false
    let lastX = 0, lastY = 0
    let velX = 0, velY = 0
    let rotX = 0, rotY = 0

    el.addEventListener('mousedown',  e => { isDragging = true; lastX = e.clientX; lastY = e.clientY; velX = 0; velY = 0 })
    el.addEventListener('touchstart', e => { isDragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY }, { passive: true })
    window.addEventListener('mouseup',  () => isDragging = false)
    window.addEventListener('touchend', () => isDragging = false)

    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDragging) return
      velX = (e.clientX - lastX) * 0.005
      velY = (e.clientY - lastY) * 0.005
      rotY += velX; rotX += velY
      rotX = Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, rotX))
      lastX = e.clientX; lastY = e.clientY
    })

    // ── ANIMATION LOOP ───────────────────────────────────────────────────────
    let frame = 0
    let rafId: number

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      frame++

      // Auto-rotate when not dragging
      if (!isDragging) {
        velX *= 0.92
        velY *= 0.92
        rotY += velX
        rotY += 0.0018  // constant auto-spin
      }

      earth.rotation.y  = rotY
      earth.rotation.x  = rotX
      clouds.rotation.y = rotY + frame * 0.00008
      clouds.rotation.x = rotX
      nodeGroup.rotation.y = rotY
      nodeGroup.rotation.x = rotX
      arcGroup.rotation.y  = rotY
      arcGroup.rotation.x  = rotX

      // Pulse rings
      markerMeshes.forEach(({ node, ring, mesh }, i) => {
        const t  = (frame * 0.03 + i * 0.7) % (Math.PI * 2)
        const sc = 1 + 0.5 * Math.abs(Math.sin(t))
        ring.scale.setScalar(sc)
        ;(ring.material as THREE.MeshBasicMaterial).opacity = 0.8 - 0.7 * Math.abs(Math.sin(t))
      })

      // Arc opacity shimmer
      arcGroup.children.forEach((child, i) => {
        const t = (frame * 0.015 + i * 0.9) % (Math.PI * 2)
        ;(child as THREE.Line).material instanceof THREE.LineBasicMaterial &&
          ((child as THREE.Line).material as THREE.LineBasicMaterial).color.setHSL(
            0.38,  // green hue
            0.85,
            0.45 + 0.12 * Math.sin(t)
          )
      })

      // Hover detect
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(allDots)
      const hLabel = hits.length > 0 ? (hits[0].object.userData as typeof FDI_NODES[0]).label : null
      if (hLabel !== hoveredRef.current) setHovered(hLabel)

      renderer.render(scene, camera)
    }
    animate()

    // ── RESIZE ───────────────────────────────────────────────────────────────
    const onResize = () => {
      const W = el.clientWidth, H = el.clientHeight
      renderer.setSize(W, H)
      camera.aspect = W / H
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('click', onClick)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  // Tooltip node
  const hovNode = FDI_NODES.find(n => n.label === hovered)

  return (
    <div className="relative w-full" style={{ aspectRatio: '16/9', maxHeight: '520px', background: 'transparent' }}>
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" style={{borderRadius:'20px',overflow:'hidden'}}/>

      {/* Tooltip */}
      {hovNode && (
        <div
          className="absolute pointer-events-none z-10 px-4 py-3 rounded-2xl border shadow-xl"
          style={{
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            background: 'rgba(255,255,255,0.96)',
            border: '1px solid #ECF0F1',
            backdropFilter: 'blur(10px)',
            minWidth: '200px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
          }}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
            <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${
              FDI_NODES.find(n=>n.label===hovNode.label) ? 
              (['Singapore','SG'],['Malaysia','MY'],['Thailand','TH'],['Vietnam','VN'],
               ['UAE','AE'],['Saudi Arabia','SA'],['India','IN'],['Indonesia','ID'],
               ['South Korea','KR'],['Japan','JP'],['Denmark','DK'],['UK','GB'],
               ['France','FR'],['Netherlands','NL'],['United States','US'],
               ['Brazil','BR'],['Morocco','MA'],['New Zealand','NZ'],['Australia','AU'])
              .find(([l])=>l===hovNode.label)?.[1] ?? 'SG' : 'SG'
            }.svg`}
            width="22" height="15" style={{borderRadius:'2px',boxShadow:'0 1px 3px rgba(0,0,0,0.15)'}}
            onError={e=>{(e.target as any).style.display='none'}} alt=""/>
            <span style={{fontFamily:'Inter,sans-serif',fontSize:'14px',fontWeight:800,color:'#1A2C3E'}}>{hovNode.label}</span>
            <span style={{marginLeft:'auto',fontSize:'9px',fontWeight:800,padding:'2px 8px',borderRadius:'20px',
              background:hovNode.tier==='TOP'?'rgba(46,204,113,0.1)':'rgba(52,152,219,0.1)',
              color:hovNode.tier==='TOP'?'#27ae60':'#2980b9'}}>
              {hovNode.tier}
            </span>
          </div>
          <div style={{display:'flex',gap:'12px'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'20px',fontWeight:900,fontFamily:'JetBrains Mono,monospace',color:hovNode.tier==='TOP'?'#2ECC71':'#3498DB'}}>{hovNode.gosa}</div>
              <div style={{fontSize:'9px',color:'#C8D0D6',textTransform:'uppercase',letterSpacing:'0.08em'}}>GOSA</div>
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'14px',fontWeight:900,fontFamily:'JetBrains Mono,monospace',color:'#1A2C3E'}}>{hovNode.fdi}</div>
              <div style={{fontSize:'9px',color:'#C8D0D6',textTransform:'uppercase',letterSpacing:'0.08em'}}>FDI Inflow</div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        position:'absolute', bottom:'14px', left:'50%', transform:'translateX(-50%)',
        display:'flex', gap:'14px', background:'rgba(0,0,0,0.55)',
        backdropFilter:'blur(8px)', padding:'6px 16px',
        borderRadius:'20px', border:'1px solid rgba(255,255,255,0.1)',
        pointerEvents:'none',
      }}>
        {[['#2ECC71','TOP (≥80)'],['#3498DB','HIGH (60-79)'],['#F1C40F','DEV (<60)']].map(([c,l])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:'5px'}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:c,boxShadow:`0 0 6px ${c}`}}/>
            <span style={{fontSize:'10px',color:'rgba(255,255,255,0.7)',fontFamily:'Inter,sans-serif',fontWeight:600}}>{l}</span>
          </div>
        ))}
        <div style={{borderLeft:'1px solid rgba(255,255,255,0.15)',paddingLeft:'14px',fontSize:'10px',color:'rgba(255,255,255,0.4)',fontFamily:'Inter,sans-serif',display:'flex',alignItems:'center',gap:'5px'}}>
          <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#2ECC71',boxShadow:'0 0 8px #2ECC71'}}/>
          Drag to rotate
        </div>
      </div>

      {/* Live badge */}
      <div style={{
        position:'absolute', top:'14px', right:'14px',
        display:'flex', alignItems:'center', gap:'5px',
        background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)',
        padding:'5px 12px', borderRadius:'20px',
        border:'1px solid rgba(255,255,255,0.1)',
        pointerEvents:'none',
      }}>
        <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#2ECC71',animation:'pulseGreen 1.5s infinite'}}/>
        <span style={{fontSize:'10px',fontWeight:700,color:'#2ECC71',fontFamily:'Inter,sans-serif'}}>LIVE</span>
        <span style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',fontFamily:'Inter,sans-serif'}}>{FDI_NODES.length} economies</span>
      </div>

      {/* FDI Corridors label */}
      <div style={{
        position:'absolute', top:'14px', left:'14px',
        display:'flex', alignItems:'center', gap:'5px',
        background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)',
        padding:'5px 12px', borderRadius:'20px',
        border:'1px solid rgba(255,255,255,0.1)',
        pointerEvents:'none',
      }}>
        <span style={{fontSize:'10px',fontWeight:700,color:'rgba(255,255,255,0.6)',fontFamily:'Inter,sans-serif'}}>
          {CORRIDORS.length} FDI Corridors
        </span>
      </div>
    </div>
  )
}
