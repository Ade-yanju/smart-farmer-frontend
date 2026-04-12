import React, { useEffect, useMemo, useRef, useState } from "react";

export default function LandingPage() {
  /* ---------------- Estimator Logic ---------------- */
  const [price, setPrice] = useState(500000);
  const [months, setMonths] = useState(6);
  const [pct, setPct] = useState(15);
  const [risk, setRisk] = useState("Low"); // Low | Medium | High

  const calc = useMemo(() => {
    const p = Math.max(0, Number(price) || 0);
    const m = Math.max(1, Number(months) || 1);
    const pr = Math.max(0, Number(pct) || 0);
    const roi = (pr / 100) * p;
    const total = p + roi;
    const perMonth = pr / m;
    return { p, m, pr, roi, total, perMonth };
  }, [price, months, pct]);

  const fmt = (n) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);

  // Sticky mobile CTA visibility
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sf-app">
      <style>{`
        :root {
          /* Silicon Valley Dark Mode Palette */
          --brand-primary: #10B981; /* Neon Emerald */
          --brand-primary-hover: #059669;
          --brand-surface: #132E24;
          --bg-main: #000000;
          --bg-secondary: #0A0A0A;
          --border-light: rgba(255, 255, 255, 0.1);
          --border-glow: rgba(16, 185, 129, 0.3);
          
          --text-main: #FFFFFF;
          --text-muted: #A1A1AA;
          
          --risk-low: #10B981;
          --risk-med: #F59E0B;
          --risk-high: #EF4444;

          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
          --shadow-glow: 0 0 30px rgba(16, 185, 129, 0.15);
          --shadow-card: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 20px 40px -10px rgba(0,0,0,0.5);
          
          --radius-md: 12px;
          --radius-lg: 24px;
          --radius-full: 9999px;
          
          --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { 
          background: var(--bg-main); 
          color: var(--text-main); 
          font-family: var(--font-sans); 
          -webkit-font-smoothing: antialiased; 
          overflow-x: hidden;
        }

        /* Typography */
        h1 { font-size: clamp(3rem, 6vw, 5rem); font-weight: 800; line-height: 1; letter-spacing: -0.04em; }
        h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; }
        h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; letter-spacing: -0.01em; color: var(--text-main); }
        p { color: var(--text-muted); line-height: 1.6; font-size: 1.125rem; }

        /* Layout & Grid */
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .section { padding: clamp(5rem, 10vw, 8rem) 0; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        
        /* Bento Box Grid */
        .bento-grid { 
          display: grid; 
          grid-template-columns: repeat(12, 1fr); 
          gap: 1.5rem; 
        }
        .bento-item {
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 2rem;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-card);
          transition: border-color 0.3s ease;
        }
        .bento-item:hover { border-color: var(--brand-primary); }

        /* Utilities */
        .text-gradient {
          background: linear-gradient(135deg, #FFFFFF 0%, #A1A1AA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-emerald { color: var(--brand-primary); }
        
        .glass-nav {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
        }

        /* Buttons */
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 0.875rem 1.75rem; border-radius: var(--radius-full);
          font-weight: 600; font-size: 1rem; text-decoration: none;
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer; border: none; outline: none; letter-spacing: -0.01em;
        }
        .btn:active { transform: scale(0.97); }
        .btn-primary { 
          background: var(--brand-primary); 
          color: #000; 
          box-shadow: var(--shadow-glow); 
        }
        .btn-primary:hover { 
          background: #34D399; 
          box-shadow: 0 0 40px rgba(16, 185, 129, 0.4); 
        }
        .btn-secondary { 
          background: rgba(255, 255, 255, 0.05); 
          color: var(--text-main); 
          border: 1px solid var(--border-light); 
          backdrop-filter: blur(10px);
        }
        .btn-secondary:hover { 
          background: rgba(255, 255, 255, 0.1); 
          border-color: rgba(255,255,255,0.2); 
        }

        /* Terminal/Cards */
        .terminal-card {
          background: var(--bg-secondary); 
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg); 
          box-shadow: var(--shadow-card);
          padding: 2.5rem;
          position: relative;
        }
        .terminal-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--brand-primary), transparent);
          opacity: 0.5;
        }

        /* Forms */
        .input-group { margin-bottom: 1.5rem; }
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;}
        .input {
          width: 100%; padding: 1rem 1.25rem; border-radius: var(--radius-md);
          border: 1px solid var(--border-light); font-size: 1.125rem;
          transition: all 0.2s ease; background: rgba(0,0,0,0.5); color: white;
          font-family: 'JetBrains Mono', monospace, sans-serif;
        }
        .input:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 1px var(--brand-primary); }
        
        /* Badges */
        .badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1.25rem; border-radius: var(--radius-full);
          background: rgba(16, 185, 129, 0.1); color: var(--brand-primary);
          border: 1px solid rgba(16, 185, 129, 0.2);
          font-weight: 500; font-size: 0.875rem; letter-spacing: 0.02em;
        }

        /* Responsive Overrides */
        @media (max-width: 968px) {
          .grid-2 { grid-template-columns: 1fr; gap: 3rem; }
          .grid-3 { grid-template-columns: 1fr; gap: 1.5rem; }
          .hero-cta { flex-direction: column; width: 100%; }
          .hero-cta .btn { width: 100%; }
          .desktop-only { display: none !important; }
          .bento-grid { display: flex; flex-direction: column; }
        }
        @media (min-width: 969px) {
          .mobile-only { display: none !important; }
        }
      `}</style>

      {/* Top Banner */}
      <div style={{ background: "var(--brand-primary)", color: "#000", fontSize: "0.875rem", fontWeight: 600, textAlign: "center", padding: "0.6rem 1rem", letterSpacing: "0.02em" }}>
        SmartFarmer V2 is live. Institutional-grade yield is now accessible to everyone. →
      </div>

      {/* Navigation */}
      <header className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div className="container" style={{ height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--brand-primary)", display: "grid", placeItems: "center", color: "#000", fontWeight: 800 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>SmartFarmer</span>
          </a>
          <nav className="desktop-only" style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
            <a href="#how" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Infrastructure</a>
            <a href="#estimator" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Yield Terminal</a>
            <a href="#faq" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>FAQ</a>
            <div style={{ display: "flex", gap: "1rem" }}>
              <a href="/login" className="btn btn-secondary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>Log in</a>
              <a href="/signup" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>Deploy Capital</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section" style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center" }}>
        {/* Background Gradients */}
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 60%)", zIndex: -1, borderRadius: "50%" }} />
        
        <div className="container grid-2">
          <Reveal>
            <div style={{ maxWidth: "650px" }}>
              <div className="badge" style={{ marginBottom: "2rem" }}>
                <span style={{width: "8px", height: "8px", borderRadius: "50%", background: "var(--brand-primary)", boxShadow: "0 0 10px var(--brand-primary)"}}></span>
                Protocol Live • 14.2% APY Average
              </div>
              <h1 style={{ marginBottom: "1.5rem" }}>
                Finance the future of <br/>
                <span className="text-emerald">agricultural yields.</span>
              </h1>
              <p style={{ marginBottom: "3rem", fontSize: "1.25rem" }}>
                Bypass intermediaries. SmartFarmer routes your capital directly to audited agricultural inputs, generating predictable, asset-backed returns powered by real-world crop cycles.
              </p>
              <div className="hero-cta" style={{ display: "flex", gap: "1rem" }}>
                <a href="/register" className="btn btn-primary">Start Investing</a>
                <a href="#estimator" className="btn btn-secondary">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{marginRight: "0.5rem"}}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  Run Simulations
                </a>
              </div>
            </div>
          </Reveal>
          
          {/* Hero Visual / Composition */}
          <Reveal delay={150}>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-glow)", position: "relative" }}>
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop" 
                  alt="Agricultural Drone Technology" 
                  style={{ width: "100%", height: "500px", objectFit: "cover", display: "block", filter: "brightness(0.7) contrast(1.1)" }} 
                />
                
                <div style={{ 
                  position: "absolute", bottom: "2rem", left: "2rem", right: "2rem", 
                  background: "rgba(10, 10, 10, 0.8)", backdropFilter: "blur(20px)", 
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "1.5rem",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Live Portfolio Value</div>
                    <div style={{ color: "var(--brand-primary)", fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                      14.2%
                    </div>
                  </div>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "white" }}>
                    ₦2,450,000<span style={{color: "var(--text-muted)"}}>.00</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Infrastructure Bento Grid */}
      <section id="how" style={{ borderTop: "1px solid var(--border-light)", background: "var(--bg-secondary)" }}>
        <div className="container" style={{ padding: "6rem 1.5rem" }}>
          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>Institutional-grade infrastructure.</h2>
            <p style={{ maxWidth: "600px" }}>We've engineered the entire stack to remove friction from agricultural financing, ensuring capital deployment is secure, transparent, and profitable.</p>
          </div>

          <div className="bento-grid">
            {/* Big Feature 1 */}
            <Reveal delay={0} style={{ gridColumn: "span 8" }}>
              <div className="bento-item" style={{ height: "100%", minHeight: "350px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <img 
                  src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c83?q=80&w=1000&auto=format&fit=crop" 
                  alt="Harvest" 
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, zIndex: 0 }} 
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0A0A0A 0%, transparent 100%)", zIndex: 1 }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--brand-primary)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  </div>
                  <h3 style={{ fontSize: "1.5rem" }}>Asset-Backed Security</h3>
                  <p style={{ margin: 0 }}>Capital doesn't sit idle. Funds directly purchase audited, physical farm materials—seeds, fertilizers, and equipment—insured against comprehensive risks.</p>
                </div>
              </div>
            </Reveal>

            {/* Small Feature 1 */}
            <Reveal delay={100} style={{ gridColumn: "span 4" }}>
              <div className="bento-item" style={{ height: "100%" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.1)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3>Dynamic Cycles</h3>
                <p style={{ fontSize: "1rem", margin: 0 }}>Hold for weeks or months. Yields are generated based on real-world crop maturity cycles, completely detached from crypto or stock market volatility.</p>
              </div>
            </Reveal>

            {/* Small Feature 2 */}
            <Reveal delay={200} style={{ gridColumn: "span 4" }}>
              <div className="bento-item" style={{ height: "100%" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.1)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h3>Algorithmic Risk Control</h3>
                <p style={{ fontSize: "1rem", margin: 0 }}>Integrated KYC, parametric weather insurance, and real-time satellite monitoring protect downside exposure.</p>
              </div>
            </Reveal>

            {/* Small Feature 3 */}
            <Reveal delay={300} style={{ gridColumn: "span 8" }}>
               <div className="bento-item" style={{ height: "100%", background: "linear-gradient(135deg, var(--brand-surface) 0%, var(--bg-secondary) 100%)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--brand-primary)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <h3 style={{ fontSize: "1.5rem" }}>Measurable Local Impact</h3>
                <p style={{ margin: 0 }}>Every Naira deployed translates directly to boosted regional yields and increased income for vetted local farming cooperatives.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Estimator Section (Terminal UI) */}
      <section id="estimator" className="section" style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="container grid-2">
          {/* Form Side */}
          <Reveal>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--brand-primary)", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Yield Terminal
              </div>
              <h2 style={{ marginBottom: "1.5rem" }}>Simulate your deployment.</h2>
              <p style={{ marginBottom: "3rem" }}>Configure your capital parameters. The algorithmic engine calculates your projected maturity payout instantly. Zero management fees.</p>
              
              <div className="terminal-card">
                <div className="input-group">
                  <label className="label">Principal Amount (NGN)</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>₦</span>
                    <input type="number" min={10000} value={price} onChange={(e) => setPrice(e.target.value)} className="input" style={{ paddingLeft: "2.5rem" }} placeholder="500000" />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="input-group">
                    <label className="label">Cycle (Months)</label>
                    <input type="number" min={1} value={months} onChange={(e) => setMonths(e.target.value)} className="input" placeholder="6" />
                  </div>
                  <div className="input-group">
                    <label className="label">Target APY (%)</label>
                    <input type="number" min={0} value={pct} onChange={(e) => setPct(e.target.value)} className="input" placeholder="15" />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="label">Risk Tranche</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                    {["Low", "Medium", "High"].map((lvl) => {
                      const isSelected = risk === lvl;
                      const colorVar = `var(--risk-${lvl.substring(0,3).toLowerCase()})`;
                      return (
                        <button
                          key={lvl}
                          onClick={() => setRisk(lvl)}
                          style={{
                            padding: "0.875rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem",
                            background: isSelected ? `rgba(${lvl==='Low'?'16,185,129':lvl==='Medium'?'245,158,11':'239,68,68'}, 0.1)` : "rgba(255,255,255,0.05)",
                            border: `1px solid ${isSelected ? colorVar : "var(--border-light)"}`,
                            color: isSelected ? colorVar : "var(--text-muted)",
                            cursor: "pointer", transition: "all 0.2s"
                          }}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Results Side */}
          <Reveal delay={150}>
            <div className="terminal-card" style={{ background: "#000", borderColor: "var(--border-light)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Projected Output</div>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--brand-primary)", boxShadow: "0 0 10px var(--brand-primary)", animation: "pulse 2s infinite" }}></div>
              </div>

              <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Total Value at Maturity</div>
                <div style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace", color: "white" }}>
                  {fmt(calc.total)}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.875rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Principal</span>
                  <span>{fmt(calc.p)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Net Profit</span>
                  <span style={{ color: "var(--brand-primary)" }}>+{fmt(calc.roi)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Monthly Velocity</span>
                  <span>{calc.perMonth.toFixed(2)}% / mo</span>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "8px", fontSize: "0.75rem", color: "var(--text-muted)", border: "1px solid var(--border-light)", marginBottom: "2rem" }}>
                <span style={{ color: "white", fontWeight: 600 }}>SYSTEM NOTE:</span> APY reflects the full {calc.m}-month lockup. Risk tranche configures the smart contract insurance layer.
              </div>

              <a href="/register" className="btn btn-primary" style={{ width: "100%", padding: "1.25rem", fontSize: "1.125rem" }}>
                Initialize Deployment
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>Trusted by smart capital.</h2>
            <p style={{ maxWidth: "600px", margin: "0 auto" }}>Join thousands of forward-thinking investors treating agriculture as a highly predictable, risk-adjusted asset class.</p>
          </div>
          
          <div className="grid-3">
            <Reveal delay={0}>
              <div className="bento-item" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "2rem" }}>
                <div style={{ color: "var(--brand-primary)", marginBottom: "1.5rem" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                </div>
                <p style={{ color: "var(--text-main)", fontSize: "1.125rem", flexGrow: 1, marginBottom: "2rem" }}>"The algorithmic risk control gave me the confidence to deploy a mid-six-figure sum. The yield has outpaced my traditional fixed-income portfolio by 3x with zero correlation to broader markets."</p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid var(--border-light)", display: "grid", placeItems: "center", fontWeight: 700 }}>SJ</div>
                  <div>
                    <div style={{ fontWeight: 600, color: "white" }}>Sarah Jenkins</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Private Wealth Manager</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="bento-item" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "2rem" }}>
                <div style={{ color: "var(--brand-primary)", marginBottom: "1.5rem" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                </div>
                <p style={{ color: "var(--text-main)", fontSize: "1.125rem", flexGrow: 1, marginBottom: "2rem" }}>"Finally, a protocol that touches grass. Real-world asset backing in agriculture is the missing primitive in modern finance. The transparency on the SmartFarmer dashboard is unmatched."</p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid var(--border-light)", display: "grid", placeItems: "center", fontWeight: 700 }}>MT</div>
                  <div>
                    <div style={{ fontWeight: 600, color: "white" }}>Marcus T.</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>DeFi Strategist</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="bento-item" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "2rem" }}>
                <div style={{ color: "var(--brand-primary)", marginBottom: "1.5rem" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                </div>
                <p style={{ color: "var(--text-main)", fontSize: "1.125rem", flexGrow: 1, marginBottom: "2rem" }}>"Seamless deployment, transparent tracking, and predictable maturity cycles. I route 10% of my startup's treasury through SmartFarmer to hedge against fiat inflation."</p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid var(--border-light)", display: "grid", placeItems: "center", fontWeight: 700 }}>ER</div>
                  <div>
                    <div style={{ fontWeight: 600, color: "white" }}>Elena R.</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Founder & CEO</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section" style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="container grid-2" style={{ alignItems: "flex-start" }}>
          <Reveal>
            <div style={{ position: "sticky", top: "120px" }}>
              <h2 style={{ marginBottom: "1rem" }}>System Queries.</h2>
              <p style={{ marginBottom: "2rem" }}>Everything you need to know about the platform, risk management, and capital deployment.</p>
              <a href="/docs" style={{ color: "var(--brand-primary)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                Read the technical documentation
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </Reveal>
          
          <Reveal delay={150}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FAQItem 
                question="How is the 14.2% APY generated?" 
                answer="Yields are generated from the actual profit margins of harvested commodities. Your capital purchases raw inputs (seeds, fertilizer) at wholesale prices. When the crop matures and is sold to our pre-vetted off-takers, the profit is distributed directly to your wallet." 
              />
              <FAQItem 
                question="What happens if a crop fails due to weather?" 
                answer="Every deployment is protected by parametric weather insurance. If specific weather metrics (e.g., rainfall, temperature) cross critical thresholds causing crop failure, the insurance smart contract executes automatically, recovering your principal." 
              />
              <FAQItem 
                question="Are there any lock-up periods?" 
                answer="Yes. Capital is locked for the duration of the specific crop cycle you choose (typically 3 to 9 months). Because your funds are tied to physical, growing assets, early withdrawal is not supported." 
              />
              <FAQItem 
                question="Is SmartFarmer a cryptocurrency or DeFi token?" 
                answer="No. SmartFarmer is a fiat-native, regulatory-compliant platform dealing strictly with Real-World Assets (RWA). While we use blockchain infrastructure on the backend for immutable record-keeping and contract execution, all deposits and payouts are handled in NGN or USD." 
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Silicon Valley Standard Footer */}
      <footer style={{ background: "#000", borderTop: "1px solid var(--border-light)", padding: "5rem 0 2rem" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "4rem", marginBottom: "4rem" }}>
            
            {/* Brand & Newsletter */}
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "white", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "4px", background: "var(--brand-primary)"}}></div>
                SmartFarmer
              </div>
              <p style={{ fontSize: "0.875rem", marginBottom: "2rem", maxWidth: "280px" }}>Bridging global liquidity with verified agricultural assets. Institutional-grade returns mapped to real-world production.</p>
              
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "white", marginBottom: "0.75rem" }}>Subscribe to our engineering blog</div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="email" placeholder="email@example.com" style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "white", outline: "none" }} />
                  <button className="btn btn-primary" style={{ padding: "0.75rem 1.25rem", borderRadius: "8px" }}>Join</button>
                </div>
              </div>

              {/* Social Icons */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <a href="#" style={{ color: "var(--text-muted)", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" style={{ color: "var(--text-muted)", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" style={{ color: "var(--text-muted)", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 style={{ color: "white", marginBottom: "1.25rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Protocol</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <a href="#how" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Infrastructure</a>
                <a href="#estimator" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Yield Terminal</a>
                <a href="/security" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Risk Framework</a>
                <a href="/docs" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Documentation</a>
              </div>
            </div>
            <div>
              <h4 style={{ color: "white", marginBottom: "1.25rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Entity</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <a href="/about" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Company</a>
                <a href="/careers" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Careers <span style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.7rem", marginLeft: "4px", color: "white" }}>Hiring</span></a>
                <a href="/blog" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Blog</a>
                <a href="/contact" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Contact</a>
              </div>
            </div>
            <div>
              <h4 style={{ color: "white", marginBottom: "1.25rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Legal</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <a href="/terms" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Terms of Service</a>
                <a href="/privacy" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>Privacy Policy</a>
                <a href="/kyc" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>KYC / AML</a>
              </div>
            </div>
          </div>
          
          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            <span>© {new Date().getFullYear()} SmartFarmer OS. All rights reserved.</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "6px", height: "6px", background: "var(--brand-primary)", borderRadius: "50%", boxShadow: "0 0 8px var(--brand-primary)" }}></span>
              All Systems Operational • Lagos
            </span>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className={`mobile-only ${showSticky ? "visible" : ""}`} style={{
        position: "fixed", bottom: 0, left: 0, right: 0, padding: "1rem",
        background: "rgba(10, 10, 10, 0.9)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--border-light)",
        transform: showSticky ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 100
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <a href="/login" className="btn btn-secondary" style={{ padding: "0.75rem" }}>Log in</a>
          <a href="/register" className="btn btn-primary" style={{ padding: "0.75rem" }}>Deploy Capital</a>
        </div>
      </div>
      
      {/* Pulse Keyframe for Terminal Status */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
}

/* ---------------- Animation Helper ---------------- */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShow(true); },
      { threshold: 0.1 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  
  return (
    <div
      ref={ref}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
        ...style
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- FAQ Item Component ---------------- */
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ borderBottom: "1px solid var(--border-light)", padding: "1.5rem 0" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", 
          background: "none", border: "none", color: "var(--text-main)", fontSize: "1.125rem", 
          fontWeight: 600, cursor: "pointer", textAlign: "left", padding: 0 
        }}
      >
        {question}
        <span style={{ 
          transform: isOpen ? "rotate(45deg)" : "none", 
          transition: "transform 0.2s ease",
          color: isOpen ? "var(--brand-primary)" : "var(--text-muted)",
          fontSize: "1.5rem", fontWeight: 400
        }}>
          +
        </span>
      </button>
      <div style={{ 
        maxHeight: isOpen ? "200px" : "0", 
        overflow: "hidden", 
        transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
        opacity: isOpen ? 1 : 0
      }}>
        <p style={{ marginTop: "1rem", color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6 }}>
          {answer}
        </p>
      </div>
    </div>
  );
}
