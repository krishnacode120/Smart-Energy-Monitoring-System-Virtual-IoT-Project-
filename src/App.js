
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Color palette & design tokens ────────────────────────────────────────────
const C = {
  bg:       "#080B12",
  surface:  "#0C1020",
  glass:    "rgba(255,255,255,0.04)",
  glass2:   "rgba(255,255,255,0.07)",
  border:   "rgba(255,255,255,0.07)",
  border2:  "rgba(255,255,255,0.13)",
  cyan:     "#00F2FF",
  cyanDim:  "rgba(0,242,255,0.15)",
  cyanGlow: "rgba(0,242,255,0.4)",
  amber:    "#FFB800",
  amberDim: "rgba(255,184,0,0.13)",
  red:      "#FF2D55",
  redDim:   "rgba(255,45,85,0.13)",
  green:    "#00FF88",
  greenDim: "rgba(0,255,136,0.13)",
  text:     "#DDE2F0",
  text2:    "#6B7490",
  text3:    "#3A3F58",
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("es-styles")) return;
  const s = document.createElement("style");
  s.id = "es-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .es-root {
      background: ${C.bg};
      color: ${C.text};
      font-family: 'Syne', sans-serif;
      min-height: 100vh;
      position: relative;
    }
    .es-root::before {
      content: '';
      position: fixed; inset: 0;
      background-image:
        linear-gradient(rgba(0,242,255,0.025) 1px,transparent 1px),
        linear-gradient(90deg,rgba(0,242,255,0.025) 1px,transparent 1px);
      background-size: 48px 48px;
      pointer-events: none; z-index: 0;
    }
    .mono { font-family: 'JetBrains Mono', monospace; }
    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(0,242,255,0.2); border-radius: 2px; }
    /* Animations */
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes glow-pulse {
      0%,100% { box-shadow: 0 0 20px rgba(0,242,255,0.1); }
      50%      { box-shadow: 0 0 40px rgba(0,242,255,0.25); }
    }
    @keyframes fadeSlide {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes countUp {
      from { opacity:0; transform:translateY(12px) scale(.95); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    .fade-in { animation: fadeSlide .35s ease forwards; }
    .count-anim { animation: countUp .4s cubic-bezier(.16,1,.3,1) forwards; }
    /* Toggle */
    .toggle-track {
      width: 42px; height: 24px;
      border-radius: 12px;
      background: rgba(255,255,255,.1);
      border: 1px solid rgba(255,255,255,.1);
      position: relative; cursor: pointer;
      transition: background .3s, border-color .3s, box-shadow .3s;
      flex-shrink: 0;
    }
    .toggle-track.on {
      background: rgba(0,242,255,.25);
      border-color: rgba(0,242,255,.5);
      box-shadow: 0 0 12px rgba(0,242,255,.3);
    }
    .toggle-thumb {
      position: absolute; top: 3px; left: 3px;
      width: 16px; height: 16px; border-radius: 50%;
      background: rgba(255,255,255,.4);
      transition: transform .3s, background .3s;
    }
    .toggle-track.on .toggle-thumb {
      transform: translateX(18px);
      background: ${C.cyan};
      box-shadow: 0 0 8px ${C.cyan};
    }
    /* Slider */
    .es-slider {
      -webkit-appearance: none; appearance: none;
      width: 100%; height: 4px;
      border-radius: 2px; outline: none; cursor: pointer;
      background: rgba(255,255,255,.08);
    }
    .es-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px; height: 18px; border-radius: 50%;
      background: ${C.cyan};
      box-shadow: 0 0 10px ${C.cyanGlow};
      cursor: pointer; transition: transform .15s;
    }
    .es-slider::-webkit-slider-thumb:hover { transform: scale(1.25); }
    /* Nav */
    .nav-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all .2s;
      color: ${C.text3}; font-size: 18px;
      border: 1px solid transparent;
    }
    .nav-icon:hover, .nav-icon.active {
      background: ${C.glass2};
      border-color: ${C.border2};
      color: ${C.cyan};
    }
    .nav-icon.active { position: relative; }
    .nav-icon.active::before {
      content: '';
      position: absolute; left: -1px; top: 50%;
      transform: translateY(-50%);
      width: 2px; height: 20px;
      background: ${C.cyan};
      border-radius: 2px;
      box-shadow: 0 0 8px ${C.cyan};
    }
    /* Glass card */
    .glass-card {
      background: ${C.glass};
      border: 1px solid ${C.border};
      border-radius: 20px;
      backdrop-filter: blur(20px);
      position: relative; overflow: hidden;
    }
    .glass-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);
    }
    /* Device card ON glow */
    .device-on {
      border-color: rgba(0,242,255,.2) !important;
      animation: glow-pulse 3s ease-in-out infinite;
    }
    .device-off { opacity: .42; filter: grayscale(.7); }
    /* Table rows */
    .trow { border-bottom: 1px solid ${C.border}; transition: background .2s; }
    .trow:hover { background: rgba(255,255,255,.02); }
    /* Alert items */
    .alert-warn { background: ${C.amberDim}; border: 1px solid rgba(255,184,0,.18); }
    .alert-crit { background: ${C.redDim};   border: 1px solid rgba(255,45,85,.18); }
    .alert-info { background: ${C.cyanDim};  border: 1px solid rgba(0,242,255,.15); }
    .alert-ok   { background: ${C.greenDim}; border: 1px solid rgba(0,255,136,.18); }
    /* Chart container */
    .chart-wrap { position: relative; width: 100%; }
    /* Tooltip */
    .es-tooltip {
      position: absolute;
      background: rgba(8,11,18,.96);
      border: 1px solid rgba(0,242,255,.25);
      border-radius: 10px; padding: 10px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; color: ${C.cyan};
      pointer-events: none; z-index: 100;
      white-space: nowrap;
      box-shadow: 0 8px 32px rgba(0,0,0,.6);
    }
    /* Tab */
    .es-tab {
      font-size: 11px; padding: 5px 13px; border-radius: 8px;
      cursor: pointer; border: 1px solid transparent;
      color: ${C.text2}; transition: all .2s;
      font-family: 'JetBrains Mono', monospace;
    }
    .es-tab.active {
      background: rgba(0,242,255,.1);
      border-color: rgba(0,242,255,.3);
      color: ${C.cyan};
    }
    /* Badge */
    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; padding: 3px 8px; border-radius: 6px; font-weight: 700;
    }
    .badge-on  { background: rgba(0,242,255,.15); color: ${C.cyan}; }
    .badge-off { background: rgba(255,255,255,.06); color: ${C.text2}; }
    /* Efficiency ring */
    @keyframes ringFill {
      from { stroke-dashoffset: 283; }
    }
    .eff-ring { animation: ringFill .8s ease forwards; }
    /* Scanline overlay */
    .scanline {
      position: fixed; top: 0; left: 0; right: 0;
      height: 120px;
      background: linear-gradient(transparent, rgba(0,242,255,.015), transparent);
      animation: scanline 8s linear infinite;
      pointer-events: none; z-index: 1; opacity: .6;
    }
    /* Page fade */
    @keyframes pageFade { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
    .page-enter { animation: pageFade .3s ease forwards; }
    /* Marquee */
    @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    .marquee-track { animation: marquee 24s linear infinite; display:flex; gap:32px; }
    .marquee-track:hover { animation-play-state: paused; }
    /* Number counter */
    .big-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: clamp(26px,4vw,38px);
      font-weight: 700; line-height: 1;
      letter-spacing: -1px;
    }
    /* Sparkline */
    .sparkline { overflow: visible; }
    /* Responsive */
    @media (max-width: 768px) {
      .sidebar-hide { display: none !important; }
      .grid-1-mobile { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(s);
};

// ─── Device definitions ────────────────────────────────────────────────────────
const DEVICE_DEFS = [
  { id:"ac",      name:"Air Conditioner", icon:"❄️",  watt:1500, category:"cooling",  health:88 },
  { id:"fridge",  name:"Refrigerator",    icon:"🧊",  watt:300,  category:"cooling",  health:96 },
  { id:"tv",      name:"Television",      icon:"📺",  watt:120,  category:"entertainment", health:100 },
  { id:"fan",     name:"Ceiling Fan",     icon:"🌀",  watt:70,   category:"cooling",  health:100 },
  { id:"lights",  name:"Smart Lights",    icon:"💡",  watt:20,   category:"lighting", health:100 },
  { id:"washer",  name:"Washing Machine", icon:"🫧",  watt:500,  category:"cleaning", health:72 },
  { id:"router",  name:"Wi-Fi Router",    icon:"📡",  watt:15,   category:"networking",health:100 },
  { id:"oven",    name:"Microwave Oven",  icon:"📦",  watt:900,  category:"cooking",  health:91 },
];

const MAX_WATT = DEVICE_DEFS.reduce((s,d)=>s+d.watt,0);

const TIPS = [
  "Set AC to 24°C — saves ~6% per degree",
  "Unplug idle devices to eliminate phantom load",
  "Run washer at night during off-peak hours",
  "Switch to LED lighting — 75% less energy",
  "Keep fridge away from heat sources",
  "Use a smart power strip to cut standby power",
  "Clean AC filters monthly for peak efficiency",
  "Enable eco mode on your washing machine",
];

// ─── Utility helpers ───────────────────────────────────────────────────────────
const fmtKwh  = v => v.toFixed(v<10?3:2);
const fmtRs   = v => "₹"+(v<1000?v.toFixed(2):(v/1000).toFixed(2)+"k");
const fmtW    = v => v>=1000?(v/1000).toFixed(2)+"kW":v+"W";
const clamp   = (v,a,b) => Math.min(b,Math.max(a,v));
const randBetween = (a,b) => a+Math.random()*(b-a);

function generateHistory(hours=24, baseKwh=8){
  return Array.from({length:hours},(_,i)=>{
    const h = (new Date().getHours()-hours+1+i+24)%24;
    const morning = h>=7&&h<=9;
    const evening = h>=18&&h<=22;
    const peak = morning||evening;
    return {
      hour:h,
      label:h.toString().padStart(2,"0")+":00",
      kwh: +(baseKwh*(peak?1.8:randBetween(0.3,0.9))).toFixed(2),
    };
  });
}

// ─── Tiny Chart component (custom Canvas) ─────────────────────────────────────
function AreaChart({ data, color="#00F2FF", height=180, labels, unit="kWh" }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas||!data.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.offsetWidth, H = height;
    canvas.width = W*window.devicePixelRatio;
    canvas.height = H*window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio,window.devicePixelRatio);

    const pad = {t:20,r:20,b:36,l:44};
    const cw = W-pad.l-pad.r, ch = H-pad.t-pad.b;
    const maxV = Math.max(...data)*1.15||1;
    const step = cw/(data.length-1||1);

    ctx.clearRect(0,0,W,H);

    // Grid lines
    for(let i=0;i<=4;i++){
      const y = pad.t+ch-(ch/4)*i;
      ctx.beginPath();
      ctx.moveTo(pad.l,y); ctx.lineTo(W-pad.r,y);
      ctx.strokeStyle="rgba(255,255,255,0.04)"; ctx.lineWidth=1; ctx.stroke();
      ctx.fillStyle="rgba(107,116,144,0.7)";
      ctx.font="10px 'JetBrains Mono',monospace";
      ctx.textAlign="right";
      ctx.fillText(((maxV/4)*i).toFixed(1),pad.l-6,y+4);
    }

    // Gradient fill
     const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
     grad.addColorStop(0, "rgba(0,242,255,0.28)");
     grad.addColorStop(1, "rgba(0,242,255,0.02)");
    

    const pts = data.map((v,i)=>({ x:pad.l+i*step, y:pad.t+ch-ch*(v/maxV) }));

    // Fill
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pad.t+ch);
    pts.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.lineTo(pts[pts.length-1].x, pad.t+ch);
    ctx.closePath();
    ctx.fillStyle=grad; ctx.fill();

    // Line
    ctx.beginPath();
    pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
    ctx.strokeStyle=color; ctx.lineWidth=2.5;
    ctx.shadowColor=color; ctx.shadowBlur=12;
    ctx.stroke(); ctx.shadowBlur=0;

    // Dots
    pts.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,3,0,Math.PI*2);
      ctx.fillStyle=color; ctx.fill();
    });

    // X labels
    const skip = Math.ceil(data.length/8);
    if(labels) labels.forEach((l,i)=>{
      if(i%skip!==0&&i!==data.length-1) return;
      ctx.fillStyle="rgba(107,116,144,0.8)";
      ctx.font="9px 'JetBrains Mono',monospace";
      ctx.textAlign="center";
      ctx.fillText(l,pad.l+i*step,H-8);
    });
  },[data,color,height,labels]);

  const handleMove = useCallback((e)=>{
    const canvas = canvasRef.current;
    if(!canvas||!data.length) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX-rect.left;
    const pad={l:44,r:20};
    const cw = rect.width-pad.l-pad.r;
    const step = cw/(data.length-1||1);
    const idx = clamp(Math.round((x-pad.l)/step),0,data.length-1);
    setTooltip({ x:e.clientX-rect.left, y:10, idx, val:data[idx], label:labels?.[idx]||idx });
  },[data,labels]);

  return (
    <div style={{position:"relative"}} onMouseMove={handleMove} onMouseLeave={()=>setTooltip(null)}>
      <canvas ref={canvasRef} style={{width:"100%",height,display:"block"}} />
      {tooltip&&(
        <div className="es-tooltip" style={{left:tooltip.x+10,top:tooltip.y}}>
          {tooltip.label}<br/>
          <span style={{color:"#fff",fontWeight:700}}>{tooltip.val} {unit}</span>
        </div>
      )}
    </div>
  );
}

