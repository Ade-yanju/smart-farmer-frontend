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
          --brand-primary: #0B5D3B;
          --brand-primary-hover: #094931;
          --brand-surface: #E9F7F1;
          --brand-surface-light: #F5FBF8;
          --text-main: #0B120F;
          --text-muted: #52605A;
          --border-light: #E2E8F0;
          --bg-main: #FAFCFB;
          --white: #FFFFFF;
          
          --risk-low: #0B5D3B;
          --risk-med: #D97706;
          --risk-high: #DC2626;

          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05);
          --shadow-glow: 0 12px 40px rgba(11,93,59,0.16);
          
          --radius-md: 12px;
          --radius-lg: 20px;
          --radius-full: 9999px;
          
          --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg-main); color: var(--text-main); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }

        /* Typography */
        h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; }
        h2 { font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
        h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: -0.01em; }
        p { color: var(--text-muted); line-height: 1.6; font-size: 1.125rem; }

        /* Layout & Grid */
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .section { padding: clamp(4rem, 8vw, 6rem) 0; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }

        /* Utilities */
        .text-gradient {
          background: linear-gradient(135deg, var(--brand-primary), #10B981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .glass-nav {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        /* Buttons */
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 0.875rem 1.5rem; border-radius: var(--radius-full);
          font-weight: 600; font-size: 1rem; text-decoration: none;
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer; border: none; outline: none;
        }
        .btn:active { transform: scale(0.98); }
        .btn-primary { background: var(--brand-primary); color: var(--white); box-shadow: var(--shadow-glow); }
        .btn-primary:hover { background: var(--brand-primary-hover); transform: translateY(-2px); box-shadow: 0 16px 32px rgba(11,93,59,0.25); }
        .btn-secondary { background: var(--white); color: var(--brand-primary); border: 1px solid var(--border-light); }
        .btn-secondary:hover { background: var(--brand-surface-light); border-color: var(--brand-primary); }

        /* Cards */
        .card {
          background: var(--white); border: 1px solid var(--border-light);
          border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 2rem;
        }
        .card-hover:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }

        /* Forms */
        .input-group { margin-bottom: 1.25rem; }
        .label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.5rem; }
        .input {
          width: 100%; padding: 0.875rem 1rem; border-radius: var(--radius-md);
          border: 1px solid var(--border-light); font-size: 1rem;
          transition: all 0.2s ease; background: var(--white);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
        }
        .input:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(11,93,59,0.1); }
        
        /* Badges */
        .badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1rem; border-radius: var(--radius-full);
          background: var(--brand-surface); color: var(--brand-primary);
          font-weight: 600; font-size: 0.875rem;
        }

        /* Responsive Overrides */
        @media (max-width: 968px) {
          .grid-2 { grid-template-columns: 1fr; gap: 2rem; }
          .hero-cta { flex-direction: column; width: 100%; }
          .hero-cta .btn { width: 100%; }
          .desktop-only { display: none !important; }
        }
        @media (min-width: 969px) {
          .mobile-only { display: none !important; }
        }
      `}</style>

      {/* Top Banner */}
      <div style={{ background: "var(--brand-primary-hover)", color: "#A7F3D0", fontSize: "0.875rem", fontWeight: 500, textAlign: "center", padding: "0.5rem 1rem" }}>
        Input-backed yield for everyone. <b>smartfarmer.ng</b>
      </div>

      {/* Navigation */}
      <header className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div className="container" style={{ height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--brand-primary)", display: "grid", placeItems: "center", color: "white", fontWeight: 800 }}>
              SF
            </div>
            <span style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>SmartFarmer</span>
          </a>
          <nav className="desktop-only" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <a href="#how" style={{ color: "var(--text-muted)", textDecoration: "none", fontWeight: 500 }}>How it Works</a>
            <a href="#estimator" style={{ color: "var(--text-muted)", textDecoration: "none", fontWeight: 500 }}>Estimator</a>
            <div style={{ display: "flex", gap: "1rem" }}>
              <a href="/login" className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>Log in</a>
              <a href="/register" className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>Sign up</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section" style={{ position: "relative", overflow: "hidden", minHeight: "80vh", display: "flex", alignItems: "center" }}>
        {/* Subtle background glow */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(17,153,98,0.08) 0%, rgba(255,255,255,0) 70%)", zIndex: -1, borderRadius: "50%" }} />
        
        <div className="container grid-2">
          <Reveal>
            <div style={{ maxWidth: "600px" }}>
              <div className="badge" style={{ marginBottom: "1.5rem" }}>
                <span>✨ Invest by Units</span>
                <span aria-hidden>•</span>
                <span>Weeks or Months</span>
              </div>
              <h1 style={{ marginBottom: "1.5rem" }}>
                Finance real farm inputs. <br />
                <span className="text-gradient">Earn predictable returns.</span>
              </h1>
              <p style={{ marginBottom: "2.5rem", fontSize: "1.25rem" }}>
                Choose your amount, risk level, holding period, and expected return. See your projected ROI instantly—then deploy capital with confidence.
              </p>
              <div className="hero-cta" style={{ display: "flex", gap: "1rem" }}>
                <a href="#estimator" className="btn btn-primary">Try the Estimator</a>
                <a href="/register" className="btn btn-secondary">Create Account</a>
              </div>
            </div>
          </Reveal>
          
          {/* Hero Visual / Mockup */}
          <Reveal delay={150}>
            <div style={{ position: "relative", padding: "1rem" }}>
              <div className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid rgba(11,93,59,0.1)", boxShadow: "0 25px 50px -12px rgba(11,93,59,0.15)" }}>
                <div style={{ background: "var(--brand-surface-light)", padding: "1.5rem", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 600 }}>Active Portfolio</div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brand-primary)" }}>₦2,450,000</div>
                  </div>
                  <div style={{ background: "#D1FAE5", color: "#065F46", padding: "0.25rem 0.75rem", borderRadius: "99px", fontWeight: 700, fontSize: "0.875rem" }}>+14.2%</div>
                </div>
                <img src="/api/placeholder/600/400" alt="Dashboard Preview" style={{ width: "100%", height: "auto", display: "block", objectFit: "cover", backgroundColor: "#E2E8F0" }} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Value Proposition Strip */}
      <section style={{ borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)", background: "var(--white)" }}>
        <div className="container" style={{ padding: "4rem 1.5rem" }}>
          <div className="grid-4">
            {[
              { i: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>, t: "Asset-backed", d: "Funds directly purchase audited farm materials." },
              { i: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, t: "Flexible Cycles", d: "Hold for weeks or months based on crop realities." },
              { i: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>, t: "Risk Controls", d: "Insurance, KYC, and satellite monitoring built-in." },
              { i: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>, t: "Real Impact", d: "Boost regional yields and local farmer income." },
            ].map((x, i) => (
              <Reveal key={x.t} delay={i * 100}>
                <div style={{ padding: "1rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--brand-surface)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                    {x.i}
                  </div>
                  <h3>{x.t}</h3>
                  <p style={{ fontSize: "1rem", margin: 0 }}>{x.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Estimator Section (Fintech Grade) */}
      <section id="estimator" className="section">
        <div className="container grid-2">
          {/* Form Side */}
          <Reveal>
            <div>
              <h2 style={{ marginBottom: "1rem" }}>Calculate your yield</h2>
              <p style={{ marginBottom: "2.5rem" }}>Adjust the parameters below to see your projected return at maturity. No hidden fees.</p>
              
              <div className="card">
                <div className="input-group">
                  <label className="label">Principal Amount (₦)</label>
                  <input type="number" min={10000} value={price} onChange={(e) => setPrice(e.target.value)} className="input" placeholder="e.g., 500000" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="input-group">
                    <label className="label">Duration (Months)</label>
                    <input type="number" min={1} value={months} onChange={(e) => setMonths(e.target.value)} className="input" placeholder="e.g., 6" />
                  </div>
                  <div className="input-group">
                    <label className="label">Expected Return (%)</label>
                    <input type="number" min={0} value={pct} onChange={(e) => setPct(e.target.value)} className="input" placeholder="e.g., 15" />
                  </div>
                </div>

                <div className="input-group">
                  <label className="label">Risk Preference</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                    {["Low", "Medium", "High"].map((lvl) => {
                      const isSelected = risk === lvl;
                      const colorVar = `var(--risk-${lvl.substring(0,3).toLowerCase()})`;
                      return (
                        <button
                          key={lvl}
                          onClick={() => setRisk(lvl)}
                          style={{
                            padding: "0.75rem", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "0.875rem",
                            background: isSelected ? "var(--brand-surface-light)" : "var(--white)",
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
            <div className="card" style={{ background: "var(--text-main)", color: "var(--white)", border: "none" }}>
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ fontSize: "0.875rem", color: "#9CA3AF", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Payout at Maturity</div>
                <div style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1 }}>
                  {fmt(calc.total)}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
                  <span style={{ color: "#9CA3AF" }}>Principal Invested</span>
                  <span style={{ fontWeight: 600 }}>{fmt(calc.p)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
                  <span style={{ color: "#9CA3AF" }}>Projected Profit</span>
                  <span style={{ fontWeight: 600, color: "#34D399" }}>+{fmt(calc.roi)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9CA3AF" }}>Monthly Yield Equivalent</span>
                  <span style={{ fontWeight: 600 }}>{calc.perMonth.toFixed(2)}% / mo</span>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.25rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", color: "#D1D5DB" }}>
                <strong style={{ color: "var(--white)", display: "block", marginBottom: "0.5rem" }}>Note:</strong>
                Percentage entered is for the entire {calc.m}-month cycle. Risk tier selection determines insurance coverage and asset allocation, not the mathematical return calculated here.
              </div>

              <a href="/register" className="btn btn-primary" style={{ width: "100%", marginTop: "2rem", background: "#34D399", color: "#064E3B", boxShadow: "none" }}>
                Start Investing Now
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--text-main)", color: "#9CA3AF", padding: "4rem 0 2rem" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>
            <div style={{ gridColumn: "1 / -1", maxWidth: "300px" }}>
              <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--white)", marginBottom: "1rem" }}>SmartFarmer</div>
              <p style={{ fontSize: "0.875rem" }}>Connecting capital to real agricultural inputs. Predictable yields, transparent processes, and tangible impact.</p>
            </div>
            <div>
              <h4 style={{ color: "var(--white)", marginBottom: "1.25rem" }}>Platform</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <a href="#how" style={{ color: "inherit", textDecoration: "none" }}>How it Works</a>
                <a href="#estimator" style={{ color: "inherit", textDecoration: "none" }}>Yield Estimator</a>
                <a href="/security" style={{ color: "inherit", textDecoration: "none" }}>Risk & Security</a>
              </div>
            </div>
            <div>
              <h4 style={{ color: "var(--white)", marginBottom: "1.25rem" }}>Company</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <a href="/about" style={{ color: "inherit", textDecoration: "none" }}>About Us</a>
                <a href="/careers" style={{ color: "inherit", textDecoration: "none" }}>Careers</a>
                <a href="/contact" style={{ color: "inherit", textDecoration: "none" }}>Contact</a>
              </div>
            </div>
            <div>
              <h4 style={{ color: "var(--white)", marginBottom: "1.25rem" }}>Legal</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <a href="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</a>
                <a href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.875rem" }}>
            <span>© {new Date().getFullYear()} SmartFarmer Ltd. All rights reserved.</span>
            <span>Made in Lagos</span>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA (Properly configured for Mobile Only) */}
      <div className={`mobile-only ${showSticky ? "visible" : ""}`} style={{
        position: "fixed", bottom: 0, left: 0, right: 0, padding: "1rem",
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--border-light)",
        transform: showSticky ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 100
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <a href="/login" className="btn btn-secondary" style={{ padding: "0.75rem" }}>Log in</a>
          <a href="/register" className="btn btn-primary" style={{ padding: "0.75rem" }}>Sign up</a>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Animation Helper ---------------- */
function Reveal({ children, delay = 0 }) {
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
        willChange: "opacity, transform"
      }}
    >
      {children}
    </div>
  );
}
