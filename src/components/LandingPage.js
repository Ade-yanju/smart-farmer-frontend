import React, { useEffect, useMemo, useRef, useState } from "react";

export default function LandingPage() {
  /* ---------------- State & Logic ---------------- */
  const [price, setPrice] = useState(500000);
  const [months, setMonths] = useState(6);
  const [pct, setPct] = useState(15);
  const [risk, setRisk] = useState("Low");
  const [showSticky, setShowSticky] = useState(false);
  
  // Testimonial Reveal Logic
  const [showTestimonials, setShowTestimonials] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Trigger testimonials after 10 seconds
    const testimonialTimer = setTimeout(() => {
      setShowTestimonials(true);
    }, 10000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(testimonialTimer);
    };
  }, []);

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
          --shadow-card: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 20px 40px -10px rgba(0,0,0,0.5);
          --font-sans: 'Inter', system-ui, sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg-main); color: var(--text-main); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .section { padding: clamp(5rem, 10vw, 8rem) 0; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 0.875rem 1.75rem; border-radius: 99px;
          font-weight: 600; text-decoration: none; transition: all 0.2s;
          cursor: pointer; border: none;
        }
        .btn-primary { background: var(--brand-primary); color: #000; }
        .btn-secondary { background: rgba(255, 255, 255, 0.05); color: white; border: 1px solid var(--border-light); }
        
        .terminal-card {
          background: var(--bg-secondary); border: 1px solid var(--border-light);
          border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-card);
        }

        .input {
          width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-light);
          background: #000; color: white; font-family: monospace; margin-top: 0.5rem;
        }

        /* Testimonial Animation */
        .testimonial-reveal {
          animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 968px) {
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Navigation */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container" style={{ height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 800, fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "30px", height: "30px", background: "var(--brand-primary)", borderRadius: "6px" }}></div>
            SmartFarmer
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="#faq" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>FAQ</a>
            <a href="/login" className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>Login</a>
          </div>
        </div>
      </header>

      {/* Hero & Estimator (Existing Logic Preserved) */}
      <section className="section">
        <div className="container grid-2">
          <div>
            <h1 style={{ fontSize: "4rem", fontWeight: 800, lineHeight: 1, marginBottom: "1.5rem" }}>
              Harvesting <span style={{ color: "var(--brand-primary)" }}>Digital Yield</span>.
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", marginBottom: "2rem" }}>
              The first algorithmic bridge between global capital and verified African agricultural production.
            </p>
            <div className="terminal-card">
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Principal Deployment</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input" />
              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Estimated Return</div>
                  <div style={{ fontSize: "2.5rem", fontWeight: 700 }}>{fmt(calc.total)}</div>
                </div>
                <div style={{ color: "var(--brand-primary)", fontWeight: 700 }}>+{calc.pr}% APY</div>
              </div>
            </div>
          </div>
          <div style={{ borderRadius: "24px", overflow: "hidden", height: "500px" }}>
            <img src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c83?auto=format&fit=crop&q=80&w=1000" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} alt="Farming" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION (Reveals after 10s) */}
      {showTestimonials && (
        <section className="section testimonial-reveal" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Trusted by Capital Allocators</h2>
              <p style={{ color: "var(--text-muted)" }}>Join 4,000+ investors financing the future of food security.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {[
                { name: "Chidi K.", role: "Portfolio Manager", text: "The transparency is unmatched. Being able to see the physical assets tied to my yield provides a level of security I haven't found in other fintechs." },
                { name: "Sarah J.", role: "Retail Investor", text: "SmartFarmer's 6-month cycles fit my liquidity needs perfectly. The returns have been consistent since V1." },
                { name: "Marcus Thorne", role: "Agri-Analyst", text: "Finally, a platform that understands parametric insurance and weather-risk. This is institutional-grade tech." }
              ].map((t, i) => (
                <div key={i} className="terminal-card" style={{ background: "#000" }}>
                  <div style={{ color: "var(--brand-primary)", marginBottom: "1rem" }}>★★★★★</div>
                  <p style={{ fontStyle: "italic", marginBottom: "1.5rem", color: "var(--text-main)" }}>"{t.text}"</p>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ SECTION */}
      <section id="faq" className="section">
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "3rem", textAlign: "center" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <FAQItem 
              question="Is my principal guaranteed?" 
              answer="While all investing carries risk, SmartFarmer utilizes asset-backed physical collateral (seeds, equipment) and parametric weather insurance to protect against downside volatility." 
            />
            <FAQItem 
              question="How do I withdraw my funds?" 
              answer="Funds are locked for the duration of the chosen cycle (e.g., 6 months). Upon maturity, your principal and yield are credited to your wallet for instant withdrawal." 
            />
            <FAQItem 
              question="What is the minimum investment?" 
              answer="To ensure we can effectively allocate capital to vetted farm units, the current minimum deployment is ₦50,000." 
            />
            <FAQItem 
              question="Is this a crypto platform?" 
              answer="No. While we use smart-contract logic for transparency, we deal in real-world assets and traditional currency (NGN) to ensure accessibility for all investors." 
            />
          </div>
        </div>
      </section>

      {/* STANDARD INSTITUTIONAL FOOTER */}
      <footer style={{ background: "#000", borderTop: "1px solid var(--border-light)", padding: "5rem 0 2rem" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "4rem", marginBottom: "4rem" }}>
            <div style={{ gridColumn: "span 1.5" }}>
              <div style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "24px", height: "24px", background: "var(--brand-primary)", borderRadius: "4px" }}></div>
                SmartFarmer OS
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                Democratizing agricultural financing through automated infrastructure and real-world asset tracking.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                {['TW', 'LI', 'IG'].map(s => <div key={s} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border-light)", display: "grid", placeItems: "center", fontSize: "0.7rem", color: "var(--text-muted)" }}>{s}</div>)}
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>Product</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {['Yield Terminal', 'Infrastructure', 'Risk Framework', 'Insurance Layer'].map(item => (
                  <li key={item}><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>Company</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {['About Us', 'Impact Report', 'Careers', 'Contact'].map(item => (
                  <li key={item}><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>{item}</a></li>
                ))}
              </ul>
            </div>

            <div style={{ gridColumn: "span 1" }}>
              <h4 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>Newsletter</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1rem" }}>Weekly insights on Ag-Tech and yields.</p>
              <div style={{ display: "flex" }}>
                <input type="text" placeholder="Email" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)", borderRight: "none", padding: "0.5rem 1rem", color: "white", borderRadius: "8px 0 0 8px", width: "100%" }} />
                <button style={{ background: "var(--brand-primary)", border: "none", padding: "0.5rem 1rem", borderRadius: "0 8px 8px 0", cursor: "pointer", fontWeight: "bold" }}>Join</button>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
              © {new Date().getFullYear()} SmartFarmer OS. Registered Agricultural Investment Entity.
            </div>
            <div style={{ display: "flex", gap: "2rem", fontSize: "0.8rem" }}>
              <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy Policy</a>
              <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      style={{ border: "1px solid var(--border-light)", borderRadius: "12px", overflow: "hidden", cursor: "pointer", background: isOpen ? "rgba(255,255,255,0.02)" : "transparent", transition: "all 0.3s" }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{question}</h4>
        <span style={{ fontSize: "1.5rem", transform: isOpen ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s" }}>+</span>
      </div>
      {isOpen && (
        <div style={{ padding: "0 1.5rem 1.5rem 1.5rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          {answer}
        </div>
      )}
    </div>
  );
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setShow(true); }, { threshold: 0.1 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}
