'use client'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

const FDI_NODES = [
  { lat:1.35,   lng:103.82, label:'Singapore',    gosa:88.4, tier:'TOP',   fdi:'$91B'  },
  { lat:37.56,  lng:126.97, label:'South Korea',  gosa:84.1, tier:'TOP',   fdi:'$17B'  },
  { lat:35.68,  lng:139.69, label:'Japan',        gosa:81.4, tier:'TOP',   fdi:'$30B'  },
  { lat:3.15,   lng:101.69, label:'Malaysia',     gosa:81.2, tier:'HIGH',  fdi:'$22B'  },
  { lat:13.75,  lng:100.51, label:'Thailand',     gosa:80.7, tier:'HIGH',  fdi:'$14B'  },
  { lat:10.82,  lng:106.63, label:'Vietnam',      gosa:79.4, tier:'HIGH',  fdi:'$24B'  },
  { lat:28.61,  lng:77.21,  label:'India',        gosa:73.2, tier:'HIGH',  fdi:'$71B'  },
  { lat:-6.21,  lng:106.85, label:'Indonesia',    gosa:77.8, tier:'HIGH',  fdi:'$22B'  },
  { lat:24.45,  lng:54.38,  label:'UAE',          gosa:82.1, tier:'TOP',   fdi:'$23B'  },
  { lat:24.68,  lng:46.72,  label:'Saudi Arabia', gosa:79.1, tier:'HIGH',  fdi:'$36B'  },
  { lat:55.67,  lng:12.57,  label:'Denmark',      gosa:85.3, tier:'TOP',   fdi:'$22B'  },
  { lat:51.51,  lng:-0.13,  label:'UK',           gosa:82.5, tier:'TOP',   fdi:'$50B'  },
  { lat:52.37,  lng:4.90,   label:'Netherlands',  gosa:87.4, tier:'TOP',   fdi:'$40B'  },
  { lat:48.86,  lng:2.35,   label:'France',       gosa:81.6, tier:'TOP',   fdi:'$40B'  },
  { lat:40.71,  lng:-74.01, label:'United States',gosa:83.9, tier:'TOP',   fdi:'$349B' },
  { lat:-15.78, lng:-47.93, label:'Brazil',       gosa:71.3, tier:'HIGH',  fdi:'$74B'  },
  { lat:33.99,  lng:-6.85,  label:'Morocco',      gosa:66.8, tier:'HIGH',  fdi:'$4B'   },
  { lat:-36.86, lng:174.76, label:'New Zealand',  gosa:86.7, tier:'TOP',   fdi:'$9B'   },
  { lat:-33.87, lng:151.21, label:'Australia',    gosa:82.8, tier:'TOP',   fdi:'$68B'  },
]

const CORRIDORS = [
  { from:[1.35,103.82],  to:[3.15,101.69],   h:0.32 },
  { from:[3.15,101.69],  to:[13.75,100.51],  h:0.30 },
  { from:[13.75,100.51], to:[10.82,106.63],  h:0.28 },
  { from:[1.35,103.82],  to:[28.61,77.21],   h:0.36 },
  { from:[40.71,-74.01], to:[1.35,103.82],   h:0.48 },
  { from:[51.51,-0.13],  to:[24.45,54.38],   h:0.38 },
  { from:[48.86,2.35],   to:[33.99,-6.85],   h:0.32 },
  { from:[24.45,54.38],  to:[3.15,101.69],   h:0.38 },
  { from:[37.56,126.97], to:[1.35,103.82],   h:0.30 },
  { from:[28.61,77.21],  to:[10.82,106.63],  h:0.28 },
]

function ll2v(lat:number,lng:number,r:number){
  const phi=(90-lat)*Math.PI/180, theta=(lng+180)*Math.PI/180
  return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta))
}

function arc(from:[number,number],to:[number,number],r=1,segs=80,h=0.32){
  const s=ll2v(from[0],from[1],r),e=ll2v(to[0],to[1],r)
  const m=s.clone().add(e).multiplyScalar(0.5).normalize().multiplyScalar(r+h)
  const pts=[]
  for(let i=0;i<=segs;i++){const t=i/segs,t1=1-t;pts.push(new THREE.Vector3().addScaledVector(s,t1*t1).addScaledVector(m,2*t1*t).addScaledVector(e,t*t))}
  return new THREE.BufferGeometry().setFromPoints(pts)
}

