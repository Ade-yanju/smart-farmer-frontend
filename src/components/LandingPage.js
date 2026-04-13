import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

/* ─── AI Chat Widget ─────────────────────────────────────── */
const SYSTEM_PROMPT = `You are SmartFarmer AI Assistant — the intelligent support agent for SmartFarmer, a Nigerian agricultural investment platform. Be concise, professional, and helpful. Always refer to the platform as "SmartFarmer."

PLATFORM KNOWLEDGE:
- SmartFarmer connects investors to vetted Nigerian agricultural projects
- Minimum investment: ₦100,000
- Returns: 10–22% APY depending on crop cycle and risk tranche
- Cycle durations: 3, 6, or 9 months
- Risk tranches: Low (10–14% APY), Medium (14–18% APY), High (18–22% APY)
- All investments are asset-backed (seeds, fertilizers, equipment)
- Parametric weather insurance protects every deployment
- Platform is fiat-native (NGN/USD), uses blockchain for record-keeping only
- KYC verification required before investing
- Capital is locked during the crop cycle; early withdrawal not supported
- Zero management fees on returns
- Payouts go directly to investor's registered bank account at maturity
- Regulated and compliant with Nigerian SEC guidelines

ABOUT THE PLATFORM:
- Operates from Lagos, Nigeria
- Partners with over 2,000 vetted farming cooperatives across 18 states
- Satellite monitoring and real-time farm analytics
- Average portfolio maturity rate: 97.3%
- Total capital deployed to date: ₦4.8 billion
- Founded 2021, SmartFarmer V2 launched 2024

Keep responses under 120 words. Be warm but professional. If asked about specific legal, tax or financial advice, recommend the user consult a professional. Never make guarantees about future returns.`;

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm the SmartFarmer AI. Ask me anything about our platform, investment cycles, returns, or how to get started. 🌱" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again shortly." }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const suggestions = ["What's the minimum investment?", "How does the insurance work?", "When do I get paid?", "Is this regulated?"];

  return (
    <>
      <style>{`
        .chat-fab {
          position: fixed; bottom: 2rem; right: 2rem; z-index: 200;
          width: 60px; height: 60px; border-radius: 50%;
          background: linear-gradient(135deg, #10B981, #059669);
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 32px rgba(16,185,129,0.4), 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .chat-fab:hover { transform: scale(1.08); box-shadow: 0 12px 40px rgba(16,185,129,0.5); }
        .chat-fab:active { transform: scale(0.96); }
        .chat-panel {
          position: fixed; bottom: 6.5rem; right: 2rem; z-index: 200;
          width: min(400px, calc(100vw - 2rem));
          height: min(560px, calc(100vh - 9rem));
          background: #0D0D0D; border: 1px solid rgba(16,185,129,0.25);
          border-radius: 20px; display: flex; flex-direction: column;
          overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.7);
          transform-origin: bottom right;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;
        }
        .chat-panel.closed { transform: scale(0.85) translateY(12px); opacity: 0; pointer-events: none; }
        .chat-header {
          padding: 1rem 1.25rem; background: rgba(16,185,129,0.08);
          border-bottom: 1px solid rgba(16,185,129,0.15);
          display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;
        }
        .chat-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #10B981, #047857);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 1rem 1.25rem;
          display: flex; flex-direction: column; gap: 0.75rem;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .chat-bubble {
          max-width: 85%; padding: 0.75rem 1rem; border-radius: 16px;
          font-size: 0.875rem; line-height: 1.55; animation: popIn 0.25s ease;
        }
        @keyframes popIn { from { transform: scale(0.92) translateY(4px); opacity: 0.4; } to { transform: none; opacity: 1; } }
        .bubble-ai { background: rgba(255,255,255,0.07); color: #E4E4E4; border-radius: 16px 16px 16px 4px; align-self: flex-start; }
        .bubble-user { background: var(--brand-primary); color: #000; font-weight: 500; border-radius: 16px 16px 4px 16px; align-self: flex-end; }
        .typing-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10B981; animation: blink 1.2s ease infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%,80%,100%{opacity:0.2} 40%{opacity:1} }
        .chat-suggestions { padding: 0 1.25rem 0.75rem; display: flex; flex-wrap: wrap; gap: 0.4rem; flex-shrink: 0; }
        .suggestion-pill {
          padding: 0.35rem 0.75rem; border-radius: 100px;
          background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2);
          color: #10B981; font-size: 0.75rem; cursor: pointer;
          transition: background 0.15s, border-color 0.15s; white-space: nowrap;
        }
        .suggestion-pill:hover { background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.4); }
        .chat-input-row {
          padding: 0.875rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; gap: 0.625rem; align-items: flex-end; flex-shrink: 0;
          background: rgba(0,0,0,0.3);
        }
        .chat-input {
          flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: white; padding: 0.625rem 0.875rem;
          font-size: 0.875rem; resize: none; outline: none; min-height: 40px; max-height: 100px;
          font-family: inherit; transition: border-color 0.2s;
        }
        .chat-input:focus { border-color: rgba(16,185,129,0.4); }
        .chat-input::placeholder { color: rgba(255,255,255,0.3); }
        .chat-send {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
          background: #10B981; border: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center; color: #000;
          transition: background 0.15s, transform 0.1s;
        }
        .chat-send:hover { background: #34D399; }
        .chat-send:active { transform: scale(0.94); }
        .chat-send:disabled { background: rgba(255,255,255,0.1); cursor: not-allowed; }
        .chat-close { margin-left: auto; background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; padding: 0; font-size: 1.25rem; line-height: 1; transition: color 0.15s; }
        .chat-close:hover { color: white; }
        .unread-dot { position: absolute; top: 2px; right: 2px; width: 12px; height: 12px; border-radius: 50%; background: #EF4444; border: 2px solid #000; animation: pulse 2s infinite; }
        @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 70%{box-shadow:0 0 0 6px rgba(239,68,68,0)} 100%{box-shadow:0 0 0 0 rgba(239,68,68,0)} }
      `}</style>

      {/* FAB Button */}
      <button className="chat-fab" onClick={() => setOpen(o => !o)} title="Chat with SmartFarmer AI" style={{ position: "fixed" }}>
        {open ? (
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        ) : (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        )}
        {!open && <span className="unread-dot" />}
      </button>

      {/* Chat Panel */}
      <div className={`chat-panel${open ? "" : " closed"}`}>
        <div className="chat-header">
          <div className="chat-avatar">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "white", letterSpacing: "-0.01em" }}>SmartFarmer AI</div>
            <div style={{ fontSize: "0.72rem", color: "#10B981", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }}></span>
              Online • Instant responses
            </div>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)}>×</button>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role === "assistant" ? "bubble-ai" : "bubble-user"}`}>
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble bubble-ai" style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <span className="typing-dot"></span><span className="typing-dot"></span><span className="typing-dot"></span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 2 && (
          <div className="chat-suggestions">
            {suggestions.map(s => (
              <button key={s} className="suggestion-pill" onClick={() => { setInput(s); setTimeout(send, 50); }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-row">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about investments, returns, security..."
            rows={1}
          />
          <button className="chat-send" onClick={send} disabled={!input.trim() || loading}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Stats Ticker ──────────────────────────────────────── */
function StatsTicker() {
  const stats = [
    "₦4.8B+ Capital Deployed",
    "2,400+ Active Investors",
    "97.3% Portfolio Maturity Rate",
    "18 States Covered",
    "2,000+ Farming Cooperatives",
    "Zero Capital Loss Events",
    "14.2% Average APY",
    "Regulatory Compliant (SEC Nigeria)",
  ];
  return (
    <div style={{ overflow: "hidden", background: "rgba(16,185,129,0.05)", borderBottom: "1px solid rgba(16,185,129,0.12)", padding: "0.6rem 0" }}>
      <div style={{
        display: "flex", gap: "3rem", whiteSpace: "nowrap",
        animation: "ticker 30s linear infinite",
      }}>
        {[...stats, ...stats].map((s, i) => (
          <span key={i} style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.02em", flexShrink: 0 }}>
            <span style={{ color: "#10B981", marginRight: "0.5rem" }}>◆</span>{s}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

/* ─── Trust Bar ──────────────────────────────────────────── */
function TrustBar() {
  const logos = ["SEC Nigeria", "CBN Compliant", "ISO 27001", "NDIC Secured", "NSE Listed"];
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem 0", background: "rgba(255,255,255,0.02)" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0 }}>Regulated & Certified By</span>
          {logos.map(l => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: "0.4rem", opacity: 0.45, filter: "grayscale(1)" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "white", letterSpacing: "0.02em" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Live Stats Panel ───────────────────────────────────── */
function LiveStats() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let c = 0;
      const iv = setInterval(() => {
        c += 1;
        setCount(c);
        if (c >= 100) clearInterval(iv);
      }, 15);
      return () => clearInterval(iv);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const metrics = [
    { label: "Total Capital Deployed", value: "₦4.8B+", sub: "+₦240M this month", positive: true },
    { label: "Active Cycles", value: "1,247", sub: "Across 18 states", positive: true },
    { label: "Avg. Maturity Return", value: "14.2%", sub: "APY last 90 days", positive: true },
    { label: "Insurance Coverage", value: "100%", sub: "All deployments insured", positive: null },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
      {metrics.map(m => (
        <div key={m.label} style={{ background: "#000", padding: "1.75rem 2rem" }}>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>{m.label}</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "white", fontFamily: "'DM Mono', 'JetBrains Mono', monospace", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>{m.value}</div>
          <div style={{ fontSize: "0.78rem", color: m.positive === true ? "#10B981" : m.positive === false ? "#EF4444" : "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {m.positive === true && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>}
            {m.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── How It Works Steps ────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: "01", title: "Verify & Fund", desc: "Complete KYC verification in under 5 minutes. Fund your SmartFarmer wallet via bank transfer in NGN or USD.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { n: "02", title: "Select a Cycle", desc: "Choose from our curated farm cycles — cassava, maize, soybean, or mixed. Pick your duration (3–9 months) and risk tranche.", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { n: "03", title: "Monitor Live", desc: "Track your investment via satellite imagery, farm sensor data, and on-chain audit logs — updated every 24 hours.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { n: "04", title: "Collect Returns", desc: "At crop maturity, your principal + yield is disbursed directly to your bank account. Reinvest or withdraw — your choice.", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0", position: "relative" }}>
      {steps.map((s, i) => (
        <Reveal key={s.n} delay={i * 120}>
          <div style={{ padding: "2.5rem 2rem", borderRight: i < steps.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", position: "relative" }}>
            <div style={{ fontSize: "0.65rem", color: "#10B981", fontWeight: 800, letterSpacing: "0.15em", marginBottom: "1.25rem", fontFamily: "'DM Mono', monospace" }}>{s.n}</div>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
            </div>
            <h3 style={{ color: "white", marginBottom: "0.625rem", fontSize: "1rem", fontWeight: 700 }}>{s.title}</h3>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
            {i < steps.length - 1 && (
              <div style={{ position: "absolute", top: "3.5rem", right: "-0.75rem", zIndex: 2, display: "flex", alignItems: "center" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#0A0A0A", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ─── Crop Cards ─────────────────────────────────────────── */
function CropCards() {
  const crops = [
    { name: "Maize", season: "Apr – Oct", apy: "12–15%", risk: "Low", img: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?q=80&w=600&auto=format&fit=crop", color: "#F59E0B" },
    { name: "Cassava", season: "Year-round", apy: "15–18%", risk: "Medium", img: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=600&auto=format&fit=crop", color: "#10B981" },
    { name: "Soybean", season: "Jun – Dec", apy: "18–22%", risk: "High", img: "https://images.unsplash.com/photo-1599493258758-6cbf59f3b0d9?q=80&w=600&auto=format&fit=crop", color: "#EF4444" },
    { name: "Rice", season: "May – Nov", apy: "13–16%", risk: "Low", img: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?q=80&w=600&auto=format&fit=crop", color: "#10B981" },
  ];
  const riskColor = r => r === "Low" ? "#10B981" : r === "Medium" ? "#F59E0B" : "#EF4444";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
      {crops.map((c, i) => (
        <Reveal key={c.name} delay={i * 100}>
          <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "#0A0A0A", transition: "border-color 0.3s, transform 0.3s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "none"; }}>
            <div style={{ height: "160px", position: "relative", overflow: "hidden" }}>
              <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)" }} />
              <div style={{ position: "absolute", top: "0.875rem", right: "0.875rem", background: `rgba(${c.risk === "Low" ? "16,185,129" : c.risk === "Medium" ? "245,158,11" : "239,68,68"},0.15)`, border: `1px solid ${riskColor(c.risk)}33`, color: riskColor(c.risk), fontSize: "0.7rem", fontWeight: 700, padding: "0.25rem 0.625rem", borderRadius: "100px", letterSpacing: "0.05em" }}>
                {c.risk} Risk
              </div>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <h3 style={{ color: "white", fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: 700 }}>{c.name}</h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>{c.season}</span>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "#10B981", fontFamily: "monospace" }}>{c.apy} APY</span>
              </div>
              <a href="/register" style={{ display: "block", marginTop: "1rem", padding: "0.625rem", textAlign: "center", borderRadius: "8px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, transition: "background 0.2s" }}
                onMouseOver={e => e.target.style.background = "rgba(16,185,129,0.15)"}
                onMouseOut={e => e.target.style.background = "rgba(16,185,129,0.08)"}>
                Invest in {c.name} →
              </a>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ─── Main Landing Page ──────────────────────────────────── */
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

  const fmt = (n) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(n) || 0);

  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sf-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

        :root {
          --brand-primary: #10B981;
          --brand-primary-hover: #059669;
          --brand-surface: #132E24;
          --bg-main: #050505;
          --bg-secondary: #0A0A0A;
          --border-light: rgba(255, 255, 255, 0.07);
          --border-glow: rgba(16, 185, 129, 0.3);
          --text-main: #FFFFFF;
          --text-muted: #888;
          --risk-low: #10B981;
          --risk-med: #F59E0B;
          --risk-hig: #EF4444;
          --shadow-glow: 0 0 40px rgba(16, 185, 129, 0.2);
          --shadow-card: 0 24px 64px -12px rgba(0,0,0,0.6);
          --radius-md: 12px;
          --radius-lg: 20px;
          --radius-full: 9999px;
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg-main);
          color: var(--text-main);
          font-family: var(--font-body);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        img { max-width: 100%; display: block; }

        h1 { font-family: var(--font-display); font-size: clamp(2.5rem, 7vw, 5.5rem); font-weight: 800; line-height: 1.02; letter-spacing: -0.04em; }
        h2 { font-family: var(--font-display); font-size: clamp(1.75rem, 4vw, 3.25rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.03em; }
        h3 { font-size: 1rem; font-weight: 600; }
        p  { color: var(--text-muted); line-height: 1.7; font-size: 1rem; }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .section    { padding: clamp(4rem, 10vw, 8rem) 0; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

        .bento-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.25rem; }
        .bento-item {
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          position: relative; overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .bento-item:hover { border-color: rgba(16,185,129,0.3); transform: translateY(-2px); }

        .text-emerald { color: var(--brand-primary); }
        .glass-nav {
          background: rgba(5,5,5,0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 0.875rem 1.75rem; border-radius: var(--radius-full);
          font-weight: 600; font-size: 0.95rem; text-decoration: none; font-family: var(--font-body);
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer; border: none; outline: none; letter-spacing: -0.01em; white-space: nowrap;
        }
        .btn:active { transform: scale(0.97); }
        .btn-primary { background: var(--brand-primary); color: #000; font-weight: 700; }
        .btn-primary:hover { background: #34D399; box-shadow: 0 0 32px rgba(16,185,129,0.35); }
        .btn-secondary {
          background: rgba(255,255,255,0.05); color: var(--text-main);
          border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(10px);
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.2); }

        .terminal-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 2rem; position: relative;
        }
        .terminal-card::before {
          content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent);
        }

        .input-group { margin-bottom: 1.25rem; }
        .label { display: block; font-size: 0.72rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.07em; }
        .input {
          width: 100%; padding: 0.875rem 1.125rem;
          border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.95rem; transition: all 0.2s ease;
          background: rgba(255,255,255,0.04); color: white; font-family: var(--font-mono);
        }
        .input:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 1px rgba(16,185,129,0.3); background: rgba(16,185,129,0.04); }

        .badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.35rem 1rem; border-radius: var(--radius-full);
          background: rgba(16,185,129,0.08); color: var(--brand-primary);
          border: 1px solid rgba(16,185,129,0.18);
          font-weight: 600; font-size: 0.78rem; letter-spacing: 0.03em;
        }

        @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)} 70%{box-shadow:0 0 0 8px rgba(16,185,129,0)} 100%{box-shadow:0 0 0 0 rgba(16,185,129,0)} }
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        /* Responsive */
        @media (max-width: 1024px) {
          .bento-grid { grid-template-columns: repeat(6, 1fr); }
          .bento-item[style*="span 8"] { grid-column: span 6 !important; }
          .bento-item[style*="span 4"] { grid-column: span 6 !important; }
        }
        @media (max-width: 768px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr; gap: 2rem; }
          .bento-grid { display: flex; flex-direction: column; }
          .hero-section { min-height: auto !important; padding: 5rem 0 3rem !important; }
          .hero-text { text-align: center; }
          .hero-cta { flex-direction: column !important; width: 100%; }
          .hero-cta .btn { width: 100%; justify-content: center; }
          .hero-badge { justify-content: center; }
          .nav-links, .nav-actions { display: none !important; }
          .mobile-only { display: flex !important; }
          .desktop-only { display: none !important; }
          .estimator-inputs { grid-template-columns: 1fr !important; }
          .risk-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-bottom { flex-direction: column !important; text-align: center; }
          .how-steps-grid { grid-template-columns: 1fr !important; }
          .chat-fab { bottom: 1.25rem; right: 1.25rem; }
        }
        @media (max-width: 480px) {
          .container { padding: 0 1rem; }
          .terminal-card { padding: 1.25rem; }
        }
        .desktop-only { display: flex; }
        .mobile-only  { display: none; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }

        /* Section label style */
        .section-eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          color: var(--brand-primary); font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem;
          font-family: var(--font-mono);
        }
      `}</style>

      {/* ── Top Banner ── */}
      <div style={{ background: "linear-gradient(90deg, #059669, #10B981, #34D399)", color: "#000", fontSize: "0.78rem", fontWeight: 700, textAlign: "center", padding: "0.55rem 1rem", letterSpacing: "0.03em" }}>
        🌱 SmartFarmer V2 is live — Institutional-grade agricultural yield, now for everyone →
      </div>

      {/* ── Stats Ticker ── */}
      <StatsTicker />

      {/* ── Navigation ── */}
      <header className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div className="container" style={{ height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", color: "inherit", flexShrink: 0 }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg,#10B981,#059669)", display: "grid", placeItems: "center", color: "#000" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.03em", fontFamily: "var(--font-display)" }}>SmartFarmer</span>
          </a>

          <nav className="nav-links desktop-only" style={{ gap: "2rem", alignItems: "center" }}>
            {[["How It Works","#how"],["Crop Cycles","#crops"],["Yield Terminal","#estimator"],["FAQ","#faq"]].map(([label, href]) => (
              <a key={label} href={href} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, transition: "color 0.2s" }}
                onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="var(--text-muted)"}>
                {label}
              </a>
            ))}
          </nav>

          <div className="nav-actions desktop-only" style={{ gap: "0.75rem", alignItems: "center" }}>
            <a href="/login" className="btn btn-secondary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>Log in</a>
            <a href="/signup" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>Deploy Capital</a>
          </div>

          <div className="mobile-only" style={{ gap: "0.5rem", alignItems: "center" }}>
            <a href="/login" className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>Log in</a>
            <a href="/signup" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>Start</a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="section hero-section" style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center" }}>
        {/* BG orbs */}
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)", zIndex: -1, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "0", right: "-5%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)", zIndex: -1, borderRadius: "50%", pointerEvents: "none" }} />

        <div className="container">
          <div className="grid-2">
            <Reveal>
              <div className="hero-text" style={{ maxWidth: "680px" }}>
                <div className="badge hero-badge" style={{ marginBottom: "1.75rem" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--brand-primary)", boxShadow: "0 0 8px var(--brand-primary)", flexShrink: 0, animation: "pulse 2s infinite" }}></span>
                  Protocol Live · 14.2% Average APY
                </div>
                <h1 style={{ marginBottom: "1.5rem" }}>
                  Your capital,<br />
                  <span className="text-emerald">growing in soil.</span>
                </h1>
                <p style={{ marginBottom: "2.75rem", fontSize: "clamp(1rem, 2vw, 1.15rem)", maxWidth: "520px", color: "#888" }}>
                  SmartFarmer routes your capital directly to audited, asset-backed agricultural inputs. Predictable, real-world returns — no crypto, no stock market volatility.
                </p>
                <div className="hero-cta" style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                  <a href="/register" className="btn btn-primary" style={{ gap: "0.5rem" }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    Start Investing
                  </a>
                  <a href="#estimator" className="btn btn-secondary">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.4rem" }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Run Simulation
                  </a>
                </div>

                {/* Social proof */}
                <div style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex" }}>
                    {["#10B981","#059669","#047857","#065F46","#064E3B"].map((c, i) => (
                      <div key={i} style={{ width: "32px", height: "32px", borderRadius: "50%", background: c, border: "2px solid #050505", marginLeft: i ? "-8px" : "0", zIndex: 5-i, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: "#000", fontWeight: 800 }}>
                        {["AO","BM","CF","DI","EK"][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "white" }}>2,400+ active investors</div>
                    <div style={{ fontSize: "0.75rem", color: "#10B981" }}>★★★★★ 4.9/5 — Verified reviews</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div style={{ position: "relative" }}>
                <div style={{ borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"
                    alt="Agricultural Drone Technology" style={{ width: "100%", height: "480px", objectFit: "cover", filter: "brightness(0.6) saturate(1.2)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.1) 50%, transparent 100%)" }} />
                </div>

                {/* Portfolio card */}
                <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", right: "1.5rem", background: "rgba(10,10,10,0.92)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "16px", padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>Live Portfolio Value</div>
                      <div style={{ fontSize: "2.25rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "white", lineHeight: 1 }}>₦2,450,000</div>
                    </div>
                    <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "8px", padding: "0.5rem 0.875rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                      <span style={{ color: "#10B981", fontWeight: 700, fontSize: "0.875rem" }}>+14.2%</span>
                    </div>
                  </div>
                  {/* Mini bar chart */}
                  <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "36px" }}>
                    {[45,60,52,70,65,80,90,75,95,88,100,96].map((h,i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "3px", background: i === 11 ? "#10B981" : `rgba(16,185,129,${0.15 + i*0.05})`, transition: "height 0.3s" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)" }}>Jan</span>
                    <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)" }}>Jun</span>
                    <span style={{ fontSize: "0.68rem", color: "#10B981", fontWeight: 600 }}>Now</span>
                  </div>
                </div>

                {/* Floating badge */}
                <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "12px", padding: "0.75rem 1rem", animation: "floatUp 4s ease-in-out infinite" }}>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.2rem" }}>Next payout in</div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "#10B981" }}>14 days</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <TrustBar />

      {/* ── Live Stats ── */}
      <LiveStats />

      {/* ── How It Works ── */}
      <section id="how" style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="container" style={{ padding: "5rem 1.5rem" }}>
          <div style={{ marginBottom: "3rem" }}>
            <div className="section-eyebrow"><span>◆</span> How It Works</div>
            <h2 style={{ maxWidth: "500px" }}>From transfer to harvest in 4 steps.</h2>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* ── Bento: Infrastructure ── */}
      <section id="infrastructure" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-light)" }}>
        <div className="container" style={{ padding: "5rem 1.5rem" }}>
          <div style={{ marginBottom: "3rem" }}>
            <div className="section-eyebrow"><span>◆</span> Infrastructure</div>
            <h2 style={{ marginBottom: "0.75rem" }}>Institutional-grade infrastructure.</h2>
            <p style={{ maxWidth: "560px" }}>We've engineered the entire stack to remove friction from agricultural financing, ensuring capital deployment is secure, transparent, and profitable.</p>
          </div>

          <div className="bento-grid">
            <Reveal delay={0} style={{ gridColumn: "span 8" }}>
              <div className="bento-item" style={{ minHeight: "300px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <img src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c83?q=80&w=1000&auto=format&fit=crop" alt="Harvest"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0A0A0A 0%, transparent 60%)" }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--brand-primary)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "white" }}>Asset-Backed Security</h3>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>Capital doesn't sit idle. Funds directly purchase audited, physical farm materials — seeds, fertilizers, and equipment — each insured against comprehensive risks.</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100} style={{ gridColumn: "span 4" }}>
              <div className="bento-item" style={{ height: "100%" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 style={{ marginBottom: "0.5rem", color: "white" }}>Dynamic Cycles</h3>
                <p style={{ fontSize: "0.875rem", margin: 0 }}>Hold for weeks or months. Yields are generated by real-world crop maturity cycles, completely detached from crypto or stock market volatility.</p>
              </div>
            </Reveal>

            <Reveal delay={200} style={{ gridColumn: "span 4" }}>
              <div className="bento-item" style={{ height: "100%" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h3 style={{ marginBottom: "0.5rem", color: "white" }}>Algorithmic Risk Control</h3>
                <p style={{ fontSize: "0.875rem", margin: 0 }}>Integrated KYC, parametric weather insurance, and real-time satellite monitoring protect downside exposure on every single deployment.</p>
              </div>
            </Reveal>

            <Reveal delay={300} style={{ gridColumn: "span 8" }}>
              <div className="bento-item" style={{ background: "linear-gradient(135deg, var(--brand-surface) 0%, var(--bg-secondary) 100%)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--brand-primary)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "white" }}>Measurable Local Impact</h3>
                <p style={{ margin: 0 }}>Every Naira deployed translates directly to boosted regional yields and increased income for 2,000+ vetted local farming cooperatives across Nigeria.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Crop Cycles ── */}
      <section id="crops" className="section" style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <div style={{ marginBottom: "3rem" }}>
            <div className="section-eyebrow"><span>◆</span> Active Cycles</div>
            <h2>Choose your crop cycle.</h2>
          </div>
          <CropCards />
        </div>
      </section>

      {/* ── Estimator ── */}
      <section id="estimator" className="section" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <div className="grid-2">
            <Reveal>
              <div>
                <div className="section-eyebrow"><span>◆</span> Yield Terminal</div>
                <h2 style={{ marginBottom: "1rem" }}>Simulate your deployment.</h2>
                <p style={{ marginBottom: "2.25rem" }}>Configure your capital parameters. Our algorithmic engine calculates your projected maturity payout instantly. Zero management fees.</p>

                <div className="terminal-card">
                  <div className="input-group">
                    <label className="label">Principal Amount (NGN)</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1.125rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>₦</span>
                      <input type="number" min={100000} value={price} onChange={e => setPrice(e.target.value)} className="input" style={{ paddingLeft: "2.25rem" }} placeholder="500000" />
                    </div>
                  </div>

                  <div className="estimator-inputs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div className="input-group">
                      <label className="label">Cycle (Months)</label>
                      <input type="number" min={3} max={9} value={months} onChange={e => setMonths(e.target.value)} className="input" placeholder="6" />
                    </div>
                    <div className="input-group">
                      <label className="label">Target APY (%)</label>
                      <input type="number" min={10} max={22} value={pct} onChange={e => setPct(e.target.value)} className="input" placeholder="15" />
                    </div>
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="label">Risk Tranche</label>
                    <div className="risk-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" }}>
                      {[["Low","10–14% APY","16,185,129"],["Medium","14–18% APY","245,158,11"],["High","18–22% APY","239,68,68"]].map(([lvl, range, rgb]) => {
                        const sel = risk === lvl;
                        return (
                          <button key={lvl} onClick={() => setRisk(lvl)} style={{
                            padding: "0.875rem 0.75rem", borderRadius: "10px", fontWeight: 600, fontSize: "0.825rem",
                            background: sel ? `rgba(${rgb},0.1)` : "rgba(255,255,255,0.04)",
                            border: `1px solid ${sel ? `rgba(${rgb},0.5)` : "rgba(255,255,255,0.09)"}`,
                            color: sel ? `rgb(${rgb})` : "var(--text-muted)", cursor: "pointer", transition: "all 0.2s",
                            display: "flex", flexDirection: "column", gap: "0.2rem"
                          }}>
                            <span>{lvl}</span>
                            <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", opacity: 0.7 }}>{range}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="terminal-card" style={{ background: "#030303" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "1rem" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Projected Output</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--brand-primary)", animation: "pulse 2s infinite" }}></div>
                    <span style={{ fontSize: "0.72rem", color: "#10B981" }}>Live Calc</span>
                  </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Total Value at Maturity</div>
                  <div style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-mono)", color: "white", wordBreak: "break-all" }}>
                    {fmt(calc.total)}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "2rem", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
                  {[
                    { label: "Principal", value: fmt(calc.p), color: "white" },
                    { label: "Net Profit", value: `+${fmt(calc.roi)}`, color: "var(--brand-primary)" },
                    { label: "Monthly Velocity", value: `${calc.perMonth.toFixed(2)}% / mo`, color: "white" },
                    { label: "Duration", value: `${calc.m} month${calc.m > 1 ? 's' : ''}`, color: "white" },
                  ].map(({ label, value, color }, i, arr) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < arr.length - 1 ? "1px dashed rgba(255,255,255,0.07)" : "none", paddingBottom: i < arr.length - 1 ? "0.875rem" : 0 }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{label}</span>
                      <span style={{ color }}>{value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "rgba(16,185,129,0.05)", padding: "0.875rem", borderRadius: "8px", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(16,185,129,0.1)", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>NOTE:</span> APY reflects the full {calc.m}-month lockup. Parametric weather insurance covers 100% of principal.
                </div>

                <a href="/register" className="btn btn-primary" style={{ width: "100%", padding: "1.1rem", fontSize: "1rem", justifyContent: "center" }}>
                  Initialize Deployment →
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section" style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-eyebrow" style={{ justifyContent: "center" }}><span>◆</span> Investor Stories</div>
            <h2>Trusted by smart capital.</h2>
          </div>

          <div className="grid-3">
            {[
              { initials: "SJ", name: "Sarah Jenkins", role: "Private Wealth Manager • Lagos", quote: "The algorithmic risk control gave me confidence to deploy a mid-six-figure sum. Yield has outpaced my fixed-income portfolio by 3x with zero correlation to broader markets.", stars: 5 },
              { initials: "MT", name: "Marcus T.", role: "DeFi Strategist • Abuja", quote: "Finally, a protocol that touches grass. Real-world asset backing in agriculture is the missing primitive in modern finance. The dashboard transparency is unmatched.", stars: 5 },
              { initials: "ER", name: "Elena R.", role: "Founder & CEO • Port Harcourt", quote: "Seamless deployment, transparent tracking, predictable maturity cycles. I route 10% of my startup treasury through SmartFarmer to hedge against fiat inflation.", stars: 5 },
            ].map(({ initials, name, role, quote, stars }, i) => (
              <Reveal key={name} delay={i * 150}>
                <div style={{ background: "var(--bg-secondary)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", height: "100%", transition: "border-color 0.3s, transform 0.3s" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem" }}>
                    {[...Array(stars)].map((_,i) => <span key={i} style={{ color: "#F59E0B", fontSize: "0.875rem" }}>★</span>)}
                  </div>
                  <p style={{ color: "#D4D4D4", fontSize: "0.95rem", flexGrow: 1, marginBottom: "1.75rem", lineHeight: 1.7 }}>"{quote}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, #10B981, #059669)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "0.8rem", color: "#000", flexShrink: 0 }}>{initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: "white", fontSize: "0.9rem" }}>{name}</div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="section" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: "flex-start" }}>
            <Reveal>
              <div style={{ position: "sticky", top: "100px" }}>
                <div className="section-eyebrow"><span>◆</span> FAQ</div>
                <h2 style={{ marginBottom: "1rem" }}>System Queries.</h2>
                <p style={{ marginBottom: "2rem" }}>Everything you need to know about the platform, risk management, and capital deployment.</p>
                <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "16px", padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.75rem" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg,#10B981,#059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    </div>
                    <span style={{ fontWeight: 700, color: "white", fontSize: "0.9rem" }}>Still have questions?</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>Chat with our AI assistant — available 24/7 to answer any questions about the platform.</p>
                  <button className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.625rem 1.25rem" }}
                    onClick={() => document.querySelector('.chat-fab')?.click()}>
                    Open AI Chat →
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div>
                {[
                  { q: "How is the 14.2% APY generated?", a: "Yields come from actual profit margins of harvested commodities. Your capital purchases raw inputs (seeds, fertilizer) at wholesale. When the crop matures and sells to pre-vetted off-takers, the profit distributes directly to your wallet." },
                  { q: "What happens if a crop fails due to weather?", a: "Every deployment is protected by parametric weather insurance. If specific weather metrics (rainfall, temperature) cross critical thresholds, the insurance smart contract executes automatically, recovering your principal in full." },
                  { q: "What is the minimum investment?", a: "The minimum investment is ₦100,000. There is no maximum cap, though investments above ₦10,000,000 require additional due diligence as part of our enterprise onboarding process." },
                  { q: "Are there any lock-up periods?", a: "Yes. Capital is locked for the duration of the crop cycle you choose (3–9 months). Because funds are tied to physical, growing assets, early withdrawal is not supported." },
                  { q: "Is SmartFarmer a cryptocurrency or DeFi token?", a: "No. SmartFarmer is a fiat-native, regulatory-compliant platform dealing strictly with Real-World Assets (RWA). All deposits and payouts are handled in NGN or USD." },
                  { q: "How is my investment protected?", a: "Every investment is covered by three layers: (1) physical asset backing (your capital buys real farm inputs), (2) parametric weather insurance, and (3) cooperative liability agreements with our farming partners." },
                ].map(({ q, a }) => <FAQItem key={q} question={q} answer={a} />)}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ borderTop: "1px solid var(--border-light)", padding: "6rem 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse, rgba(16,185,129,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="container" style={{ textAlign: "center" }}>
          <Reveal>
            <div className="badge" style={{ marginBottom: "1.75rem", margin: "0 auto 1.75rem" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981", animation: "pulse 2s infinite" }}></span>
              Limited slots available this season
            </div>
            <h2 style={{ marginBottom: "1.25rem", maxWidth: "700px", margin: "0 auto 1.25rem" }}>Ready to put your capital to work in Nigerian soil?</h2>
            <p style={{ marginBottom: "2.5rem", maxWidth: "480px", margin: "0 auto 2.5rem" }}>Join 2,400+ investors earning predictable, asset-backed returns from agriculture. Get started in under 5 minutes.</p>
            <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/register" className="btn btn-primary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>Deploy Capital Today</a>
              <a href="/docs" className="btn btn-secondary" style={{ padding: "1rem 2rem", fontSize: "1rem" }}>Read the Docs</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#030303", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "4rem 0 2rem" }}>
        <div className="container">
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "linear-gradient(135deg,#10B981,#059669)", flexShrink: 0 }}></div>
                <span style={{ fontWeight: 800, fontSize: "1.1rem", fontFamily: "var(--font-display)" }}>SmartFarmer</span>
              </div>
              <p style={{ fontSize: "0.875rem", marginBottom: "1.75rem", maxWidth: "260px", lineHeight: 1.7 }}>Bridging global liquidity with verified agricultural assets. Institutional-grade returns from real-world production.</p>
              <div style={{ display: "flex", gap: "0.875rem" }}>
                {[
                  <svg key="tw" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>,
                  <svg key="li" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
                ].map((icon, i) => (
                  <a key={i} href="#" style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.2s", display: "flex" }}
                    onMouseOver={e => e.currentTarget.style.color="white"} onMouseOut={e => e.currentTarget.style.color="rgba(255,255,255,0.3)"}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Protocol", links: [["Infrastructure","#infrastructure"],["Crop Cycles","#crops"],["Yield Terminal","#estimator"],["Documentation","/docs"]] },
              { title: "Company",  links: [["About Us","/about"],["Careers","/careers"],["Blog","/blog"],["Contact","/contact"]] },
              { title: "Legal",    links: [["Terms of Service","/terms"],["Privacy Policy","/privacy"],["KYC / AML","/kyc"],["SEC Compliance","/compliance"]] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 style={{ color: "white", marginBottom: "1.125rem", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{title}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {links.map(([label, href]) => (
                    <a key={label} href={href} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
                      onMouseOver={e => e.target.style.color="white"} onMouseOut={e => e.target.style.color="rgba(255,255,255,0.35)"}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)" }}>
            <span>© {new Date().getFullYear()} SmartFarmer OS. All rights reserved.</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "6px", height: "6px", background: "#10B981", borderRadius: "50%", boxShadow: "0 0 6px #10B981" }}></span>
              All Systems Operational · Lagos, Nigeria
            </span>
          </div>
        </div>
      </footer>

      {/* ── Sticky Mobile CTA ── */}
      <div className="mobile-only" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, padding: "0.875rem 1.25rem",
        background: "rgba(5,5,5,0.96)", backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        transform: showSticky ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", zIndex: 100,
        flexDirection: "column"
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <a href="/login" className="btn btn-secondary" style={{ padding: "0.75rem" }}>Log in</a>
          <a href="/register" className="btn btn-primary" style={{ padding: "0.75rem" }}>Deploy Capital</a>
        </div>
      </div>

      {/* ── AI Chat Widget ── */}
      <ChatWidget />
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold: 0.06 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      willChange: "opacity, transform", ...style
    }}>
      {children}
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "1.375rem 0" }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
        background: "none", border: "none", color: "white", fontSize: "0.975rem",
        fontWeight: 600, cursor: "pointer", textAlign: "left", padding: 0, gap: "1rem", fontFamily: "var(--font-body)"
      }}>
        <span>{question}</span>
        <span style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.25s ease", color: isOpen ? "#10B981" : "rgba(255,255,255,0.35)", fontSize: "1.5rem", fontWeight: 300, flexShrink: 0 }}>+</span>
      </button>
      <div style={{ maxHeight: isOpen ? "300px" : "0", overflow: "hidden", transition: "max-height 0.4s ease", opacity: isOpen ? 1 : 0 }}>
        <p style={{ marginTop: "0.875rem", color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.7 }}>{answer}</p>
      </div>
    </div>
  );
}
