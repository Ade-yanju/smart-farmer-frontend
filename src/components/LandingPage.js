import React, { useEffect, useMemo, useRef, useState } from "react";

export default function LandingPage() {
  /* ---------------- Estimator Logic ---------------- */
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

  /* ---------------- UI State ---------------- */
  const [showSticky, setShowSticky] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Delayed Testimonials (10 seconds)
    const timer = setTimeout(() => setShowTestimonials(true), 10000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="sf-app">
      <style>{`
        :root {
          --brand-primary: #10B981;
          --brand-primary-hover: #059669;
          --brand-surface: #132E24;
          --bg-main: #000000;
          --bg-secondary: #0A0A0A;
          --border-light: rgba(255, 255, 255, 0.1);
          --text-main: #FFFFFF;
          --text-muted: #A1A1AA;
          --risk-low: #10B981;
          --risk-med: #F59E0B;
          --risk-high: #EF4444;
          --radius-md: 12px;
          --radius-lg: 24px;
          --radius-full: 9999px;
          --shadow-glow: 0 0 30px rgba(16, 185, 129, 0.15);
          --shadow-card: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 20px 40px -10px rgba(0,0,0,0.5);
          --font-sans: 'Inter', system-ui, sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg-main); color: var(--text-main); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
        
        h1 { font-size: clamp(3rem, 6vw, 5rem); font-weight: 800; line-height: 1; letter-spacing: -0.04em; }
        h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; }
        p { color: var(--text-muted); line-height: 1.6; font-size: 1.125rem; }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .section { padding: clamp(5rem, 10vw, 8rem) 0; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 0.875rem 1.75rem; border-radius: var(--radius-full);
          font-weight: 600; text-decoration: none; transition: all 0.2s; cursor: pointer; border: none;
        }
        .btn-primary { background: var(--brand-primary); color: #000; box-shadow: var(--shadow-glow); }
        .btn-secondary { background: rgba(255, 255, 255, 0.05); color: var(--text-main); border: 1px solid var(--border-light); }
        
        .terminal-card { background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 2.5rem; position: relative; }
        .input { width: 100%; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); background: #000; color: white; font-family: monospace; }
        
        /* FAQ Styles */
        .faq-item { border-bottom: 1px solid var(--border-light); padding: 1.5rem 0; cursor: pointer; }
        .faq-question { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 1.125rem; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, margin 0.3s ease; color: var(--text-muted); font-size: 1rem; }
        .faq-item.active .faq-answer { max-height: 200px; margin-top: 1rem; }

        @media (max-width: 968px) { .grid-2 { grid-template-columns: 1fr; } .desktop-only { display: none; } }
      `}</style>

      {/* Navigation */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container" style={{ height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 800, fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "32px", height: "32px", background: "var(--brand-primary)", borderRadius: "8px" }}></div>
            SmartFarmer
          </div>
          <nav className="desktop-only" style={{ display: "flex", gap: "2rem" }}>
            <a href="#how" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Infrastructure</a>
            <a href="#testimonials" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Proof</a>
            <a href="#faq" style={{ color: "var(--text-muted)", textDecoration: "none" }}>FAQ</a>
            <a href="/login" className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>Launch App</a>
          </nav>
        </div>
      </header>

      {/* Hero (Existing) */}
      <section className="section">
        <div className="container grid-2">
            <div>
                <h1>Finance the <span style={{color: 'var(--brand-primary)'}}>Yield</span> of the Earth.</h1>
                <p style={{marginTop: '1.5rem'}}>Predictable, asset-backed returns powered by real-world agricultural cycles.</p>
                <div style={{marginTop: '2rem', display: 'flex', gap: '1rem'}}>
                    <button className="btn btn-primary">Get Started</button>
                    <button className="btn btn-secondary">View Audit</button>
                </div>
            </div>
            <div className="terminal-card">
                <label style={{fontSize: '12px', color: 'var(--text-muted)'}}>ESTIMATED RETURNS</label>
                <div style={{fontSize: '3rem', fontWeight: 800}}>{fmt(calc.total)}</div>
                <input type="range" min="100000" max="5000000" step="100000" value={price} onChange={(e) => setPrice(e.target.value)} style={{width: '100%', margin: '2rem 0'}} />
                <p>Principal: {fmt(price)} at {pct}% APY</p>
            </div>
        </div>
      </section>

      {/* Testimonials (Revealed after 10s) */}
      <section id="testimonials" style={{ 
        opacity: showTestimonials ? 1 : 0, 
        transform: showTestimonials ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 1s ease',
        background: 'var(--bg-secondary)',
        overflow: 'hidden'
      }} className="section">
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: "4rem" }}>Trusted by Capital Allocators</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {[
              { name: "Chidi O.", role: "Angel Investor", text: "The transparency is unmatched. Seeing exactly which farm my capital is supporting changes the game." },
              { name: "Sarah J.", role: "Portfolio Manager", text: "In a volatile market, SmartFarmer provides the non-correlated returns my clients actually need." },
              { name: "Ahmed K.", role: "Tech Founder", text: "Finally, a way to build wealth that actually impacts local food security while I sleep." }
            ].map((t, i) => (
              <div key={i} className="terminal-card" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p style={{ fontStyle: "italic", marginBottom: "1.5rem", color: "white" }}>"{t.text}"</p>
                <div style={{ fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: "0.875rem", color: "var(--brand-primary)" }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section">
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 style={{ marginBottom: "3rem", textAlign: "center" }}>Frequently Asked Questions</h2>
          <div className="faq-list">
            {[
              { q: "How are yields actually generated?", a: "Yields come from the sale of harvested produce. Your capital buys inputs (seeds/fertilizer) for vetted farmers, and you receive a fixed share of the profit post-harvest." },
              { q: "What happens if a crop fails?", a: "We utilize parametric weather insurance and satellite monitoring. If a qualified climate event occurs, the insurance payout covers the principal to protect investors." },
              { q: "Is there a minimum investment?", a: "The minimum deployment starts at ₦50,000 to keep institutional-grade assets accessible to everyone." },
              { q: "Can I exit my position early?", a: "SmartFarmer uses fixed cycles (3-12 months). However, our secondary market (Beta) allows you to sell your 'Yield Receipt' to other investors." }
            ].map((item, idx) => (
              <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`} onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                <div className="faq-question">
                  {item.q}
                  <span style={{ transform: activeFaq === idx ? 'rotate(45deg)' : 'rotate(0)', transition: '0.2s' }}>+</span>
                </div>
                <div className="faq-answer">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standard Footer */}
      <footer style={{ borderTop: "1px solid var(--border-light)", background: "#000", padding: "5rem 0 2rem" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "4rem", marginBottom: "4rem" }}>
            <div style={{ gridColumn: "span 2" }}>
              <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "white", marginBottom: "1.5rem" }}>SmartFarmer</div>
              <p style={{ fontSize: "0.875rem", maxWidth: "260px" }}>Bridging the gap between global capital and the world's most essential industry. Built for the modern allocator.</p>
            </div>
            <div>
              <h4 style={{ color: "white", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Platform</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Investment Terminal</a></li>
                <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Farm Monitoring</a></li>
                <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Secondary Market</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: "white", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Company</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>About Us</a></li>
                <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Careers</a></li>
                <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: "white", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Legal</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy Policy</a></li>
                <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Terms of Service</a></li>
                <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Risk Disclosure</a></li>
              </ul>
            </div>
          </div>
          
          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            <p>© {new Date().getFullYear()} SmartFarmer Operations Ltd. All rights reserved.</p>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <span>Twitter</span>
              <span>LinkedIn</span>
              <span>Instagram</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
```
