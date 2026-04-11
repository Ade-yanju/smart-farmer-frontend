import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; 
import { useTheme } from '../context/ThemeContext'; 

export default function Login() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Silicon Valley Brand Guidelines (Palette)
  const tokens = {
    primary: '#10B981', // Emerald 500 (Vibrant & Agricultural)
    bg: '#000000',
    surface: '#0A0A0A',
    border: 'rgba(255, 255, 255, 0.1)',
    textMuted: '#A1A1AA',
    glass: 'rgba(255, 255, 255, 0.03)',
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.includes('auth/invalid-credential') 
        ? 'The credentials provided do not match our records.' 
        : 'System error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: tokens.bg, 
      color: 'white', 
      fontFamily: '"Inter", -apple-system, sans-serif' 
    }}>
      {/* Dynamic Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          .auth-side-panel { display: none !important; }
          .auth-form-container { width: 100% !important; padding: 1.5rem !important; }
        }
        .auth-input:focus { 
          border-color: ${tokens.primary} !important; 
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
          outline: none;
        }
        .btn-hover:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .btn-hover:active:not(:disabled) {
          transform: translateY(0px);
        }
      `}</style>

      {/* LEFT PANEL: The Brand Experience (Hidden on Mobile) */}
      <div className="auth-side-panel" style={{ 
        flex: 1.2, 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        padding: '4rem',
        borderRight: `1px solid ${tokens.border}`,
        overflow: 'hidden'
      }}>
        {/* Background Ambient Effect */}
        <div style={{ 
          position: 'absolute', inset: 0, zIndex: 0,
          background: `radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)`
        }} />
        
        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: tokens.primary, borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.05em' }}>SmartFarmer</span>
          </div>
        </div>

        <div style={{ zIndex: 1, maxWidth: '480px' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1, marginBottom: '2rem', letterSpacing: '-0.02em' }}>
            Cultivate your <br/>
            <span style={{ color: tokens.primary }}>digital yield.</span>
          </h2>
          <p style={{ color: tokens.textMuted, fontSize: '1.25rem', lineHeight: 1.5 }}>
            Access the world's most advanced agricultural investment engine. 
            Real-time tracking, verified inputs, and instant liquidity.
          </p>
        </div>

        <div style={{ zIndex: 1, display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>$42M+</div>
            <div style={{ fontSize: '0.8rem', color: tokens.textMuted, textTransform: 'uppercase' }}>Capital Deployed</div>
          </div>
          <div style={{ width: '1px', background: tokens.border }}></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>14.2%</div>
            <div style={{ fontSize: '0.8rem', color: tokens.textMuted, textTransform: 'uppercase' }}>Avg. Annual Yield</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: The Conversion (Mobile Responsive) */}
      <div className="auth-form-container" style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '3rem'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <Reveal>
            <div style={{ marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome back</h1>
              <p style={{ color: tokens.textMuted }}>Enter your credentials to manage your portfolio.</p>
            </div>

            {error && (
              <div style={{ 
                padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', 
                borderRadius: '12px', color: '#FCA5A5', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' 
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: tokens.textMuted, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="auth-input"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="name@company.com"
                  style={{ 
                    width: '100%', padding: '0.875rem 1rem', background: tokens.surface, 
                    border: `1px solid ${tokens.border}`, borderRadius: '10px', color: 'white', fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: tokens.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: tokens.primary, textDecoration: 'none', fontWeight: 600 }}>Forgot password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="auth-input"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="••••••••"
                    style={{ 
                      width: '100%', padding: '0.875rem 1rem', background: tokens.surface, 
                      border: `1px solid ${tokens.border}`, borderRadius: '10px', color: 'white', fontSize: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: tokens.textMuted, cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700 }}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-hover"
                style={{ 
                  width: '100%', padding: '1rem', background: tokens.primary, color: 'black', border: 'none', 
                  borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '1.5rem', transition: 'all 0.2s ease', opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
              </button>
            </form>

            <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '1px', background: tokens.border }}></div>
              <span style={{ fontSize: '0.7rem', color: '#444', fontWeight: 800 }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: tokens.border }}></div>
            </div>

            <button style={{ 
              width: '100%', padding: '0.875rem', background: 'transparent', border: `1px solid ${tokens.border}`, 
              borderRadius: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', 
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign in with Google
            </button>

            <p style={{ textAlign: 'center', marginTop: '2.5rem', color: tokens.textMuted, fontSize: '0.9rem' }}>
              New to the platform? <Link to="/signup" style={{ color: tokens.primary, textDecoration: 'none', fontWeight: 600 }}>Create an account</Link>
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

// Micro-animation component
function Reveal({ children }) {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);
  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(15px)',
      transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {children}
    </div>
  );
}
