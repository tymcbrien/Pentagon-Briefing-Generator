import { useState, useEffect, useCallback, useRef } from "react";
/* Pentagon Briefing Generator - Corpus-Integrated Version */

// --- FALLBACK DATA (used when no corpus is loaded) ---
const FB_TOPICS = ["Multi-Domain Operations (MDO)","Joint All-Domain Command & Control (JADC2)","Integrated Deterrence Framework","Pacific Deterrence Initiative (PDI)","Zero Trust Architecture Implementation","AI/ML Enabled Decision Advantage","CMMC 2.0 Implementation Status","PPBE Reform Initiative","Electromagnetic Spectrum Operations (EMSO)","Counter-UAS Strategy","Hypersonic Weapons Program Update","Space Domain Awareness (SDA)","Nuclear Command, Control & Communications (NC3)","Operational Energy Strategy","Contested Logistics in A2/AD Environments","Mission Partner Environment (MPE)","Digital Engineering Ecosystem Strategy","Microelectronics Supply Chain Security","Quantum Information Science Roadmap","CBRN Defense Modernization","Force Design 2030 Update","Readiness Recovery Framework","Long-Range Precision Fires (LRPF)","Next-Gen Air Dominance (NGAD)","Autonomous Systems Integration","5G/Open RAN Military Applications"];
const FB_ORGS = ["OUSD(R&E)","DARPA","OSD","JS J-6","DISA","CYBERCOM","STRATCOM","INDOPACOM","EUCOM","CENTCOM","TRANSCOM","SOCOM","SPACECOM","DIA","NSA/CSS","NGA","DCSA","CAPE","USD(P)","USD(A&S)","AFLCMC","PEO IEW&S","NAVAIR","NAVSEA","MARCORSYSCOM","JSOC"];
const FB_BUZZWORDS = ["synergy","interoperability","lethality","readiness","resilience","overmatch","decision superiority","kill chain","sensor-to-shooter","cross-domain","multi-domain","all-domain","warfighting","battlespace","effects-based","capability gap","materiel solution","enterprise","ecosystem","framework","architecture","posture","throughput","fusion","convergence","integration","decision advantage","information dominance","battle management","DevSecOps","zero trust","mesh network","edge computing","digital twin"];
const FB_ACRONYMS = [{a:"JADC2",e:"Joint All-Domain Command & Control"},{a:"DOTMLPF-P",e:"Doctrine, Organization, Training, Materiel, Leadership, Personnel, Facilities, Policy"},{a:"JCIDS",e:"Joint Capabilities Integration & Development System"},{a:"IOC",e:"Initial Operational Capability"},{a:"FOC",e:"Full Operational Capability"},{a:"PPBE",e:"Planning, Programming, Budgeting & Execution"},{a:"FYDP",e:"Future Years Defense Program"},{a:"RDT&E",e:"Research, Development, Test & Evaluation"},{a:"EMD",e:"Engineering & Manufacturing Development"},{a:"LRIP",e:"Low-Rate Initial Production"},{a:"FRP",e:"Full-Rate Production"},{a:"AoA",e:"Analysis of Alternatives"},{a:"C4ISR",e:"Command, Control, Communications, Computers, Intelligence, Surveillance & Reconnaissance"},{a:"ISR",e:"Intelligence, Surveillance & Reconnaissance"},{a:"CONOPS",e:"Concept of Operations"},{a:"BDA",e:"Battle Damage Assessment"},{a:"RMF",e:"Risk Management Framework"},{a:"ATO",e:"Authority to Operate"},{a:"CMMC",e:"Cybersecurity Maturity Model Certification"}];
const FB_VERBS = ["Accelerate","Enhance","Modernize","Integrate","Synchronize","Optimize","Transform","Leverage","Operationalize","Institutionalize","Deliver","Establish","Maintain","Resource","Prioritize","Execute","Field","Transition","Mature","Sustain","Divest","Realign","Consolidate"];
const FB_OBJECTS = ["across the enterprise","IAW policy guidance","NLT FY27","within the FYDP","to close capability gaps","through iterative development","via agile acquisition pathways","in support of NDS objectives","aligned with CCMD priorities","to achieve decision superiority","per SECDEF direction","as directed by Congress","leveraging allied capabilities","in coordination with interagency partners"];

