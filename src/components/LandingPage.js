import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * SMARTFARMER OS - VERSION 2.1 (SILICON VALLEY EDITION)
 * Design System: Emerald-Dark High-Performance
 */

export default function LandingPage() {
  /* ---------------- State & Logic ---------------- */
  const [price, setPrice] = useState(1250000);
  const [months, setMonths] = useState(8);
  const [pct, setPct] = useState(18);
  const [risk, setRisk] = useState("Low");

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

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <GlobalStyles />
      
      {/* --- TOP HUD --- */}
      <nav className="glass-nav" style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container" style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>SmartFarmer<span style={{color: "var(--brand)"}}>.os</span></span>
          </div>
          <div className="desktop-only" style={{ display: "flex", gap: "32px", fontSize: "0.85rem", fontWeight: 500, color: "var(--muted)" }}>
            <a href="#" className="nav-link">Infrastructure</a>
            <a href="#" className="nav-link">Protocol</a>
            <a href="#" className="nav-link">Yields</a>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn-ghost mobile-hide">Log in</button>
            <button className="btn-primary-sm">Deploy Capital</button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section style={{ paddingTop: "140px", paddingBottom: "100px", position: "relative", overflow: "hidden" }}>
        <div className="spotlight" />
        <div className="container" style={{ textAlign: "center" }}>
          <Reveal>
            <div className="announcement-badge">
              <span className="dot" /> Now accepting institutional liquidity
            </div>
            <h1 className="hero-title">
              Agricultural yield <br/>
              <span className="gradient-text">meets capital efficiency.</span>
            </h1>
            <p className="hero-subtitle">
              The first decentralized operating system for agricultural financing. <br className="desktop-only"/> 
              Automated auditing. Parametric insurance. Non-correlated returns.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "40px" }}>
              <button className="btn-primary-lg">Start Investing</button>
              <button className="btn-secondary-lg">Read Whitepaper</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- YIELD TERMINAL (THE "CORE") --- */}
      <section className="container" style={{ paddingBottom: "120px" }}>
        <Reveal delay={200}>
          <div className="terminal-container">
            <div className="terminal-header">
              <div style={{ display: "flex", gap: "6px" }}>
                <div className="dot-red" /> <div className="dot-amber" /> <div className="dot-green" />
              </div>
              <div className="terminal-title">YIELD_SIMULATOR_V2.exe</div>
              <div style={{ fontSize: "10px", color: "var(--muted)" }}>READY_TO_DEPLOY</div>
            </div>
            
            <div className="terminal-body">
              {/* Controls */}
              <div className="terminal-panel-left">
                <div className="input-row">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <label className="terminal-label">Principal Amount</label>
                    <span className="terminal-value">{fmt(price)}</span>
                  </div>
                  <input type="range" min="100000" max="10000000" step="50000" value={price} onChange={e => setPrice(e.target.value)} className="sf-slider" />
                </div>

                <div className="input-row">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <label className="terminal-label">Deployment Cycle</label>
                    <span className="terminal-value">{months} Months</span>
                  </div>
                  <input type="range" min="3" max="24" step="1" value={months} onChange={e => setMonths(e.target.value)} className="sf-slider" />
                </div>

                <div className="input-row">
                  <label className="terminal-label" style={{ marginBottom: "16px", display: "block" }}>Risk Tranche Configuration</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                    {['Low', 'Medium', 'High'].map(lvl => (
                      <button 
                        key={lvl} 
                        onClick={() => setRisk(lvl)}
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
                  <div className="stat-label">EXPECTED MATURITY VALUE</div>
                  <div className="stat-main">{fmt(calc.total)}</div>
                </div>

                <div className="grid-mini">
                  <div className="mini-card">
                    <span className="mini-label">Monthly ROI</span>
                    <span className="mini-value text-brand">{calc.perMonth}%</span>
                  </div>
                  <div className="mini-card">
                    <span className="mini-label">Daily Accrual</span>
                    <span className="mini-value">{fmt(calc.daily)}</span>
                  </div>
                </div>

                <div className="timeline-container">
                  <div className="timeline-header">
                    <span>Initiation</span>
                    <span>Maturity</span>
                  </div>
                  <div className="timeline-track">
                    <div className="timeline-fill" style={{ width: `${(months / 24) * 100}%` }} />
                  </div>
                </div>

                <button className="btn-deploy-action">
                  Initialize Protocol Deployment
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* --- TRUST LOGOS --- */}
      <section style={{ paddingBottom: "100px", opacity: 0.5 }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "40px", filter: "grayscale(1)" }}>
          <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>Adesola Capital</span>
          <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>Lagos Venture Group</span>
          <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>AgriCore Global</span>
          <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>SEC Compliant</span>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ borderTop: "1px solid #111", padding: "60px 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--muted)", fontSize: "0.8rem" }}>
          <div>© 2026 SmartFarmer OS. Built for institutional liquidity.</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <span className="status-indicator">All Systems Operational</span>
            <div style={{ display: "flex", gap: "16px" }}>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
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
        --brand-glow: rgba(16, 185, 129, 0.2);
        --muted: #71717A;
        --border: rgba(255, 255, 255, 0.08);
        --surface: #09090B;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }
      .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
      
      /* Typography */
      .hero-title { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 850; letter-spacing: -0.05em; line-height: 1; margin-bottom: 24px; }
      .gradient-text { background: linear-gradient(to right, #fff, var(--brand)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .hero-subtitle { color: var(--muted); font-size: 1.25rem; line-height: 1.6; max-width: 600px; margin: 0 auto; }

      /* Components */
      .announcement-badge {
        display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03);
        border: 1px solid var(--border); padding: 6px 14px; border-radius: 99px;
        font-size: 0.75rem; font-weight: 600; color: var(--brand); margin-bottom: 32px;
      }
      .dot { width: 6px; height: 6px; background: var(--brand); border-radius: 50%; box-shadow: 0 0 8px var(--brand); }

      .spotlight {
        position: absolute; top: 0; left: 50%; transform: translateX(-50%);
        width: 100vw; height: 100vh;
        background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
        pointer-events: none; z-index: 0;
      }

      /* Buttons */
      .btn-primary-lg { background: #fff; color: #000; padding: 14px 28px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; transition: 0.2s; }
      .btn-primary-lg:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255,255,255,0.1); }
      .btn-secondary-lg { background: rgba(255,255,255,0.05); color: #fff; padding: 14px 28px; border-radius: 8px; font-weight: 600; border: 1px solid var(--border); cursor: pointer; }

      /* Terminal UI */
      .terminal-container { 
        background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
        overflow: hidden; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8);
      }
      .terminal-header { 
        background: #111; padding: 12px 20px; border-bottom: 1px solid var(--border);
        display: flex; justify-content: space-between; align-items: center;
      }
      .terminal-title { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); }
      .terminal-body { display: grid; grid-template-columns: 1.2fr 1fr; }
      
      .terminal-panel-left { padding: 40px; border-right: 1px solid var(--border); }
      .terminal-panel-right { padding: 40px; background: rgba(255,255,255,0.01); }

      .terminal-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 700; }
      .terminal-value { font-family: 'JetBrains Mono', monospace; font-size: 1.1rem; color: #fff; }

      /* Sliders */
      .sf-slider { 
        width: 100%; height: 4px; background: #222; border-radius: 2px; -webkit-appearance: none; margin-bottom: 40px;
      }
      .sf-slider::-webkit-slider-thumb {
        -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border-radius: 50%; cursor: pointer;
        box-shadow: 0 0 10px rgba(255,255,255,0.4);
      }

      /* Risk Buttons */
      .risk-btn {
        background: transparent; border: 1px solid var(--border); color: var(--muted);
        padding: 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: 0.2s;
      }
      .risk-btn.active { background: var(--brand-glow); border-color: var(--brand); color: var(--brand); }

      /* Results */
      .stat-label { font-size: 0.75rem; color: var(--brand); font-weight: 700; letter-spacing: 0.05em; margin-bottom: 8px; }
      .stat-main { font-size: 3rem; font-weight: 800; letter-spacing: -0.03em; font-family: 'JetBrains Mono', monospace; }

      .grid-mini { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
      .mini-card { background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; border: 1px solid var(--border); }
      .mini-label { display: block; font-size: 0.65rem; color: var(--muted); text-transform: uppercase; margin-bottom: 4px; }
      .mini-value { font-weight: 700; font-size: 1.1rem; }
      .text-brand { color: var(--brand); }

      .timeline-track { width: 100%; height: 6px; background: #111; border-radius: 3px; margin: 12px 0 32px; }
      .timeline-fill { height: 100%; background: var(--brand); border-radius: 3px; box-shadow: 0 0 15px var(--brand); transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      .timeline-header { display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--muted); text-transform: uppercase; }

      .btn-deploy-action {
        width: 100%; padding: 18px; background: var(--brand); color: #000; border: none;
        border-radius: 8px; font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: 0.2s;
      }
      .btn-deploy-action:hover { filter: brightness(1.1); transform: scale(1.01); }

      .status-indicator { display: flex; alignItems: center; gap: 8px; }
      .status-indicator::before { content: ""; width: 8px; height: 8px; background: var(--brand); border-radius: 50%; animation: pulse 2s infinite; }

      @keyframes pulse {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.2); }
        100% { opacity: 1; transform: scale(1); }
      }

      @media (max-width: 768px) {
        .terminal-body { grid-template-columns: 1fr; }
        .terminal-panel-left { border-right: none; border-bottom: 1px solid var(--border); }
        .mobile-hide { display: none; }
        .hero-title { font-size: 2.8rem; }
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
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `all 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
    }}>
      {children}
    </div>
  );
}
