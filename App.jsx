import { useState, useEffect, useCallback } from "react";
/* Pentagon Briefing Generator v2.0 — Maximum Chaos Edition */

// ============================================================
// EXPANDED BUILT-IN VOCABULARY
// ============================================================
const FB_TOPICS = [
  "Multi-Domain Operations (MDO)","Joint All-Domain Command & Control (JADC2)",
  "Integrated Deterrence Framework","Pacific Deterrence Initiative (PDI)",
  "Zero Trust Architecture Implementation","AI/ML Enabled Decision Advantage",
  "CMMC 2.0 Implementation Status","PPBE Reform Initiative",
  "Electromagnetic Spectrum Operations (EMSO)","Counter-UAS Strategy",
  "Hypersonic Weapons Program Update","Space Domain Awareness (SDA)",
  "Nuclear Command, Control & Communications (NC3)","Operational Energy Strategy",
  "Contested Logistics in A2/AD Environments","Mission Partner Environment (MPE)",
  "Digital Engineering Ecosystem Strategy","Microelectronics Supply Chain Security",
  "Quantum Information Science Roadmap","CBRN Defense Modernization",
  "Force Design 2030 Update","Readiness Recovery Framework",
  "Long-Range Precision Fires (LRPF)","Next-Gen Air Dominance (NGAD)",
  "Autonomous Systems Integration","5G/Open RAN Military Applications",
  "Integrated Air & Missile Defense (IAMD)","Joint Fires Network (JFN)",
  "Theater Posture & Force Laydown","Combatant Commander Posture Review",
  "Strategic Sealift Recapitalization","Arctic Defense Strategy",
  "Software Acquisition Pathway Reform","Cloud Migration & Data Architecture",
  "Joint Concept for Competing (JCC)","Supply Chain Risk Management (SCRM)",
  "Unmanned Systems Integration Roadmap","Advanced Battle Management System (ABMS)",
  "Joint Warfighting Concept (JWC)","Gray Zone Operations Framework",
  "Information Advantage Strategy","Rapid Defense Experimentation Reserve (RDER)",
  "Global Posture Review Implementation","Munitions Industrial Base Expansion",
  "Electronic Warfare Modernization","Cyber Mission Force Readiness",
];
const FB_ORGS = [
  "OUSD(R&E)","DARPA","OSD","JS J-6","DISA","CYBERCOM","STRATCOM","INDOPACOM",
  "EUCOM","CENTCOM","TRANSCOM","SOCOM","SPACECOM","DIA","NSA/CSS","NGA","DCSA",
  "CAPE","USD(P)","USD(A&S)","AFLCMC","PEO IEW&S","NAVAIR","NAVSEA","MARCORSYSCOM",
  "JSOC","PEO STRI","PEO Soldier","NAVWAR","AFMC","TRADOC","AMC","MDA","DTRA",
  "JFHQ-C","CISA","CDAO","DCMA","DLA",
];
const FB_BUZZWORDS = [
  "synergy","interoperability","lethality","readiness","resilience","overmatch",
  "decision superiority","kill chain","sensor-to-shooter","cross-domain",
  "multi-domain","all-domain","warfighting","battlespace","effects-based",
  "capability gap","materiel solution","enterprise","ecosystem","framework",
  "architecture","posture","throughput","fusion","convergence","integration",
  "decision advantage","information dominance","battle management","DevSecOps",
  "zero trust","mesh network","edge computing","digital twin","data fabric",
  "mission thread","kill web","fires network","decision calculus","cognitive EW",
  "operational reach","force projection","deterrent posture","mission engineering",
  "model-based systems engineering","digital thread","rapid prototyping",
  "agile acquisition","middle-tier acquisition","software factory",
  "data-centric warfare","algorithmic warfare","human-machine teaming",
  "autonomous maneuver","distributed operations","contested environment",
  "situational awareness","common operating picture","mission command",
];
const FB_ACRONYMS = [
  {a:"JADC2",e:"Joint All-Domain Command & Control"},
  {a:"DOTMLPF-P",e:"Doctrine, Organization, Training, Materiel, Leadership, Personnel, Facilities, Policy"},
  {a:"JCIDS",e:"Joint Capabilities Integration & Development System"},
  {a:"IOC",e:"Initial Operational Capability"},{a:"FOC",e:"Full Operational Capability"},
  {a:"PPBE",e:"Planning, Programming, Budgeting & Execution"},
  {a:"FYDP",e:"Future Years Defense Program"},
  {a:"RDT&E",e:"Research, Development, Test & Evaluation"},
  {a:"EMD",e:"Engineering & Manufacturing Development"},
  {a:"LRIP",e:"Low-Rate Initial Production"},{a:"FRP",e:"Full-Rate Production"},
  {a:"AoA",e:"Analysis of Alternatives"},
  {a:"C4ISR",e:"Command, Control, Communications, Computers, Intelligence, Surveillance & Reconnaissance"},
  {a:"ISR",e:"Intelligence, Surveillance & Reconnaissance"},
  {a:"CONOPS",e:"Concept of Operations"},{a:"BDA",e:"Battle Damage Assessment"},
  {a:"RMF",e:"Risk Management Framework"},{a:"ATO",e:"Authority to Operate"},
  {a:"CMMC",e:"Cybersecurity Maturity Model Certification"},
  {a:"MDA",e:"Milestone Decision Authority"},{a:"DAE",e:"Defense Acquisition Executive"},
  {a:"PEO",e:"Program Executive Officer"},{a:"APB",e:"Acquisition Program Baseline"},
  {a:"MDAP",e:"Major Defense Acquisition Program"},{a:"ACAT",e:"Acquisition Category"},
  {a:"CDD",e:"Capability Development Document"},{a:"ICD",e:"Initial Capabilities Document"},
  {a:"KPP",e:"Key Performance Parameter"},{a:"KSA",e:"Key System Attribute"},
  {a:"OT&E",e:"Operational Test & Evaluation"},{a:"DT&E",e:"Developmental Test & Evaluation"},
  {a:"JROC",e:"Joint Requirements Oversight Council"},{a:"DAB",e:"Defense Acquisition Board"},
  {a:"SLRG",e:"Senior Leader Review Group"},{a:"IPT",e:"Integrated Product Team"},
  {a:"PDR",e:"Preliminary Design Review"},{a:"CDR",e:"Critical Design Review"},
  {a:"TRR",e:"Test Readiness Review"},{a:"TEMP",e:"Test & Evaluation Master Plan"},
  {a:"SATCOM",e:"Satellite Communications"},{a:"EMSO",e:"Electromagnetic Spectrum Operations"},
  {a:"SIGINT",e:"Signals Intelligence"},{a:"HUMINT",e:"Human Intelligence"},
  {a:"GEOINT",e:"Geospatial Intelligence"},{a:"OSINT",e:"Open Source Intelligence"},
  {a:"SCI",e:"Sensitive Compartmented Information"},{a:"SAP",e:"Special Access Program"},
  {a:"CJADC2",e:"Combined Joint All-Domain Command and Control"},
  {a:"FCA",e:"Functional Configuration Audit"},{a:"PCA",e:"Physical Configuration Audit"},
  {a:"SVR",e:"System Verification Review"},{a:"SDD",e:"System Development & Demonstration"},
  {a:"MASINT",e:"Measurement & Signature Intelligence"},
];
const FB_VERBS = [
  "Accelerate","Enhance","Modernize","Integrate","Synchronize","Optimize",
  "Transform","Leverage","Operationalize","Institutionalize","Deliver",
  "Establish","Maintain","Resource","Prioritize","Execute","Field",
  "Transition","Mature","Sustain","Divest","Realign","Consolidate",
  "Implement","Posture","Assess","Validate","Certify","Federate",
];
const FB_OBJECTS = [
  "across the enterprise","IAW policy guidance","NLT FY27","within the FYDP",
  "to close capability gaps","through iterative development",
  "via agile acquisition pathways","in support of NDS objectives",
  "aligned with CCMD priorities","to achieve decision superiority",
  "per SECDEF direction","as directed by Congress",
  "leveraging allied capabilities","in coordination with interagency partners",
  "across all echelons","within existing authorities",
  "consistent with DODI 5000.02","per the Adaptive Acquisition Framework",
  "in a contested, degraded & operationally-limited environment",
];
const FB_PHRASES = [
  "BLUF: This program remains on track with minor schedule risk due to supply chain constraints",
  "The threat has evolved faster than our acquisition timeline — must accelerate fielding",
  "Without additional FY26 funding, IOC will slip to 3QFY28 (12-month delay)",
  "Current approach delivers 80% solution at 60% of lifecycle cost vs. legacy system",
  "Operational testing reveals performance exceeds threshold in 14 of 16 KPPs",
  "NOTE: Unfunded requirement of $47.3M in FY27-28 for LRIP Lots 3-4",
  "Risk: Single-source vendor for critical component (DMEA mitigation in progress)",
  "Recommended COA: Option 2 — phased fielding with spiral development",
  "Congressional interest remains high — anticipate HASC/SASC staffer visit 2Q FY26",
  "Key decision: MDA must approve MS C NLT 15 MAR to maintain schedule",
  "Integration testing with legacy C2 systems remains the critical path item",
  "Three-star engagement required to resolve joint equities across Services",
  "Software sprint velocity improved 340% since adopting DevSecOps practices",
  "Cyber survivability assessment complete — 3 CAT I findings require remediation",
];