// ─── Mini Sparkline ────────────────────────────────────────────────────────────
function Sparkline({ data, color, w=80, h=32 }){
  if(!data||data.length<2) return null;
  const max = Math.max(...data)||1;
  const min = Math.min(...data);
  const pts = data.map((v,i)=>{
    const x = (i/(data.length-1))*w;
    const y = h-(v-min)/(max-min||1)*h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="sparkline">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
    </svg>
  );
}

// ─── Gauge ring ───────────────────────────────────────────────────────────────
function GaugeRing({ pct, color, size=80, label }){
  const r=32, circ=2*Math.PI*r;
  const offset = circ-(pct/100)*circ;
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{transition:"stroke-dashoffset .8s ease",filter:`drop-shadow(0 0 6px ${color})`}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace"}}>
        <span style={{fontSize:13,fontWeight:700,color,lineHeight:1}}>{Math.round(pct)}%</span>
        {label&&<span style={{fontSize:9,color:C.text2,marginTop:2}}>{label}</span>}
      </div>
    </div>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────────
function BarChart({ data, labels, colors, height=140, unit="W" }){
  const max = Math.max(...data)||1;
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:4,height,paddingTop:8}}>
      {data.map((v,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%",justifyContent:"flex-end"}}>
          <div style={{
            width:"100%",
            height:`${(v/max)*100}%`,
            background:colors?.[i]||C.cyan,
            borderRadius:"4px 4px 0 0",
            boxShadow:`0 0 8px ${colors?.[i]||C.cyan}44`,
            transition:"height .6s ease",
            minHeight:2,
            position:"relative",
          }}>
            <div style={{position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",
              fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:C.text2,whiteSpace:"nowrap"}}>
              {v>=1000?(v/1000).toFixed(1)+"k":v}
            </div>
          </div>
          {labels&&<div style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:C.text2,textAlign:"center"}}>{labels[i]}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── HeatMap ─────────────────────────────────────────────────────────────────
function HeatMap({ devices }){
  const total = devices.filter(d=>d.on).reduce((s,d)=>s+d.watt,0)||1;
  const on = [...devices].filter(d=>d.on).sort((a,b)=>b.watt-a.watt);
  const colors = ["#FF2D55","#FFB800","#FF8C00","#FFD700","#00F2FF","#00FF88","#7B61FF","#A78BFA"];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
      {on.slice(0,6).map((d,i)=>{
        const pct = (d.watt/total)*100;
        return (
          <div key={d.id} style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:14,flexShrink:0}}>{d.icon}</div>
            <div style={{fontSize:11,color:C.text2,fontFamily:"'JetBrains Mono',monospace",width:90,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div>
            <div style={{flex:1,height:8,background:"rgba(255,255,255,0.05)",borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:colors[i],borderRadius:4,
                boxShadow:`0 0 6px ${colors[i]}88`,transition:"width .6s ease"}}/>
            </div>
            <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:colors[i],width:36,textAlign:"right",flexShrink:0}}>{Math.round(pct)}%</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Efficiency Score ─────────────────────────────────────────────────────────
function EffScore({ devices }){
  const on = devices.filter(d=>d.on);
  if(!on.length) return <div style={{color:C.text2,fontSize:12}}>No active devices</div>;
  const score = Math.round(on.reduce((s,d)=>s+d.health,0)/on.length);
  const color = score>80?C.green:score>60?C.amber:C.red;
  const label = score>80?"Excellent":score>60?"Good":"Needs Attention";
  return (
    <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
      <GaugeRing pct={score} color={color} size={88} label={label}/>
      <div style={{flex:1,minWidth:100}}>
        <div style={{fontSize:11,color:C.text2,marginBottom:4}}>Efficiency Score</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:30,fontWeight:700,color,lineHeight:1}}>{score}</div>
        <div style={{fontSize:11,color:C.text2,marginTop:6}}>/100 pts</div>
        <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:4}}>
          {on.slice(0,3).map(d=>(
            <div key={d.id} style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:10}}>{d.icon}</span>
              <div style={{flex:1,height:4,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${d.health}%`,background:d.health>80?C.green:d.health>60?C.amber:C.red,transition:"width .6s"}}/>
              </div>
              <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:C.text2}}>{d.health}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Alert system ─────────────────────────────────────────────────────────────
function buildAlerts(devices, totalKwh, rate){
  const aw = devices.filter(d=>d.on).reduce((s,d)=>s+d.watt,0);
  const alerts = [];
  const time = new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
  if(aw>2000) alerts.push({type:"crit",text:`Critical overload: ${fmtW(aw)} active`,time,icon:"🔴"});
  else if(aw>1500) alerts.push({type:"warn",text:`High load detected: ${fmtW(aw)}`,time,icon:"🟡"});
  const ac = devices.find(d=>d.id==="ac"&&d.on);
  if(ac) alerts.push({type:"warn",text:"AC is running — highest single consumer",time,icon:"❄️"});
  if(totalKwh>5) alerts.push({type:"warn",text:`${fmtKwh(totalKwh)} kWh consumed today`,time,icon:"⚡"});
  if(aw===0) alerts.push({type:"ok",text:"All devices off — zero consumption",time,icon:"✅"});
  else if(aw<200) alerts.push({type:"info",text:"Low power mode — great efficiency!",time,icon:"💚"});
  const washer = devices.find(d=>d.id==="washer"&&d.on);
  if(washer) alerts.push({type:"info",text:"Washer active — consider off-peak hours",time,icon:"🫧"});
  return alerts.slice(0,5);
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function DashboardPage({ devices, totalKwh, rate, history24h, setRate, toggleDevice }){
  const aw = devices.filter(d=>d.on).reduce((s,d)=>s+d.watt,0);
  const on = devices.filter(d=>d.on).length;
  const loadPct = (aw/MAX_WATT)*100;
  const alerts = buildAlerts(devices, totalKwh, rate);

  return (
    <div className="page-enter" style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* Hero row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {[
          { label:"Total Energy Today", value:fmtKwh(totalKwh)+" kWh", sub:"Accumulated", color:C.cyan, spark:history24h.map(h=>h.kwh) },
          { label:"Live Cost (₹)", value:fmtRs(totalKwh*rate), sub:`₹${rate}/kWh rate`, color:C.amber, spark:history24h.map(h=>+(h.kwh*rate).toFixed(2)) },
          { label:"Active Load", value:fmtW(aw), sub:`${on}/${devices.length} devices on`, color:C.red, spark:null, gauge:true, pct:loadPct },
        ].map((m,i)=>(
          <div key={i} className="glass-card" style={{padding:"20px",borderColor:m.color+"33",boxShadow:`0 0 30px ${m.color}0D`}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1.5px",color:C.text2,marginBottom:10,fontWeight:600}}>{m.label}</div>
            {m.gauge?(
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <GaugeRing pct={m.pct} color={m.color} size={72}/>
                <div>
                  <div className="big-num" style={{color:m.color,textShadow:`0 0 20px ${m.color}66`,fontSize:22}}>{m.value}</div>
                  <div style={{fontSize:11,color:C.text2,marginTop:4}}>{m.sub}</div>
                </div>
              </div>
            ):(
              <>
                <div className="big-num" style={{color:m.color,textShadow:`0 0 20px ${m.color}66`}}>{m.value}</div>
                <div style={{fontSize:11,color:C.text2,marginTop:6,marginBottom:12}}>{m.sub}</div>
                {m.spark&&<Sparkline data={m.spark} color={m.color} w={120} h={28}/>}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="glass-card" style={{padding:"20px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:600}}>24-Hour Energy Profile</div>
          <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:C.text2}}>
            Peak: {Math.max(...history24h.map(h=>h.kwh)).toFixed(2)} kWh
          </div>
        </div>
        <AreaChart data={history24h.map(h=>h.kwh)} labels={history24h.map(h=>h.label)} height={180} color={C.cyan} unit="kWh"/>
      </div>

      {/* Bottom 3 col */}
      <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:16}}>
        {/* Quick device grid */}
        <div className="glass-card" style={{padding:"20px"}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>Quick Controls</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {devices.map(d=>(
              <div key={d.id} className={`glass-card ${d.on?"device-on":"device-off"}`}
                style={{padding:"12px 8px",textAlign:"center",cursor:"pointer",borderRadius:14,transition:"all .3s"}}
                onClick={()=>toggleDevice(d.id)}>
                <div style={{fontSize:22,marginBottom:6}}>{d.icon}</div>
                <div style={{fontSize:10,fontWeight:600,color:d.on?C.text:C.text2,marginBottom:6}}>{d.name.split(" ")[0]}</div>
                <div className={`badge ${d.on?"badge-on":"badge-off"}`}>{d.on?"ON":"OFF"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts + tips */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="glass-card" style={{padding:"16px",flex:1}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>⚡ Live Alerts</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {alerts.map((a,i)=>(
                <div key={i} className={`alert-${a.type}`} style={{padding:"8px 12px",borderRadius:10,display:"flex",alignItems:"center",gap:8,animation:"fadeSlide .3s ease"}}>
                  <span style={{fontSize:12}}>{a.icon}</span>
                  <div>
                    <div style={{fontSize:11,color:C.text,lineHeight:1.3}}>{a.text}</div>
                    <div style={{fontSize:10,color:C.text3,fontFamily:"'JetBrains Mono',monospace",marginTop:1}}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card" style={{padding:"16px"}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>💡 Energy Tip</div>
            <div style={{fontSize:12,color:C.text2,lineHeight:1.6}}>{TIPS[Math.floor(Date.now()/15000)%TIPS.length]}</div>
          </div>
        </div>
      </div>

      {/* Cost calculator */}
      <div className="glass-card" style={{padding:"20px"}}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>⚡ Electricity Rate Calculator</div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <span style={{fontSize:12,color:C.text2,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>₹/kWh</span>
          <input type="range" className="es-slider" min="1" max="20" value={rate} step="1" onChange={e=>setRate(+e.target.value)}/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:C.amber,minWidth:40}}>₹{rate}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {[
            { label:"Hourly",   val: fmtRs((aw/1000)*rate),          color:C.cyan },
            { label:"Daily",    val: fmtRs(totalKwh*rate),            color:C.amber },
            { label:"Monthly",  val: fmtRs(totalKwh*rate*30),         color:C.red },
            { label:"Yearly",   val: fmtRs(totalKwh*rate*365),        color:"#7B61FF" },
          ].map((c,i)=>(
            <div key={i} style={{background:C.surface,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:10,color:C.text2,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>{c.label}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:c.color}}>{c.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DevicesPage({ devices, toggleDevice }){
  const sorted = [...devices].sort((a,b)=>b.watt-a.watt);
  return (
    <div className="page-enter">
      <div style={{fontSize:16,fontWeight:700,marginBottom:20}}>Device Management</div>
      <div className="glass-card" style={{padding:0,overflow:"hidden"}}>
        {/* Table header */}
        <div style={{display:"grid",gridTemplateColumns:"2fr 80px 100px 110px 90px 80px",gap:0,
          padding:"12px 20px",borderBottom:`1px solid ${C.border}`,
          fontSize:10,textTransform:"uppercase",letterSpacing:"1.5px",color:C.text3,fontWeight:600}}>
          <div>Device</div><div>Status</div><div>Power</div><div>Energy Used</div><div>Health</div><div>Control</div>
        </div>
        {sorted.map((d,i)=>{
          const color = d.watt>800?C.red:d.watt>200?C.amber:C.cyan;
          return (
            <div key={d.id} className="trow" style={{display:"grid",gridTemplateColumns:"2fr 80px 100px 110px 90px 80px",
              gap:0,padding:"14px 20px",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:22}}>{d.icon}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{d.name}</div>
                  <div style={{fontSize:10,color:C.text2,fontFamily:"'JetBrains Mono',monospace",textTransform:"capitalize"}}>{d.category}</div>
                </div>
              </div>
              <div><span className={`badge ${d.on?"badge-on":"badge-off"}`}>{d.on?"ON":"OFF"}</span></div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:600,color:d.on?color:C.text3}}>{d.watt}W</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:d.on?color:C.text3}}>{fmtKwh(d.kwh)} kWh</div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{flex:1,height:4,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${d.health}%`,background:d.health>80?C.green:d.health>60?C.amber:C.red,transition:"width .6s"}}/>
                </div>
                <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:C.text2,minWidth:28}}>{d.health}%</span>
              </div>
              <div>
                <div className={`toggle-track ${d.on?"on":""}`} onClick={()=>toggleDevice(d.id)}>
                  <div className="toggle-thumb"/>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:16}}>
        <div className="glass-card" style={{padding:18}}>
          <div style={{fontSize:11,color:C.text2,marginBottom:12}}>Load Distribution</div>
          <HeatMap devices={devices}/>
        </div>
        <div className="glass-card" style={{padding:18}}>
          <div style={{fontSize:11,color:C.text2,marginBottom:12}}>Device Wattage</div>
          <BarChart
            data={sorted.map(d=>d.on?d.watt:0)}
            labels={sorted.map(d=>d.name.split(" ")[0])}
            colors={sorted.map(d=>d.watt>800?C.red:d.watt>200?C.amber:C.cyan)}
            height={120}/>
        </div>
        <div className="glass-card" style={{padding:18}}>
          <div style={{fontSize:11,color:C.text2,marginBottom:12}}>Efficiency Report</div>
          <EffScore devices={devices}/>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage({ history24h, history7d, history30d, devices }){
  const [tab, setTab] = useState("24h");
  const chartData = tab==="24h"?history24h:tab==="7d"?history7d:history30d;
  const peakIdx = chartData.reduce((pi,h,i,arr)=>h.kwh>arr[pi].kwh?i:pi,0);

  return (
    <div className="page-enter">
      <div style={{fontSize:16,fontWeight:700,marginBottom:20}}>Analytics & Trends</div>

      <div className="glass-card" style={{padding:"20px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <div style={{fontSize:14,fontWeight:600}}>Consumption Trend</div>
          <div style={{display:"flex",gap:6}}>
            {["24h","7d","30d"].map(t=>(
              <div key={t} className={`es-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{t}</div>
            ))}
          </div>
        </div>
        <AreaChart data={chartData.map(h=>h.kwh)} labels={chartData.map(h=>h.label)} height={200} color={C.cyan} unit="kWh"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:16}}>
          {[
            { label:"Total", val:fmtKwh(chartData.reduce((s,h)=>s+h.kwh,0))+" kWh", color:C.cyan },
            { label:"Peak",  val:fmtKwh(Math.max(...chartData.map(h=>h.kwh)))+" kWh", color:C.red },
            { label:"Avg",   val:fmtKwh(chartData.reduce((s,h)=>s+h.kwh,0)/chartData.length)+" kWh", color:C.amber },
            { label:"Peak Time", val:chartData[peakIdx]?.label||"—", color:"#7B61FF" },
          ].map((s,i)=>(
            <div key={i} style={{background:C.surface,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:10,color:C.text2,textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>{s.label}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:700,color:s.color}}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="glass-card" style={{padding:"20px"}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Cost Trend</div>
          <AreaChart data={chartData.map(h=>+(h.kwh*8).toFixed(2))} labels={chartData.map(h=>h.label)} height={150} color={C.amber} unit="₹"/>
        </div>
        <div className="glass-card" style={{padding:"20px"}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Device Energy Share</div>
          <HeatMap devices={devices}/>
        </div>
      </div>

      {/* Weekly bar */}
      <div className="glass-card" style={{padding:"20px",marginTop:16}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Weekly Overview (kWh/day)</div>
        <BarChart
          data={history7d.map(h=>h.kwh)}
          labels={history7d.map(h=>h.label)}
          colors={history7d.map((_,i)=>[C.cyan,C.amber,C.red,C.green,"#7B61FF","#A78BFA",C.cyan][i])}
          height={140}
          unit="kWh"/>
      </div>
    </div>
  );
}

function BillingPage({ devices, totalKwh, rate, setRate, history30d }){
  const aw = devices.filter(d=>d.on).reduce((s,d)=>s+d.watt,0);
  const monthlyKwh = history30d.reduce((s,h)=>s+h.kwh,0);
  return (
    <div className="page-enter">
      <div style={{fontSize:16,fontWeight:700,marginBottom:20}}>Billing & Cost Estimation</div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="glass-card" style={{padding:"22px",borderColor:C.amber+"33"}}>
          <div style={{fontSize:11,color:C.text2,marginBottom:8,textTransform:"uppercase",letterSpacing:"1.5px"}}>Current Bill (Month)</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:36,fontWeight:700,color:C.amber,textShadow:`0 0 20px ${C.amber}66`}}>
            {fmtRs(monthlyKwh*rate)}
          </div>
          <div style={{fontSize:11,color:C.text2,marginTop:6}}>{fmtKwh(monthlyKwh)} kWh this month</div>
        </div>
        <div className="glass-card" style={{padding:"22px"}}>
          <div style={{fontSize:11,color:C.text2,marginBottom:16,textTransform:"uppercase",letterSpacing:"1.5px"}}>Adjust Rate ₹/kWh</div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <input type="range" className="es-slider" min="1" max="20" value={rate} step="1" onChange={e=>setRate(+e.target.value)}/>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:C.amber,minWidth:40}}>₹{rate}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {label:"Hourly",val:fmtRs((aw/1000)*rate)},
              {label:"Daily", val:fmtRs((monthlyKwh/30)*rate)},
            ].map((r,i)=>(
              <div key={i} style={{background:C.surface,borderRadius:10,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                <div style={{fontSize:10,color:C.text2}}>{r.label}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:C.cyan,marginTop:2}}>{r.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device-wise cost */}
      <div className="glass-card" style={{padding:"20px",marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>Device-wise Cost Breakdown</div>
        {devices.sort((a,b)=>b.watt-a.watt).map(d=>{
          const dKwh = d.kwh;
          const dCost = dKwh*rate;
          const pct = Math.min(100,(d.watt/MAX_WATT)*100*3.5);
          const color = d.watt>800?C.red:d.watt>200?C.amber:C.cyan;
          return (
            <div key={d.id} style={{display:"grid",gridTemplateColumns:"180px 1fr 80px 80px",gap:12,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span>{d.icon}</span>
                <span style={{fontSize:12,fontWeight:500}}>{d.name}</span>
              </div>
              <div style={{height:6,background:"rgba(255,255,255,.05)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:d.on?`${pct}%`:"0%",background:color,transition:"width .6s",borderRadius:3}}/>
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:d.on?color:C.text3,textAlign:"right"}}>{fmtKwh(dKwh)} kWh</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:d.on?C.amber:C.text3,textAlign:"right"}}>{fmtRs(dCost)}</div>
            </div>
          );
        })}
      </div>

      {/* Monthly trend */}
      <div className="glass-card" style={{padding:"20px"}}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>30-Day Cost Trend</div>
        <AreaChart data={history30d.map(h=>+(h.kwh*rate).toFixed(2))} labels={history30d.map(h=>h.label)} height={160} color={C.amber} unit="₹"/>
      </div>
    </div>
  );
}

function SettingsPage({ devices, rate, setRate }){
  const [notifications, setNotifications] = useState(true);
  const [autoOff, setAutoOff] = useState(false);
  const [, setUnit] = useState("kWh");
  return (
    <div className="page-enter">
      <div style={{fontSize:16,fontWeight:700,marginBottom:20}}>Settings & Preferences</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="glass-card" style={{padding:"22px"}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>System Preferences</div>
          {[
            {label:"Live Alerts",     sub:"Notify on high consumption", val:notifications, set:setNotifications},
            {label:"Auto-Off Idle",   sub:"Turn off after 4h idle",     val:autoOff,       set:setAutoOff},
          ].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
              <div>
                <div style={{fontSize:13,fontWeight:500}}>{s.label}</div>
                <div style={{fontSize:11,color:C.text2,marginTop:2}}>{s.sub}</div>
              </div>
              <div className={`toggle-track ${s.val?"on":""}`} onClick={()=>s.set(!s.val)}>
                <div className="toggle-thumb"/>
              </div>
            </div>
          ))}
          <div style={{paddingTop:14}}>
            <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Default Rate (₹/kWh)</div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <input type="range" className="es-slider" min="1" max="20" value={rate} step="1" onChange={e=>setRate(+e.target.value)}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",color:C.amber,fontWeight:700}}>₹{rate}</span>
            </div>
          </div>
        </div>
        <div className="glass-card" style={{padding:"22px"}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>About EnergiSense</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[
              {label:"Version",         val:"v2.0.0"},
              {label:"Build",           val:"2026.03.16"},
              {label:"Simulation",      val:"Virtual IoT Engine"},
              {label:"Total Devices",   val:devices.length},
              {label:"Stack",           val:"React + Chart.js"},
              {label:"Deployment",      val:"Vercel + Render"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{color:C.text2}}>{r.label}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",color:C.cyan}}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{padding:"22px",marginTop:16}}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>💡 Energy Saving Tips</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {TIPS.map((t,i)=>(
            <div key={i} style={{background:C.surface,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.border}`,
              display:"flex",alignItems:"flex-start",gap:10}}>
              <span style={{fontSize:16,flexShrink:0}}>💡</span>
              <span style={{fontSize:12,color:C.text2,lineHeight:1.5}}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function EnergiSense() {
  injectStyles();

  const [page, setPage] = useState("dashboard");
  const [devices, setDevices] = useState(()=>DEVICE_DEFS.map(d=>({...d, on:d.id!=="washer"&&d.id!=="oven", kwh:0})));
  const [totalKwh, setTotalKwh] = useState(0);
  const [rate, setRate] = useState(8);
  const [history24h] = useState(()=>generateHistory(24,2.5));
  const [history7d]  = useState(()=>generateHistory(7, 18).map((h,i)=>{const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];return{...h,label:days[i%7]}}));
  const [history30d] = useState(()=>generateHistory(30,15).map((h,i)=>{const d=new Date(Date.now()-(29-i)*86400000);return{...h,label:`${d.getMonth()+1}/${d.getDate()}`}}));
  const [, setTick] = useState(0);

  // Simulation engine — ticks every 5s
  useEffect(()=>{
    const id = setInterval(()=>{
      setDevices(prev=>prev.map(d=>{
        if(!d.on) return d;
        const delta = (d.watt/1000)*(5/3600);
        return {...d, kwh:d.kwh+delta};
      }));
      setTotalKwh(prev=>{
        const aw = devices.filter(d=>d.on).reduce((s,d)=>s+d.watt,0);
        return prev+(aw/1000)*(5/3600);
      });
      setTick(t=>t+1);
    },5000);
    return ()=>clearInterval(id);
  },[devices]);

  // Toggle device
  const toggleDevice = useCallback((id)=>{
    setDevices(prev=>prev.map(d=>d.id===id?{...d,on:!d.on}:d));
  },[]);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const dateStr = now.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"});

  const navItems = [
    {id:"dashboard", icon:"⊞", label:"Dashboard"},
    {id:"devices",   icon:"◈", label:"Devices"},
    {id:"analytics", icon:"⋈", label:"Analytics"},
    {id:"billing",   icon:"◉", label:"Billing"},
    {id:"settings",  icon:"⊙", label:"Settings"},
  ];

  const pageProps = { devices, totalKwh, rate, history24h, history7d, history30d, setRate, toggleDevice };

  return (
    <div className="es-root">
      <div className="scanline"/>
      <div style={{display:"flex",minHeight:"100vh",position:"relative",zIndex:1}}>
        {/* Sidebar */}
        <div style={{width:64,background:"rgba(8,11,18,.96)",borderRight:`1px solid ${C.border}`,
          display:"flex",flexDirection:"column",alignItems:"center",padding:"18px 0",gap:6,
          position:"sticky",top:0,height:"100vh",flexShrink:0}}>
          <div style={{width:38,height:38,borderRadius:11,
            background:`linear-gradient(135deg,${C.cyan},rgba(0,242,255,.3))`,
            display:"flex",alignItems:"center",justifyContent:"center",
            marginBottom:18,fontSize:18,boxShadow:`0 0 20px ${C.cyanGlow}`}}>⚡</div>
          {navItems.map(n=>(
            <div key={n.id} className={`nav-icon ${page===n.id?"active":""}`}
              onClick={()=>setPage(n.id)} title={n.label}>{n.icon}</div>
          ))}
        </div>

        {/* Content */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Top bar */}
          <div style={{padding:"14px 24px",borderBottom:`1px solid ${C.border}`,
            display:"flex",alignItems:"center",justifyContent:"space-between",
            background:"rgba(8,11,18,.8)",backdropFilter:"blur(10px)",
            position:"sticky",top:0,zIndex:10}}>
            <div>
              <div style={{fontSize:18,fontWeight:800,
                background:`linear-gradient(90deg,${C.cyan},rgba(0,242,255,.5))`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                EnergiSense
              </div>
              <div style={{fontSize:10,color:C.text2,fontFamily:"'JetBrains Mono',monospace",marginTop:1}}>
                Virtual IoT Smart Energy Monitor
              </div>
            </div>
            {/* Ticker */}
            <div style={{overflow:"hidden",flex:1,maxWidth:340,margin:"0 24px"}}>
              <div className="marquee-track" style={{display:"flex",gap:32,whiteSpace:"nowrap"}}>
                {[...TIPS,...TIPS].map((t,i)=>(
                  <span key={i} style={{fontSize:10,color:C.text3,fontFamily:"'JetBrains Mono',monospace"}}>• {t}</span>
                ))}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:C.cyan}}>{timeStr}</div>
                <div style={{fontSize:10,color:C.text2,fontFamily:"'JetBrains Mono',monospace"}}>{dateStr}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,
                background:C.cyanDim,border:`1px solid rgba(0,242,255,.2)`,
                borderRadius:20,padding:"5px 12px",fontSize:11,color:C.cyan,fontFamily:"'JetBrains Mono',monospace"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.cyan,
                  boxShadow:`0 0 6px ${C.cyan}`,animation:"pulse 1.5s ease-in-out infinite"}}/>
                LIVE
              </div>
            </div>
          </div>

          {/* Page content */}
          <div style={{flex:1,overflowY:"auto",padding:"24px"}}>
            {page==="dashboard" && <DashboardPage {...pageProps}/>}
            {page==="devices"   && <DevicesPage   {...pageProps}/>}
            {page==="analytics" && <AnalyticsPage {...pageProps}/>}
            {page==="billing"   && <BillingPage   {...pageProps}/>}
            {page==="settings"  && <SettingsPage  {...pageProps}/>}
          </div>
        </div>
      </div>
    </div>
  );
}
