import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Silicon Valley Brand Palette
  const styles = {
    primary: "#10B981", // Emerald Neon
    bg: "#000000",
    surface: "#0A0A0A",
    border: "rgba(255, 255, 255, 0.1)",
    textMuted: "#A1A1AA"
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const newReferralCode = user.uid.substring(0, 6).toUpperCase();

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        walletBalance: 0,
        role: "user",
        referralCode: newReferralCode,
        referredBy: referralCode,
        notificationPrefs: { activity: true, investment: true, promotions: false },
      });
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: styles.bg, color: "white", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        .auth-input:focus { border-color: ${styles.primary} !important; box-shadow: 0 0 0 1px ${styles.primary} !important; outline: none; }
        .social-btn:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.2) !important; }
      `}</style>

      {/* Left Side: Brand & Social Proof */}
      <div style={{ 
        flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "3rem",
        overflow: "hidden", borderRight: `1px solid ${styles.border}` 
      }} className="desktop-only">
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop" 
            alt="AgriTech" 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} 
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, #000)" }}></div>
        </div>

        <div style={{ zIndex: 1 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "white" }}>
            <div style={{ width: "40px", height: "40px", background: styles.primary, borderRadius: "8px", display: "grid", placeItems: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em" }}>SmartFarmer</span>
          </Link>
        </div>

        <div style={{ zIndex: 1, maxWidth: "400px" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.1, marginBottom: "1.5rem" }}>
            Invest in the <span style={{ color: styles.primary }}>ground</span> you walk on.
          </h2>
          <p style={{ color: styles.textMuted, fontSize: "1.1rem", marginBottom: "2rem" }}>
            Join 12,000+ investors deploying capital into verified high-yield agricultural inputs.
          </p>
          <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: `1px solid ${styles.border}` }}>
            <p style={{ fontStyle: "italic", fontSize: "0.95rem", marginBottom: "1rem" }}>"The most transparent agricultural platform I've used. The yields are predictable and the impact is real."</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#333" }}></div>
              <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>Adesola P. • Lead Investor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <Reveal>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Create account</h1>
            <p style={{ color: styles.textMuted, marginBottom: "2.5rem" }}>Enter your details to initialize deployment.</p>

            {error && (
              <div style={{ padding: "1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", borderRadius: "8px", color: "#EF4444", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: styles.textMuted, marginBottom: "0.5rem" }}>Email Address</label>
                <input 
                  type="email" 
                  className="auth-input"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={{ width: "100%", padding: "0.875rem 1rem", background: styles.surface, border: `1px solid ${styles.border}`, borderRadius: "8px", color: "white", fontSize: "1rem" }}
                  placeholder="name@company.com"
                />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: styles.textMuted, marginBottom: "0.5rem" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="auth-input"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ width: "100%", padding: "0.875rem 1rem", background: styles.surface, border: `1px solid ${styles.border}`, borderRadius: "8px", color: "white", fontSize: "1rem" }}
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: styles.textMuted, cursor: "pointer", fontSize: "0.75rem" }}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: styles.textMuted, marginBottom: "0.5rem" }}>Referral Code (Optional)</label>
                <input 
                  type="text" 
                  className="auth-input"
                  value={referralCode} 
                  onChange={(e) => setReferralCode(e.target.value)} 
                  style={{ width: "100%", padding: "0.875rem 1rem", background: styles.surface, border: `1px solid ${styles.border}`, borderRadius: "8px", color: "white", fontSize: "1rem" }}
                  placeholder="EX: ALPHA1"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  width: "100%", padding: "1rem", background: styles.primary, color: "black", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
                  transition: "transform 0.2s, opacity 0.2s", opacity: loading ? 0.7 : 1 
                }}
              >
                {loading ? "INITIALIZING..." : "CREATE ACCOUNT"}
              </button>
            </form>

            <div style={{ margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ flex: 1, height: "1px", background: styles.border }}></div>
              <span style={{ fontSize: "0.75rem", color: styles.textMuted }}>OR CONTINUE WITH</span>
              <div style={{ flex: 1, height: "1px", background: styles.border }}></div>
            </div>

            <button className="social-btn" style={{ width: "100%", padding: "0.875rem", background: "transparent", border: `1px solid ${styles.border}`, borderRadius: "8px", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer", transition: "all 0.2s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>

            <p style={{ textAlign: "center", marginTop: "2rem", color: styles.textMuted, fontSize: "0.875rem" }}>
              Already have an account? <Link to="/login" style={{ color: styles.primary, textDecoration: "none", fontWeight: 600 }}>Log in</Link>
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

// Reuse the Reveal animation from the Landing Page for consistency
function Reveal({ children }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);
  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.6s ease-out, transform 0.6s ease-out"
    }}>
      {children}
    </div>
  );
}
