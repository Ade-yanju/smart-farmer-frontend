import React, { useEffect, useMemo, useRef, useState } from "react";

export default function LandingPage() {
  const [price, setPrice] = useState(500000);
  const [months, setMonths] = useState(6);
  const [pct, setPct] = useState(15);
  const [risk, setRisk] = useState("Low");

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

  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sf-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        :root {
          --brand-primary: #10B981;
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
          --risk-hig: #EF4444;
          --shadow-glow: 0 0 30px rgba(16, 185, 129, 0.15);
          --shadow-card: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 20px 40px -10px rgba(0,0,0,0.5);
          --radius-md: 12px;
          --radius-lg: 24px;
          --radius-full: 9999px;
          --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg-main);
          color: var(--text-main);
          font-family: var(--font-sans);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        img { max-width: 100%; display: block; }

        /* ── Typography ── */
        h1 { font-size: clamp(2.25rem, 8vw, 5rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.04em; }
        h2 { font-size: clamp(1.75rem, 5vw, 3rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; }
        h3 { font-size: 1.15rem; font-weight: 600; margin-bottom: 0.5rem; letter-spacing: -0.01em; color: var(--text-main); }
        p  { color: var(--text-muted); line-height: 1.65; font-size: 1rem; }

        /* ── Layout ── */
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.25rem; }
        .section    { padding: clamp(4rem, 10vw, 8rem) 0; }

        /* Two-column grid */
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        /* Three-column grid */
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        /* Bento grid */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
        }
        .bento-item {
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-card);
          transition: border-color 0.3s ease;
        }
        .bento-item:hover { border-color: var(--brand-primary); }

        /* ── Utilities ── */
        .text-emerald { color: var(--brand-primary); }
        .glass-nav {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
        }

        /* ── Buttons ── */
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 0.875rem 1.75rem; border-radius: var(--radius-full);
          font-weight: 600; font-size: 1rem; text-decoration: none;
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer; border: none; outline: none; letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .btn:active { transform: scale(0.97); }
        .btn-primary {
          background: var(--brand-primary);
          color: #000;
          box-shadow: var(--shadow-glow);
        }
        .btn-primary:hover { background: #34D399; box-shadow: 0 0 40px rgba(16,185,129,0.4); }
        .btn-secondary {
          background: rgba(255,255,255,0.05);
          color: var(--text-main);
          border: 1px solid var(--border-light);
          backdrop-filter: blur(10px);
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }

        /* ── Cards ── */
        .terminal-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          padding: 2rem;
          position: relative;
        }
        .terminal-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--brand-primary), transparent);
          opacity: 0.5;
        }

        /* ── Forms ── */
        .input-group { margin-bottom: 1.25rem; }
        .label {
          display: block; font-size: 0.8rem; font-weight: 500;
          color: var(--text-muted); margin-bottom: 0.5rem;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .input {
          width: 100%; padding: 0.875rem 1.125rem;
          border-radius: var(--radius-md); border: 1px solid var(--border-light);
          font-size: 1rem; transition: all 0.2s ease;
          background: rgba(0,0,0,0.5); color: white;
          font-family: 'JetBrains Mono', monospace, sans-serif;
          -webkit-appearance: none;
        }
        .input:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 1px var(--brand-primary); }

        /* ── Badge ── */
        .badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.4rem 1rem; border-radius: var(--radius-full);
          background: rgba(16,185,129,0.1); color: var(--brand-primary);
          border: 1px solid rgba(16,185,129,0.2);
          font-weight: 500; font-size: 0.8rem; letter-spacing: 0.02em;
        }

        /* ── Animations ── */
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0   rgba(16,185,129,0.4); }
          70%  { box-shadow: 0 0 0 6px rgba(16,185,129,0);   }
          100% { box-shadow: 0 0 0 0   rgba(16,185,129,0);   }
        }

        /* ════════════════════════════════════════
           RESPONSIVE BREAKPOINTS
        ════════════════════════════════════════ */

        /* ── Tablet (≤ 1024px) ── */
        @media (max-width: 1024px) {
          .bento-grid { grid-template-columns: repeat(6, 1fr); }
          .bento-item[style*="span 8"] { grid-column: span 6 !important; }
          .bento-item[style*="span 4"] { grid-column: span 6 !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
          .footer-brand { grid-column: span 2; }
        }

        /* ── Large mobile / small tablet (≤ 768px) ── */
        @media (max-width: 768px) {
          h3 { font-size: 1.1rem; }
          p  { font-size: 0.975rem; }

          .grid-2 {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .grid-3 {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .bento-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .bento-item { padding: 1.5rem; }

          /* Hero */
          .hero-section {
            min-height: auto !important;
            padding: 5rem 0 3rem !important;
          }
          .hero-text { text-align: center; }
          .hero-cta {
            flex-direction: column !important;
            width: 100%;
          }
          .hero-cta .btn { width: 100%; }
          .hero-badge { justify-content: center; }

          /* Nav */
          .nav-links  { display: none !important; }
          .nav-actions { display: none !important; }
          .mobile-menu-hint { display: flex !important; }

          /* Hero card */
          .hero-img   { height: 320px !important; }
          .hero-overlay-card { left: 1rem !important; right: 1rem !important; bottom: 1rem !important; }
          .hero-overlay-value { font-size: 2rem !important; }

          /* Estimator */
          .estimator-grid { grid-template-columns: 1fr !important; }
          .estimator-inputs { grid-template-columns: 1fr !important; gap: 0 !important; }
          .result-total { font-size: 2.25rem !important; }

          /* FAQ */
          .faq-sticky { position: static !important; top: auto !important; margin-bottom: 2rem; }

          /* Footer */
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .footer-brand { grid-column: span 1 !important; }
          .footer-bottom {
            flex-direction: column !important;
            text-align: center;
            gap: 0.75rem !important;
          }
          .footer-newsletter { flex-direction: column !important; }
          .footer-newsletter input { width: 100% !important; }
          .footer-newsletter .btn { width: 100%; }

          /* Testimonials */
          .testimonial-card { padding: 1.5rem !important; }

          /* Section spacing */
          .section { padding: clamp(3rem, 8vw, 5rem) 0; }
        }

        /* ── Small mobile (≤ 480px) ── */
        @media (max-width: 480px) {
          .container { padding: 0 1rem; }
          .terminal-card { padding: 1.25rem; }
          .risk-grid { grid-template-columns: 1fr !important; gap: 0.5rem !important; }
          .hero-badge { font-size: 0.7rem !important; }
          .footer-social { gap: 0.75rem !important; }
          .banner-text { font-size: 0.75rem !important; }
        }

        /* ── Desktop only / Mobile only toggles ── */
        .desktop-only { display: flex; }
        .mobile-only  { display: none; }
        .mobile-menu-hint { display: none; }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only  { display: flex !important; }
        }
      `}</style>

      {/* ── Top Banner ── */}
      <div style={{ background: "var(--brand-primary)", color: "#000", fontSize: "0.875rem", fontWeight: 600, textAlign: "center", padding: "0.6rem 1rem", letterSpacing: "0.02em" }} className="banner-text">
        SmartFarmer V2 is live. Institutional-grade yield is now accessible to everyone. →
      </div>

      {/* ── Navigation ── */}
      <header className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div className="container" style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>

          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", color: "inherit", flexShrink: 0 }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--brand-primary)", display: "grid", placeItems: "center", color: "#000", fontWeight: 800 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.125rem", letterSpacing: "-0.02em" }}>SmartFarmer</span>
          </a>

          {/* Desktop nav */}
          <nav className="nav-links desktop-only" style={{ gap: "2rem", alignItems: "center" }}>
            {["Infrastructure|#how", "Yield Terminal|#estimator", "FAQ|#faq"].map(item => {
              const [label, href] = item.split("|");
              return (
                <a key={label} href={href} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, transition: "color 0.2s" }}
                  onMouseOver={e => e.target.style.color = "white"} onMouseOut={e => e.target.style.color = "var(--text-muted)"}>
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="nav-actions desktop-only" style={{ gap: "0.75rem" }}>
            <a href="/login"  className="btn btn-secondary" style={{ padding: "0.5rem 1.125rem", fontSize: "0.875rem" }}>Log in</a>
            <a href="/signup" className="btn btn-primary"   style={{ padding: "0.5rem 1.125rem", fontSize: "0.875rem" }}>Deploy Capital</a>
          </div>

          {/* Mobile: compact CTA */}
          <div className="mobile-only" style={{ gap: "0.5rem", alignItems: "center" }}>
            <a href="/login"  className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>Log in</a>
            <a href="/signup" className="btn btn-primary"   style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>Start</a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="section hero-section" style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 60%)", zIndex: -1, borderRadius: "50%", pointerEvents: "none" }} />

        <div className="container">
          <div className="grid-2">
            <Reveal>
              <div className="hero-text" style={{ maxWidth: "650px" }}>
                <div className="badge hero-badge" style={{ marginBottom: "1.75rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--brand-primary)", boxShadow: "0 0 10px var(--brand-primary)", flexShrink: 0 }}></span>
                  Protocol Live • 14.2% APY Average
                </div>
                <h1 style={{ marginBottom: "1.25rem" }}>
                  Finance the future of{" "}
                  <span className="text-emerald">agricultural yields.</span>
                </h1>
                <p style={{ marginBottom: "2.5rem", fontSize: "clamp(1rem, 2.5vw, 1.2rem)" }}>
                  Bypass intermediaries. SmartFarmer routes your capital directly to audited agricultural inputs, generating predictable, asset-backed returns powered by real-world crop cycles.
                </p>
                <div className="hero-cta" style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                  <a href="/register" className="btn btn-primary">Start Investing</a>
                  <a href="#estimator" className="btn btn-secondary">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.4rem" }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    Run Simulations
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-glow)" }}>
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"
                  alt="Agricultural Drone Technology"
                  className="hero-img"
                  style={{ width: "100%", height: "460px", objectFit: "cover", filter: "brightness(0.7) contrast(1.1)" }}
                />
                <div className="hero-overlay-card" style={{
                  position: "absolute", bottom: "1.5rem", left: "1.5rem", right: "1.5rem",
                  background: "rgba(10,10,10,0.85)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "1.25rem",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Live Portfolio Value</div>
                    <div style={{ color: "var(--brand-primary)", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                      14.2%
                    </div>
                  </div>
                  <div className="hero-overlay-value" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "white", lineHeight: 1 }}>
                    ₦2,450,000<span style={{ color: "var(--text-muted)" }}>.00</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Bento Grid ── */}
      <section id="how" style={{ borderTop: "1px solid var(--border-light)", background: "var(--bg-secondary)" }}>
        <div className="container" style={{ padding: "5rem 1.25rem" }}>
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>Institutional-grade infrastructure.</h2>
            <p style={{ maxWidth: "580px" }}>We've engineered the entire stack to remove friction from agricultural financing, ensuring capital deployment is secure, transparent, and profitable.</p>
          </div>

          <div className="bento-grid">
            <Reveal delay={0} style={{ gridColumn: "span 8" }}>
              <div className="bento-item" style={{ minHeight: "320px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <img src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c83?q=80&w=1000&auto=format&fit=crop" alt="Harvest"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, zIndex: 0 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0A0A0A 0%, transparent 100%)", zIndex: 1 }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "var(--brand-primary)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  </div>
                  <h3 style={{ fontSize: "1.35rem" }}>Asset-Backed Security</h3>
                  <p style={{ margin: 0 }}>Capital doesn't sit idle. Funds directly purchase audited, physical farm materials—seeds, fertilizers, and equipment—insured against comprehensive risks.</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100} style={{ gridColumn: "span 4" }}>
              <div className="bento-item" style={{ height: "100%" }}>
                <FeatureIcon><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></FeatureIcon>
                <h3>Dynamic Cycles</h3>
                <p style={{ fontSize: "0.95rem", margin: 0 }}>Hold for weeks or months. Yields are generated based on real-world crop maturity cycles, completely detached from crypto or stock market volatility.</p>
              </div>
            </Reveal>

            <Reveal delay={200} style={{ gridColumn: "span 4" }}>
              <div className="bento-item" style={{ height: "100%" }}>
                <FeatureIcon><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></FeatureIcon>
                <h3>Algorithmic Risk Control</h3>
                <p style={{ fontSize: "0.95rem", margin: 0 }}>Integrated KYC, parametric weather insurance, and real-time satellite monitoring protect downside exposure.</p>
              </div>
            </Reveal>

            <Reveal delay={300} style={{ gridColumn: "span 8" }}>
              <div className="bento-item" style={{ height: "100%", background: "linear-gradient(135deg, var(--brand-surface) 0%, var(--bg-secondary) 100%)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "var(--brand-primary)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <h3 style={{ fontSize: "1.35rem" }}>Measurable Local Impact</h3>
                <p style={{ margin: 0 }}>Every Naira deployed translates directly to boosted regional yields and increased income for vetted local farming cooperatives.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Estimator ── */}
      <section id="estimator" className="section" style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <div className="grid-2 estimator-grid">
            {/* Form */}
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--brand-primary)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.875rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Yield Terminal
                </div>
                <h2 style={{ marginBottom: "1rem" }}>Simulate your deployment.</h2>
                <p style={{ marginBottom: "2rem" }}>Configure your capital parameters. The algorithmic engine calculates your projected maturity payout instantly. Zero management fees.</p>

                <div className="terminal-card">
                  <div className="input-group">
                    <label className="label">Principal Amount (NGN)</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1.125rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>₦</span>
                      <input type="number" min={10000} value={price} onChange={e => setPrice(e.target.value)} className="input" style={{ paddingLeft: "2.25rem" }} placeholder="500000" />
                    </div>
                  </div>

                  <div className="estimator-inputs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div className="input-group">
                      <label className="label">Cycle (Months)</label>
                      <input type="number" min={1} value={months} onChange={e => setMonths(e.target.value)} className="input" placeholder="6" />
                    </div>
                    <div className="input-group">
                      <label className="label">Target APY (%)</label>
                      <input type="number" min={0} value={pct} onChange={e => setPct(e.target.value)} className="input" placeholder="15" />
                    </div>
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="label">Risk Tranche</label>
                    <div className="risk-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                      {["Low", "Medium", "High"].map(lvl => {
                        const isSelected = risk === lvl;
                        const colorVar = lvl === "Low" ? "var(--risk-low)" : lvl === "Medium" ? "var(--risk-med)" : "var(--risk-hig)";
                        const rgba = lvl === "Low" ? "16,185,129" : lvl === "Medium" ? "245,158,11" : "239,68,68";
                        return (
                          <button key={lvl} onClick={() => setRisk(lvl)} style={{
                            padding: "0.75rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem",
                            background: isSelected ? `rgba(${rgba}, 0.1)` : "rgba(255,255,255,0.05)",
                            border: `1px solid ${isSelected ? colorVar : "var(--border-light)"}`,
                            color: isSelected ? colorVar : "var(--text-muted)",
                            cursor: "pointer", transition: "all 0.2s"
                          }}>
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Results */}
            <Reveal delay={150}>
              <div className="terminal-card" style={{ background: "#000" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Projected Output</div>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--brand-primary)", boxShadow: "0 0 10px var(--brand-primary)", animation: "pulse 2s infinite" }}></div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Total Value at Maturity</div>
                  <div className="result-total" style={{ fontSize: "clamp(1.75rem, 5vw, 3.25rem)", fontWeight: 800, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace", color: "white", wordBreak: "break-all" }}>
                    {fmt(calc.total)}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "2rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.875rem" }}>
                  {[
                    { label: "Principal", value: fmt(calc.p), color: "white" },
                    { label: "Net Profit", value: `+${fmt(calc.roi)}`, color: "var(--brand-primary)" },
                    { label: "Monthly Velocity", value: `${calc.perMonth.toFixed(2)}% / mo`, color: "white" },
                  ].map(({ label, value, color }, i, arr) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < arr.length - 1 ? "1px dashed rgba(255,255,255,0.1)" : "none", paddingBottom: i < arr.length - 1 ? "0.875rem" : 0 }}>
                      <span style={{ color: "var(--text-muted)" }}>{label}</span>
                      <span style={{ color }}>{value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.875rem", borderRadius: "8px", fontSize: "0.75rem", color: "var(--text-muted)", border: "1px solid var(--border-light)", marginBottom: "1.75rem" }}>
                  <span style={{ color: "white", fontWeight: 600 }}>SYSTEM NOTE:</span> APY reflects the full {calc.m}-month lockup. Risk tranche configures the smart contract insurance layer.
                </div>

                <a href="/register" className="btn btn-primary" style={{ width: "100%", padding: "1.1rem", fontSize: "1rem" }}>
                  Initialize Deployment
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>Trusted by smart capital.</h2>
            <p style={{ maxWidth: "560px", margin: "0 auto" }}>Join thousands of forward-thinking investors treating agriculture as a highly predictable, risk-adjusted asset class.</p>
          </div>

          <div className="grid-3">
            {[
              { initials: "SJ", name: "Sarah Jenkins", role: "Private Wealth Manager", quote: "The algorithmic risk control gave me the confidence to deploy a mid-six-figure sum. The yield has outpaced my traditional fixed-income portfolio by 3x with zero correlation to broader markets." },
              { initials: "MT", name: "Marcus T.", role: "DeFi Strategist", quote: "Finally, a protocol that touches grass. Real-world asset backing in agriculture is the missing primitive in modern finance. The transparency on the SmartFarmer dashboard is unmatched." },
              { initials: "ER", name: "Elena R.", role: "Founder & CEO", quote: "Seamless deployment, transparent tracking, and predictable maturity cycles. I route 10% of my startup's treasury through SmartFarmer to hedge against fiat inflation." },
            ].map(({ initials, name, role, quote }, i) => (
              <Reveal key={name} delay={i * 150}>
                <div className="bento-item testimonial-card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "1.75rem" }}>
                  <div style={{ color: "var(--brand-primary)", marginBottom: "1.25rem" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                  </div>
                  <p style={{ color: "var(--text-main)", fontSize: "1rem", flexGrow: 1, marginBottom: "1.75rem" }}>{quote}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid var(--border-light)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>{initials}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: "white", fontSize: "0.95rem" }}>{name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="section" style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: "flex-start" }}>
            <Reveal>
              <div className="faq-sticky" style={{ position: "sticky", top: "100px" }}>
                <h2 style={{ marginBottom: "1rem" }}>System Queries.</h2>
                <p style={{ marginBottom: "1.75rem" }}>Everything you need to know about the platform, risk management, and capital deployment.</p>
                <a href="/docs" style={{ color: "var(--brand-primary)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem" }}>
                  Read the technical documentation
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <FAQItem question="How is the 14.2% APY generated?" answer="Yields are generated from the actual profit margins of harvested commodities. Your capital purchases raw inputs (seeds, fertilizer) at wholesale prices. When the crop matures and is sold to our pre-vetted off-takers, the profit is distributed directly to your wallet." />
                <FAQItem question="What happens if a crop fails due to weather?" answer="Every deployment is protected by parametric weather insurance. If specific weather metrics (e.g., rainfall, temperature) cross critical thresholds causing crop failure, the insurance smart contract executes automatically, recovering your principal." />
                <FAQItem question="Are there any lock-up periods?" answer="Yes. Capital is locked for the duration of the specific crop cycle you choose (typically 3 to 9 months). Because your funds are tied to physical, growing assets, early withdrawal is not supported." />
                <FAQItem question="Is SmartFarmer a cryptocurrency or DeFi token?" answer="No. SmartFarmer is a fiat-native, regulatory-compliant platform dealing strictly with Real-World Assets (RWA). While we use blockchain infrastructure on the backend for immutable record-keeping and contract execution, all deposits and payouts are handled in NGN or USD." />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#000", borderTop: "1px solid var(--border-light)", padding: "4rem 0 2rem" }}>
        <div className="container">
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>

            <div className="footer-brand">
              <div style={{ fontWeight: 800, fontSize: "1.375rem", color: "white", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "4px", background: "var(--brand-primary)", flexShrink: 0 }}></div>
                SmartFarmer
              </div>
              <p style={{ fontSize: "0.875rem", marginBottom: "1.75rem", maxWidth: "280px" }}>Bridging global liquidity with verified agricultural assets. Institutional-grade returns mapped to real-world production.</p>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "white", marginBottom: "0.625rem" }}>Subscribe to our engineering blog</div>
                <div className="footer-newsletter" style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="email" placeholder="email@example.com" style={{ flex: 1, padding: "0.7rem 0.875rem", borderRadius: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "white", outline: "none", fontSize: "0.875rem" }} />
                  <button className="btn btn-primary" style={{ padding: "0.7rem 1.125rem", borderRadius: "8px", flexShrink: 0 }}>Join</button>
                </div>
              </div>

              <div className="footer-social" style={{ display: "flex", gap: "1rem" }}>
                {[
                  <svg key="tw" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>,
                  <svg key="li" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
                  <svg key="gh" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                ].map((icon, i) => (
                  <a key={i} href="#" style={{ color: "var(--text-muted)", transition: "color 0.2s", display: "flex" }}
                    onMouseOver={e => e.currentTarget.style.color = "white"} onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Protocol", links: [["Infrastructure","#how"],["Yield Terminal","#estimator"],["Risk Framework","/security"],["Documentation","/docs"]] },
              { title: "Entity",   links: [["Company","/about"],["Careers","/careers"],["Blog","/blog"],["Contact","/contact"]] },
              { title: "Legal",    links: [["Terms of Service","/terms"],["Privacy Policy","/privacy"],["KYC / AML","/kyc"]] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 style={{ color: "white", marginBottom: "1.125rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                  {links.map(([label, href]) => (
                    <a key={label} href={href} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
                      onMouseOver={e => e.target.style.color = "white"} onMouseOut={e => e.target.style.color = "var(--text-muted)"}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="footer-bottom" style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <span>© {new Date().getFullYear()} SmartFarmer OS. All rights reserved.</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "6px", height: "6px", background: "var(--brand-primary)", borderRadius: "50%", boxShadow: "0 0 8px var(--brand-primary)" }}></span>
              All Systems Operational • Lagos
            </span>
          </div>
        </div>
      </footer>

      {/* ── Sticky Mobile CTA ── */}
      <div className="mobile-only" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, padding: "0.875rem 1.25rem",
        background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border-light)",
        transform: showSticky ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 100,
        flexDirection: "column"
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <a href="/login"    className="btn btn-secondary" style={{ padding: "0.75rem" }}>Log in</a>
          <a href="/register" className="btn btn-primary"   style={{ padding: "0.75rem" }}>Deploy Capital</a>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */
function FeatureIcon({ children }) {
  return (
    <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,255,255,0.1)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
      {children}
    </div>
  );
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setShow(true); }, { threshold: 0.08 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      willChange: "opacity, transform",
      ...style
    }}>
      {children}
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border-light)", padding: "1.25rem 0" }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
        background: "none", border: "none", color: "var(--text-main)", fontSize: "1rem",
        fontWeight: 600, cursor: "pointer", textAlign: "left", padding: 0, gap: "1rem"
      }}>
        <span>{question}</span>
        <span style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s ease", color: isOpen ? "var(--brand-primary)" : "var(--text-muted)", fontSize: "1.5rem", fontWeight: 400, flexShrink: 0, lineHeight: 1 }}>+</span>
      </button>
      <div style={{ maxHeight: isOpen ? "300px" : "0", overflow: "hidden", transition: "max-height 0.35s ease, opacity 0.3s ease", opacity: isOpen ? 1 : 0 }}>
        <p style={{ marginTop: "0.875rem", color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>{answer}</p>
      </div>
    </div>
  );
}
