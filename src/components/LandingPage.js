import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

/* ────────────────────────────────────────────────────────────
   GLOBAL STYLES
──────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --green:#10B981; --green-d:#059669; --green-xd:#047857;
      --bg:#050505; --bg2:#0A0A0A; --bg3:#111;
      --border:rgba(255,255,255,0.08); --border-g:rgba(16,185,129,0.25);
      --muted:#888; --white:#fff;
      --fd:'Syne',sans-serif; --fb:'DM Sans',system-ui,sans-serif; --fm:'DM Mono',monospace;
      --rsm:10px; --rmd:14px; --rlg:20px; --rxl:28px; --rfull:9999px;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:var(--bg);color:var(--white);font-family:var(--fb);-webkit-font-smoothing:antialiased;overflow-x:hidden;line-height:1.6}
    img{max-width:100%;display:block}
    a{text-decoration:none}

    .h1{font-family:var(--fd);font-size:clamp(2.1rem,6vw,5.25rem);font-weight:800;line-height:1.03;letter-spacing:-0.04em}
    .h2{font-family:var(--fd);font-size:clamp(1.55rem,3.5vw,3rem);font-weight:800;line-height:1.08;letter-spacing:-0.03em}
    .h3{font-size:1rem;font-weight:700;color:var(--white)}
    .muted{color:var(--muted);line-height:1.7;font-size:1rem}
    .mono{font-family:var(--fm)}

    .wrap{max-width:1200px;margin:0 auto;padding:0 1.5rem}
    .sec{padding:clamp(3.5rem,8vw,7rem) 0}

    .col2{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
    .col3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}

    .bento{display:grid;grid-template-columns:repeat(12,1fr);gap:1.25rem}
    .s8{grid-column:span 8}
    .s4{grid-column:span 4}

    .card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--rlg);padding:1.75rem;position:relative;overflow:hidden;transition:border-color .3s,transform .3s}
    .card:hover{border-color:var(--border-g);transform:translateY(-2px)}
    .card-shine::before{content:'';position:absolute;top:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(16,185,129,.5),transparent)}

    .nav-glass{background:rgba(5,5,5,.88);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,255,255,.06);position:sticky;top:0;z-index:60}
    .nav-inner{height:68px;display:flex;align-items:center;justify-content:space-between;gap:1rem}

    .btn{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;padding:.875rem 1.75rem;border-radius:var(--rfull);font-family:var(--fb);font-weight:700;font-size:.95rem;cursor:pointer;border:none;outline:none;transition:all .2s cubic-bezier(.25,.8,.25,1);white-space:nowrap;letter-spacing:-.01em}
    .btn:active{transform:scale(.97)}
    .btn-p{background:var(--green);color:#000}
    .btn-p:hover{background:#34D399;box-shadow:0 0 28px rgba(16,185,129,.35)}
    .btn-s{background:rgba(255,255,255,.05);color:var(--white);border:1px solid rgba(255,255,255,.12)}
    .btn-s:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.22)}

    .field{width:100%;padding:.875rem 1.125rem;border-radius:var(--rsm);border:1px solid rgba(255,255,255,.1);font-size:.95rem;font-family:var(--fm);background:rgba(255,255,255,.04);color:var(--white);transition:all .2s}
    .field:focus{outline:none;border-color:var(--green);box-shadow:0 0 0 1px rgba(16,185,129,.3);background:rgba(16,185,129,.04)}
    .lbl{display:block;font-size:.7rem;font-weight:700;color:var(--muted);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.07em}

    .badge{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem 1rem;border-radius:var(--rfull);background:rgba(16,185,129,.08);color:var(--green);border:1px solid rgba(16,185,129,.18);font-weight:600;font-size:.78rem;letter-spacing:.03em}
    .dot-g{width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0;animation:pulse-g 2s infinite}
    .eyebrow{display:inline-flex;align-items:center;gap:.4rem;color:var(--green);font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.875rem;font-family:var(--fm)}

    @keyframes pulse-g{0%{box-shadow:0 0 0 0 rgba(16,185,129,.45)}70%{box-shadow:0 0 0 7px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}
    @keyframes pulse-r{0%{box-shadow:0 0 0 0 rgba(239,68,68,.45)}70%{box-shadow:0 0 0 6px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes popIn{from{transform:scale(.92) translateY(4px);opacity:.4}to{transform:none;opacity:1}}
    @keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}}

    /* ── RESPONSIVE ── */
    @media(max-width:1024px){
      .bento{grid-template-columns:repeat(6,1fr)}
      .s8,.s4{grid-column:span 6!important}
      .stats4{grid-template-columns:repeat(2,1fr)!important}
    }
    @media(max-width:768px){
      .wrap{padding:0 1rem}
      .col2,.col3{grid-template-columns:1fr;gap:2rem}
      .bento{display:flex;flex-direction:column}
      .stats4{grid-template-columns:1fr 1fr!important}
      .hero-sec{min-height:auto!important;padding:4.5rem 0 2.5rem!important}
      .hero-txt{text-align:center}
      .hero-cta{flex-direction:column!important;width:100%!important}
      .hero-cta .btn{width:100%!important;justify-content:center}
      .hero-proof{justify-content:center!important}
      .hero-badge{justify-content:center}
      .hero-img{height:260px!important}
      .hero-float{display:none!important}
      .hero-card{left:.75rem!important;right:.75rem!important;bottom:.75rem!important;padding:1rem!important}
      .hero-pval{font-size:1.45rem!important}
      .nav-desk{display:none!important}
      .nav-mob{display:flex!important}
      .est-row{grid-template-columns:1fr!important}
      .risk-row{grid-template-columns:1fr!important}
      .steps-wrap{display:flex!important;flex-direction:column!important}
      .step-arrow{display:none!important}
      .step-sep{border-right:none!important;border-bottom:1px solid rgba(255,255,255,.06)!important;padding-bottom:2rem!important;margin-bottom:0!important}
      .ft-grid{grid-template-columns:1fr!important;gap:2rem!important}
      .ft-btm{flex-direction:column!important;text-align:center;gap:.5rem!important}
      .mob-bar{display:flex!important}
      .hide-m{display:none!important}
    }
    @media(max-width:480px){
      .stats4{grid-template-columns:1fr 1fr!important}
      .crop-grid{grid-template-columns:1fr!important}
      .col3{grid-template-columns:1fr!important}
    }
    .nav-mob{display:none}
    .mob-bar{display:none}
  `}</style>
);

/* ────────────────────────────────────────────────────────────
   SUPPORT WIDGET
──────────────────────────────────────────────────────────── */
function SupportWidget() {
  const [open, setOpen]       = useState(false);
  const [tab, setTab]         = useState('help');  // 'help' | 'contact'
  const [form, setForm]       = useState({ name:'', email:'', message:'' });
  const [sent, setSent]       = useState(false);
  const [busy, setBusy]       = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q:"What's the minimum investment?",          a:"The minimum is ₦100,000. No upper cap — amounts above ₦10M require enterprise KYC (24–48 hrs)." },
    { q:"When do I receive my returns?",            a:"At crop maturity your principal + yield are paid directly to your Nigerian bank account." },
    { q:"Is my investment insured?",                a:"Yes — 100% of deployments are covered by parametric weather insurance. If crops fail due to weather, your principal is recovered automatically." },
    { q:"Can I withdraw before the cycle ends?",   a:"No — capital is locked for your chosen cycle (3, 6, or 9 months). Funds are tied to physical, growing farm inputs." },
    { q:"How long does KYC take?",                 a:"Under 5 minutes. You'll need a government-issued ID and your BVN." },
    { q:"Is SmartFarmer a crypto platform?",       a:"No. SmartFarmer is fiat-native (NGN/USD), SEC-regulated, and deals strictly with real-world agricultural assets. Blockchain is used only for immutable record-keeping." },
  ];

  const channels = [
    { label:"Telegram (Fastest)", href:"https://t.me/smartfarmerng",                          color:"#229ED9", bg:"rgba(34,158,217,.08)",  bdr:"rgba(34,158,217,.18)"  },
    { label:"Instagram DM",       href:"https://www.instagram.com/smartfarmer_ng",            color:"#E1306C", bg:"rgba(225,48,108,.08)",   bdr:"rgba(225,48,108,.18)"  },
    { label:"Email Support",      href:"mailto:support@smartfarmer.ng",                        color:"#10B981", bg:"rgba(16,185,129,.08)",   bdr:"rgba(16,185,129,.18)"  },
  ];

  const handleContact = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addDoc(collection(db, "support_tickets"), { ...form, createdAt: new Date(), status: 'open' });
      setSent(true);
    } catch { /* silent fail */ }
    finally { setBusy(false); }
  };

  return (
    <>
      <style>{`
        .cfab{position:fixed;bottom:2rem;right:2rem;z-index:210;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#10B981,#047857);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(16,185,129,.45);transition:transform .2s,box-shadow .2s}
        .cfab:hover{transform:scale(1.09);box-shadow:0 12px 36px rgba(16,185,129,.55)}
        .cfab:active{transform:scale(.95)}
        .cunread{position:absolute;top:2px;right:2px;width:13px;height:13px;border-radius:50%;background:#EF4444;border:2px solid #050505;animation:pulse-r 2s infinite}
        .cpanel{position:fixed;bottom:6.5rem;right:2rem;z-index:205;width:min(420px,calc(100vw - 2rem));height:min(590px,calc(100dvh - 9rem));background:#0C0C0C;border:1px solid rgba(16,185,129,.22);border-radius:22px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.75);transform-origin:bottom right;transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s}
        .cpanel.closed{transform:scale(.82) translateY(16px);opacity:0;pointer-events:none}
        .chdr{padding:1rem 1.25rem;background:rgba(16,185,129,.07);border-bottom:1px solid rgba(16,185,129,.13);display:flex;align-items:center;gap:.75rem;flex-shrink:0}
        .ctabs{display:flex;padding:.625rem 1.25rem .5rem;gap:.5rem;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.06)}
        .ctab{flex:1;padding:.525rem;border-radius:8px;border:none;cursor:pointer;font-size:.78rem;font-weight:700;transition:all .2s;font-family:var(--fb);letter-spacing:.01em}
        .ctab.act{background:rgba(16,185,129,.12);color:#10B981;border:1px solid rgba(16,185,129,.25)}
        .ctab.inact{background:transparent;color:rgba(255,255,255,.35);border:1px solid transparent}
        .ctab.inact:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.65)}
        .cbody{flex:1;overflow-y:auto;padding:1rem 1.25rem;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.08) transparent}
        .cfaq-item{border-bottom:1px solid rgba(255,255,255,.06);padding:.75rem 0}
        .cfaq-btn{display:flex;justify-content:space-between;align-items:center;width:100%;background:none;border:none;color:#fff;font-size:.82rem;font-weight:600;cursor:pointer;text-align:left;padding:0;gap:.75rem;font-family:var(--fb)}
        .cfaq-ans{font-size:.79rem;color:rgba(255,255,255,.48);line-height:1.65;padding-top:.5rem;margin:0}
        .cinp-sm{width:100%;padding:.75rem 1rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:white;font-size:.875rem;font-family:var(--fb);outline:none;transition:border-color .2s;margin-bottom:.75rem;display:block;box-sizing:border-box}
        .cinp-sm:focus{border-color:rgba(16,185,129,.45)}
        .cinp-sm::placeholder{color:rgba(255,255,255,.28)}
        .ctarea{resize:vertical;min-height:82px}
        .cclose{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.35);cursor:pointer;font-size:1.35rem;line-height:1;padding:2px}
        .cclose:hover{color:white}
        .csend-btn{width:100%;padding:.875rem;background:#10B981;color:#000;border:none;border-radius:10px;font-weight:700;font-size:.875rem;cursor:pointer;transition:background .15s;font-family:var(--fb);letter-spacing:.01em}
        .csend-btn:hover:not(:disabled){background:#34D399}
        .csend-btn:disabled{opacity:.5;cursor:not-allowed}
        @media(max-width:768px){
          .cpanel{right:0!important;bottom:0!important;width:100vw!important;height:100dvh!important;border-radius:0!important}
          .cfab{bottom:5.5rem!important;right:1.25rem!important}
        }
      `}</style>

      {/* Floating trigger button */}
      <button className="cfab" onClick={() => setOpen(o => !o)} title="Support Center">
        {open
          ? <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          : <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>}
        {!open && <span className="cunread" />}
      </button>

      <div className={`cpanel${open ? "" : " closed"}`} role="dialog" aria-label="Support Center">
        {/* Header */}
        <div className="chdr">
          <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#10B981,#047857)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:".875rem", color:"#fff" }}>Support Center</div>
            <div style={{ fontSize:".7rem", color:"#10B981", display:"flex", alignItems:"center", gap:".3rem" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#10B981", display:"inline-block" }} />
              Online · Quick answers
            </div>
          </div>
          <button className="cclose" onClick={() => setOpen(false)} aria-label="Close">×</button>
        </div>

        {/* Tabs */}
        <div className="ctabs">
          <button className={`ctab ${tab==='help'?'act':'inact'}`} onClick={()=>setTab('help')}>Quick Help</button>
          <button className={`ctab ${tab==='contact'?'act':'inact'}`} onClick={()=>setTab('contact')}>Contact Us</button>
        </div>

        {/* Body */}
        <div className="cbody">
          {tab === 'help' ? (
            <>
              <p style={{ fontSize:".73rem", color:"rgba(255,255,255,.32)", margin:"0 0 .875rem" }}>Common questions — tap any to expand</p>
              {faqs.map((f, i) => (
                <div key={i} className="cfaq-item">
                  <button className="cfaq-btn" onClick={()=>setOpenFaq(openFaq===i ? null : i)}>
                    <span>{f.q}</span>
                    <span style={{ transform:openFaq===i?"rotate(45deg)":"none", transition:"transform .22s", color:"#10B981", fontSize:"1.3rem", fontWeight:300, flexShrink:0, lineHeight:1 }}>+</span>
                  </button>
                  {openFaq === i && <p className="cfaq-ans">{f.a}</p>}
                </div>
              ))}

              <div style={{ marginTop:"1.25rem", padding:"1rem", background:"rgba(16,185,129,.05)", border:"1px solid rgba(16,185,129,.12)", borderRadius:12 }}>
                <div style={{ fontWeight:700, color:"#fff", fontSize:".83rem", marginBottom:".375rem" }}>Still need help?</div>
                <p style={{ margin:"0 0 .875rem", fontSize:".74rem", color:"rgba(255,255,255,.38)" }}>Reach us directly on any channel below.</p>
                {channels.map(c => (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                    style={{ display:"block", padding:".6rem .875rem", borderRadius:8, marginBottom:".4rem", background:c.bg, color:c.color, fontSize:".79rem", fontWeight:700, textDecoration:"none", border:`1px solid ${c.bdr}`, transition:"opacity .15s" }}
                    onMouseOver={e=>e.currentTarget.style.opacity=".75"} onMouseOut={e=>e.currentTarget.style.opacity="1"}>
                    {c.label} →
                  </a>
                ))}
              </div>
            </>
          ) : (
            sent ? (
              <div style={{ textAlign:"center", padding:"2.5rem 1rem" }}>
                <div style={{ fontSize:"2.75rem", marginBottom:"1rem" }}>✅</div>
                <div style={{ fontWeight:700, color:"#fff", marginBottom:".5rem", fontSize:".95rem" }}>Message Received!</div>
                <p style={{ color:"rgba(255,255,255,.38)", fontSize:".82rem", lineHeight:1.65 }}>
                  We'll respond within 24 hours. For the fastest reply, reach us on Telegram.
                </p>
                <a href="https://t.me/smartfarmerng" target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-block", marginTop:"1.25rem", padding:".65rem 1.4rem", background:"#229ED9", color:"#fff", borderRadius:9, fontWeight:700, fontSize:".82rem", textDecoration:"none" }}>
                  Open Telegram →
                </a>
              </div>
            ) : (
              <form onSubmit={handleContact}>
                <p style={{ fontSize:".76rem", color:"rgba(255,255,255,.35)", margin:"0 0 1rem" }}>Send a message — we'll get back within 24 hours.</p>
                <input className="cinp-sm" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Your name" />
                <input className="cinp-sm" type="email" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="Email address" />
                <textarea className="cinp-sm ctarea" required value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="How can we help you?" />
                <button type="submit" disabled={busy} className="csend-btn">{busy?"Sending…":"Send Message"}</button>
                <div style={{ marginTop:".875rem", textAlign:"center", fontSize:".71rem", color:"rgba(255,255,255,.25)" }}>
                  For instant replies, chat us on{" "}
                  <a href="https://t.me/smartfarmerng" target="_blank" rel="noopener noreferrer" style={{ color:"#229ED9", textDecoration:"none" }}>Telegram</a>
                </div>
              </form>
            )
          )}
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   TICKER
──────────────────────────────────────────────────────────── */
function Ticker() {
  const items = ["₦4.8B+ Capital Deployed","2,400+ Active Investors","97.3% Portfolio Maturity Rate","18 States Covered","2,000+ Farm Cooperatives","Zero Capital Loss Events","14.2% Average APY","SEC Nigeria Compliant","100% Insured Deployments"];
  const all = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", background: "rgba(16,185,129,.05)", borderBottom: "1px solid rgba(16,185,129,.1)", padding: ".55rem 0" }}>
      <div style={{ display: "flex", gap: "3rem", whiteSpace: "nowrap", animation: "ticker 35s linear infinite" }}>
        {all.map((s, i) => (
          <span key={i} style={{ fontSize: ".74rem", color: "var(--muted)", fontWeight: 500, flexShrink: 0 }}>
            <span style={{ color: "var(--green)", marginRight: ".45rem" }}>◆</span>{s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   TRUST BAR
──────────────────────────────────────────────────────────── */
function TrustBar() {
  return (
    <div style={{ borderBottom: "1px solid var(--border)", padding: "1.2rem 0", background: "rgba(255,255,255,.015)" }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", textTransform: "uppercase", letterSpacing: ".1em", flexShrink: 0 }}>Regulated & Certified By</span>
        {["SEC Nigeria","CBN Compliant","ISO 27001","NDIC Secured","NSE Listed"].map(c => (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: ".35rem", opacity: .4 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <span style={{ fontSize: ".7rem", fontWeight: 700, color: "white" }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   STATS ROW
──────────────────────────────────────────────────────────── */
function StatsRow() {
  const data = [
    { l: "Total Capital Deployed", v: "₦4.8B+", s: "+₦240M this month",    up: true },
    { l: "Active Farm Cycles",      v: "1,247",  s: "Across 18 states",      up: true },
    { l: "Avg. Maturity Return",    v: "14.2%",  s: "APY last 90 days",      up: true },
    { l: "Insurance Coverage",      v: "100%",   s: "All deployments",       up: null },
  ];
  return (
    <div className="stats4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(255,255,255,.06)" }}>
      {data.map(d => (
        <div key={d.l} style={{ background: "#000", padding: "1.75rem 1.5rem" }}>
          <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.38)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".4rem" }}>{d.l}</div>
          <div style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#fff", fontFamily: "var(--fm)", letterSpacing: "-.03em", marginBottom: ".2rem" }}>{d.v}</div>
          <div style={{ fontSize: ".73rem", color: d.up === true ? "var(--green)" : "rgba(255,255,255,.32)", display: "flex", alignItems: "center", gap: ".25rem" }}>
            {d.up && <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>}
            {d.s}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   HOW IT WORKS
──────────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n:"01", t:"Verify & Fund",   d:"Complete KYC in under 5 minutes. Fund your wallet via bank transfer in NGN or USD.", p:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { n:"02", t:"Select a Cycle",  d:"Choose from maize, cassava, soybean, or rice. Pick your duration (3–9 months) and risk tranche.", p:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { n:"03", t:"Monitor Live",    d:"Track via satellite imagery, IoT sensors, and on-chain audit logs — updated every 24 hours.", p:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { n:"04", t:"Collect Returns", d:"At crop maturity, principal + yield paid directly to your bank account. Reinvest or withdraw.", p:"M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
  ];
  return (
    <div className="steps-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
      {steps.map((s, i) => (
        <Reveal key={s.n} delay={i * 100}>
          <div className={`step-sep`} style={{ padding: "2rem 1.75rem", borderRight: i < 3 ? "1px solid rgba(255,255,255,.06)" : "none", position: "relative" }}>
            <div style={{ fontFamily: "var(--fm)", fontSize: ".6rem", color: "var(--green)", fontWeight: 800, letterSpacing: ".15em", marginBottom: "1rem" }}>{s.n}</div>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--green)" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d={s.p}/></svg>
            </div>
            <div className="h3" style={{ marginBottom: ".4rem", fontSize: ".975rem" }}>{s.t}</div>
            <p style={{ fontSize: ".85rem", lineHeight: 1.65, margin: 0, color: "var(--muted)" }}>{s.d}</p>
            {i < 3 && (
              <div className="step-arrow" style={{ position: "absolute", top: "3rem", right: "-.75rem", zIndex: 2 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#0A0A0A", border: "1px solid rgba(16,185,129,.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="var(--green)" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   CROP CARDS
──────────────────────────────────────────────────────────── */
function CropCards() {
  const crops = [
    { n:"Maize",   s:"Apr – Oct",    a:"12–15%", r:"Low",    rgb:"16,185,129", img:"https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?q=80&w=600&auto=format&fit=crop" },
    { n:"Cassava", s:"Year-round",   a:"15–18%", r:"Medium", rgb:"245,158,11", img:"https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=600&auto=format&fit=crop" },
    { n:"Soybean", s:"Jun – Dec",    a:"18–22%", r:"High",   rgb:"239,68,68",  img:"https://images.unsplash.com/photo-1599493258758-6cbf59f3b0d9?q=80&w=600&auto=format&fit=crop" },
    { n:"Rice",    s:"May – Nov",    a:"13–16%", r:"Low",    rgb:"16,185,129", img:"https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?q=80&w=600&auto=format&fit=crop" },
  ];
  return (
    <div className="crop-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.25rem" }}>
      {crops.map((c, i) => (
        <Reveal key={c.n} delay={i * 90}>
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)", background: "#0A0A0A", transition: "border-color .3s,transform .3s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor="rgba(16,185,129,.35)"; e.currentTarget.style.transform="translateY(-4px)"; }}
            onMouseOut={e  => { e.currentTarget.style.borderColor="rgba(255,255,255,.08)"; e.currentTarget.style.transform="none"; }}>
            <div style={{ height: 150, position: "relative", overflow: "hidden" }}>
              <img src={c.img} alt={c.n} style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.6)" }}/>
              <div style={{ position:"absolute", top:".875rem", right:".875rem", background:`rgba(${c.rgb},.13)`, border:`1px solid rgba(${c.rgb},.3)`, color:`rgb(${c.rgb})`, fontSize:".67rem", fontWeight:700, padding:".25rem .6rem", borderRadius:100 }}>{c.r} Risk</div>
            </div>
            <div style={{ padding:"1.1rem 1.25rem" }}>
              <div className="h3" style={{ marginBottom:".4rem" }}>{c.n}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                <span style={{ fontSize:".73rem", color:"rgba(255,255,255,.38)" }}>{c.s}</span>
                <span style={{ fontSize:".9rem", fontWeight:800, color:"var(--green)", fontFamily:"var(--fm)" }}>{c.a} APY</span>
              </div>
              <a href="/register" style={{ display:"block", padding:".575rem", textAlign:"center", borderRadius:8, background:"rgba(16,185,129,.07)", border:"1px solid rgba(16,185,129,.2)", color:"var(--green)", fontSize:".77rem", fontWeight:700, transition:"background .2s" }}
                onMouseOver={e => e.currentTarget.style.background="rgba(16,185,129,.14)"}
                onMouseOut={e  => e.currentTarget.style.background="rgba(16,185,129,.07)"}>
                Invest in {c.n} →
              </a>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   FAQ ITEM
──────────────────────────────────────────────────────────── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,.07)", padding: "1.3rem 0" }}>
      <button onClick={() => setOpen(o => !o)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", background:"none", border:"none", color:"#fff", fontSize:".975rem", fontWeight:600, cursor:"pointer", textAlign:"left", padding:0, gap:"1rem", fontFamily:"var(--fb)" }}>
        <span>{q}</span>
        <span style={{ transform:open?"rotate(45deg)":"none", transition:"transform .25s", color:open?"var(--green)":"rgba(255,255,255,.3)", fontSize:"1.5rem", fontWeight:300, flexShrink:0, lineHeight:1 }}>+</span>
      </button>
      <div style={{ maxHeight:open?"320px":0, overflow:"hidden", transition:"max-height .4s ease", opacity:open?1:0 }}>
        <p style={{ marginTop:".875rem", color:"rgba(255,255,255,.5)", fontSize:".88rem", lineHeight:1.7 }}>{a}</p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   REVEAL
──────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: .05 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity:v?1:0, transform:v?"translateY(0)":"translateY(20px)", transition:`opacity .85s cubic-bezier(.16,1,.3,1) ${delay}ms,transform .85s cubic-bezier(.16,1,.3,1) ${delay}ms`, willChange:"opacity,transform", ...style }}>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   AFFILIATE SECTION
──────────────────────────────────────────────────────────── */
function AffiliateSection() {
  const [form, setForm]         = useState({ name:'', email:'', phone:'', platform:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await addDoc(collection(db, "affiliate_applications"), {
        ...form,
        createdAt: new Date(),
        status: 'pending'
      });
      setSubmitted(true);
    } catch {
      setError('Submission failed — please try again or email us at partners@smartfarmer.ng');
    } finally {
      setSending(false);
    }
  };

  const perks = [
    { icon:"💰", title:"Earn 5% Commission",    desc:"Get 5% of every investment made by your referred users, paid monthly." },
    { icon:"📊", title:"Live Tracking Dashboard", desc:"Monitor clicks, sign-ups, and earnings in real time from your portal." },
    { icon:"⚡", title:"Fast Bank Payouts",      desc:"Commissions paid directly to your Nigerian bank account — no delays." },
    { icon:"🎯", title:"Free Marketing Kit",     desc:"Branded graphics, referral links, and copy to maximise conversions." },
  ];

  return (
    <section id="affiliate" className="sec" style={{ borderTop:"1px solid var(--border)", background:"var(--bg)" }}>
      <div className="wrap">
        <div className="col2" style={{ alignItems:"flex-start", gap:"3.5rem" }}>

          {/* LEFT — Info */}
          <Reveal>
            <div>
              <div className="eyebrow"><span>◆</span> Partner Program</div>
              <h2 className="h2" style={{ marginBottom:"1rem" }}>Become a SmartFarmer Affiliate.</h2>
              <p style={{ marginBottom:"2rem", color:"var(--muted)", maxWidth:460 }}>
                Earn real commissions by introducing investors to Nigeria's leading agricultural yield platform.
                No cap — the more you refer, the more you earn.
              </p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"2rem" }}>
                {perks.map((p, i) => (
                  <Reveal key={p.title} delay={i * 70}>
                    <div style={{ background:"rgba(16,185,129,.04)", border:"1px solid rgba(16,185,129,.1)", borderRadius:14, padding:"1.25rem", height:"100%" }}>
                      <div style={{ fontSize:"1.55rem", marginBottom:".5rem" }}>{p.icon}</div>
                      <div style={{ fontWeight:700, color:"#fff", marginBottom:".25rem", fontSize:".88rem" }}>{p.title}</div>
                      <p style={{ margin:0, fontSize:".78rem", color:"var(--muted)", lineHeight:1.65 }}>{p.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Social proof strip */}
              <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
                {[["₦2.4M+","Paid to affiliates"],["340+","Active partners"],["5%","Commission rate"]].map(([v,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily:"var(--fm)", fontSize:"1.2rem", fontWeight:800, color:"var(--green)" }}>{v}</div>
                    <div style={{ fontSize:".73rem", color:"var(--muted)", marginTop:".1rem" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* RIGHT — Form */}
          <Reveal delay={150}>
            {submitted ? (
              <div className="card" style={{ textAlign:"center", padding:"3rem 2rem" }}>
                <div style={{ fontSize:"3.5rem", marginBottom:"1.25rem" }}>🌱</div>
                <h3 style={{ color:"var(--green)", marginBottom:".5rem", fontFamily:"var(--fd)", fontSize:"1.5rem" }}>Application Received!</h3>
                <p style={{ color:"var(--muted)", lineHeight:1.7 }}>
                  Thank you! Our partnerships team will review your application and reach out within <strong style={{ color:"#fff" }}>2–3 business days</strong>.
                  In the meantime, follow us on social media.
                </p>
                <div style={{ display:"flex", gap:".75rem", justifyContent:"center", marginTop:"1.5rem", flexWrap:"wrap" }}>
                  <a href="https://t.me/smartfarmerng" target="_blank" rel="noopener noreferrer" className="btn btn-p" style={{ padding:".6rem 1.25rem", fontSize:".83rem" }}>Join Telegram →</a>
                  <a href="https://www.instagram.com/smartfarmer_ng" target="_blank" rel="noopener noreferrer" className="btn btn-s" style={{ padding:".6rem 1.25rem", fontSize:".83rem" }}>Follow on Instagram</a>
                </div>
              </div>
            ) : (
              <div className="card card-shine">
                <div style={{ marginBottom:"1.5rem" }}>
                  <div style={{ fontWeight:800, fontSize:"1.1rem", color:"#fff", marginBottom:".3rem" }}>Apply to Partner</div>
                  <p style={{ margin:0, fontSize:".83rem", color:"var(--muted)" }}>Fill in the form and we'll be in touch within 48 hours.</p>
                </div>

                {error && (
                  <div style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:8, padding:".875rem", color:"#FCA5A5", fontSize:".82rem", marginBottom:"1rem" }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handle}>
                  <div style={{ marginBottom:"1rem" }}>
                    <label className="lbl">Full Name *</label>
                    <input className="field" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Your full name" />
                  </div>
                  <div style={{ marginBottom:"1rem" }}>
                    <label className="lbl">Email Address *</label>
                    <input className="field" type="email" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="you@email.com" />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
                    <div>
                      <label className="lbl">Phone Number</label>
                      <input className="field" type="tel" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+234 ..." />
                    </div>
                    <div>
                      <label className="lbl">Main Platform</label>
                      <select className="field" value={form.platform} onChange={e=>setForm(p=>({...p,platform:e.target.value}))} style={{ cursor:"pointer", appearance:"none" }}>
                        <option value="">Select…</option>
                        <option>Instagram</option>
                        <option>X / Twitter</option>
                        <option>TikTok</option>
                        <option>YouTube</option>
                        <option>Telegram</option>
                        <option>WhatsApp</option>
                        <option>Blog / Website</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom:"1.5rem" }}>
                    <label className="lbl">How will you promote SmartFarmer?</label>
                    <textarea className="field" rows={3} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="Tell us about your audience and your promotion strategy…" style={{ resize:"vertical", minHeight:88 }} />
                  </div>
                  <button type="submit" disabled={sending} className="btn btn-p" style={{ width:"100%", padding:"1rem", justifyContent:"center", fontSize:".95rem" }}>
                    {sending ? "Submitting…" : "Apply Now →"}
                  </button>
                  <p style={{ textAlign:"center", marginTop:".875rem", fontSize:".73rem", color:"var(--muted)" }}>
                    Questions? Email <a href="mailto:partners@smartfarmer.ng" style={{ color:"var(--green)", textDecoration:"none" }}>partners@smartfarmer.ng</a>
                  </p>
                </form>
              </div>
            )}
          </Reveal>

        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   MAIN PAGE
──────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [price,  setPrice]  = useState(500000);
  const [months, setMonths] = useState(6);
  const [pct,    setPct]    = useState(15);
  const [risk,   setRisk]   = useState("Low");
  const [sticky, setSticky] = useState(false);

  const calc = useMemo(() => {
    const p  = Math.max(0, Number(price)  || 0);
    const m  = Math.max(1, Number(months) || 1);
    const pr = Math.max(0, Number(pct)    || 0);
    const roi = (pr / 100) * p;
    return { p, m, pr, roi, total: p + roi, perMo: pr / m };
  }, [price, months, pct]);

  const fmt = n => new Intl.NumberFormat("en-NG", { style:"currency", currency:"NGN", minimumFractionDigits:0 }).format(Number(n) || 0);

  useEffect(() => {
    const fn = () => setSticky(window.scrollY > 280);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [["How It Works","#how"],["Crop Cycles","#crops"],["Yield Terminal","#estimator"],["FAQ","#faq"],["Affiliate","#affiliate"]];
  const faqs = [
    { q:"How is the 14.2% APY generated?",          a:"Returns come from actual commodity profit margins. Your capital buys raw inputs (seeds, fertiliser) at wholesale. When the crop matures and sells to pre-vetted off-takers, the profit distributes directly to your bank account." },
    { q:"What is the minimum investment?",           a:"The minimum is ₦100,000. There is no upper cap — investments above ₦10,000,000 require our enhanced enterprise KYC, which takes 24–48 hours." },
    { q:"What happens if a crop fails due to weather?", a:"Every deployment is protected by parametric weather insurance. If rainfall, temperature, or other metrics breach critical thresholds, the insurance smart contract auto-executes and recovers your full principal." },
    { q:"Are there any lock-up periods?",            a:"Yes — capital is locked for the duration of the cycle you choose (3, 6, or 9 months). Because funds are tied to real, growing physical assets, early withdrawal is not supported." },
    { q:"Is SmartFarmer a cryptocurrency platform?", a:"No. SmartFarmer is a fiat-native (NGN/USD), SEC-regulated platform dealing strictly with real-world agricultural assets. Blockchain is used only for immutable back-end record-keeping." },
    { q:"How is my investment protected?",           a:"Three layers: (1) physical asset backing — your capital buys insured real farm inputs; (2) parametric weather insurance on every cycle; (3) cooperative liability agreements with all 2,000+ farming partners." },
  ];

  return (
    <>
      <GlobalStyles />

      {/* ── Banner ── */}
      <div style={{ background:"linear-gradient(90deg,#059669,#10B981,#34D399)", color:"#000", fontSize:".74rem", fontWeight:700, textAlign:"center", padding:".5rem 1rem", letterSpacing:".03em", display:"flex", alignItems:"center", justifyContent:"center", gap:"1.25rem", flexWrap:"wrap" }}>
        <span>🌱 SmartFarmer V2 is live — Institutional-grade agricultural yield, now for everyone</span>
        <span style={{ display:"flex", gap:".6rem", alignItems:"center" }}>
          <a href="https://x.com/smartfarmer_ng" target="_blank" rel="noopener noreferrer" style={{ color:"#000", textDecoration:"none", fontWeight:800, opacity:.75, fontSize:".7rem" }}>𝕏 Twitter</a>
          <span style={{ opacity:.4 }}>·</span>
          <a href="https://www.instagram.com/smartfarmer_ng" target="_blank" rel="noopener noreferrer" style={{ color:"#000", textDecoration:"none", fontWeight:800, opacity:.75, fontSize:".7rem" }}>Instagram</a>
          <span style={{ opacity:.4 }}>·</span>
          <a href="https://t.me/smartfarmerng" target="_blank" rel="noopener noreferrer" style={{ color:"#000", textDecoration:"none", fontWeight:800, opacity:.75, fontSize:".7rem" }}>Telegram</a>
        </span>
      </div>

      <Ticker />

      {/* ── Nav ── */}
      <header className="nav-glass">
        <div className="wrap nav-inner">
          <a href="/" style={{ display:"flex", alignItems:"center", gap:".6rem", color:"inherit", flexShrink:0 }}>
            <img src="/logo-dark-theme.png" alt="SmartFarmer" style={{ height:38, width:38, objectFit:"contain", borderRadius:8 }} />
            <span style={{ fontFamily:"var(--fd)", fontWeight:800, fontSize:"1.05rem", letterSpacing:"-.03em" }}>SmartFarmer</span>
          </a>

          <nav className="nav-desk" style={{ display:"flex", gap:"2rem", alignItems:"center" }}>
            {navLinks.map(([l, h]) => (
              <a key={l} href={h} style={{ color:"var(--muted)", fontSize:".875rem", fontWeight:500, transition:"color .2s" }}
                onMouseOver={e => e.target.style.color="#fff"} onMouseOut={e => e.target.style.color="var(--muted)"}>{l}</a>
            ))}
          </nav>

          <div className="nav-desk" style={{ display:"flex", gap:".75rem", alignItems:"center" }}>
            <a href="/login"  className="btn btn-s" style={{ padding:".5rem 1.2rem", fontSize:".85rem" }}>Log in</a>
            <a href="/signup" className="btn btn-p" style={{ padding:".5rem 1.2rem", fontSize:".85rem" }}>Deploy Capital</a>
          </div>

          <div className="nav-mob" style={{ gap:".5rem", alignItems:"center" }}>
            <a href="/login"  className="btn btn-s" style={{ padding:".5rem .9rem", fontSize:".8rem" }}>Login</a>
            <a href="/signup" className="btn btn-p" style={{ padding:".5rem .9rem", fontSize:".8rem" }}>Start</a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="sec hero-sec" style={{ position:"relative", minHeight:"90vh", display:"flex", alignItems:"center" }}>
        <div style={{ position:"absolute", top:"-15%", left:"-8%", width:"55vw", height:"55vw", background:"radial-gradient(circle,rgba(16,185,129,.07) 0%,transparent 65%)", zIndex:-1, borderRadius:"50%", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:0, right:"-5%", width:"38vw", height:"38vw", background:"radial-gradient(circle,rgba(16,185,129,.04) 0%,transparent 70%)", zIndex:-1, borderRadius:"50%", pointerEvents:"none" }} />

        <div className="wrap" style={{ width:"100%" }}>
          <div className="col2">
            <Reveal>
              <div className="hero-txt">
                <div className="badge hero-badge" style={{ marginBottom:"1.6rem" }}>
                  <span className="dot-g" />
                  Protocol Live · 14.2% Average APY
                </div>
                <h1 className="h1" style={{ marginBottom:"1.25rem" }}>
                  Your capital,<br/><span style={{ color:"var(--green)" }}>growing in soil.</span>
                </h1>
                <p style={{ marginBottom:"2.5rem", fontSize:"clamp(.975rem,2vw,1.1rem)", maxWidth:510, color:"#888" }}>
                  SmartFarmer routes your capital directly to audited, asset-backed agricultural inputs. Predictable, real-world returns — no crypto, no stock market exposure.
                </p>
                <div className="hero-cta" style={{ display:"flex", gap:".875rem", flexWrap:"wrap" }}>
                  <a href="/register" className="btn btn-p">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    Start Investing
                  </a>
                  <a href="#estimator" className="btn btn-s">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Run Simulation
                  </a>
                </div>
                <div className="hero-proof" style={{ marginTop:"2.25rem", display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap" }}>
                  <div style={{ display:"flex" }}>
                    {["#10B981","#059669","#047857","#065F46","#064E3B"].map((c, i) => (
                      <div key={i} style={{ width:30, height:30, borderRadius:"50%", background:c, border:"2px solid #050505", marginLeft:i?-8:0, zIndex:5-i, display:"flex", alignItems:"center", justifyContent:"center", fontSize:".6rem", color:"#000", fontWeight:800 }}>
                        {["AO","BM","CF","DI","EK"][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize:".82rem", fontWeight:600, color:"#fff" }}>2,400+ active investors</div>
                    <div style={{ fontSize:".72rem", color:"var(--green)" }}>★★★★★ 4.9/5 · Verified reviews</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div style={{ position:"relative" }}>
                <div style={{ borderRadius:24, overflow:"hidden", border:"1px solid rgba(255,255,255,.08)" }}>
                  <img className="hero-img" src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"
                    alt="Agricultural drone" style={{ width:"100%", height:460, objectFit:"cover", filter:"brightness(.58) saturate(1.2)", display:"block" }}/>
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(5,5,5,.9) 0%,rgba(5,5,5,.08) 55%,transparent 100%)" }} />
                </div>

                {/* Portfolio card */}
                <div className="hero-card" style={{ position:"absolute", bottom:"1.5rem", left:"1.5rem", right:"1.5rem", background:"rgba(8,8,8,.93)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,.09)", borderRadius:16, padding:"1.2rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:".875rem" }}>
                    <div>
                      <div style={{ fontSize:".63rem", color:"rgba(255,255,255,.38)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:".2rem" }}>Live Portfolio Value</div>
                      <div className="hero-pval" style={{ fontSize:"2.1rem", fontWeight:800, fontFamily:"var(--fm)", color:"#fff", lineHeight:1 }}>₦2,450,000</div>
                    </div>
                    <div style={{ background:"rgba(16,185,129,.1)", border:"1px solid rgba(16,185,129,.25)", borderRadius:8, padding:".45rem .8rem", display:"flex", alignItems:"center", gap:".3rem" }}>
                      <svg width="13" height="13" fill="none" stroke="#10B981" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                      <span style={{ color:"var(--green)", fontWeight:700, fontSize:".82rem" }}>+14.2%</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:28 }}>
                    {[40,58,50,68,62,78,88,72,93,85,100,94].map((h, i) => (
                      <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:3, background:i===11?"var(--green)":`rgba(16,185,129,${.1+i*.043})` }}/>
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:".4rem" }}>
                    <span style={{ fontSize:".6rem", color:"rgba(255,255,255,.22)" }}>Jan</span>
                    <span style={{ fontSize:".6rem", color:"rgba(255,255,255,.22)" }}>Jun</span>
                    <span style={{ fontSize:".6rem", color:"var(--green)", fontWeight:600 }}>Now</span>
                  </div>
                </div>

                {/* Float badge */}
                <div className="hero-float" style={{ position:"absolute", top:"1.5rem", right:"1.5rem", background:"rgba(8,8,8,.92)", backdropFilter:"blur(12px)", border:"1px solid rgba(16,185,129,.25)", borderRadius:12, padding:".75rem 1rem", animation:"float 4s ease-in-out infinite" }}>
                  <div style={{ fontSize:".62rem", color:"rgba(255,255,255,.38)", marginBottom:".15rem" }}>Next payout in</div>
                  <div style={{ fontSize:".95rem", fontWeight:800, fontFamily:"var(--fm)", color:"var(--green)" }}>14 days</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <TrustBar />
      <StatsRow />

      {/* ── How It Works ── */}
      <section id="how" style={{ borderTop:"1px solid var(--border)" }}>
        <div className="wrap" style={{ padding:"5rem 1.5rem" }}>
          <div style={{ marginBottom:"2.75rem" }}>
            <div className="eyebrow"><span>◆</span> How It Works</div>
            <h2 className="h2" style={{ maxWidth:460 }}>From transfer to harvest in 4 steps.</h2>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* ── Bento ── */}
      <section id="infrastructure" style={{ background:"var(--bg2)", borderTop:"1px solid var(--border)" }}>
        <div className="wrap" style={{ padding:"5rem 1.5rem" }}>
          <div style={{ marginBottom:"2.75rem" }}>
            <div className="eyebrow"><span>◆</span> Infrastructure</div>
            <h2 className="h2" style={{ marginBottom:".75rem" }}>Institutional-grade infrastructure.</h2>
            <p style={{ maxWidth:540, color:"var(--muted)" }}>We've engineered the entire stack to remove friction from agricultural financing — secure, transparent, and productive.</p>
          </div>
          <div className="bento">
            <Reveal delay={0} style={{ gridColumn:"span 8" }}>
              <div className="card" style={{ minHeight:280, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                <img src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c83?q=80&w=1000&auto=format&fit=crop" alt="Harvest"
                  style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:.35 }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,#0A0A0A 0%,transparent 60%)" }}/>
                <div style={{ position:"relative", zIndex:2 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:"var(--green)", color:"#000", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1rem" }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  </div>
                  <div className="h3" style={{ fontSize:"1.2rem", marginBottom:".4rem" }}>Asset-Backed Security</div>
                  <p style={{ margin:0, fontSize:".88rem", color:"var(--muted)" }}>Capital doesn't sit idle. Funds directly purchase audited, physical farm materials — seeds, fertilisers, equipment — each insured against comprehensive risks.</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100} style={{ gridColumn:"span 4" }}>
              <div className="card" style={{ height:"100%" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:"rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1rem" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--green)" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div className="h3" style={{ marginBottom:".4rem" }}>Dynamic Cycles</div>
                <p style={{ margin:0, fontSize:".875rem", color:"var(--muted)" }}>Yields generated by real-world crop maturity cycles — completely detached from crypto or stock market volatility.</p>
              </div>
            </Reveal>
            <Reveal delay={200} style={{ gridColumn:"span 4" }}>
              <div className="card" style={{ height:"100%" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:"rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1rem" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--green)" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <div className="h3" style={{ marginBottom:".4rem" }}>Algorithmic Risk Control</div>
                <p style={{ margin:0, fontSize:".875rem", color:"var(--muted)" }}>Integrated KYC, parametric weather insurance, and real-time satellite monitoring protect every single deployment.</p>
              </div>
            </Reveal>
            <Reveal delay={300} style={{ gridColumn:"span 8" }}>
              <div className="card" style={{ background:"linear-gradient(135deg,#0D2218 0%,var(--bg2) 100%)", border:"1px solid rgba(16,185,129,.18)" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:"var(--green)", color:"#000", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1rem" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <div className="h3" style={{ fontSize:"1.2rem", marginBottom:".4rem" }}>Measurable Local Impact</div>
                <p style={{ margin:0, color:"var(--muted)" }}>Every Naira deployed translates directly to boosted regional yields and increased income for 2,000+ vetted farming cooperatives across Nigeria.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Crop Cycles ── */}
      <section id="crops" className="sec" style={{ borderTop:"1px solid var(--border)" }}>
        <div className="wrap">
          <div style={{ marginBottom:"2.75rem" }}>
            <div className="eyebrow"><span>◆</span> Active Cycles</div>
            <h2 className="h2">Choose your crop cycle.</h2>
          </div>
          <CropCards />
        </div>
      </section>

      {/* ── Estimator ── */}
      <section id="estimator" className="sec" style={{ background:"var(--bg2)", borderTop:"1px solid var(--border)" }}>
        <div className="wrap">
          <div className="col2">
            <Reveal>
              <div>
                <div className="eyebrow"><span>◆</span> Yield Terminal</div>
                <h2 className="h2" style={{ marginBottom:"1rem" }}>Simulate your deployment.</h2>
                <p style={{ marginBottom:"2rem", color:"var(--muted)" }}>Configure your capital parameters. The engine calculates your projected maturity payout instantly. Zero management fees.</p>
                <div className="card card-shine">
                  <div style={{ marginBottom:"1.25rem" }}>
                    <label className="lbl">Principal Amount (NGN)</label>
                    <div style={{ position:"relative" }}>
                      <span style={{ position:"absolute", left:"1.1rem", top:"50%", transform:"translateY(-50%)", color:"var(--muted)", fontFamily:"var(--fm)" }}>₦</span>
                      <input type="number" min={100000} value={price} onChange={e=>setPrice(e.target.value)} className="field" style={{ paddingLeft:"2.25rem" }} placeholder="500000"/>
                    </div>
                  </div>
                  <div className="est-row" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem", marginBottom:"1.25rem" }}>
                    <div><label className="lbl">Cycle (Months)</label><input type="number" min={3} max={9} value={months} onChange={e=>setMonths(e.target.value)} className="field" placeholder="6"/></div>
                    <div><label className="lbl">Target APY (%)</label><input type="number" min={10} max={22} value={pct} onChange={e=>setPct(e.target.value)} className="field" placeholder="15"/></div>
                  </div>
                  <div>
                    <label className="lbl">Risk Tranche</label>
                    <div className="risk-row" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:".625rem" }}>
                      {[["Low","10–14% APY","16,185,129"],["Medium","14–18% APY","245,158,11"],["High","18–22% APY","239,68,68"]].map(([lv,rng,rgb])=>{
                        const sel=risk===lv;
                        return <button key={lv} onClick={()=>setRisk(lv)} style={{ padding:".8rem .6rem", borderRadius:10, fontWeight:700, fontSize:".78rem", background:sel?`rgba(${rgb},.1)`:"rgba(255,255,255,.04)", border:`1px solid ${sel?`rgba(${rgb},.5)`:"rgba(255,255,255,.09)"}`, color:sel?`rgb(${rgb})`:"var(--muted)", cursor:"pointer", transition:"all .2s", display:"flex", flexDirection:"column", gap:".15rem", fontFamily:"var(--fb)" }}>
                          <span>{lv}</span><span style={{ fontSize:".63rem", fontFamily:"var(--fm)", opacity:.7 }}>{rng}</span>
                        </button>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="card card-shine" style={{ background:"#030303" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,.07)", paddingBottom:"1rem", marginBottom:"1.75rem" }}>
                  <div style={{ fontSize:".7rem", color:"var(--muted)", fontWeight:700, textTransform:"uppercase", letterSpacing:".08em" }}>Projected Output</div>
                  <div style={{ display:"flex", alignItems:"center", gap:".45rem" }}>
                    <span className="dot-g"/><span style={{ fontSize:".7rem", color:"var(--green)" }}>Live Calc</span>
                  </div>
                </div>
                <div style={{ marginBottom:"1.75rem" }}>
                  <div style={{ fontSize:".73rem", color:"var(--muted)", marginBottom:".45rem" }}>Total Value at Maturity</div>
                  <div style={{ fontSize:"clamp(1.6rem,5vw,2.9rem)", fontWeight:800, lineHeight:1, fontFamily:"var(--fm)", color:"#fff", wordBreak:"break-all" }}>{fmt(calc.total)}</div>
                </div>
                {[{l:"Principal",v:fmt(calc.p),c:"#fff"},{l:"Net Profit",v:`+${fmt(calc.roi)}`,c:"var(--green)"},{l:"Monthly Velocity",v:`${calc.perMo.toFixed(2)}% / mo`,c:"#fff"},{l:"Duration",v:`${calc.m} month${calc.m>1?"s":""}`,c:"#fff"}].map(({l,v,c},i,arr)=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:i<arr.length-1?"1px dashed rgba(255,255,255,.07)":"none", paddingBottom:i<arr.length-1?".875rem":0, marginBottom:i<arr.length-1?".875rem":0 }}>
                    <span style={{ fontSize:".77rem", color:"rgba(255,255,255,.38)", fontFamily:"var(--fm)" }}>{l}</span>
                    <span style={{ fontSize:".875rem", fontFamily:"var(--fm)", color:c }}>{v}</span>
                  </div>
                ))}
                <div style={{ background:"rgba(16,185,129,.04)", border:"1px solid rgba(16,185,129,.1)", borderRadius:8, padding:".875rem", fontSize:".72rem", color:"rgba(255,255,255,.38)", lineHeight:1.65, margin:"1.75rem 0" }}>
                  <span style={{ color:"var(--green)", fontWeight:700 }}>NOTE:</span> APY reflects the full {calc.m}-month lockup. Parametric weather insurance covers 100% of principal.
                </div>
                <a href="/register" className="btn btn-p" style={{ width:"100%", padding:"1.05rem", justifyContent:"center" }}>Initialize Deployment →</a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="sec" style={{ borderTop:"1px solid var(--border)" }}>
        <div className="wrap">
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div className="eyebrow" style={{ justifyContent:"center" }}><span>◆</span> Investor Stories</div>
            <h2 className="h2">Trusted by smart capital.</h2>
          </div>
          <div className="col3">
            {[
              { ii:"FK", name:"Folake", role:"Lagos", q:"The algorithmic risk control gave me confidence to deploy a mid-six-figure sum. Yield has outpaced my fixed-income portfolio by 3× with zero correlation to broader markets." },
              { ii:"M", name:"Muhammed",      role:"Abuja",        q:"Finally, a protocol that touches grass. Real-world asset backing in agriculture is the missing primitive in modern finance. The dashboard transparency is unmatched." },
              { ii:"AK", name:"Akpan",       role:"Port Harcourt",  q:"Seamless deployment, transparent tracking, predictable maturity cycles. I route 10% of my startup treasury through SmartFarmer to hedge against fiat inflation." },
               { ii:"JE", name:"Jessica",       role:"Ogun",  q:"Have been looking for a legit platform to invest in agriculture and earn back. Smartfarmer does not only fill this void, but champion my financial life." },
            ].map(({ ii, name, role, q }, i) => (
              <Reveal key={name} delay={i * 130}>
                <div className="card" style={{ display:"flex", flexDirection:"column", height:"100%" }}
                  onMouseOver={e=>{ e.currentTarget.style.borderColor="rgba(16,185,129,.25)"; e.currentTarget.style.transform="translateY(-4px)"; }}
                  onMouseOut={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; }}>
                  <div style={{ display:"flex", gap:".25rem", marginBottom:"1.1rem" }}>
                    {[...Array(5)].map((_,j)=><span key={j} style={{ color:"#F59E0B", fontSize:".875rem" }}>★</span>)}
                  </div>
                  <p style={{ color:"#D0D0D0", fontSize:".92rem", flexGrow:1, marginBottom:"1.5rem", lineHeight:1.7 }}>"{q}"</p>
                  <div style={{ display:"flex", alignItems:"center", gap:".875rem" }}>
                    <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#10B981,#059669)", display:"grid", placeItems:"center", fontWeight:800, fontSize:".78rem", color:"#000", flexShrink:0 }}>{ii}</div>
                    <div>
                      <div style={{ fontWeight:700, color:"#fff", fontSize:".875rem" }}>{name}</div>
                      <div style={{ fontSize:".72rem", color:"rgba(255,255,255,.33)" }}>{role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="sec" style={{ background:"var(--bg2)", borderTop:"1px solid var(--border)" }}>
        <div className="wrap">
          <div className="col2" style={{ alignItems:"flex-start" }}>
            <Reveal>
              <div style={{ position:"sticky", top:96 }}>
                <div className="eyebrow"><span>◆</span> FAQ</div>
                <h2 className="h2" style={{ marginBottom:"1rem" }}>System Queries.</h2>
                <p style={{ marginBottom:"2rem", color:"var(--muted)" }}>Everything you need to know about the platform, risk management, and capital deployment.</p>
                <div style={{ background:"rgba(16,185,129,.06)", border:"1px solid rgba(16,185,129,.15)", borderRadius:16, padding:"1.5rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:".625rem", marginBottom:".75rem" }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#10B981,#059669)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    </div>
                    <span style={{ fontWeight:700, color:"#fff", fontSize:".9rem" }}>Still have questions?</span>
                  </div>
                  <p style={{ marginBottom:"1rem", color:"var(--muted)", fontSize:".85rem" }}>Our support team is available on Telegram, Instagram, and email — or send us a quick message here.</p>
                  <button className="btn btn-p" style={{ fontSize:".85rem", padding:".6rem 1.25rem" }} onClick={()=>document.querySelector(".cfab")?.click()}>
                    Chat with Support →
                  </button>
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div>{faqs.map(({ q, a }) => <FAQItem key={q} q={q} a={a}/>)}</div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Affiliate Program ── */}
      <AffiliateSection />

      {/* ── CTA ── */}
      <section style={{ borderTop:"1px solid var(--border)", padding:"5.5rem 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"700px", height:"350px", background:"radial-gradient(ellipse,rgba(16,185,129,.09) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div className="wrap" style={{ textAlign:"center" }}>
          <Reveal>
            <div className="badge" style={{ margin:"0 auto 1.5rem", width:"fit-content" }}>
              <span className="dot-g"/>Limited slots available this season
            </div>
            <h2 className="h2" style={{ maxWidth:640, margin:"0 auto 1.1rem" }}>Ready to put your capital to work in Nigerian soil?</h2>
            <p style={{ maxWidth:440, margin:"0 auto 2.25rem", color:"var(--muted)" }}>Join 2,400+ investors earning predictable, asset-backed returns from agriculture. Get started in under 5 minutes.</p>
            <div style={{ display:"flex", gap:".875rem", justifyContent:"center", flexWrap:"wrap" }}>
              <a href="/register" className="btn btn-p" style={{ padding:"1rem 2rem" }}>Deploy Capital Today</a>
              <a href="/docs"     className="btn btn-s" style={{ padding:"1rem 2rem" }}>Read the Docs</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background:"#030303", borderTop:"1px solid rgba(255,255,255,.06)", padding:"4rem 0 2rem" }}>
        <div className="wrap">
          <div className="ft-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"3rem", marginBottom:"3rem" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:"1rem" }}>
                <img src="/logo-dark-theme.png" alt="SmartFarmer" style={{ height:30, width:30, objectFit:"contain", borderRadius:6 }} />
                <span style={{ fontFamily:"var(--fd)", fontWeight:800, fontSize:"1.05rem" }}>SmartFarmer</span>
              </div>
              <p style={{ marginBottom:"1.5rem", maxWidth:250, lineHeight:1.7, color:"var(--muted)", fontSize:".875rem" }}>Bridging Nigerian capital with verified agricultural assets. Institutional-grade returns from real-world production.</p>
              {/* Social Links */}
              <div style={{ display:"flex", gap:".75rem", flexWrap:"wrap" }}>
                {/* X / Twitter */}
                <a href="https://x.com/smartfarmer_ng" target="_blank" rel="noopener noreferrer"
                  title="X / Twitter"
                  style={{ color:"rgba(255,255,255,.28)", transition:"color .2s", display:"flex", alignItems:"center", justifyContent:"center", width:34, height:34, borderRadius:8, border:"1px solid rgba(255,255,255,.1)", background:"rgba(255,255,255,.04)" }}
                  onMouseOver={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="rgba(255,255,255,.25)";e.currentTarget.style.background="rgba(255,255,255,.08)"}}
                  onMouseOut={e=>{e.currentTarget.style.color="rgba(255,255,255,.28)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";e.currentTarget.style.background="rgba(255,255,255,.04)"}}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.258 5.639 5.906-5.639zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/smartfarmer_ng?igsh=enEwc2ZwYnZkZmUy" target="_blank" rel="noopener noreferrer"
                  title="Instagram"
                  style={{ color:"rgba(255,255,255,.28)", transition:"color .2s", display:"flex", alignItems:"center", justifyContent:"center", width:34, height:34, borderRadius:8, border:"1px solid rgba(255,255,255,.1)", background:"rgba(255,255,255,.04)" }}
                  onMouseOver={e=>{e.currentTarget.style.color="#E1306C";e.currentTarget.style.borderColor="rgba(225,48,108,.3)";e.currentTarget.style.background="rgba(225,48,108,.08)"}}
                  onMouseOut={e=>{e.currentTarget.style.color="rgba(255,255,255,.28)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";e.currentTarget.style.background="rgba(255,255,255,.04)"}}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                {/* Telegram */}
                <a href="https://t.me/smartfarmerng" target="_blank" rel="noopener noreferrer"
                  title="Telegram"
                  style={{ color:"rgba(255,255,255,.28)", transition:"color .2s", display:"flex", alignItems:"center", justifyContent:"center", width:34, height:34, borderRadius:8, border:"1px solid rgba(255,255,255,.1)", background:"rgba(255,255,255,.04)" }}
                  onMouseOver={e=>{e.currentTarget.style.color="#229ED9";e.currentTarget.style.borderColor="rgba(34,158,217,.3)";e.currentTarget.style.background="rgba(34,158,217,.08)"}}
                  onMouseOut={e=>{e.currentTarget.style.color="rgba(255,255,255,.28)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";e.currentTarget.style.background="rgba(255,255,255,.04)"}}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </a>
              </div>
            </div>
            {[
              { title:"Platform", links:[["How It Works","#how"],["Crop Cycles","#crops"],["Yield Terminal","#estimator"],["Affiliate Program","#affiliate"]] },
              { title:"Company",  links:[["About Us","/about"],["Blog","/blog"],["Contact","/contact"],["Partner With Us","#affiliate"]] },
              { title:"Connect",  links:[["X / Twitter","https://x.com/smartfarmer_ng"],["Instagram","https://www.instagram.com/smartfarmer_ng"],["Telegram","https://t.me/smartfarmerng"],["Email","mailto:support@smartfarmer.ng"]] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 style={{ color:"#fff", marginBottom:"1rem", fontSize:".68rem", textTransform:"uppercase", letterSpacing:".08em", fontWeight:700 }}>{title}</h4>
                <div style={{ display:"flex", flexDirection:"column", gap:".6rem" }}>
                  {links.map(([l,h])=>(
                    <a key={l} href={h} style={{ color:"rgba(255,255,255,.32)", fontSize:".85rem", transition:"color .2s" }}
                      target={h.startsWith('http')||h.startsWith('mailto')?'_blank':undefined}
                      rel={h.startsWith('http')?"noopener noreferrer":undefined}
                      onMouseOver={e=>e.target.style.color="#fff"} onMouseOut={e=>e.target.style.color="rgba(255,255,255,.32)"}>{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="ft-btm" style={{ borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".75rem", fontSize:".75rem", color:"rgba(255,255,255,.22)" }}>
            <span>© {new Date().getFullYear()} SmartFarmer OS. All rights reserved.</span>
            <span style={{ display:"flex", alignItems:"center", gap:".45rem" }}>
              <span style={{ width:6, height:6, background:"var(--green)", borderRadius:"50%", boxShadow:"0 0 6px var(--green)" }}/>
              All Systems Operational · Lagos, Nigeria
            </span>
          </div>
        </div>
      </footer>

      {/* ── Mobile sticky bar ── */}
      <div className="mob-bar" style={{ position:"fixed", bottom:0, left:0, right:0, padding:".875rem 1rem", background:"rgba(5,5,5,.97)", backdropFilter:"blur(16px)", borderTop:"1px solid rgba(255,255,255,.07)", transform:sticky?"translateY(0)":"translateY(100%)", transition:"transform .3s cubic-bezier(.4,0,.2,1)", zIndex:90, flexDirection:"column" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem" }}>
          <a href="/login"    className="btn btn-s" style={{ padding:".75rem" }}>Log in</a>
          <a href="/register" className="btn btn-p" style={{ padding:".75rem" }}>Deploy Capital</a>
        </div>
      </div>

      <SupportWidget />
    </>
  );
}