// ============================================================
// CORPUS WRAPPER
// ============================================================
function buildSource(corpus) {
  const has = !!corpus;
  const ct = corpus?.terms || [];
  const cv = corpus?.type_vocab || {};
  const cTitles = corpus?.titles || [];
  const cAcr = corpus?.acronyms || [];
  const cPal = corpus?.palettes || [];
  const cSamp = corpus?.samples || {};
  // Filter out garbage unicode from extracted corpus
  const clean = ct.filter(t => t.trim().length > 2 && !/[\u0080-\uffff]{3,}/.test(t));
  const terms = clean.length > 20 ? clean : [...clean, ...FB_BUZZWORDS];
  const titles = cTitles.length > 10 ? cTitles : [...cTitles, ...FB_TOPICS];
  const acronyms = cAcr.length > 10 ? cAcr : [...cAcr, ...FB_ACRONYMS];

  function makeBullet() {
    if (has && cv.bullets?.length > 10) {
      const b = cv.bullets.filter(t => t.trim().length > 2);
      if (b.length > 10) return `${pick(FB_VERBS)} ${pick(b)} ${pick(b)} ${pick(FB_OBJECTS)} — ${pick(b)}`;
    }
    return `${pick(FB_VERBS)} ${pick(terms)} ${pick(FB_OBJECTS)}`;
  }
  function makePhrase() { return pick(FB_PHRASES); }
  function makeSlideTitle(type) {
    if (has && cv[type]?.length > 5) {
      const t = pick(cv[type]).trim();
      if (t.length > 2) return t.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
    return null;
  }
  function getSample(type) { return (has && cSamp[type]?.length > 0) ? pick(cSamp[type]) : null; }
  function getPalette() { return cPal.length > 0 ? pick(cPal) : null; }
  function getAcronyms(n) { return pickN(acronyms, n).map(a => typeof a === "string" ? a : a.a); }
  return { has, topics: titles, terms, acronyms, orgs: FB_ORGS, makeBullet, makePhrase, makeSlideTitle, getSample, getPalette, getAcronyms, stats: corpus?.stats || null };
}

// ============================================================
// CONSTANTS
// ============================================================
const CLASSIFICATIONS = [
  {label:"UNCLASSIFIED",color:"#00a651"},{label:"UNCLASSIFIED // FOUO",color:"#00a651"},
  {label:"CUI",color:"#502b85"},{label:"CONFIDENTIAL",color:"#0033a0"},
  {label:"SECRET",color:"#c8102e"},{label:"TOP SECRET",color:"#ff8c00"},
  {label:"TOP SECRET // SCI",color:"#ff8c00"},
];
const NAMES = ["Smith","Johnson","Williams","Brown","Davis","Miller","Wilson","Moore","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Garcia","Martinez","Robinson","Clark","Allen","Young","King","Wright","Scott","Green","Adams","Baker","Nelson","Carter","Mitchell","Roberts","Turner","Phillips","Campbell","Parker","Evans","Collins","Stewart","Morris","Rogers","Reed","Cook","Morgan","Bell","Murphy","Bailey","Rivera","Cooper","Cox","Howard","Ward","Torres","Peterson","Gray","Ramirez","Watson","Brooks","Kelly","Sanders","Price","Bennett","Wood","Barnes","Ross"];
const RANKS = ["COL","CAPT","BG","RADM","MG","VADM","Mr.","Ms.","Dr.","SES","GS-15","LTC","CDR","LtCol","Maj","LCDR","CW5","CMSgt"];
const ARROW_WORDS = ["Enables","Informs","Drives","Supports","Feeds","Shapes","Accelerates","Synchronizes","Integrates","Operationalizes","Triggers","Validates","Directs"];
const C = { navy:"#0a1628",blue:"#003366",red:"#c8102e",gold:"#ffd700",armyGreen:"#4b5320",navyBlue:"#003b6f",airForce:"#00308f",teal:"#008080",purple:"#663399",orange:"#ff6600",maroon:"#800000",olive:"#6b8e23",steel:"#4682b4",slate:"#2f4f4f",charcoal:"#36454f",forest:"#228b22" };
const BRANCH_STYLES = [
  { bg:"#4b5320", accent:"#ffd700" }, // Army
  { bg:"#003b6f", accent:"#ffd700" }, // Navy
  { bg:"#00308f", accent:"#b0c4de" }, // Air Force
  { bg:"#8b0000", accent:"#ffd700" }, // Marines
  { bg:"#0b3d91", accent:"#c0c0c0" }, // Space Force
  { bg:"#003366", accent:"#ffd700" }, // OSD
  { bg:"#1a1a2e", accent:"#c8102e" }, // Joint
];

// ============================================================
// UTILITIES
// ============================================================
const pick = a => a[Math.floor(Math.random() * a.length)];
const pickN = (a, n) => [...a].sort(() => Math.random() - .5).slice(0, Math.min(n, a.length));
const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const dateStr = () => { const d = new Date(), m = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]; return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`; };
const fyStr = () => `FY${ri(25,30)}`;

function getSlideColors(src) {
  const p = src.getPalette();
  if (p && p.length >= 3) return { primary:p[0], secondary:p[1], accent:p[2], all:p };
  const d = [C.blue,C.red,C.armyGreen,C.navyBlue,C.airForce,C.teal,C.purple,C.orange,C.maroon,C.steel];
  return { primary:pick(d), secondary:pick(d), accent:pick(d), all:d };
}

// ============================================================
// SLIDE DATA GENERATORS
// ============================================================
function genTitle(topic, org, cls, src) {
  const acrs = src.getAcronyms(2);
  const branch = pick(BRANCH_STYLES);
  return { type:"title", cls, topic, org, date:dateStr(), branch,
    subtitle: pick([`Quarterly Program Review — ${org}`,`Flag Officer / SES Briefing — ${org}`,`${acrs[0]||"SECDEF"} Decision Brief — ${org}`,`Program Status Update — ${org}`,`Milestone Decision Review — ${org}`,`${acrs[1]||"JROC"} Interest Item — ${org}`,`Congressional Notification Brief — ${org}`,`${org} Semi-Annual Business Review`,`OSD-Level Decision Memorandum — ${org}`]),
    caveat: pick(["PREDECISIONAL — NOT FOR RELEASE","DRAFT — FOR DISCUSSION PURPOSES ONLY","CLOSE HOLD — DO NOT DISTRIBUTE","PRE-DECISIONAL WORKING PAPER","DELIBERATIVE PROCESS — PRIVILEGED","NOT RELEASABLE TO FOREIGN NATIONALS","FOUO — DISTRIBUTION TO DOD COMPONENTS ONLY","CUI // FEDCON"]),
  };
}
function genAgenda(cls, topics, src) {
  return { type:"agenda", cls, items: topics.map((t, i) => ({ num:i+1, title:t, time:`${ri(5,20)} min`, speaker:`${pick(RANKS)} ${pick(NAMES)}` })) };
}
function genBullets(cls, _org, src) {
  const colors = getSlideColors(src);
  const corpusTitle = src.makeSlideTitle("bullets");
  const defaultTitles = ["Key Findings","Way Ahead","Challenges & Mitigations","Lines of Effort","Strategic Imperatives","Decision Points","Risk Assessment","Programmatic Concerns","Operational Impacts","Resource Requirements","Capability Gaps & Solutions","Commander's Priorities","Issues for Resolution","Bottom Line Up Front (BLUF)","Current State Assessment"];
  const bullets = Array.from({ length: ri(4, 9) }, () => src.makeBullet());
  const bluf = pick(FB_PHRASES);
  const style = pick(["standard","dense","callout","twoColumn"]);
  return { type:"bullets", cls, title:corpusTitle||pick(defaultTitles), bullets, bluf, colors, style };
}
function genTimeline(cls, _org, src) {
  const corpusTitle = src.makeSlideTitle("timeline");
  const phases = pickN(["MSA","TMRR","EMD","LRIP","IOT&E","FRP","FOC","Milestone A","Milestone B","Milestone C","PDR","CDR","SRR","SFR","TRR","SVR","FCA","PCA","Phase 0","Phase 1","Phase 2","Phase 3","Sprint 1-4","Sprint 5-8","PI 1","PI 2","Tech Maturation","Eng & Mfg Dev","Production & Deploy","IOC Decision","DAES Review"], ri(5, 10));
  const fy = ri(24, 30);
  const colors = getSlideColors(src);
  const ca = colors.all.length>=5?colors.all:[C.blue,C.red,C.armyGreen,C.navyBlue,C.airForce,C.teal,C.purple,C.orange];
  return { type:"timeline", cls, title:corpusTitle||pick(["Program Schedule","Milestone Timeline","Acquisition Strategy Timeline","Implementation Roadmap","Transition Plan","Master Schedule — Critical Path","Integrated Master Schedule (IMS) Summary"]), phases:phases.map((p,i)=>({name:p,fy:`FY${fy+Math.floor(i*0.7)}`,color:ca[i%ca.length]})) };
}
function genMatrix(cls, _org, src) {
  const corpusTitle = src.makeSlideTitle("matrix");
  const rs = src.has?src.terms:FB_BUZZWORDS;
  const rows = pickN(rs, ri(4,7));
  if(src.has&&Math.random()>.5){src.getAcronyms(2).forEach((a,i)=>{if(i<rows.length)rows[i]=a;});}
  const cols = pickN(["Cost","Schedule","Performance","Technical","Programmatic","Operational","Cyber","Supply Chain","Workforce","Integration"],ri(3,6));
  const s = ["green","yellow","red","grey"];
  return { type:"matrix", cls, title:corpusTitle||pick(["Risk Assessment Matrix","DOTMLPF-P Analysis","Capability Assessment","Gap Analysis","Threat Matrix","Readiness Dashboard","Stoplight Chart","Program Health Indicators"]), rows, cols, grid:rows.map(()=>cols.map(()=>pick(s))) };
}
function genOrgChart(cls, org, src) {
  const corpusTitle = src.makeSlideTitle("orgchart");
  const db = ["SECDEF","DEPSECDEF","USD(R&E)","USD(A&S)","USD(P)","USD(I&S)","CJCS","VCJCS","Service Chiefs","CCMDs","PEO","PM","DPM","Chief Engineer","Test Director","IPT Lead","DAE","MDA","CIO","CDO","CDAO","CTO","CISO",org,"CAPE","DOT&E"];
  let boxes = pickN(db, ri(7,13));
  if(src.has){src.getAcronyms(3).forEach(a=>{if(boxes.length<14)boxes.push(a);});}
  return { type:"orgchart", cls, org, title:corpusTitle||pick(["Organizational Structure","Command Relationships","Governance Framework","Program Office Organization","Enterprise Governance","Decision Authority Chain"]), boxes };
}
function genFlowchart(cls, _org, src) {
  const corpusTitle = src.makeSlideTitle("flowchart");
  const dn = ["SENSOR","C2 NODE","FIRES","EFFECTS","BDA","ISR","INTEL FUSION","TARGETING","COA DEV","JIPOE","PED","DISSEM","FEEDBACK","AI/ML ENGINE","CLOUD","EDGE NODE","GATEWAY","DATA LAKE","ANALYTICS","DECISION AID","HUMAN-IN-LOOP","COMMS","EW","SIGINT","CYBER","RELAY","FUSION CENTER"];
  let nodes = pickN(dn, ri(7,12));
  if(src.has){src.getAcronyms(4).forEach((a,i)=>{if(i<nodes.length)nodes[i]=a;});}
  const chaosLevel = pick(["normal","spaghetti","insane"]);
  return { type:"flowchart", cls, title:corpusTitle||pick(["Process Flow","Decision Framework","Kill Chain Integration","Sensor-to-Shooter Loop","Data Flow Architecture","C2 Architecture","System-of-Systems Architecture"]), nodes, chaosLevel };
}
function genBudget(cls, _org, src) {
  const corpusTitle = src.makeSlideTitle("budget");
  const years = Array.from({length:6},(_,i)=>`FY${25+i}`);
  const cats = pickN(["RDT&E","Procurement","O&M","MILPERS","MILCON","BA 1 - Basic Research","BA 2 - Applied Research","BA 3 - ATD","BA 5 - System Dev & Demo","BA 7 - Operational Sys Dev","Contract Support","Gov FTE","Travel","Test & Eval","Sustainment","Classified Programs"],ri(4,8));
  return { type:"budget", cls, title:corpusTitle||pick(["Resource Summary ($ in Millions)","FYDP Funding Profile","Budget Overview — PB vs Enacted","Financial Execution Status","Spend Plan vs Actuals","POM Submission Overview"]), years, data:cats.map(c=>({name:c,values:years.map(()=>(Math.random()*500+10).toFixed(1))})) };
}
function genVenn(cls, _org, src) {
  let circles = pickN(["CYBER","SPACE","AIR","LAND","SEA","EW/EMSO","INFO OPS","INTEL","FIRES","C2","LOGISTICS","ISR","AI/ML","CLOUD","5G","ELECTRONIC WARFARE"],3);
  if(src.has){src.getAcronyms(2).forEach((a,i)=>{if(i<circles.length)circles[i]=a;});}
  let center = pick(["DECISION ADVANTAGE","OVERMATCH","LETHALITY","CONVERGENCE","INTEGRATED DETERRENCE","MULTI-DOMAIN EFFECTS"]);
  if(src.has&&src.terms.length>20) center=pick(src.terms).toUpperCase();
  return { type:"venn", cls, title:pick(["Convergence of Capabilities","Integration Framework","Multi-Domain Synergy","Cross-Functional Dependencies","Joint Force Integration Concept"]), circles, center };
}

// === NEW SLIDE TYPES ===
function genWallOfText(cls, _org, src) {
  const title = pick(["Policy Background & Statutory Authority","Legislative History & Compliance","Strategic Context & Threat Assessment","Detailed Technical Approach","Program Background & Operational Need","Acquisition Strategy Rationale","Risk Mitigation Details","Interagency Coordination Summary"]);
  const paragraphs = Array.from({length:ri(3,5)},()=>{
    const sentences = Array.from({length:ri(3,6)},()=>{
      const acr=src.getAcronyms(ri(1,3)), t=pickN(src.terms,3);
      return pick([
        `The ${pick(acr)} program ${pick(FB_VERBS).toLowerCase()}s ${pick(t)} ${pick(FB_OBJECTS)}, consistent with ${pick(acr)} guidance.`,
        `Per DODI 5000.02, the ${pick(FB_ORGS)} has directed all ${pick(t)} activities be ${pick(FB_VERBS).toLowerCase()}d through the Adaptive Acquisition Framework.`,
        `In accordance with 10 USC sec${ri(100,9999)}, the ${pick(FB_ORGS)} shall ${pick(FB_VERBS).toLowerCase()} ${pick(t)} capabilities NLT ${fyStr()}.`,
        `Analysis indicates ${pick(t)} gaps in the ${pick(acr)} portfolio require ${pick(["immediate","phased","iterative","spiral"])} solutions ${pick(FB_OBJECTS)}.`,
        `Ref: ${pick(["SECDEF Memo","CJCS Instruction","Service Policy Letter","VCJCS Tasker"])} dated ${ri(1,28)} ${pick(["JAN","MAR","JUN","SEP","NOV"])} ${ri(2023,2025)}, Subject: ${pick(t)} Requirements.`,
      ]);
    });
    return sentences.join(" ");
  });
  const footnotes = Array.from({length:ri(2,4)},(_,i)=>`${i+1}. ${pick(["See","Ref","Per","IAW"])} ${pick(["DODI 5000.02","10 USC 2366b","CJCSI 3170.01","DFARS 252.227","OMB Circular A-11","DoDI 8510.01","AR 70-1","AFI 63-101"])} (${pick(["as amended","current edition","dtd "+ri(1,28)+" "+pick(["JAN","MAR","JUL","OCT"])+" "+ri(2022,2025)])})`);
  return { type:"wallOfText", cls, title, paragraphs, footnotes };
}
function genComparison(cls, _org, src) {
  const options = pickN(["COA 1","COA 2","COA 3","Option A","Option B","Option C","Current Approach","Alternative 1","Alternative 2","Do Nothing"],ri(2,4));
  const criteria = pickN(["Cost ($M)","Schedule (months)","Performance","Risk Level","Political Feasibility","Technical Maturity","Workforce Impact","Interoperability","Sustainment Cost","Coalition Support","Congressional Support","Industrial Base"],ri(4,7));
  const recommended = ri(0,options.length-1);
  return { type:"comparison", cls, title:pick(["Course of Action Analysis","AoA Summary","Alternatives Comparison","Trade Space Analysis","Decision Matrix","Options for SECDEF Decision"]), options, criteria, recommended, data:criteria.map(()=>options.map(()=>pick(["HIGH","MED","LOW","$47M","$123M","$89M","12 mo","24 mo","36 mo","TRL 7","TRL 5","TRL 3","GREEN","YELLOW","RED"]))) };
}
function genSpiderChart(cls, _org, src) {
  const axes = pickN(["Lethality","Survivability","Sustainability","Mobility","C2","Interoperability","Readiness","Modernization","Capacity","Cyber Resilience","EW Capability","ISR Coverage","Logistics","Training","Manning"],ri(5,8));
  const series = [{name:pick(["Current","Baseline","FY25"]),color:C.blue},{name:pick(["Objective","Required","FY28"]),color:C.red}];
  if(Math.random()>.5) series.push({name:pick(["Threshold","Planned","FY27"]),color:C.armyGreen});
  return { type:"spiderChart", cls, title:pick(["Capability Assessment","Force Readiness Profile","System Performance vs Requirements","Gap Analysis — Current vs Objective","Warfighting Function Assessment"]), axes, series:series.map(s=>({...s,values:axes.map(()=>ri(20,100))})) };
}
function genConops(cls, _org, src) {
  const phases = pickN(["Phase 0: Shape","Phase I: Deter","Phase II: Seize Initiative","Phase III: Dominate","Phase IV: Stabilize","Phase V: Enable Civil Authority","Pre-Conflict Posture","Crisis Response","Combat Operations","Transition"],ri(3,5));
  const elements = pickN(["Carrier Strike Group","MEU","BCT","SFAB","SOF","AWACS","B-21","F-35","MQ-9","Cyber Team","Space Ops","THAAD","Patriot","HIMARS","Gray Eagle","Triton","P-8A","DDG","SSN","CV/CVN","ARG"],ri(5,8));
  return { type:"conops", cls, title:pick(["Concept of Operations","Operational Overview","Phased Campaign Plan","Theater Campaign Concept","CONOPS Overlay"]), phases, elements };
}
function genAcronymSlide(cls, _org, src) {
  const acrs = pickN(src.acronyms, ri(10,20));
  return { type:"acronymSlide", cls, title:pick(["Acronym Reference","Glossary of Terms","Abbreviations & Definitions","Key Terminology"]), acronyms:acrs.map(a=>typeof a==="string"?{a,e:"See referenced document"}:a) };
}
function genWaterfall(cls, _org, src) {
  const items = [{name:`FY${ri(24,25)} Enacted`,value:ri(500,2000),type:"start"}];
  pickN([{name:"Congressional Adds",value:ri(10,200),type:"up"},{name:"Reprogramming",value:-ri(10,80),type:"down"},{name:"Sequestration Risk",value:-ri(50,300),type:"down"},{name:"Unfunded Requirements",value:ri(50,400),type:"up"},{name:"OUSD(C) Adjustment",value:-ri(20,100),type:"down"},{name:"POM Addition",value:ri(30,250),type:"up"},{name:"Below Threshold Reprog",value:-ri(5,50),type:"down"},{name:"Service Offset",value:-ri(10,150),type:"down"},{name:"OCO Transfer",value:ri(20,100),type:"up"},{name:"New Start Funding",value:ri(40,200),type:"up"}],ri(4,7)).forEach(x=>items.push(x));
  let running=items[0].value; items.slice(1).forEach(it=>{running+=it.value;}); items.push({name:`FY${ri(26,28)} Request`,value:running,type:"total"});
  return { type:"waterfall", cls, title:pick(["Budget Build Walk","Funding Delta Analysis","POM-to-Budget Bridge","Resource Adjustment Summary"]), items };
}
function genQuestions(cls) { return { type:"questions", cls, title:pick(["QUESTIONS?","DISCUSSION","QUESTIONS / DISCUSSION","Q&A"]) }; }
function genBackup(cls) { return { type:"backup", cls }; }

// ============================================================
// DECK GENERATOR
// ============================================================
function generateDeck(corpus) {
  const src = buildSource(corpus);
  const topic = pick(src.topics), org = pick(src.orgs), cls = pick(CLASSIFICATIONS);
  const count = ri(10,17);
  const gens = [genBullets,genTimeline,genMatrix,genOrgChart,genFlowchart,genBudget,genVenn,genBullets,genMatrix,genBullets,genWallOfText,genComparison,genSpiderChart,genConops,genWaterfall,genAcronymSlide,genBullets];
  const slides = [genTitle(topic,org,cls,src)];
  if(Math.random()>.3){const at=pickN(src.topics,ri(4,7)).map(t=>typeof t==="string"?t.split("(")[0].trim():t);slides.push(genAgenda(cls,at,src));}
  const usedTypes = new Set();
  while(slides.length<count-2){const gen=pick(gens);const slide=gen(cls,org,src);if(usedTypes.has(slide.type)&&slide.type!=="bullets"&&slide.type!=="matrix"&&Math.random()>.3)continue;usedTypes.add(slide.type);slides.push(slide);}
  slides.push(genQuestions(cls));
  if(Math.random()>.4) slides.push(genBackup(cls));
  if(Math.random()>.6) slides.splice(-1,0,genAcronymSlide(cls,org,src));
  return { topic,org,cls,slides,corpusUsed:src.has,corpusStats:src.stats };
}

// ============================================================
// SHARED RENDERER COMPONENTS
// ============================================================
const Banner = ({cls,pos}) => (<div style={{position:"absolute",[pos]:0,left:0,right:0,background:cls.color,color:"#fff",textAlign:"center",fontSize:9,fontWeight:900,fontFamily:"'Courier New',monospace",letterSpacing:3,padding:"2px 0",zIndex:10}}>{cls.label}</div>);

const Frame = ({children,cls,bg,texturize}) => {
  const textures = ["repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(255,255,255,.02) 35px,rgba(255,255,255,.02) 70px)","repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(0,0,0,.02) 20px,rgba(0,0,0,.02) 21px)","radial-gradient(circle at 10% 20%,rgba(0,0,0,.03) 0%,transparent 60%)","none"];
  return (<div style={{position:"relative",width:"100%",aspectRatio:"16/9",background:bg||"#fff",border:`2px solid ${cls.color}`,overflow:"hidden",fontFamily:"'Arial','Helvetica',sans-serif",boxShadow:"0 4px 24px rgba(0,0,0,0.25)"}}><Banner cls={cls} pos="top"/><Banner cls={cls} pos="bottom"/>{texturize&&<div style={{position:"absolute",inset:0,background:pick(textures),pointerEvents:"none",zIndex:1}}/>}<div style={{position:"absolute",top:15,left:0,right:0,bottom:15,overflow:"hidden",zIndex:2}}>{children}</div></div>);
};

const Seal = ({size=44,style:s={},variant}) => {
  const v=variant||pick(["dod","star","shield"]);
  const inner=v==="star"?"\u2605":v==="shield"?"\u2B1F":"DoD";
  return (<div style={{width:size,height:size,borderRadius:"50%",border:"2px solid #003366",background:"radial-gradient(circle,#003366 25%,#0a5c99 60%,#003366)",display:"flex",alignItems:"center",justifyContent:"center",color:"#ffd700",fontWeight:900,fontSize:size*.22,fontFamily:"Georgia,serif",boxShadow:"0 2px 10px rgba(0,0,0,.4),inset 0 1px 3px rgba(255,215,0,.2)",textShadow:"0 1px 2px rgba(0,0,0,.5)",...s}}>{inner}</div>);
};

const SlideTitle = ({title,color=C.blue}) => (<div style={{fontSize:14,fontWeight:900,color,borderBottom:`3px solid ${color}`,paddingBottom:5,marginBottom:10,textTransform:"uppercase",letterSpacing:.5,lineHeight:1.2}}>{title}</div>);
const Footer = ({text}) => (<div style={{fontSize:6.5,color:"#999",borderTop:"1px solid #ddd",paddingTop:3,marginTop:"auto",fontStyle:"italic"}}>{text}</div>);
const CornerLogo = () => (<div style={{position:"absolute",top:18,right:8,opacity:.07,fontSize:28,fontWeight:900,fontFamily:"Georgia,serif",color:C.blue,pointerEvents:"none"}}>{pick(["DoD","USA","\u2605"])}</div>);

// ============================================================
// SLIDE RENDERERS
// ============================================================
const RTitle = ({s}) => { const b=s.branch||pick(BRANCH_STYLES); return (
  <Frame cls={s.cls} bg={`linear-gradient(135deg,${b.bg},${b.bg}dd 50%,${b.bg}99)`}>
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:36,position:"relative"}}>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(255,255,255,.015) 35px,rgba(255,255,255,.015) 70px)"}}/>
      <div style={{position:"absolute",top:20,left:12,width:40,height:2,background:b.accent,opacity:.4}}/><div style={{position:"absolute",top:20,left:12,width:2,height:40,background:b.accent,opacity:.4}}/>
      <div style={{position:"absolute",bottom:20,right:12,width:40,height:2,background:b.accent,opacity:.4}}/><div style={{position:"absolute",bottom:20,right:12,width:2,height:40,background:b.accent,opacity:.4}}/>
      <Seal size={48} style={{marginBottom:14}} variant={pick(["dod","star","shield"])}/>
      <div style={{fontSize:19,fontWeight:900,color:"#fff",textAlign:"center",textTransform:"uppercase",letterSpacing:1.5,lineHeight:1.25,textShadow:"0 2px 8px rgba(0,0,0,.6)",maxWidth:"82%"}}>{s.topic}</div>
      <div style={{width:"55%",height:3,background:b.accent,margin:"12px 0",boxShadow:`0 0 14px ${b.accent}66`}}/>
      <div style={{fontSize:10,color:"rgba(255,255,255,.75)",textAlign:"center",textTransform:"uppercase",letterSpacing:1}}>{s.subtitle}</div>
      <div style={{fontSize:9.5,color:"rgba(255,255,255,.5)",marginTop:5}}>{s.date}</div>
      <div style={{position:"absolute",bottom:22,fontSize:7.5,color:"#ff6666",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>{s.caveat}</div>
    </div>
  </Frame>);
};

const RAgenda = ({s}) => (<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title="AGENDA"/><CornerLogo/><div style={{flex:1,display:"flex",flexDirection:"column",gap:3,overflow:"hidden"}}>{s.items.map((it,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 8px",background:i%2===0?"#f0f4f8":"#fff",borderLeft:`4px solid ${i%2===0?C.blue:C.red}`,fontSize:9}}><div style={{width:20,height:20,borderRadius:"50%",background:C.blue,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:9,flexShrink:0}}>{it.num}</div><div style={{flex:1,fontWeight:600,color:"#222",textTransform:"uppercase"}}>{it.title}</div><div style={{color:"#666",fontSize:8,flexShrink:0}}>{it.speaker}</div><div style={{background:C.gold,color:"#000",padding:"1px 7px",fontWeight:700,fontSize:8,borderRadius:2,flexShrink:0}}>{it.time}</div></div>))}</div></div></Frame>);

const RBullets = ({s}) => {
  const ac=s.colors?.primary||pick([C.blue,C.red,C.armyGreen,C.navyBlue,C.airForce]);
  const isTwoCol=s.style==="twoColumn"&&s.bullets.length>=6;
  const isCallout=s.style==="callout";
  const isDense=s.style==="dense";
  const renderBullet=(b,i,fs)=>(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:6,fontSize:fs||9,lineHeight:1.4,color:"#1a1a1a"}}><div style={{width:7,height:7,marginTop:2,flexShrink:0,background:[C.red,C.gold,ac][i%3],transform:"rotate(45deg)"}}/><div><b>{b.split(" ").slice(0,2).join(" ")}</b> {b.split(" ").slice(2).join(" ")}</div></div>);
  if(isTwoCol){const mid=Math.ceil(s.bullets.length/2);return(<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title} color={ac}/><CornerLogo/><div style={{flex:1,display:"flex",gap:16,overflow:"hidden"}}>{[s.bullets.slice(0,mid),s.bullets.slice(mid)].map((col,ci)=>(<div key={ci} style={{flex:1,display:"flex",flexDirection:"column",gap:4}}>{col.map((b,i)=>renderBullet(b,i,8.5))}</div>))}</div><Footer text={`BLUF: ${s.bluf.slice(0,90)}`}/></div></Frame>);}
  return(<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title} color={ac}/><CornerLogo/>{isCallout&&<div style={{background:`${ac}11`,border:`2px solid ${ac}`,borderRadius:4,padding:"5px 10px",marginBottom:8,fontSize:8,color:ac,fontWeight:700}}>{s.bluf.slice(0,100)}</div>}<div style={{flex:1,display:"flex",flexDirection:"column",gap:isDense?3:5,overflow:"hidden"}}>{s.bullets.map((b,i)=>renderBullet(b,i,isDense?8:9))}</div>{!isCallout&&<Footer text={`BLUF: ${s.bluf.slice(0,90)}`}/>}</div></Frame>);
};

const RTimeline = ({s}) => (<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><CornerLogo/><div style={{flex:1,position:"relative",overflow:"hidden"}}><div style={{display:"flex",marginBottom:8,paddingLeft:90}}>{s.phases.map((p,i)=>(<div key={i} style={{flex:1,fontSize:7,color:"#666",fontWeight:700,textAlign:"center"}}>{p.fy}</div>))}</div>{s.phases.map((p,i)=>(<div key={i} style={{display:"flex",alignItems:"center",marginBottom:3,height:22}}><div style={{width:90,fontSize:7,fontWeight:700,color:"#333",textAlign:"right",paddingRight:7,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.name}</div><div style={{flex:1,position:"relative",height:"100%",background:"#f5f5f5"}}><div style={{position:"absolute",left:`${(i/s.phases.length)*100}%`,width:`${Math.max(10,100/s.phases.length)}%`,height:"100%",background:p.color,opacity:.85,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,color:"#fff",fontWeight:700}}>{p.name.length<14?p.name:""}</div><div style={{position:"absolute",left:`${(i/s.phases.length)*100}%`,top:-3,width:8,height:8,background:C.red,transform:"rotate(45deg) translateX(-2px)"}}/></div></div>))}<div style={{position:"absolute",left:`calc(90px + ${ri(18,35)}%)`,top:12,bottom:0,borderLeft:"2px dashed #c8102e"}}><div style={{position:"absolute",top:-12,left:-14,fontSize:7,color:"#c8102e",fontWeight:900}}>{"\u25BC"} TODAY</div></div>{[ri(20,40),ri(55,75)].map((x,i)=>(<div key={i} style={{position:"absolute",left:`calc(90px + ${x}%)`,top:ri(20,60),fontSize:6,color:C.gold,fontWeight:900,transform:"translate(-50%,-50%)",background:"rgba(255,215,0,.15)",padding:"1px 4px",borderRadius:2,border:"1px solid rgba(255,215,0,.3)"}}>{pick(["\u25C6 MS","\u2605 IOC","\u25B2 CDR","\u25CF PDR"])}</div>))}</div></div></Frame>);

const RMatrix = ({s}) => { const sc={green:"#00a651",yellow:"#ffc107",red:"#c8102e",grey:"#999"};const sl={green:"G",yellow:"Y",red:"R",grey:"\u2014"}; return (<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><CornerLogo/><div style={{flex:1,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:8}}><thead><tr><th style={{background:C.blue,color:"#fff",padding:"5px 6px",textAlign:"left",fontSize:7,textTransform:"uppercase"}}>CAPABILITY</th>{s.cols.map((c,i)=>(<th key={i} style={{background:C.blue,color:"#fff",padding:"5px 3px",textAlign:"center",fontSize:7,textTransform:"uppercase",minWidth:36}}>{c}</th>))}<th style={{background:C.blue,color:C.gold,padding:"5px 3px",textAlign:"center",fontSize:7}}>TREND</th></tr></thead><tbody>{s.rows.map((r,ri_)=>(<tr key={ri_}><td style={{padding:"4px 6px",fontWeight:600,background:ri_%2===0?"#f8f9fa":"#fff",borderBottom:"1px solid #e0e0e0",fontSize:7,textTransform:"uppercase"}}>{r}</td>{s.grid[ri_].map((st,ci)=>(<td key={ci} style={{padding:3,background:ri_%2===0?"#f8f9fa":"#fff",borderBottom:"1px solid #e0e0e0",textAlign:"center"}}><div style={{width:20,height:20,borderRadius:"50%",background:sc[st],color:"#fff",fontWeight:900,fontSize:7,display:"inline-flex",alignItems:"center",justifyContent:"center",boxShadow:`0 1px 3px ${sc[st]}44`}}>{sl[st]}</div></td>))}<td style={{padding:3,background:ri_%2===0?"#f8f9fa":"#fff",borderBottom:"1px solid #e0e0e0",textAlign:"center",fontSize:10}}>{pick(["\u2191","\u2192","\u2193","\u2197","\u2198"])}</td></tr>))}</tbody></table></div><div style={{display:"flex",gap:10,marginTop:6,fontSize:7}}>{[["green","On Track"],["yellow","At Risk"],["red","Critical"],["grey","N/A"]].map(([k,v])=>(<div key={k} style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:9,height:9,borderRadius:"50%",background:sc[k]}}/><span>{v}</span></div>))}<div style={{marginLeft:"auto",fontSize:7,color:"#999"}}>As of {dateStr()}</div></div></div></Frame>);};

const ROrgChart = ({s}) => (<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><div style={{flex:1,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",left:"50%",top:4,transform:"translateX(-50%)",width:100,height:30,background:C.blue,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:900,textAlign:"center",border:"2px solid #001a33",borderRadius:3,textTransform:"uppercase",padding:"0 4px",boxShadow:"0 2px 6px rgba(0,0,0,.2)"}}>{s.boxes[0]}</div><div style={{position:"absolute",left:"50%",top:34,width:2,height:16,background:"#999"}}/>{s.boxes.slice(1,4).map((b,i)=>{const t=Math.min(3,s.boxes.length-1);const x=((i+1)/(t+1))*100;return(<div key={i} style={{position:"absolute",left:`${x}%`,top:52,transform:"translateX(-50%)",width:82,height:28,background:C.red,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:6.5,fontWeight:700,textAlign:"center",borderRadius:2,textTransform:"uppercase",padding:"0 3px",boxShadow:"0 1px 4px rgba(0,0,0,.15)"}}>{b}</div>);})}<div style={{position:"absolute",left:`${(1/(Math.min(3,s.boxes.length-1)+1))*100}%`,right:`${100-(Math.min(3,s.boxes.length-1)/(Math.min(3,s.boxes.length-1)+1))*100}%`,top:50,height:2,background:"#999"}}/>{s.boxes.slice(4).map((b,i)=>{const cols=Math.min(s.boxes.length-4,5);const col=i%cols,row=Math.floor(i/cols);const x=((col+1)/(cols+1))*100;return(<div key={i} style={{position:"absolute",left:`${x}%`,top:95+row*36,transform:"translateX(-50%)",width:78,height:26,background:"#f0f4f8",color:C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,fontWeight:700,textAlign:"center",border:`1px solid ${C.blue}`,borderRadius:2,textTransform:"uppercase",padding:"0 2px"}}>{b}</div>);})}{[30,50,70].map((x,i)=>(<div key={i} style={{position:"absolute",left:`${x}%`,top:82,color:"#bbb",fontSize:9,transform:"translateX(-50%)"}}>▼</div>))}<svg style={{position:"absolute",inset:0,pointerEvents:"none",opacity:.15}}>{[0,1].map(i=>(<line key={i} x1={`${ri(10,40)}%`} y1={`${ri(50,90)}%`} x2={`${ri(60,90)}%`} y2={`${ri(50,90)}%`} stroke={C.blue} strokeWidth="1" strokeDasharray="3 3"/>))}</svg></div></div></Frame>);

const RFlowchart = ({s}) => { const colors=[C.blue,C.red,C.armyGreen,C.navyBlue,C.teal,C.purple,C.orange,C.airForce,C.maroon,C.steel]; const isSpaghetti=s.chaosLevel==="spaghetti"||s.chaosLevel==="insane"; return (<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><div style={{flex:1,display:"flex",flexWrap:"wrap",gap:5,alignContent:"flex-start",padding:"6px 0",position:"relative"}}>{s.nodes.map((n,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:i%4===0?72:i%4===2?62:68,height:i%4===0?34:32,background:colors[i%colors.length],color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:6.5,fontWeight:700,textAlign:"center",borderRadius:i%5===0?"50%":i%5===1?0:i%5===2?"4px 0":3,boxShadow:"0 2px 5px rgba(0,0,0,.2)",padding:"2px 3px",textTransform:"uppercase",lineHeight:1.2,border:i%3===0?"2px solid rgba(255,255,255,.3)":"none"}}>{n}</div>{i<s.nodes.length-1&&(<div style={{fontSize:7,color:"#888",fontWeight:700,display:"flex",flexDirection:"column",alignItems:"center",minWidth:44}}><div style={{fontSize:5.5,color:"#aaa",marginBottom:1}}>{pick(ARROW_WORDS)}</div><div style={{fontSize:10}}>{pick(["\u2192","\u21D2","\u279C","\u25BA","\u27F6"])}</div></div>)}</div>))}<svg style={{position:"absolute",inset:0,pointerEvents:"none",opacity:isSpaghetti?.25:.12}}>{Array.from({length:isSpaghetti?ri(6,10):ri(2,4)},(_,i)=>(<line key={i} x1={`${ri(5,45)}%`} y1={`${ri(10,90)}%`} x2={`${ri(55,95)}%`} y2={`${ri(10,90)}%`} stroke={pick([C.red,C.blue,C.armyGreen,C.orange,C.purple])} strokeWidth={isSpaghetti?"2":"1.5"} strokeDasharray={pick(["4 3","6 2","none","2 2"])} markerEnd="url(#ah)"/>))}<defs><marker id="ah" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#c8102e"/></marker></defs></svg>{isSpaghetti&&Array.from({length:ri(2,4)},(_,i)=>(<div key={`lbl-${i}`} style={{position:"absolute",left:`${ri(10,80)}%`,top:`${ri(10,80)}%`,fontSize:6,color:pick([C.red,C.blue,"#666"]),fontWeight:700,background:"rgba(255,255,255,.85)",padding:"1px 4px",borderRadius:2,border:`1px solid ${pick([C.red,C.blue,"#ccc"])}`,transform:`rotate(${ri(-5,5)}deg)`}}>{pick(ARROW_WORDS)} {pick(["Loop","Cycle","Feed","Path"])}</div>))}</div></div></Frame>);};

const RBudget = ({s}) => (<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><div style={{flex:1,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:7}}><thead><tr><th style={{background:C.navy,color:"#fff",padding:"4px 5px",textAlign:"left",fontSize:6.5}}>CATEGORY</th>{s.years.map((y,i)=>(<th key={i} style={{background:C.navy,color:C.gold,padding:"4px 3px",textAlign:"right",fontSize:6.5}}>{y}</th>))}<th style={{background:C.red,color:"#fff",padding:"4px 3px",textAlign:"right",fontSize:6.5}}>TOTAL</th><th style={{background:C.navy,color:C.gold,padding:"4px 3px",textAlign:"center",fontSize:6.5}}>{"\u0394"}</th></tr></thead><tbody>{s.data.map((r,ri_)=>{const total=r.values.reduce((a,b)=>a+ +b,0).toFixed(1);const delta=(Math.random()*40-20).toFixed(1);return(<tr key={ri_}><td style={{padding:"3px 5px",fontWeight:600,background:ri_%2===0?"#f8f9fa":"#fff",borderBottom:"1px solid #e0e0e0",fontSize:6.5,maxWidth:110,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{r.name}</td>{r.values.map((v,vi)=>(<td key={vi} style={{padding:"3px",textAlign:"right",background:ri_%2===0?"#f8f9fa":"#fff",borderBottom:"1px solid #e0e0e0",fontFamily:"'Courier New',monospace",fontSize:6.5}}>{v}</td>))}<td style={{padding:"3px",textAlign:"right",background:ri_%2===0?"#eef2f7":"#f0f4f8",borderBottom:"1px solid #e0e0e0",fontFamily:"'Courier New',monospace",fontSize:6.5,fontWeight:700}}>{total}</td><td style={{padding:"3px",textAlign:"center",background:ri_%2===0?"#f8f9fa":"#fff",borderBottom:"1px solid #e0e0e0",fontFamily:"'Courier New',monospace",fontSize:6.5,fontWeight:700,color:+delta>0?"#00a651":"#c8102e"}}>{+delta>0?"+":""}{delta}%</td></tr>);})}<tr><td style={{padding:"4px 5px",fontWeight:900,background:C.blue,color:"#fff",fontSize:6.5}}>TOTAL</td>{s.years.map((_,yi)=>{const ct=s.data.reduce((a,r)=>a+ +r.values[yi],0).toFixed(1);return <td key={yi} style={{padding:"4px 3px",textAlign:"right",background:C.blue,color:C.gold,fontFamily:"'Courier New',monospace",fontSize:6.5,fontWeight:700}}>{ct}</td>;})}<td style={{padding:"4px 3px",textAlign:"right",background:C.red,color:"#fff",fontFamily:"'Courier New',monospace",fontSize:6.5,fontWeight:900}}>{s.data.reduce((a,r)=>a+r.values.reduce((b,v)=>b+ +v,0),0).toFixed(1)}</td><td style={{padding:"4px 3px",background:C.blue}}/></tr></tbody></table></div><Footer text={`Source: ${pick(["OUSD(C) PB FY26 Submission","SAR Dec 2025","CAPE Estimate","Comptroller Database"])} | Then-Year $M`}/></div></Frame>);

const RVenn = ({s}) => { const cc=["rgba(0,51,102,.55)","rgba(200,16,46,.55)","rgba(0,128,128,.5)"]; return (<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><div style={{flex:1,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>{s.circles.map((l,i)=>{const a=(i*120-90)*(Math.PI/180);const cx=50+Math.cos(a)*14,cy=50+Math.sin(a)*14;return(<div key={i} style={{position:"absolute",left:`${cx-18}%`,top:`${cy-25}%`,width:"36%",aspectRatio:"1",borderRadius:"50%",background:cc[i],border:`2px solid ${cc[i].replace(/[\d.]+\)/,"1)")}`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:"#fff",fontWeight:900,fontSize:10,textAlign:"center",textShadow:"0 1px 4px rgba(0,0,0,.5)",textTransform:"uppercase",transform:`translateY(${i===0?-14:14}px)`}}>{l}</div></div>);})}<div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",background:C.gold,color:C.navy,padding:"5px 11px",fontWeight:900,fontSize:8,textAlign:"center",borderRadius:4,boxShadow:"0 2px 10px rgba(0,0,0,.3)",textTransform:"uppercase",zIndex:5,border:"2px solid #b8860b"}}>{s.center}</div></div></div></Frame>);};

// === NEW SLIDE RENDERERS ===
const RWallOfText = ({s}) => (<Frame cls={s.cls} texturize><div style={{padding:"20px 26px 14px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><div style={{flex:1,overflow:"hidden",columnCount:s.paragraphs.length>3?2:1,columnGap:14,fontSize:7,lineHeight:1.5,color:"#222",textAlign:"justify"}}>{s.paragraphs.map((p,i)=>(<p key={i} style={{marginBottom:6,textIndent:i>0?14:0}}>{p}</p>))}</div><div style={{borderTop:"1px solid #ccc",paddingTop:4,marginTop:4}}>{s.footnotes.map((f,i)=>(<div key={i} style={{fontSize:5.5,color:"#888",lineHeight:1.4}}>{f}</div>))}</div></div></Frame>);

const RComparison = ({s}) => { const oc=[C.blue,C.red,C.armyGreen,C.purple,C.teal]; return (<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><div style={{flex:1,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:7.5}}><thead><tr><th style={{background:"#f0f4f8",padding:"5px 6px",textAlign:"left",fontSize:7,textTransform:"uppercase",borderBottom:"2px solid #ccc"}}>CRITERIA</th>{s.options.map((o,i)=>(<th key={i} style={{background:oc[i%oc.length],color:"#fff",padding:"5px 6px",textAlign:"center",fontSize:7,textTransform:"uppercase",minWidth:60,borderBottom:"2px solid #ccc",position:"relative"}}>{o}{i===s.recommended&&<div style={{position:"absolute",top:-1,right:2,fontSize:6,color:C.gold}}>{"\u2605"}</div>}</th>))}</tr></thead><tbody>{s.criteria.map((c,ri_)=>(<tr key={ri_}><td style={{padding:"4px 6px",fontWeight:600,background:ri_%2===0?"#f8f9fa":"#fff",borderBottom:"1px solid #e0e0e0",fontSize:7}}>{c}</td>{s.data[ri_].map((v,ci)=>(<td key={ci} style={{padding:"4px 6px",textAlign:"center",background:ri_%2===0?"#f8f9fa":"#fff",borderBottom:"1px solid #e0e0e0",fontSize:7.5,fontWeight:600,color:v.includes("RED")?"#c8102e":v.includes("GREEN")?"#00a651":"#333"}}>{v}</td>))}</tr>))}</tbody></table></div><div style={{display:"flex",alignItems:"center",gap:8,marginTop:6,fontSize:7,color:C.blue,fontWeight:700}}><span style={{color:C.gold,fontSize:10}}>{"\u2605"}</span> RECOMMENDED: {s.options[s.recommended]}<span style={{marginLeft:"auto",color:"#999",fontWeight:400}}>{pick(["PM Recommendation","WIPT Consensus","IPT Assessment","AoA Result"])}</span></div></div></Frame>);};

const RSpiderChart = ({s}) => { const cx=140,cy=85,r=65,n=s.axes.length; const pts=(vals)=>vals.map((v,i)=>{const a=(Math.PI*2*i/n)-Math.PI/2;return`${cx+(r*v/100)*Math.cos(a)},${cy+(r*v/100)*Math.sin(a)}`;}).join(" "); const axEnd=(i)=>{const a=(Math.PI*2*i/n)-Math.PI/2;return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)};}; return (<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}><svg viewBox="0 0 280 170" style={{width:"100%",maxHeight:"100%"}}>{[20,40,60,80,100].map(pv=>(<polygon key={pv} points={s.axes.map((_,i)=>{const a=(Math.PI*2*i/n)-Math.PI/2;return`${cx+(r*pv/100)*Math.cos(a)},${cy+(r*pv/100)*Math.sin(a)}`;}).join(" ")} fill="none" stroke="#ddd" strokeWidth=".5"/>))}{s.axes.map((_,i)=>{const e=axEnd(i);return<line key={i} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke="#ccc" strokeWidth=".5"/>;})}{s.series.map((ser,si)=>(<polygon key={si} points={pts(ser.values)} fill={`${ser.color}22`} stroke={ser.color} strokeWidth="1.5" strokeDasharray={si>0?"4 2":"none"}/>))}{s.series.map((ser,si)=>ser.values.map((v,i)=>{const a=(Math.PI*2*i/n)-Math.PI/2;return<circle key={`${si}-${i}`} cx={cx+(r*v/100)*Math.cos(a)} cy={cy+(r*v/100)*Math.sin(a)} r="2" fill={ser.color}/>;}))} {s.axes.map((label,i)=>{const e=axEnd(i);const dx=e.x>cx?4:e.x<cx?-4:0;const dy=e.y>cy?8:-4;return<text key={i} x={e.x+dx} y={e.y+dy} fontSize="5" fill="#333" textAnchor={e.x>cx+5?"start":e.x<cx-5?"end":"middle"} fontWeight="600" style={{textTransform:"uppercase"}}>{label}</text>;})}</svg></div><div style={{display:"flex",gap:12,justifyContent:"center",fontSize:7}}>{s.series.map((ser,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:14,height:3,background:ser.color,borderRadius:1}}/><span style={{fontWeight:600}}>{ser.name}</span></div>))}</div></div></Frame>);};

const RConops = ({s}) => { const pc=[C.blue,C.armyGreen,C.red,C.orange,C.purple]; return (<Frame cls={s.cls} bg="#f0f3f6" texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><div style={{display:"flex",marginBottom:10}}>{s.phases.map((p,i)=>(<div key={i} style={{flex:1,background:pc[i%pc.length],color:"#fff",padding:"5px 8px",fontSize:7,fontWeight:700,textAlign:"center",textTransform:"uppercase",marginRight:i<s.phases.length-1?2:0,clipPath:i<s.phases.length-1?"polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)":"none"}}>{p}</div>))}</div><div style={{flex:1,display:"flex",flexWrap:"wrap",gap:4,alignContent:"flex-start"}}>{s.elements.map((el,i)=>(<div key={i} style={{padding:"4px 8px",background:i%3===0?C.navy:i%3===1?C.maroon:C.steel,color:"#fff",fontSize:7,fontWeight:700,borderRadius:2,display:"flex",alignItems:"center",gap:4,textTransform:"uppercase"}}><span style={{fontSize:10}}>{pick(["\u2B1F","\u25C6","\u25B2","\u25CF","\u2726","\u2B21"])}</span>{el}</div>))}</div><svg style={{position:"absolute",inset:0,pointerEvents:"none",opacity:.12,zIndex:1}}>{Array.from({length:4},(_,i)=>(<line key={i} x1={`${ri(5,30)}%`} y1={`${ri(30,90)}%`} x2={`${ri(70,95)}%`} y2={`${ri(30,90)}%`} stroke={C.red} strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#aco)"/>))}<defs><marker id="aco" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#c8102e"/></marker></defs></svg><Footer text={`Classification Guide: ${pick(["CG-XXXX-20XX","DoDM 5200.01"])} | ${pick(["Prepared by J-5","Prepared by J-3","Source: CCMD OPLAN"])}`}/></div></Frame>);};

const RAcronymSlide = ({s}) => { const cols=s.acronyms.length>12?3:2;const perCol=Math.ceil(s.acronyms.length/cols); return (<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><div style={{flex:1,display:"flex",gap:16,overflow:"hidden"}}>{Array.from({length:cols},(_,ci)=>(<div key={ci} style={{flex:1}}>{s.acronyms.slice(ci*perCol,(ci+1)*perCol).map((acr,i)=>(<div key={i} style={{display:"flex",gap:6,marginBottom:3,fontSize:7.5,lineHeight:1.4}}><span style={{fontWeight:900,color:C.blue,minWidth:50,flexShrink:0}}>{acr.a}</span><span style={{color:"#444"}}>{acr.e}</span></div>))}</div>))}</div></div></Frame>);};

const RWaterfall = ({s}) => { const maxVal=Math.max(...s.items.map(it=>Math.abs(it.value)));const scale=120/(maxVal*1.3);let running=0; return (<Frame cls={s.cls} texturize><div style={{padding:"22px 28px 16px",height:"100%",display:"flex",flexDirection:"column"}}><SlideTitle title={s.title}/><div style={{flex:1,display:"flex",alignItems:"flex-end",gap:3,paddingBottom:20}}>{s.items.map((it,i)=>{const prev=running;if(it.type==="start"||it.type==="total"){running=it.value;const h=Math.abs(it.value)*scale*0.4;return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end"}}><div style={{fontSize:6,fontWeight:700,color:"#333",marginBottom:2}}>${it.value}</div><div style={{width:"80%",height:h,background:it.type==="start"?C.blue:C.navy,borderRadius:"2px 2px 0 0"}}/><div style={{fontSize:5.5,fontWeight:600,color:"#666",marginTop:3,textAlign:"center",maxWidth:60,lineHeight:1.2}}>{it.name}</div></div>);}running=prev+it.value;const h=Math.abs(it.value)*scale*0.4;return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end"}}><div style={{fontSize:6,fontWeight:700,color:it.value>0?"#00a651":"#c8102e",marginBottom:2}}>{it.value>0?"+":""}{it.value}</div><div style={{width:"80%",height:h,background:it.value>0?"#00a651":"#c8102e",borderRadius:2,opacity:.85}}/><div style={{fontSize:5.5,fontWeight:600,color:"#666",marginTop:3,textAlign:"center",maxWidth:60,lineHeight:1.2}}>{it.name}</div></div>);})}</div><Footer text="Source: OUSD(C) | Then-Year $M | Subject to change pending final marks"/></div></Frame>);};

const RQuestions = ({s}) => (<Frame cls={s.cls} bg={`linear-gradient(135deg,${C.navy},${C.blue})`}><div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}><div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(255,255,255,.015) 35px,rgba(255,255,255,.015) 70px)"}}/><Seal size={38} style={{marginBottom:14}}/><div style={{fontSize:28,fontWeight:900,color:"#fff",textTransform:"uppercase",letterSpacing:6,textShadow:"0 2px 10px rgba(0,0,0,.5)"}}>{s.title}</div><div style={{width:"35%",height:3,background:C.gold,margin:"12px 0"}}/><div style={{fontSize:10,color:"#7aa8cc"}}>POC: {pick(RANKS)} {pick(NAMES)} | DSN: {ri(100,999)}-{ri(1000,9999)}</div><div style={{fontSize:8,color:"#5a7a9a",marginTop:4}}>SIPR: {pick(NAMES).toLowerCase()}.{pick(["j","m","r","s","d"])}.{ri(1,9)}@mail.smil.mil</div></div></Frame>);

const RBackup = ({s}) => (<Frame cls={s.cls} bg="repeating-linear-gradient(45deg,#f5f5f5,#f5f5f5 10px,#eee 10px,#eee 20px)"><div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}><div style={{fontSize:26,fontWeight:900,color:C.blue,textTransform:"uppercase",letterSpacing:8,border:`4px solid ${C.blue}`,padding:"18px 44px",background:"rgba(255,255,255,.9)"}}>BACKUP SLIDES</div><div style={{fontSize:8,color:"#999",letterSpacing:2}}>ADDITIONAL DETAIL AS REQUESTED</div></div></Frame>);

// ============================================================
// RENDERER REGISTRY
// ============================================================
const RENDERERS = { title:RTitle,agenda:RAgenda,bullets:RBullets,timeline:RTimeline,matrix:RMatrix,orgchart:ROrgChart,flowchart:RFlowchart,budget:RBudget,venn:RVenn,questions:RQuestions,backup:RBackup,wallOfText:RWallOfText,comparison:RComparison,spiderChart:RSpiderChart,conops:RConops,acronymSlide:RAcronymSlide,waterfall:RWaterfall };
const RenderSlide = ({slide}) => { const R=RENDERERS[slide.type]; return R?<R s={slide}/>:<div>Unknown: {slide.type}</div>; };
const SLIDE_LABELS = { title:"Title",agenda:"Agenda",bullets:"Key Points",timeline:"Timeline",matrix:"Stoplight Chart",orgchart:"Org Chart",flowchart:"Architecture",budget:"Budget Table",venn:"Venn Diagram",questions:"Q&A",backup:"Backup",wallOfText:"Policy Detail",comparison:"COA Analysis",spiderChart:"Capability Assessment",conops:"CONOPS",acronymSlide:"Acronyms",waterfall:"Budget Walk" };

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [deck,setDeck]=useState(null);
  const [cur,setCur]=useState(0);
  const [loading,setLoading]=useState(false);
  const [view,setView]=useState("presenter");
  const [corpusData,setCorpusData]=useState(null);
  const [showSetup,setShowSetup]=useState(false);

  const generate=useCallback(()=>{setLoading(true);setTimeout(()=>{setDeck(generateDeck(corpusData));setCur(0);setLoading(false);},800);},[corpusData]);

  useEffect(()=>{
    const h=e=>{if(!deck)return;if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();setCur(c=>Math.min(c+1,deck.slides.length-1));}if(e.key==="ArrowLeft"){e.preventDefault();setCur(c=>Math.max(c-1,0));}};
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[deck]);

  useEffect(()=>{
    fetch("/api/corpus").then(r=>r.json()).then(d=>{if(d.available)setCorpusData(d.corpus);}).catch(()=>{
      fetch("/corpus/slim_corpus.json").then(r=>r.json()).then(d=>{if(d&&d.terms&&d.terms.filter(t=>t.trim().length>2).length>10)setCorpusData(d);}).catch(()=>{});
    });
  },[]);

  const loadingMsgs=["ASSEMBLING BRIEFING PACKAGE...","CONSULTING JOINT STAFF...","GENERATING ACRONYMS...","ADDING MORE ARROWS...","CLASSIFYING INFORMATION...","SYNERGIZING CAPABILITIES..."];

  return (
    <div style={{minHeight:"100vh",background:"#0d1117",color:"#c9d1d9",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      {/* HEADER */}
      <div style={{background:"linear-gradient(90deg,#0a1628,#162a4a 50%,#0a1628)",borderBottom:"2px solid #1e3a5f",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Seal size={32}/>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#fff",letterSpacing:1,textTransform:"uppercase"}}>Pentagon Briefing Generator</div>
            <div style={{fontSize:8.5,color:"#5a7a9a",letterSpacing:2}}>
              RANDOMLY GENERATED {"\u2022"} NOT REAL
              {corpusData?` \u2022 TRAINED ON ${corpusData.stats?.total_slides||"?"} REAL DoD SLIDES \u2713`:` \u2022 ${FB_ACRONYMS.length} ACRONYMS \u2022 ${Object.keys(RENDERERS).length} SLIDE TYPES`}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {deck&&<><Btn text="Presenter" active={view==="presenter"} onClick={()=>setView("presenter")}/><Btn text="Grid" active={view==="grid"} onClick={()=>setView("grid")}/></>}
          <button onClick={()=>setShowSetup(!showSetup)} style={{padding:"5px 10px",background:"transparent",color:"#5a7a9a",border:"1px solid #1e3a5f",borderRadius:4,cursor:"pointer",fontSize:10}}>{"\u2699"}</button>
          <button onClick={generate} disabled={loading} style={{padding:"7px 18px",background:loading?"#333":"linear-gradient(135deg,#c8102e,#8b0000)",color:"#fff",border:"none",borderRadius:4,fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:1,cursor:loading?"wait":"pointer",boxShadow:loading?"none":"0 2px 10px rgba(200,16,46,.4)"}}>
            {loading?"\u23F3 GENERATING...":deck?"\uD83C\uDFB2 NEW BRIEFING":"\uD83C\uDFB2 GENERATE BRIEFING"}
          </button>
        </div>
      </div>

      {showSetup&&<SetupPanel corpusData={corpusData}/>}

      {/* LANDING */}
      {!deck&&!loading&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"70vh",gap:18,padding:36}}>
          <Seal size={72} style={{boxShadow:"0 0 30px rgba(0,51,102,.5)"}}/>
          <div style={{fontSize:22,fontWeight:800,color:"#fff",textTransform:"uppercase",letterSpacing:3,textAlign:"center"}}>Pentagon Briefing Generator</div>
          <div style={{fontSize:12,color:"#5a7a9a",textAlign:"center",maxWidth:480,lineHeight:1.6}}>
            {corpusData?`Generates DoD-style briefing decks trained on ${corpusData.stats?.total_slides||""} real military presentations.`:`Generates multi-slide DoD-style briefing decks with ${Object.keys(RENDERERS).length} slide types including org charts, risk matrices, CONOPS overlays, budget waterfalls, capability spider charts, and an overwhelming number of acronyms.`}
          </div>
          {corpusData&&<div style={{fontSize:10,color:"#00a651",fontWeight:600}}>{"\u2713"} Corpus loaded: {corpusData.stats?.total_slides} slides from {corpusData.stats?.unique_sources} sources</div>}
          <div style={{display:"flex",gap:8,marginTop:4,flexWrap:"wrap",justifyContent:"center"}}>
            {["Stoplight Charts","Org Charts","CONOPS","Budget Tables","Spider Charts","Waterfall","COA Analysis","Spaghetti Diagrams","Timelines","Venn Diagrams","Wall of Text","Acronym Pages"].map(t=>(<div key={t} style={{fontSize:8,color:"#3a5a7a",background:"#1a2a3a",padding:"2px 8px",borderRadius:10,border:"1px solid #1e3a5f"}}>{t}</div>))}
          </div>
          <button onClick={generate} style={{padding:"11px 32px",marginTop:8,background:"linear-gradient(135deg,#c8102e,#8b0000)",color:"#fff",border:"2px solid #ff3344",borderRadius:6,fontSize:13,fontWeight:800,textTransform:"uppercase",letterSpacing:2,cursor:"pointer",boxShadow:"0 4px 20px rgba(200,16,46,.4)"}}>GENERATE BRIEFING</button>
          <div style={{fontSize:8,color:"#3a4a5a",marginTop:6,letterSpacing:1}}>DISCLAIMER: ALL CONTENT IS RANDOMLY GENERATED FICTION</div>
        </div>
      )}

      {/* LOADING */}
      {loading&&(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:14}}><div style={{width:44,height:44,border:"3px solid #1e3a5f",borderTop:"3px solid #ffd700",borderRadius:"50%",animation:"spin 1s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{color:"#5a7a9a",fontSize:11,letterSpacing:2}}>{pick(loadingMsgs)}</div></div>)}

      {/* PRESENTER VIEW */}
      {deck&&!loading&&view==="presenter"&&(
        <div style={{padding:"16px 20px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:11,color:"#5a7a9a"}}><span style={{color:deck.cls.color,fontWeight:700}}>{deck.cls.label}</span>{" \u2022 "}{deck.org}{" \u2022 "}{deck.slides.length} slides{deck.corpusUsed&&<span style={{color:"#00a651"}}> {"\u2022"} corpus-trained</span>}</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}><NavBtn text="\u25C0 PREV" disabled={cur===0} onClick={()=>setCur(c=>c-1)}/><span style={{fontSize:11,color:"#fff",fontWeight:700,minWidth:54,textAlign:"center"}}>{cur+1} / {deck.slides.length}</span><NavBtn text="NEXT \u25B6" disabled={cur===deck.slides.length-1} onClick={()=>setCur(c=>c+1)}/></div>
          </div>
          <div style={{maxWidth:860,margin:"0 auto"}}><RenderSlide slide={deck.slides[cur]}/></div>
          <div style={{textAlign:"center",marginTop:8,fontSize:9,color:"#3a4a5a",textTransform:"uppercase",letterSpacing:2}}>{SLIDE_LABELS[deck.slides[cur].type]||deck.slides[cur].type} slide {"\u2022"} Arrow keys to navigate</div>
          <div style={{display:"flex",gap:5,marginTop:14,overflowX:"auto",padding:"6px 0"}}>{deck.slides.map((slide,i)=>(<div key={i} onClick={()=>setCur(i)} style={{flexShrink:0,width:110,cursor:"pointer",border:i===cur?"2px solid #ffd700":"2px solid transparent",borderRadius:3,overflow:"hidden",opacity:i===cur?1:.55,transition:"all .15s",position:"relative"}}><div style={{width:110,pointerEvents:"none"}}><RenderSlide slide={slide}/></div><div style={{position:"absolute",bottom:2,right:3,fontSize:7,color:"#fff",fontWeight:700,background:"rgba(0,0,0,.6)",padding:"0 3px",borderRadius:2}}>{i+1}</div></div>))}</div>
        </div>
      )}

      {/* GRID VIEW */}
      {deck&&!loading&&view==="grid"&&(
        <div style={{padding:"16px 20px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>{deck.slides.map((slide,i)=>(<div key={i} onClick={()=>{setCur(i);setView("presenter");}} style={{cursor:"pointer",position:"relative"}}><RenderSlide slide={slide}/><div style={{position:"absolute",top:18,left:5,background:"rgba(0,0,0,.7)",color:"#fff",padding:"1px 6px",borderRadius:3,fontSize:9,fontWeight:700}}>{i+1}</div></div>))}</div>
      )}
    </div>
  );
}

// ============================================================
// UI HELPER COMPONENTS
// ============================================================
function Btn({text,active,onClick}){return(<button onClick={onClick} style={{padding:"5px 12px",fontSize:10,fontWeight:600,background:active?"#1e3a5f":"transparent",color:active?"#fff":"#5a7a9a",border:"1px solid #1e3a5f",borderRadius:4,cursor:"pointer"}}>{text}</button>);}
function NavBtn({text,disabled,onClick}){return(<button onClick={onClick} disabled={disabled} style={{padding:"3px 10px",background:disabled?"#1a1a2e":"#1e3a5f",color:disabled?"#333":"#fff",border:"none",borderRadius:3,cursor:disabled?"default":"pointer",fontSize:11}}>{text}</button>);}

function SetupPanel({corpusData}){return(
  <div style={{background:"#111822",borderBottom:"1px solid #1e3a5f",padding:"20px 24px",fontSize:12,lineHeight:1.7,color:"#8899aa"}}><div style={{maxWidth:700}}>
    <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:10}}>{"\uD83D\uDE80"} How to Deploy & Train This App</div>
    <Step n="1" title="Get the code">Clone or download from <A href="https://github.com/tymcbrien/Pentagon-Briefing-Generator">GitHub</A>.</Step>
    <Step n="2" title="Create free accounts">Sign up at <A href="https://vercel.com">vercel.com</A> and <A href="https://github.com">github.com</A>.</Step>
    <Step n="3" title="Upload code to GitHub">New repository {"\u2192"} upload existing files {"\u2192"} drag in your files.</Step>
    <Step n="4" title="Deploy on Vercel">Add New {"\u2192"} Project {"\u2192"} select your repo {"\u2192"} Deploy.</Step>
    <Step n="5" title="(Optional) Train on real DoD slides">
      Open Terminal. Then run:
      <Code lines={["cd ~/Downloads/Pentagon-Briefing-Generator","pip3 install -r requirements.txt","python3 pipeline/ingest.py --count 200"]}/>
      Then copy <code style={{color:"#ffd700"}}>corpus/slim_corpus.json</code> into <code style={{color:"#ffd700"}}>public/corpus/</code> in your GitHub repo.
    </Step>
    <div style={{marginTop:16,padding:"10px 14px",background:"#1a2332",borderRadius:6,borderLeft:"3px solid #ffd700"}}>
      <div style={{fontSize:11,color:"#ffd700",fontWeight:700,marginBottom:4}}>{"\uD83D\uDCCA"} Status</div>
      <div style={{fontSize:11}}>{corpusData?`\u2705 Corpus loaded \u2014 ${corpusData.stats?.total_slides||"?"} slides, ${corpusData.stats?.unique_sources||"?"} sources`:`\u26AA No corpus \u2014 using ${FB_ACRONYMS.length} built-in acronyms, ${FB_TOPICS.length} topics, ${Object.keys(RENDERERS).length} slide types`}</div>
    </div>
  </div></div>
);}

function Step({n,title,children}){return(<div style={{marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><div style={{width:22,height:22,borderRadius:"50%",background:"#1e3a5f",color:"#ffd700",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,flexShrink:0}}>{n}</div><div style={{fontSize:13,fontWeight:700,color:"#d0d8e0"}}>{title}</div></div><div style={{marginLeft:30}}>{children}</div></div>);}
function A({href,children}){return <a href={href} target="_blank" rel="noopener noreferrer" style={{color:"#4da6ff",textDecoration:"underline"}}>{children}</a>;}
function Code({lines}){return(<div style={{background:"#0d1117",border:"1px solid #1e3a5f",borderRadius:5,padding:"8px 12px",marginTop:6,fontFamily:"'SF Mono','Courier New',monospace",fontSize:11,lineHeight:1.6,overflowX:"auto"}}>{lines.map((l,i)=>(<div key={i} style={{color:l.startsWith("#")?"#6a737d":"#c9d1d9"}}>{l||"\u00A0"}</div>))}</div>);}