// --- CORPUS WRAPPER: merges real data with fallbacks ---
function buildSource(corpus) {
  const has = !!corpus;
  const corpusTerms = corpus?.terms || [];
  const corpusTypeVocab = corpus?.type_vocab || {};
  const corpusTitles = corpus?.titles || [];
  const corpusAcronyms = corpus?.acronyms || [];
  const corpusPalettes = corpus?.palettes || [];
  const corpusSamples = corpus?.samples || {};
  const allTerms = corpusTerms.length > 20 ? corpusTerms : [...corpusTerms, ...FB_BUZZWORDS];
  const allTitles = corpusTitles.length > 10 ? corpusTitles : [...corpusTitles, ...FB_TOPICS];
  const allAcronyms = corpusAcronyms.length > 10 ? corpusAcronyms : [...corpusAcronyms, ...FB_ACRONYMS];

  function makeBullet() {
    if (has && corpusTypeVocab.bullets?.length > 10) {
      const terms = corpusTypeVocab.bullets;
      return `${pick(FB_VERBS)} ${pick(terms)} ${pick(terms)} ${pick(FB_OBJECTS)} — ${pick(terms)}`;
    }
    return `${pick(FB_VERBS)} ${pick(allTerms)} ${pick(FB_OBJECTS)}`;
  }
  function makeSlideTitle(type) {
    if (has && corpusTypeVocab[type]?.length > 5) {
      const t = pick(corpusTypeVocab[type]);
      return t.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
    return null;
  }
  function getSample(type) {
    if (has && corpusSamples[type]?.length > 0) return pick(corpusSamples[type]);
    return null;
  }
  function getPalette() {
    if (corpusPalettes.length > 0) return pick(corpusPalettes);
    return null;
  }
  function getAcronyms(n) {
    return pickN(allAcronyms, n).map(a => typeof a === "string" ? a : a.a);
  }
  return { has, topics: allTitles, terms: allTerms, acronyms: allAcronyms, orgs: FB_ORGS, makeBullet, makeSlideTitle, getSample, getPalette, getAcronyms, stats: corpus?.stats || null };
}

// --- CONSTANTS ---
const CLASSIFICATIONS = [{label:"UNCLASSIFIED",color:"#00a651"},{label:"UNCLASSIFIED // FOUO",color:"#00a651"},{label:"CUI",color:"#502b85"},{label:"CONFIDENTIAL",color:"#0033a0"},{label:"SECRET",color:"#c8102e"},{label:"TOP SECRET",color:"#ff8c00"},{label:"TOP SECRET // SCI",color:"#ff8c00"}];
const NAMES = ["Smith","Johnson","Williams","Brown","Davis","Miller","Wilson","Moore","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Garcia","Martinez","Robinson","Clark"];
const RANKS = ["COL","CAPT","BG","RADM","MG","VADM","Mr.","Ms.","Dr.","SES","GS-15"];
const ARROW_WORDS = ["Enables","Informs","Drives","Supports","Feeds","Shapes","Accelerates","Synchronizes","Integrates","Operationalizes"];
const C = {navy:"#0a1628",blue:"#003366",red:"#c8102e",gold:"#ffd700",armyGreen:"#4b5320",navyBlue:"#003b6f",airForce:"#00308f",teal:"#008080",purple:"#663399",orange:"#ff6600"};

// --- UTILITIES ---
const pick = a => a[Math.floor(Math.random() * a.length)];
const pickN = (a, n) => [...a].sort(() => Math.random() - .5).slice(0, Math.min(n, a.length));
const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const dateStr = () => { const d = new Date(), m = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]; return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`; };

function getSlideColors(src) {
  const palette = src.getPalette();
  if (palette && palette.length >= 3) return { primary: palette[0], secondary: palette[1], accent: palette[2], all: palette };
  const defaults = [C.blue, C.red, C.armyGreen, C.navyBlue, C.airForce, C.teal, C.purple, C.orange];
  return { primary: pick(defaults), secondary: pick(defaults), accent: pick(defaults), all: defaults };
}

// --- SLIDE DATA GENERATORS (all take src for corpus integration) ---
function genTitle(topic, org, cls, src) {
  const acrs = src.getAcronyms(2);
  return { type:"title", cls, topic, org, date: dateStr(),
    subtitle: pick([`Quarterly Program Review — ${org}`,`Flag Officer / SES Briefing — ${org}`,`${acrs[0]||"SECDEF"} Decision Brief — ${org}`,`Program Status Update — ${org}`,`Milestone Decision Review — ${org}`,`${acrs[1]||"JROC"} Interest Item — ${org}`,`Congressional Notification Brief — ${org}`]),
    caveat: pick(["PREDECISIONAL — NOT FOR RELEASE","DRAFT — FOR DISCUSSION PURPOSES ONLY","CLOSE HOLD — DO NOT DISTRIBUTE","PRE-DECISIONAL WORKING PAPER","DELIBERATIVE PROCESS — PRIVILEGED","NOT RELEASABLE TO FOREIGN NATIONALS"]) };
}
function genAgenda(cls, topics, src) {
  return { type:"agenda", cls, items: topics.map((t, i) => ({ num: i+1, title: t, time: `${ri(5,20)} min`, speaker: `${pick(RANKS)} ${pick(NAMES)}` })) };
}
function genBullets(cls, _org, src) {
  const colors = getSlideColors(src);
  const corpusTitle = src.makeSlideTitle("bullets");
  const defaultTitles = ["Key Findings","Way Ahead","Challenges & Mitigations","Lines of Effort","Strategic Imperatives","Decision Points","Risk Assessment","Programmatic Concerns","Operational Impacts","Resource Requirements","Capability Gaps & Solutions","Commander's Priorities"];
  const bullets = Array.from({ length: ri(4, 8) }, () => src.makeBullet());
  const sample = src.getSample("bullets");
  const bluf = sample?.s ? sample.s.slice(0, 80).trim() + "..." : pick(["Immediate action required","On track with noted risks","Significant concerns — flag for leadership","Decision needed NLT next SLRG","Favorable trajectory — continue current approach","Unfunded requirement — seek reprogramming authority"]);
  return { type:"bullets", cls, title: corpusTitle || pick(defaultTitles), bullets, bluf, colors };
}
function genTimeline(cls, _org, src) {
  const corpusTitle = src.makeSlideTitle("timeline");
  const phases = pickN(["MSA","TMRR","EMD","LRIP","IOT&E","FRP","FOC","Milestone A","Milestone B","Milestone C","PDR","CDR","SRR","SFR","TRR","SVR","FCA","PCA","Phase 0","Phase 1","Phase 2","Phase 3","Phase 4","Sprint 1-4","Sprint 5-8","PI 1","PI 2","PI 3"], ri(5, 9));
  const fy = ri(24, 30);
  const colors = getSlideColors(src);
  const colorArr = colors.all.length >= 5 ? colors.all : [C.blue,C.red,C.armyGreen,C.navyBlue,C.airForce,C.teal,C.purple,C.orange];
  return { type:"timeline", cls, title: corpusTitle || pick(["Program Schedule","Milestone Timeline","Acquisition Strategy Timeline","Implementation Roadmap","Transition Plan","Phased Approach"]), phases: phases.map((p, i) => ({ name: p, fy: `FY${fy + Math.floor(i * 0.7)}`, color: colorArr[i % colorArr.length] })) };
}
function genMatrix(cls, _org, src) {
  const corpusTitle = src.makeSlideTitle("matrix");
  const rowSource = src.has ? src.terms : FB_BUZZWORDS;
  const rows = pickN(rowSource, ri(4, 6));
  if (src.has && Math.random() > 0.5) { const acrs = src.getAcronyms(2); acrs.forEach((a, i) => { if (i < rows.length) rows[i] = a; }); }
  const cols = pickN(["Cost","Schedule","Performance","Technical","Programmatic","Operational","Cyber","Supply Chain"], ri(3, 5));
  const s = ["green","yellow","red","grey"];
  return { type:"matrix", cls, title: corpusTitle || pick(["Risk Assessment Matrix","DOTMLPF-P Analysis","Capability Assessment","Gap Analysis","Threat Matrix","Readiness Dashboard","Stoplight Chart"]), rows, cols, grid: rows.map(() => cols.map(() => pick(s))) };
}
function genOrgChart(cls, org, src) {
  const corpusTitle = src.makeSlideTitle("orgchart");
  const defaultBoxes = ["SECDEF","DEPSECDEF","USD(R&E)","USD(A&S)","USD(P)","USD(I&S)","CJCS","VCJCS","Service Chiefs","CCMDs","PEO","PM","DPM","Chief Engineer","Test Director","IPT Lead","DAE","MDA","CIO","CDO","CDAO","CTO","CISO",org];
  let boxes = pickN(defaultBoxes, ri(6, 11));
  if (src.has) { src.getAcronyms(3).forEach(a => { if (boxes.length < 12) boxes.push(a); }); }
  return { type:"orgchart", cls, org, title: corpusTitle || pick(["Organizational Structure","Command Relationships","Governance Framework","Program Office Organization","Enterprise Governance"]), boxes };
}
function genFlowchart(cls, _org, src) {
  const corpusTitle = src.makeSlideTitle("flowchart");
  const defaultNodes = ["SENSOR","C2 NODE","FIRES","EFFECTS","BDA","ISR","INTEL FUSION","TARGETING","COA DEV","JIPOE","PED","DISSEM","FEEDBACK","AI/ML ENGINE","CLOUD","EDGE NODE","GATEWAY","DATA LAKE","ANALYTICS","DECISION AID","HUMAN-IN-LOOP","COMMS","EW"];
  let nodes = pickN(defaultNodes, ri(6, 10));
  if (src.has) { src.getAcronyms(4).forEach((a, i) => { if (i < nodes.length) nodes[i] = a; }); }
  return { type:"flowchart", cls, title: corpusTitle || pick(["Process Flow","Decision Framework","Kill Chain Integration","Sensor-to-Shooter Loop","Data Flow Architecture","C2 Architecture","Operational Workflow","Information Flow"]), nodes };
}
function genBudget(cls, _org, src) {
  const corpusTitle = src.makeSlideTitle("budget");
  const years = Array.from({ length: 6 }, (_, i) => `FY${25 + i}`);
  const cats = pickN(["RDT&E","Procurement","O&M","MILPERS","MILCON","BA 1 - Basic Research","BA 2 - Applied Research","BA 3 - ATD","BA 5 - System Dev & Demo","BA 7 - Operational Sys Dev","Contract Support","Gov FTE","Travel","Test & Eval"], ri(4, 7));
  return { type:"budget", cls, title: corpusTitle || pick(["Resource Summary ($ in Millions)","FYDP Funding Profile","Budget Overview — PB vs Enacted","Financial Execution Status","Spend Plan vs Actuals"]), years, data: cats.map(c => ({ name: c, values: years.map(() => (Math.random() * 500 + 10).toFixed(1)) })) };
}
function genVenn(cls, _org, src) {
  const corpusTitle = src.makeSlideTitle("venn");
  let circles = pickN(["CYBER","SPACE","AIR","LAND","SEA","EW/EMSO","INFO OPS","INTEL","FIRES","C2","LOGISTICS","ISR","AI/ML","CLOUD","5G"], 3);
  if (src.has) { src.getAcronyms(2).forEach((a, i) => { if (i < circles.length) circles[i] = a; }); }
  let center = pick(["DECISION ADVANTAGE","OVERMATCH","LETHALITY","CONVERGENCE","INTEGRATED DETERRENCE"]);
  if (src.has && src.terms.length > 20) center = pick(src.terms).toUpperCase();
  return { type:"venn", cls, title: corpusTitle || pick(["Convergence of Capabilities","Integration Framework","Multi-Domain Synergy","Cross-Functional Dependencies"]), circles, center };
}
function genQuestions(cls) { return { type:"questions", cls, title: pick(["QUESTIONS?","DISCUSSION","QUESTIONS / DISCUSSION"]) }; }
function genBackup(cls) { return { type:"backup", cls }; }

// --- DECK GENERATOR ---
function generateDeck(corpus) {
  const src = buildSource(corpus);
  const topic = pick(src.topics);
  const org = pick(src.orgs);
  const cls = pick(CLASSIFICATIONS);
  const count = ri(9, 15);
  const gens = [genBullets, genTimeline, genMatrix, genOrgChart, genFlowchart, genBudget, genVenn, genBullets, genMatrix, genBullets];
  const slides = [genTitle(topic, org, cls, src)];
  if (Math.random() > 0.35) {
    const agendaTopics = pickN(src.topics, ri(4, 7)).map(t => typeof t === "string" ? t.split("(")[0].trim() : t);
    slides.push(genAgenda(cls, agendaTopics, src));
  }
  while (slides.length < count - 2) { const gen = pick(gens); slides.push(gen(cls, org, src)); }
  slides.push(genQuestions(cls));
  if (Math.random() > 0.5) slides.push(genBackup(cls));
  return { topic, org, cls, slides, corpusUsed: src.has, corpusStats: src.stats };
}

// --- SLIDE RENDERERS ---
const Banner = ({ cls, pos }) => (<div style={{ position:"absolute", [pos]:0, left:0, right:0, background:cls.color, color:"#fff", textAlign:"center", fontSize:9, fontWeight:900, fontFamily:"'Courier New',monospace", letterSpacing:3, padding:"2px 0", zIndex:10 }}>{cls.label}</div>);
const Frame = ({ children, cls, bg }) => (<div style={{ position:"relative", width:"100%", aspectRatio:"16/9", background:bg||"#fff", border:`2px solid ${cls.color}`, overflow:"hidden", fontFamily:"'Arial','Helvetica',sans-serif", boxShadow:"0 4px 24px rgba(0,0,0,0.2)" }}><Banner cls={cls} pos="top" /><Banner cls={cls} pos="bottom" /><div style={{ position:"absolute", top:15, left:0, right:0, bottom:15, overflow:"hidden" }}>{children}</div></div>);
const Seal = ({ size = 44, style = {} }) => (<div style={{ width:size, height:size, borderRadius:"50%", border:"2px solid #003366", background:"radial-gradient(circle,#003366 30%,#0a5c99 65%,#003366)", display:"flex", alignItems:"center", justifyContent:"center", color:"#ffd700", fontWeight:900, fontSize:size*.22, fontFamily:"Georgia,serif", boxShadow:"0 2px 8px rgba(0,0,0,.35)", ...style }}>DoD</div>);
const SlideTitle = ({ title, color = C.blue }) => (<div style={{ fontSize:15, fontWeight:900, color, borderBottom:`3px solid ${color}`, paddingBottom:5, marginBottom:10, textTransform:"uppercase", letterSpacing:.5 }}>{title}</div>);
const Footer = ({ text }) => (<div style={{ fontSize:7, color:"#999", borderTop:"1px solid #ddd", paddingTop:3, marginTop:"auto", fontStyle:"italic" }}>{text}</div>);

const RTitle = ({ s }) => (<Frame cls={s.cls} bg={`linear-gradient(135deg,${C.navy},${C.blue} 50%,#0a4a7a)`}><div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:36, position:"relative" }}><div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(255,255,255,.02) 35px,rgba(255,255,255,.02) 70px)" }} /><Seal size={48} style={{ marginBottom:16 }} /><div style={{ fontSize:20, fontWeight:900, color:"#fff", textAlign:"center", textTransform:"uppercase", letterSpacing:1, lineHeight:1.3, textShadow:"0 2px 6px rgba(0,0,0,.5)", maxWidth:"82%" }}>{s.topic}</div><div style={{ width:"55%", height:3, background:C.gold, margin:"14px 0", boxShadow:"0 0 12px rgba(255,215,0,.4)" }} /><div style={{ fontSize:11, color:"#a0c4e8", textAlign:"center", textTransform:"uppercase", letterSpacing:1 }}>{s.subtitle}</div><div style={{ fontSize:10, color:"#7aa8cc", marginTop:6 }}>{s.date}</div><div style={{ position:"absolute", bottom:22, fontSize:8, color:"#ff6666", fontWeight:700, letterSpacing:2, textTransform:"uppercase" }}>{s.caveat}</div></div></Frame>);

const RAgenda = ({ s }) => (<Frame cls={s.cls}><div style={{ padding:"22px 28px 16px", height:"100%", display:"flex", flexDirection:"column" }}><SlideTitle title="AGENDA" /><div style={{ flex:1, display:"flex", flexDirection:"column", gap:3, overflow:"hidden" }}>{s.items.map((it, i) => (<div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 8px", background:i%2===0?"#f0f4f8":"#fff", borderLeft:`4px solid ${i%2===0?C.blue:C.red}`, fontSize:9 }}><div style={{ width:20, height:20, borderRadius:"50%", background:C.blue, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:9, flexShrink:0 }}>{it.num}</div><div style={{ flex:1, fontWeight:600, color:"#222", textTransform:"uppercase" }}>{it.title}</div><div style={{ color:"#666", fontSize:8, flexShrink:0 }}>{it.speaker}</div><div style={{ background:C.gold, color:"#000", padding:"1px 7px", fontWeight:700, fontSize:8, borderRadius:2, flexShrink:0 }}>{it.time}</div></div>))}</div></div></Frame>);

const RBullets = ({ s }) => { const ac = s.colors?.primary || pick([C.blue,C.red,C.armyGreen,C.navyBlue,C.airForce]); return (<Frame cls={s.cls}><div style={{ padding:"22px 28px 16px", height:"100%", display:"flex", flexDirection:"column" }}><SlideTitle title={s.title} color={ac} /><div style={{ flex:1, display:"flex", flexDirection:"column", gap:5, overflow:"hidden" }}>{s.bullets.map((b, i) => (<div key={i} style={{ display:"flex", alignItems:"flex-start", gap:7, fontSize:9, lineHeight:1.4, color:"#1a1a1a" }}><div style={{ width:7, height:7, marginTop:2, flexShrink:0, background:[C.red,C.gold,ac][i%3], transform:"rotate(45deg)" }} /><div><b>{b.split(" ").slice(0,2).join(" ")}</b> {b.split(" ").slice(2).join(" ")}</div></div>))}</div><Footer text={`BLUF: ${s.bluf}`} /></div></Frame>); };

const RTimeline = ({ s }) => (<Frame cls={s.cls}><div style={{ padding:"22px 28px 16px", height:"100%", display:"flex", flexDirection:"column" }}><SlideTitle title={s.title} /><div style={{ flex:1, position:"relative", overflow:"hidden" }}><div style={{ display:"flex", marginBottom:8, paddingLeft:90 }}>{s.phases.map((p, i) => (<div key={i} style={{ flex:1, fontSize:7, color:"#666", fontWeight:700, textAlign:"center" }}>{p.fy}</div>))}</div>{s.phases.map((p, i) => (<div key={i} style={{ display:"flex", alignItems:"center", marginBottom:3, height:22 }}><div style={{ width:90, fontSize:7, fontWeight:700, color:"#333", textAlign:"right", paddingRight:7, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{p.name}</div><div style={{ flex:1, position:"relative", height:"100%", background:"#f5f5f5" }}><div style={{ position:"absolute", left:`${(i/s.phases.length)*100}%`, width:`${Math.max(10,100/s.phases.length)}%`, height:"100%", background:p.color, opacity:.85, borderRadius:2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:6, color:"#fff", fontWeight:700 }}>{p.name.length<14?p.name:""}</div><div style={{ position:"absolute", left:`${(i/s.phases.length)*100}%`, top:-3, width:8, height:8, background:C.red, transform:"rotate(45deg) translateX(-2px)" }} /></div></div>))}<div style={{ position:"absolute", left:`calc(90px + ${ri(18,35)}%)`, top:12, bottom:0, borderLeft:"2px dashed #c8102e" }}><div style={{ position:"absolute", top:-12, left:-14, fontSize:7, color:"#c8102e", fontWeight:900 }}>▼ TODAY</div></div></div></div></Frame>);

const RMatrix = ({ s }) => { const sc = {green:"#00a651",yellow:"#ffc107",red:"#c8102e",grey:"#999"}; const sl = {green:"G",yellow:"Y",red:"R",grey:"—"}; return (<Frame cls={s.cls}><div style={{ padding:"22px 28px 16px", height:"100%", display:"flex", flexDirection:"column" }}><SlideTitle title={s.title} /><div style={{ flex:1, overflow:"hidden" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:8 }}><thead><tr><th style={{ background:C.blue, color:"#fff", padding:"5px 6px", textAlign:"left", fontSize:7, textTransform:"uppercase" }}>CAPABILITY</th>{s.cols.map((c, i) => (<th key={i} style={{ background:C.blue, color:"#fff", padding:"5px 3px", textAlign:"center", fontSize:7, textTransform:"uppercase", minWidth:36 }}>{c}</th>))}</tr></thead><tbody>{s.rows.map((r, ri_) => (<tr key={ri_}><td style={{ padding:"4px 6px", fontWeight:600, background:ri_%2===0?"#f8f9fa":"#fff", borderBottom:"1px solid #e0e0e0", fontSize:7, textTransform:"uppercase" }}>{r}</td>{s.grid[ri_].map((st, ci) => (<td key={ci} style={{ padding:3, background:ri_%2===0?"#f8f9fa":"#fff", borderBottom:"1px solid #e0e0e0", textAlign:"center" }}><div style={{ width:20, height:20, borderRadius:"50%", background:sc[st], color:"#fff", fontWeight:900, fontSize:7, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>{sl[st]}</div></td>))}</tr>))}</tbody></table></div><div style={{ display:"flex", gap:10, marginTop:6, fontSize:7 }}>{[["green","On Track"],["yellow","At Risk"],["red","Critical"]].map(([k,v]) => (<div key={k} style={{ display:"flex", alignItems:"center", gap:3 }}><div style={{ width:9, height:9, borderRadius:"50%", background:sc[k] }} /><span>{v}</span></div>))}</div></div></Frame>); };

const ROrgChart = ({ s }) => (<Frame cls={s.cls}><div style={{ padding:"22px 28px 16px", height:"100%", display:"flex", flexDirection:"column" }}><SlideTitle title={s.title} /><div style={{ flex:1, position:"relative", overflow:"hidden" }}><div style={{ position:"absolute", left:"50%", top:4, transform:"translateX(-50%)", width:100, height:30, background:C.blue, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, fontWeight:900, textAlign:"center", border:"2px solid #001a33", borderRadius:3, textTransform:"uppercase", padding:"0 4px" }}>{s.boxes[0]}</div><div style={{ position:"absolute", left:"50%", top:34, width:2, height:16, background:"#999" }} />{s.boxes.slice(1,4).map((b, i) => { const t = Math.min(3, s.boxes.length-1); const x = ((i+1)/(t+1))*100; return (<div key={i} style={{ position:"absolute", left:`${x}%`, top:52, transform:"translateX(-50%)", width:82, height:28, background:C.red, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:6.5, fontWeight:700, textAlign:"center", borderRadius:2, textTransform:"uppercase", padding:"0 3px" }}>{b}</div>); })}<div style={{ position:"absolute", left:`${(1/(Math.min(3,s.boxes.length-1)+1))*100}%`, right:`${100-(Math.min(3,s.boxes.length-1)/(Math.min(3,s.boxes.length-1)+1))*100}%`, top:50, height:2, background:"#999" }} />{s.boxes.slice(4).map((b, i) => { const cols = Math.min(s.boxes.length-4, 5); const col = i%cols, row = Math.floor(i/cols); const x = ((col+1)/(cols+1))*100; return (<div key={i} style={{ position:"absolute", left:`${x}%`, top:95+row*36, transform:"translateX(-50%)", width:78, height:26, background:"#f0f4f8", color:C.blue, display:"flex", alignItems:"center", justifyContent:"center", fontSize:6, fontWeight:700, textAlign:"center", border:`1px solid ${C.blue}`, borderRadius:2, textTransform:"uppercase", padding:"0 2px" }}>{b}</div>); })}{[30,50,70].map((x, i) => (<div key={i} style={{ position:"absolute", left:`${x}%`, top:82, color:"#bbb", fontSize:9, transform:"translateX(-50%)" }}>▼</div>))}</div></div></Frame>);

const RFlowchart = ({ s }) => { const colors = [C.blue,C.red,C.armyGreen,C.navyBlue,C.teal,C.purple,C.orange,C.airForce]; return (<Frame cls={s.cls}><div style={{ padding:"22px 28px 16px", height:"100%", display:"flex", flexDirection:"column" }}><SlideTitle title={s.title} /><div style={{ flex:1, display:"flex", flexWrap:"wrap", gap:5, alignContent:"flex-start", padding:"6px 0", position:"relative" }}>{s.nodes.map((n, i) => (<div key={i} style={{ display:"flex", alignItems:"center", gap:3 }}><div style={{ width:i%4===0?72:i%4===2?62:68, height:i%4===0?34:32, background:colors[i%colors.length], color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:6.5, fontWeight:700, textAlign:"center", borderRadius:i%4===0?"50%":3, boxShadow:"0 2px 5px rgba(0,0,0,.2)", padding:"2px 3px", textTransform:"uppercase", lineHeight:1.2 }}>{n}</div>{i<s.nodes.length-1 && (<div style={{ fontSize:7, color:"#888", fontWeight:700, display:"flex", flexDirection:"column", alignItems:"center", minWidth:44 }}><div style={{ fontSize:5.5, color:"#aaa", marginBottom:1 }}>{pick(ARROW_WORDS)}</div><div style={{ fontSize:10 }}>→</div></div>)}</div>))}<svg style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:.12 }}>{[0,1,2].map(i => (<line key={i} x1={`${ri(10,40)}%`} y1={`${ri(20,80)}%`} x2={`${ri(60,90)}%`} y2={`${ri(20,80)}%`} stroke={C.red} strokeWidth="1.5" strokeDasharray="4 3" />))}</svg></div></div></Frame>); };

const RBudget = ({ s }) => (<Frame cls={s.cls}><div style={{ padding:"22px 28px 16px", height:"100%", display:"flex", flexDirection:"column" }}><SlideTitle title={s.title} /><div style={{ flex:1, overflow:"hidden" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:7 }}><thead><tr><th style={{ background:C.navy, color:"#fff", padding:"4px 5px", textAlign:"left", fontSize:6.5 }}>CATEGORY</th>{s.years.map((y, i) => (<th key={i} style={{ background:C.navy, color:C.gold, padding:"4px 3px", textAlign:"right", fontSize:6.5 }}>{y}</th>))}<th style={{ background:C.red, color:"#fff", padding:"4px 3px", textAlign:"right", fontSize:6.5 }}>TOTAL</th></tr></thead><tbody>{s.data.map((r, ri_) => { const total = r.values.reduce((a,b)=>a+ +b,0).toFixed(1); return (<tr key={ri_}><td style={{ padding:"3px 5px", fontWeight:600, background:ri_%2===0?"#f8f9fa":"#fff", borderBottom:"1px solid #e0e0e0", fontSize:6.5, maxWidth:110, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{r.name}</td>{r.values.map((v, vi) => (<td key={vi} style={{ padding:"3px", textAlign:"right", background:ri_%2===0?"#f8f9fa":"#fff", borderBottom:"1px solid #e0e0e0", fontFamily:"'Courier New',monospace", fontSize:6.5 }}>{v}</td>))}<td style={{ padding:"3px", textAlign:"right", background:ri_%2===0?"#eef2f7":"#f0f4f8", borderBottom:"1px solid #e0e0e0", fontFamily:"'Courier New',monospace", fontSize:6.5, fontWeight:700 }}>{total}</td></tr>); })}<tr><td style={{ padding:"4px 5px", fontWeight:900, background:C.blue, color:"#fff", fontSize:6.5 }}>TOTAL</td>{s.years.map((_, yi) => { const ct = s.data.reduce((a,r)=>a+ +r.values[yi],0).toFixed(1); return <td key={yi} style={{ padding:"4px 3px", textAlign:"right", background:C.blue, color:C.gold, fontFamily:"'Courier New',monospace", fontSize:6.5, fontWeight:700 }}>{ct}</td>; })}<td style={{ padding:"4px 3px", textAlign:"right", background:C.red, color:"#fff", fontFamily:"'Courier New',monospace", fontSize:6.5, fontWeight:900 }}>{s.data.reduce((a,r)=>a+r.values.reduce((b,v)=>b+ +v,0),0).toFixed(1)}</td></tr></tbody></table></div><Footer text={`Source: ${pick(["OUSD(C) PB FY26 Submission","SAR Dec 2025","CAPE Estimate","Service Budget Submission"])} | Then-Year $M`} /></div></Frame>);

const RVenn = ({ s }) => { const cc = ["rgba(0,51,102,.55)","rgba(200,16,46,.55)","rgba(0,128,128,.5)"]; return (<Frame cls={s.cls}><div style={{ padding:"22px 28px 16px", height:"100%", display:"flex", flexDirection:"column" }}><SlideTitle title={s.title} /><div style={{ flex:1, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>{s.circles.map((l, i) => { const a = (i*120-90)*(Math.PI/180); const cx = 50+Math.cos(a)*14, cy = 50+Math.sin(a)*14; return (<div key={i} style={{ position:"absolute", left:`${cx-18}%`, top:`${cy-25}%`, width:"36%", aspectRatio:"1", borderRadius:"50%", background:cc[i], border:`2px solid ${cc[i].replace(/[\d.]+\)/,"1)")}`, display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ color:"#fff", fontWeight:900, fontSize:10, textAlign:"center", textShadow:"0 1px 4px rgba(0,0,0,.5)", textTransform:"uppercase", transform:`translateY(${i===0?-14:14}px)` }}>{l}</div></div>); })}<div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", background:C.gold, color:C.navy, padding:"5px 11px", fontWeight:900, fontSize:8, textAlign:"center", borderRadius:4, boxShadow:"0 2px 10px rgba(0,0,0,.3)", textTransform:"uppercase", zIndex:5, border:"2px solid #b8860b" }}>{s.center}</div></div></div></Frame>); };

const RQuestions = ({ s }) => (<Frame cls={s.cls} bg={`linear-gradient(135deg,${C.navy},${C.blue})`}><div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative" }}><div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(255,255,255,.015) 35px,rgba(255,255,255,.015) 70px)" }} /><Seal size={38} style={{ marginBottom:14 }} /><div style={{ fontSize:28, fontWeight:900, color:"#fff", textTransform:"uppercase", letterSpacing:6, textShadow:"0 2px 10px rgba(0,0,0,.5)" }}>{s.title}</div><div style={{ width:"35%", height:3, background:C.gold, margin:"12px 0" }} /><div style={{ fontSize:10, color:"#7aa8cc" }}>POC: {pick(RANKS)} {pick(NAMES)} | DSN: {ri(100,999)}-{ri(1000,9999)}</div></div></Frame>);

const RBackup = ({ s }) => (<Frame cls={s.cls} bg="repeating-linear-gradient(45deg,#f5f5f5,#f5f5f5 10px,#eee 10px,#eee 20px)"><div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ fontSize:26, fontWeight:900, color:C.blue, textTransform:"uppercase", letterSpacing:8, border:`4px solid ${C.blue}`, padding:"18px 44px", background:"rgba(255,255,255,.9)" }}>BACKUP SLIDES</div></div></Frame>);

const RENDERERS = { title:RTitle, agenda:RAgenda, bullets:RBullets, timeline:RTimeline, matrix:RMatrix, orgchart:ROrgChart, flowchart:RFlowchart, budget:RBudget, venn:RVenn, questions:RQuestions, backup:RBackup };
const RenderSlide = ({ slide }) => { const R = RENDERERS[slide.type]; return R ? <R s={slide} /> : <div>Unknown: {slide.type}</div>; };

// --- MAIN APP ---
export default function App() {
  const [deck, setDeck] = useState(null);
  const [cur, setCur] = useState(0);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("presenter");
  const [corpusData, setCorpusData] = useState(null);
  const [showSetup, setShowSetup] = useState(false);

  const generate = useCallback(() => {
    setLoading(true);
    setTimeout(() => { setDeck(generateDeck(corpusData)); setCur(0); setLoading(false); }, 600);
  }, [corpusData]);

  useEffect(() => {
    const h = e => {
      if (!deck) return;
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); setCur(c => Math.min(c + 1, deck.slides.length - 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setCur(c => Math.max(c - 1, 0)); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [deck]);

  useEffect(() => {
    fetch("/api/corpus").then(r => r.json()).then(d => {
      if (d.available) setCorpusData(d.corpus);
    }).catch(() => {
      fetch("/corpus/slim_corpus.json").then(r => r.json()).then(d => setCorpusData(d)).catch(() => {});
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#c9d1d9", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(90deg,#0a1628,#162a4a 50%,#0a1628)", borderBottom: "2px solid #1e3a5f", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Seal size={32} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>Pentagon Briefing Generator</div>
            <div style={{ fontSize: 9, color: "#5a7a9a", letterSpacing: 2 }}>
              RANDOMLY GENERATED • NOT REAL
              {corpusData ? ` • TRAINED ON ${corpusData.stats?.total_slides || "?"} REAL DoD SLIDES ✓` : " • BUILT-IN VOCABULARY"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {deck && (
            <>
              <Btn text="Presenter" active={view === "presenter"} onClick={() => setView("presenter")} />
              <Btn text="Grid" active={view === "grid"} onClick={() => setView("grid")} />
            </>
          )}
          <button onClick={() => setShowSetup(!showSetup)} style={{ padding: "6px 12px", background: "transparent", color: "#5a7a9a", border: "1px solid #1e3a5f", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>⚙ Setup</button>
          <button onClick={generate} disabled={loading} style={{
            padding: "7px 18px",
            background: loading ? "#333" : "linear-gradient(135deg,#c8102e,#8b0000)",
            color: "#fff", border: "none", borderRadius: 4, fontSize: 11,
            fontWeight: 800, textTransform: "uppercase", letterSpacing: 1,
            cursor: loading ? "wait" : "pointer",
            boxShadow: loading ? "none" : "0 2px 10px rgba(200,16,46,.4)",
          }}>
            {loading ? "⏳ GENERATING..." : deck ? "🎲 NEW BRIEFING" : "🎲 GENERATE BRIEFING"}
          </button>
        </div>
      </div>

      {showSetup && <SetupPanel corpusData={corpusData} />}

      {/* LANDING */}
      {!deck && !loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", gap: 18, padding: 36 }}>
          <Seal size={72} style={{ boxShadow: "0 0 30px rgba(0,51,102,.5)" }} />
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: 3, textAlign: "center" }}>Pentagon Briefing Generator</div>
          <div style={{ fontSize: 12, color: "#5a7a9a", textAlign: "center", maxWidth: 460, lineHeight: 1.6 }}>
            {corpusData
              ? `Generates DoD-style briefing decks trained on ${corpusData.stats?.total_slides || ""} real military presentations from Archive.org.`
              : "Generates multi-slide DoD-style briefing decks with org charts, risk matrices, budget tables, timelines, and an overwhelming number of acronyms."}
          </div>
          {corpusData && (
            <div style={{ fontSize: 10, color: "#00a651", fontWeight: 600 }}>
              ✓ Corpus loaded: {corpusData.stats?.total_slides} slides from {corpusData.stats?.unique_sources} sources
            </div>
          )}
          <button onClick={generate} style={{
            padding: "11px 32px", marginTop: 8,
            background: "linear-gradient(135deg,#c8102e,#8b0000)",
            color: "#fff", border: "2px solid #ff3344", borderRadius: 6,
            fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2,
            cursor: "pointer", boxShadow: "0 4px 20px rgba(200,16,46,.4)",
          }}>GENERATE BRIEFING</button>
          <div style={{ fontSize: 8, color: "#3a4a5a", marginTop: 6, letterSpacing: 1 }}>DISCLAIMER: ALL CONTENT IS RANDOMLY GENERATED FICTION</div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 14 }}>
          <div style={{ width: 44, height: 44, border: "3px solid #1e3a5f", borderTop: "3px solid #ffd700", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ color: "#5a7a9a", fontSize: 11, letterSpacing: 2 }}>ASSEMBLING BRIEFING PACKAGE...</div>
        </div>
      )}

      {/* PRESENTER VIEW */}
      {deck && !loading && view === "presenter" && (
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 11, color: "#5a7a9a" }}>
              <span style={{ color: deck.cls.color, fontWeight: 700 }}>{deck.cls.label}</span>
              {" • "}{deck.org}{" • "}{deck.slides.length} slides
              {deck.corpusUsed && <span style={{ color: "#00a651" }}> • corpus-trained</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <NavBtn text="◀ PREV" disabled={cur === 0} onClick={() => setCur(c => c - 1)} />
              <span style={{ fontSize: 11, color: "#fff", fontWeight: 700, minWidth: 54, textAlign: "center" }}>{cur + 1} / {deck.slides.length}</span>
              <NavBtn text="NEXT ▶" disabled={cur === deck.slides.length - 1} onClick={() => setCur(c => c + 1)} />
            </div>
          </div>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <RenderSlide slide={deck.slides[cur]} />
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 9, color: "#3a4a5a", textTransform: "uppercase", letterSpacing: 2 }}>
            {deck.slides[cur].type} slide • Arrow keys to navigate
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 14, overflowX: "auto", padding: "6px 0" }}>
            {deck.slides.map((slide, i) => (
              <div key={i} onClick={() => setCur(i)} style={{
                flexShrink: 0, width: 110, cursor: "pointer",
                border: i === cur ? "2px solid #ffd700" : "2px solid transparent",
                borderRadius: 3, overflow: "hidden", opacity: i === cur ? 1 : .55,
                transition: "all .15s", position: "relative",
              }}>
                <div style={{ width: 110, pointerEvents: "none" }}><RenderSlide slide={slide} /></div>
                <div style={{ position: "absolute", bottom: 2, right: 3, fontSize: 7, color: "#fff", fontWeight: 700, background: "rgba(0,0,0,.6)", padding: "0 3px", borderRadius: 2 }}>{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {deck && !loading && view === "grid" && (
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
          {deck.slides.map((slide, i) => (
            <div key={i} onClick={() => { setCur(i); setView("presenter"); }} style={{ cursor: "pointer", position: "relative" }}>
              <RenderSlide slide={slide} />
              <div style={{ position: "absolute", top: 18, left: 5, background: "rgba(0,0,0,.7)", color: "#fff", padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 700 }}>{i + 1}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- HELPER COMPONENTS ---
function Btn({ text, active, onClick }) {
  return (<button onClick={onClick} style={{ padding: "5px 12px", fontSize: 10, fontWeight: 600, background: active ? "#1e3a5f" : "transparent", color: active ? "#fff" : "#5a7a9a", border: "1px solid #1e3a5f", borderRadius: 4, cursor: "pointer" }}>{text}</button>);
}

function NavBtn({ text, disabled, onClick }) {
  return (<button onClick={onClick} disabled={disabled} style={{ padding: "3px 10px", background: disabled ? "#1a1a2e" : "#1e3a5f", color: disabled ? "#333" : "#fff", border: "none", borderRadius: 3, cursor: disabled ? "default" : "pointer", fontSize: 11 }}>{text}</button>);
}

function SetupPanel({ corpusData }) {
  return (
    <div style={{ background: "#111822", borderBottom: "1px solid #1e3a5f", padding: "20px 24px", fontSize: 12, lineHeight: 1.7, color: "#8899aa" }}>
      <div style={{ maxWidth: 700 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10 }}>🚀 How to Deploy & Train This App</div>

        <Step n="1" title="Get the code">Download the project ZIP from this conversation.</Step>
        <Step n="2" title="Create free accounts">Sign up at <A href="https://vercel.com">vercel.com</A> and <A href="https://github.com">github.com</A>.</Step>
        <Step n="3" title="Upload code to GitHub">New repository → "uploading an existing file" → drag in your files.</Step>
        <Step n="4" title="Deploy on Vercel">Add New → Project → select your repo → Deploy. You get a live URL!</Step>
        <Step n="5" title="(Optional) Train on real DoD slides">
          Open Terminal on your Mac. If you need Python, download it from <A href="https://python.org/downloads">python.org/downloads</A>. Then run:
          <Code lines={[
            "cd ~/Downloads/pentagon-briefing-generator",
            "pip3 install -r requirements.txt",
            "python3 pipeline/ingest.py --count 50",
          ]} />
          Then copy your <code style={{color:"#ffd700"}}>corpus/slim_corpus.json</code> file into a <code style={{color:"#ffd700"}}>public/corpus/</code> folder in your GitHub repo. The app will load it automatically.
        </Step>

        <div style={{ marginTop: 16, padding: "10px 14px", background: "#1a2332", borderRadius: 6, borderLeft: "3px solid #ffd700" }}>
          <div style={{ fontSize: 11, color: "#ffd700", fontWeight: 700, marginBottom: 4 }}>📊 Corpus Status</div>
          <div style={{ fontSize: 11 }}>
            {corpusData
              ? `✅ Corpus loaded! Using real vocabulary from ${corpusData.stats?.total_slides || "?"} slides across ${corpusData.stats?.unique_sources || "?"} sources. Titles, bullets, acronyms, and colors all come from real Pentagon briefings.`
              : "⚪ No corpus loaded — using built-in vocabulary. Works great already! Training on real slides adds authenticity."}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#1e3a5f", color: "#ffd700", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{n}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#d0d8e0" }}>{title}</div>
      </div>
      <div style={{ marginLeft: 30 }}>{children}</div>
    </div>
  );
}

function A({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#4da6ff", textDecoration: "underline" }}>{children}</a>;
}

function Code({ lines }) {
  return (
    <div style={{ background: "#0d1117", border: "1px solid #1e3a5f", borderRadius: 5, padding: "8px 12px", marginTop: 6, fontFamily: "'SF Mono','Courier New',monospace", fontSize: 11, lineHeight: 1.6, overflowX: "auto" }}>
      {lines.map((l, i) => (<div key={i} style={{ color: l.startsWith("#") ? "#6a737d" : "#c9d1d9" }}>{l || "\u00A0"}</div>))}
    </div>
  );
}