export function Globe3D({ onSelect }:{ onSelect?:(l:string)=>void }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string|null>(null)
  const hovRef = useRef<string|null>(null)
  hovRef.current = hovered

  useEffect(() => {
    const el = mountRef.current; if(!el) return
    const W=el.clientWidth, H=el.clientHeight
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.setSize(W,H); renderer.setClearColor(0x080f1c, 1)
    el.appendChild(renderer.domElement)

    const scene=new THREE.Scene()
    const camera=new THREE.PerspectiveCamera(42,W/H,0.1,100)
    camera.position.set(0,0,3.0)

    // Stars
    const sp=new Float32Array(1800*3)
    for(let i=0;i<1800;i++){const r=40+Math.random()*20,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);sp[i*3]=-r*Math.sin(p)*Math.cos(t);sp[i*3+1]=r*Math.cos(p);sp[i*3+2]=r*Math.sin(p)*Math.sin(t)}
    const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.BufferAttribute(sp,3))
    scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:0.055,transparent:true,opacity:0.65})))

    // Earth
    const loader=new THREE.TextureLoader()
    const mat=new THREE.MeshPhongMaterial({color:0x1a3a5c,emissive:0x112233,shininess:10,specular:new THREE.Color(0x334455)})
    const earth=new THREE.Mesh(new THREE.SphereGeometry(1,80,80),mat); scene.add(earth)
    loader.load('https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg',t=>{mat.map=t;mat.color.set(0xffffff);mat.emissive.set(0);mat.needsUpdate=true},undefined,()=>{})

    // Clouds
    const cmat=new THREE.MeshPhongMaterial({transparent:true,opacity:0.16,depthWrite:false,blending:THREE.AdditiveBlending,color:0xffffff})
    loader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png',t=>{cmat.map=t;cmat.needsUpdate=true},undefined,()=>{})
    const clouds=new THREE.Mesh(new THREE.SphereGeometry(1.012,64,64),cmat); scene.add(clouds)

    // Atmosphere
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.17,64,64),new THREE.MeshPhongMaterial({color:new THREE.Color(0.07,0.40,0.95),transparent:true,opacity:0.12,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false})))
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.34,64,64),new THREE.MeshPhongMaterial({color:new THREE.Color(0.02,0.28,0.82),transparent:true,opacity:0.05,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false})))

    // Lights
    const sun=new THREE.DirectionalLight(0xfff5e0,1.35); sun.position.set(4,2,4); scene.add(sun)
    scene.add(new THREE.AmbientLight(0x223355,0.75))

    // Nodes
    const ng=new THREE.Group(); scene.add(ng)
    const tc:Record<string,THREE.Color>={TOP:new THREE.Color(0.17,0.86,0.44),HIGH:new THREE.Color(0.20,0.60,0.86),DEV:new THREE.Color(0.95,0.77,0.06)}
    const markers:{mesh:THREE.Mesh;ring:THREE.Mesh;node:typeof FDI_NODES[0]}[]=[]
    FDI_NODES.forEach(n=>{
      const pos=ll2v(n.lat,n.lng,1.015),col=tc[n.tier]??tc.HIGH
      const dot=new THREE.Mesh(new THREE.SphereGeometry(0.016,12,12),new THREE.MeshBasicMaterial({color:col}))
      dot.position.copy(pos); dot.userData=n; ng.add(dot)
      const ring=new THREE.Mesh(new THREE.RingGeometry(0.022,0.032,24),new THREE.MeshBasicMaterial({color:col,side:THREE.DoubleSide,transparent:true,opacity:0.7,blending:THREE.AdditiveBlending,depthWrite:false}))
      ring.position.copy(pos); ring.lookAt(new THREE.Vector3(0,0,0)); ng.add(ring)
      markers.push({mesh:dot,ring,node:n})
    })

    // Arcs
    const ag=new THREE.Group(); scene.add(ag)
    CORRIDORS.forEach(c=>{
      ag.add(new THREE.Line(arc(c.from as[number,number],c.to as[number,number],1,80,c.h),new THREE.LineBasicMaterial({color:new THREE.Color(0.17,0.86,0.44),transparent:true,opacity:0.28,blending:THREE.AdditiveBlending})))
    })

    // Raycaster
    const ray=new THREE.Raycaster(), mouse=new THREE.Vector2(-9,-9)
    const allDots=markers.map(m=>m.mesh)
    const onMove=(e:MouseEvent|TouchEvent)=>{
      const r=el.getBoundingClientRect()
      let cx:number,cy:number
      if('touches' in e){cx=(e as TouchEvent).touches[0].clientX;cy=(e as TouchEvent).touches[0].clientY}
      else{cx=(e as MouseEvent).clientX;cy=(e as MouseEvent).clientY}
      mouse.x=((cx-r.left)/r.width)*2-1; mouse.y=-((cy-r.top)/r.height)*2+1
    }
    el.addEventListener('mousemove',onMove)
    el.addEventListener('touchmove',onMove,{passive:true})
    el.addEventListener('click',()=>{
      ray.setFromCamera(mouse,camera)
      const h=ray.intersectObjects(allDots)
      if(h.length>0)onSelect?.((h[0].object.userData as typeof FDI_NODES[0]).label)
    })

    // Drag
    let drag=false,lx=0,ly=0,vx=0,vy=0,rx=0,ry=0
    el.addEventListener('mousedown',e=>{drag=true;lx=e.clientX;ly=e.clientY;vx=0;vy=0})
    el.addEventListener('touchstart',e=>{drag=true;lx=e.touches[0].clientX;ly=e.touches[0].clientY},{passive:true})
    window.addEventListener('mouseup',()=>drag=false)
    window.addEventListener('touchend',()=>drag=false)
    window.addEventListener('mousemove',(e:MouseEvent)=>{
      if(!drag)return
      vx=(e.clientX-lx)*0.005; vy=(e.clientY-ly)*0.005
      ry+=vx; rx+=vy; rx=Math.max(-Math.PI/2.5,Math.min(Math.PI/2.5,rx)); lx=e.clientX; ly=e.clientY
    })

    let frame=0, rafId:number
    const animate=()=>{
      rafId=requestAnimationFrame(animate); frame++
      if(!drag){vx*=0.92;vy*=0.92;ry+=vx;ry+=0.0018}
      earth.rotation.y=ry; earth.rotation.x=rx
      clouds.rotation.y=ry+frame*0.00008; clouds.rotation.x=rx
      ng.rotation.y=ry; ng.rotation.x=rx; ag.rotation.y=ry; ag.rotation.x=rx
      markers.forEach(({ring},i)=>{
        const t=(frame*0.03+i*0.7)%(Math.PI*2)
        ring.scale.setScalar(1+0.5*Math.abs(Math.sin(t)));
        (ring.material as THREE.MeshBasicMaterial).opacity=0.8-0.7*Math.abs(Math.sin(t))
      })
      ray.setFromCamera(mouse,camera)
      const h=ray.intersectObjects(allDots)
      const hl=h.length>0?(h[0].object.userData as typeof FDI_NODES[0]).label:null
      if(hl!==hovRef.current)setHovered(hl)
      renderer.render(scene,camera)
    }
    animate()

    const onResize=()=>{const W=el.clientWidth,H=el.clientHeight;renderer.setSize(W,H);camera.aspect=W/H;camera.updateProjectionMatrix()}
    window.addEventListener('resize',onResize)
    return()=>{cancelAnimationFrame(rafId);window.removeEventListener('resize',onResize);el.removeEventListener('mousemove',onMove);renderer.dispose();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement)}
  },[])

  const FLAGS:Record<string,string>={Singapore:'SG','South Korea':'KR',Japan:'JP',Malaysia:'MY',Thailand:'TH',Vietnam:'VN',India:'IN',Indonesia:'ID',UAE:'AE','Saudi Arabia':'SA',Denmark:'DK',UK:'GB',Netherlands:'NL',France:'FR','United States':'US',Brazil:'BR',Morocco:'MA','New Zealand':'NZ',Australia:'AU'}
  const hNode=FDI_NODES.find(n=>n.label===hovered)

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" style={{borderRadius:'inherit',overflow:'hidden'}}/>

      {/* Hover tooltip */}
      {hNode&&(
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none',zIndex:10,padding:'12px 16px',borderRadius:'16px',background:'rgba(255,255,255,0.95)',border:'1px solid #ECF0F1',boxShadow:'0 16px 40px rgba(0,0,0,0.18)',minWidth:'190px',backdropFilter:'blur(10px)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
            <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${FLAGS[hNode.label]??'SG'}.svg`} width="22" height="15" style={{borderRadius:2,boxShadow:'0 1px 4px rgba(0,0,0,0.15)'}} alt=""/>
            <span style={{fontFamily:'Inter,sans-serif',fontSize:14,fontWeight:800,color:'#1A2C3E',flex:1}}>{hNode.label}</span>
            <span style={{fontSize:9,fontWeight:800,padding:'2px 7px',borderRadius:20,background:hNode.tier==='TOP'?'rgba(46,204,113,0.1)':'rgba(52,152,219,0.1)',color:hNode.tier==='TOP'?'#27ae60':'#2980b9'}}>{hNode.tier}</span>
          </div>
          <div style={{display:'flex',gap:14}}>
            <div style={{textAlign:'center'}}><div style={{fontSize:20,fontWeight:900,fontFamily:'JetBrains Mono,monospace',color:hNode.tier==='TOP'?'#2ECC71':'#3498DB'}}>{hNode.gosa}</div><div style={{fontSize:9,color:'#C8D0D6',letterSpacing:'0.08em',textTransform:'uppercase'}}>GOSA</div></div>
            <div style={{textAlign:'center'}}><div style={{fontSize:14,fontWeight:900,fontFamily:'JetBrains Mono,monospace',color:'#1A2C3E'}}>{hNode.fdi}</div><div style={{fontSize:9,color:'#C8D0D6',letterSpacing:'0.08em',textTransform:'uppercase'}}>FDI Inflow</div></div>
          </div>
        </div>
      )}

    </div>
  )
}
