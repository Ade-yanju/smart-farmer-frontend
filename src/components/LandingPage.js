import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * SMARTFARMER OS - VERSION 3.0 (AGGRESSIVE SILICON VALLEY UPGRADE)
 * Design System: Obsidian & Emerald High-Frequency
 */

export default function LandingPage() {
  /* ---------------- State & Logic ---------------- */
  const [price, setPrice] = useState(2500000);
  const [months, setMonths] = useState(12);
  const [pct, setPct] = useState(24);
  const [risk, setRisk] = useState("Alpha");
  const [activeFaq, setActiveFaq] = useState(null);
  const [footerOpen, setFooterOpen] = useState(false);

  const calc = useMemo(() => {
    const p = Math.max(0, Number(price));
    const m = Math.max(1, Number(months));
    const pr = Math.max(0, Number(pct));
    const roi = (pr / 100) * p;
    return { 
      p, m, pr, roi, 
      total: p + roi, 
      perMonth: (pr / m).toFixed(1),
      daily: (roi / (m * 30)).toFixed(0)
    };
  }, [price, months, pct]);

  const fmt = (n) => new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", minimumFractionDigits: 0
  }).format(n);

  const faqs = [
    {
      q: "How does the protocol generate non-correlated alpha?",
      a: "By bypassing traditional agricultural middlemen. SmartFarmer routes institutional liquidity directly into heavily vetted, parametrically insured agricultural operations, capturing the full yield delta natively."
    },
    {
      q: "Is my deployed capital locked?",
      a: "Yes. Algorithmic farming cycles require hard commitments. Capital is deployed into real-world assets (RWAs) and cannot be liquidated until the harvest cycle matures. We do not do fractional reserves."
    },
    {
      q: "What happens in a catastrophic crop failure event?",
      a: "Every deployment is hedged via smart-contract parametric weather insurance and on-the-ground risk tranches. In a Level 5 failure event, principal is recovered via our multi-sig insurance pool."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <GlobalStyles />
      
      {/* --- TOP HUD --- */}
      <nav className="glass-nav" style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
        <div className="container" style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>SmartFarmer<span style={{color: "var(--brand)"}}>.os</span></span>
          </div>
          <div className="desktop-only" style={{ display: "flex", gap: "32px", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted)" }}>
            <a href="#" className="nav-link">Infrastructure</a>
            <a href="#" className="nav-link">Liquidity</a>
            <a href="#" className="nav-link">Audit Reports</a>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn-ghost mobile-hide">Client Portal</button>
            <button className="btn-primary-sm">Deploy Capital</button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section style={{ paddingTop: "160px", paddingBottom: "100px", position: "relative", overflow: "hidden" }}>
        <div className="spotlight" />
        <div className="grid-bg" />
        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
          <Reveal>
            <div className="announcement-badge">
              <span className="dot" /> $150M TVL Surpassed in Q3
            </div>
            <h1 className="hero-title">
              Weaponize your liquidity.<br/>
              <span className="gradient-text">Farm real-world alpha.</span>
            </h1>
            <p className="hero-subtitle">
              The first decentralized operating system for aggressively scaling agricultural financing. <br className="desktop-only"/> 
              Automated auditing. Parametric insurance. Ruthless capital efficiency.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "40px" }}>
              <button className="btn-primary-lg">Execute Deployment</button>
              <button className="btn-secondary-lg">Read the Docs</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- YIELD TERMINAL (THE "CORE") --- */}
      <section className="container" style={{ paddingBottom: "120px", position: "relative", zIndex: 10 }}>
        <Reveal delay={200}>
          <div className="terminal-container">
            <div className="terminal-header">
              <div style={{ display: "flex", gap: "6px" }}>
                <div className="dot-red" /> <div className="dot-amber" /> <div className="dot-green" />
              </div>
              <div className="terminal-title">LIQUIDITY_ROUTER_V3.exe</div>
              <div style={{ fontSize: "10px", color: "var(--brand)", fontWeight: "bold" }}>SYSTEM_ONLINE</div>
            </div>
            
            <div className="terminal-body">
              {/* Controls */}
              <div className="terminal-panel-left">
                <div className="input-row">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <label className="terminal-label">Deployment Capital</label>
                    <span className="terminal-value">{fmt(price)}</span>
                  </div>
                  <input type="range" min="500000" max="50000000" step="100000" value={price} onChange={e => setPrice(e.target.value)} className="sf-slider" />
                </div>

                <div className="input-row">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <label className="terminal-label">Lock-up Period</label>
                    <span className="terminal-value">{months} Months</span>
                  </div>
                  <input type="range" min="6" max="36" step="1" value={months} onChange={e => setMonths(e.target.value)} className="sf-slider" />
                </div>

                <div className="input-row">
                  <label className="terminal-label" style={{ marginBottom: "16px", display: "block" }}>Risk Matrix Tranche</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                    {['Senior', 'Mezzanine', 'Alpha'].map(lvl => (
                      <button 
                        key={lvl} 
                        onClick={() => {
                            setRisk(lvl);
                            setPct(lvl === 'Senior' ? 12 : lvl === 'Mezzanine' ? 18 : 28);
                        }}
                        className={`risk-btn ${risk === lvl ? 'active' : ''}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visualization */}
              <div className="terminal-panel-right">
                <div style={{ marginBottom: "32px" }}>
                  <div className="stat-label">PROJECTED MATURITY VALUE</div>
                  <div className="stat-main">{fmt(calc.total)}</div>
                </div>

                <div className="grid-mini">
                  <div className="mini-card">
                    <span className="mini-label">Target APY</span>
                    <span className="mini-value text-brand">{calc.pr}%</span>
                  </div>
                  <div className="mini-card">
                    <span className="mini-label">Daily Accrual</span>
                    <span className="mini-value">{fmt(calc.daily)}</span>
                  </div>
                </div>

                <div className="timeline-container">
                  <div className="timeline-header">
                    <span>Initiation</span>
                    <span>Harvest Event</span>
                  </div>
                  <div className="timeline-track">
                    <div className="timeline-fill" style={{ width: `${(months / 36) * 100}%` }} />
                  </div>
                </div>

                <button className="btn-deploy-action">
                  Initialize Smart Contract
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section style={{ paddingBottom: "120px", background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(16, 185, 129, 0.03) 100%)" }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">Verified Operators</h2>
            <p className="section-subtitle">What the highest-performing asset managers are saying.</p>
            <div className="testimonial-grid">
              <div className="testimonial-card">
                <p className="quote">"SmartFarmer completely eliminated our counterparty risk. The yield delta is unprecedented compared to traditional ag-tech debt."</p>
                <div className="author">
                  <div className="avatar" style={{background: "#333"}} />
                  <div>
                    <div className="author-name">E. Thorne</div>
                    <div className="author-title">Partner, Apex Ventures</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="quote">"The parametric insurance integration means we can deploy eight-figure tranches into emerging markets without sweating the weather data."</p>
                <div className="author">
                  <div className="avatar" style={{background: "#444"}} />
                  <div>
                    <div className="author-name">M. Chen</div>
                    <div className="author-title">Head of Real Assets, Ouroboros Capital</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="container" style={{ paddingBottom: "120px" }}>
        <Reveal>
          <h2 className="section-title">Protocol Inquiries</h2>
          <div className="faq-container">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${activeFaq === i ? 'active' : ''}`} onClick={() => toggleFaq(i)}>
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <span className="faq-icon">{activeFaq === i ? '-' : '+'}</span>
                </div>
                <div className="faq-answer" style={{ maxHeight: activeFaq === i ? '200px' : '0', opacity: activeFaq === i ? 1 : 0 }}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* --- INTERACTIVE FOOTER --- */}
      <footer onClick={() => setFooterOpen(!footerOpen)} style={{ borderTop: "1px solid var(--border)", background: footerOpen ? "var(--surface)" : "transparent", transition: "0.4s", cursor: "pointer", overflow: "hidden" }}>
        <div className="container" style={{ padding: "60px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--muted)", fontSize: "0.8rem", position: "relative" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ color: "#fff", fontWeight: 700 }}>© 2026 SmartFarmer OS.</div>
            <div>Built for institutional liquidity. Click to {footerOpen ? "close" : "decrypt origin"}.</div>
          </div>
          
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <span className="status-indicator">All Nodes Synced</span>
          </div>
        </div>

        {/* Hidden Details revealed on click */}
        <div className={`footer-details ${footerOpen ? "open" : ""}`}>
          <div className="container" style={{ padding: "0 24px 60px" }}>
            <div className="footer-grid">
              <div>
                <h4 style={{ color: "#fff", marginBottom: "12px", fontFamily: "'JetBrains Mono', monospace" }}>// THE MANIFESTO</h4>
                <p>We are ex-HFT quants, satellite engineers, and algorithmic game theorists. We looked at the $3 Trillion agricultural sector and saw unacceptable latency. SmartFarmer OS was built to fix this. Backed by $50M from tier-1 SV funds, we are turning dirt into deterministic yield.</p>
              </div>
              <div>
                <h4 style={{ color: "#fff", marginBottom: "12px", fontFamily: "'JetBrains Mono', monospace" }}>// TELEMETRY</h4>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li>Headquarters: San Francisco, CA</li>
                  <li>Uptime: 99.999%</li>
                  <li>Audited by: CertiK & Trail of Bits</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------- CSS-IN-JS FOR SPEED & SCOPE ------------------- */
function GlobalStyles() {
  return (
    <style>{`
      :root {
        --brand: #10B981;
        --brand-glow: rgba(16, 185, 129, 0.15);
        --muted: #A1A1AA;
        --border: rgba(255, 255, 255, 0.12);
        --surface: #0C0C0E;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #000; overflow-x: hidden; }
      .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
      
      /* Typography */
      .hero-title { font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 900; letter-spacing: -0.05em; line-height: 1.05; margin-bottom: 24px; }
      .gradient-text { background: linear-gradient(135deg, #fff 0%, var(--brand) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .hero-subtitle { color: var(--muted); font-size: 1.25rem; line-height: 1.6; max-width: 650px; margin: 0 auto; font-weight: 400; }
      .section-title { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 12px; }
      .section-subtitle { color: var(--muted); font-size: 1.1rem; margin-bottom: 48px; }

      /* Components */
      .announcement-badge {
        display: inline-flex; align-items: center; gap: 8px; background: rgba(16,185,129,0.05);
        border: 1px solid rgba(16,185,129,0.2); padding: 8px 16px; border-radius: 99px;
        font-size: 0.8rem; font-weight: 700; color: var(--brand); margin-bottom: 32px; letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .dot { width: 6px; height: 6px; background: var(--brand); border-radius: 50%; box-shadow: 0 0 12px var(--brand); }

      .spotlight {
        position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
        width: 150vw; height: 100vh;
        background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.12) 0%, transparent 60%);
        pointer-events: none; z-index: 0;
      }
      .grid-bg {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 40px 40px; pointer-events: none; z-index: 0;
        mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
        -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
      }

      /* Buttons */
      .btn-primary-sm { background: #fff; color: #000; padding: 10px 20px; border-radius: 6px; font-weight: 700; border: none; cursor: pointer; transition: 0.2s; font-size: 0.85rem;}
      .btn-primary-sm:hover { background: var(--brand); box-shadow: 0 0 15px var(--brand-glow); }
      
      .btn-primary-lg { background: #fff; color: #000; padding: 16px 32px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: 0.2s; font-size: 1rem; }
      .btn-primary-lg:hover { transform: translateY(-2px); background: var(--brand); box-shadow: 0 8px 30px rgba(16, 185, 129, 0.3); }
      .btn-secondary-lg { background: rgba(255,255,255,0.03); color: #fff; padding: 16px 32px; border-radius: 8px; font-weight: 700; border: 1px solid var(--border); cursor: pointer; font-size: 1rem; backdrop-filter: blur(10px); transition: 0.2s; }
      .btn-secondary-lg:hover { background: rgba(255,255,255,0.08); }
      .btn-ghost { background: transparent; border: none; color: #fff; font-weight: 600; cursor: pointer; }

      /* Terminal UI */
      .terminal-container { 
        background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
        overflow: hidden; box-shadow: 0 20px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05) inset;
      }
      .terminal-header { 
        background: #000; padding: 12px 20px; border-bottom: 1px solid var(--border);
        display: flex; justify-content: space-between; align-items: center;
      }
      .terminal-title { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.05em; }
      .terminal-body { display: grid; grid-template-columns: 1.2fr 1fr; }
      
      .terminal-panel-left { padding: 48px; border-right: 1px solid var(--border); }
      .terminal-panel-right { padding: 48px; background: rgba(0,0,0,0.3); }

      .terminal-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 700; }
      .terminal-value { font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; color: #fff; font-weight: 600; }

      /* Sliders */
      .sf-slider { 
        width: 100%; height: 4px; background: #333; border-radius: 2px; -webkit-appearance: none; margin-bottom: 40px;
      }
      .sf-slider::-webkit-slider-thumb {
        -webkit-appearance: none; width: 18px; height: 18px; background: #fff; border-radius: 50%; cursor: pointer;
        box-shadow: 0 0 15px rgba(255,255,255,0.5); transition: 0.2s;
      }
      .sf-slider::-webkit-slider-thumb:hover { transform: scale(1.2); background: var(--brand); box-shadow: 0 0 20px var(--brand); }

      /* Risk Buttons */
      .risk-btn {
        background: transparent; border: 1px solid var(--border); color: var(--muted);
        padding: 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: 0.2s; text-transform: uppercase; letter-spacing: 0.05em;
      }
      .risk-btn:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
      .risk-btn.active { background: var(--brand-glow); border-color: var(--brand); color: var(--brand); box-shadow: 0 0 20px rgba(16,185,129,0.1) inset; }

      /* Results */
      .stat-label { font-size: 0.75rem; color: var(--brand); font-weight: 800; letter-spacing: 0.1em; margin-bottom: 8px; }
      .stat-main { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.04em; font-family: 'JetBrains Mono', monospace; line-height: 1; }

      .grid-mini { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 40px; }
      .mini-card { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 8px; border: 1px solid var(--border); }
      .mini-label { display: block; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.05em; }
      .mini-value { font-weight: 800; font-size: 1.25rem; font-family: 'JetBrains Mono', monospace; }
      .text-brand { color: var(--brand); }

      .timeline-track { width: 100%; height: 6px; background: #222; border-radius: 3px; margin: 12px 0 32px; overflow: hidden; }
      .timeline-fill { height: 100%; background: var(--brand); border-radius: 3px; box-shadow: 0 0 20px var(--brand); transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      .timeline-header { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; }

      .btn-deploy-action {
        width: 100%; padding: 20px; background: var(--brand); color: #000; border: none;
        border-radius: 8px; font-weight: 900; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: 0.2s;
      }
      .btn-deploy-action:hover { filter: brightness(1.2); box-shadow: 0 0 30px rgba(16,185,129,0.4); }

      /* Testimonials */
      .testimonial-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
      .testimonial-card { background: var(--surface); border: 1px solid var(--border); padding: 40px; border-radius: 12px; transition: 0.3s; }
      .testimonial-card:hover { border-color: rgba(16, 185, 129, 0.3); transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
      .quote { font-size: 1.1rem; line-height: 1.6; font-style: italic; color: #fff; margin-bottom: 24px; font-weight: 500; }
      .author { display: flex; gap: 16px; align-items: center; }
      .avatar { width: 48px; height: 48px; border-radius: 50%; border: 1px solid var(--border); }
      .author-name { font-weight: 700; font-size: 1rem; }
      .author-title { color: var(--brand); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

      /* FAQ */
      .faq-container { border-top: 1px solid var(--border); }
      .faq-item { border-bottom: 1px solid var(--border); cursor: pointer; transition: 0.3s; }
      .faq-item:hover { background: rgba(255,255,255,0.02); }
      .faq-question { padding: 32px 0; display: flex; justify-content: space-between; align-items: center; font-size: 1.2rem; font-weight: 600; }
      .faq-icon { font-size: 1.5rem; color: var(--brand); font-weight: 300; }
      .faq-answer { overflow: hidden; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      .faq-answer p { padding-bottom: 32px; color: var(--muted); line-height: 1.6; font-size: 1.05rem; }
      .faq-item.active .faq-question { color: var(--brand); }

      /* Footer Interaction */
      .footer-details { max-height: 0; opacity: 0; transition: 0.5s ease; }
      .footer-details.open { max-height: 300px; opacity: 1; }
      .footer-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 60px; color: var(--muted); line-height: 1.6; }

      .status-indicator { display: flex; align-items: center; gap: 8px; font-weight: 600; }
      .status-indicator::before { content: ""; width: 8px; height: 8px; background: var(--brand); border-radius: 50%; animation: pulse 2s infinite; box-shadow: 0 0 10px var(--brand); }

      @keyframes pulse {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(1.2); }
        100% { opacity: 1; transform: scale(1); }
      }

      @media (max-width: 768px) {
        .terminal-body { grid-template-columns: 1fr; }
        .terminal-panel-left { border-right: none; border-bottom: 1px solid var(--border); padding: 24px; }
        .terminal-panel-right { padding: 24px; }
        .testimonial-grid { grid-template-columns: 1fr; }
        .footer-grid { grid-template-columns: 1fr; gap: 30px; }
        .mobile-hide { display: none; }
        .hero-title { font-size: 2.5rem; }
        .stat-main { font-size: 2.5rem; }
      }
    `}</style>
  );
}

/* ------------------- MOTION WRAPPER ------------------- */
function Reveal({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: `all 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
    }}>
      {children}
    </div>
  );
}
