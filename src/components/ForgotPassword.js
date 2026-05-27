import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

/* ── Design tokens (matches Login.js) ── */
const T = {
  primary:   '#10B981',
  bg:        '#000000',
  surface:   '#0A0A0A',
  border:    'rgba(255,255,255,0.1)',
  muted:     '#A1A1AA',
};

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Reset link sent! Check your inbox — it expires in 1 hour.');
      setEmail('');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests — please wait a few minutes and try again.');
      } else {
        setError('Failed to send reset link. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* Reveal animation */
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);

  return (
    <div style={{
      display:    'flex',
      minHeight:  '100vh',
      background: T.bg,
      color:      '#fff',
      fontFamily: '"Inter", -apple-system, sans-serif',
    }}>
      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 860px) {
          .fp-left  { display: none !important; }
          .fp-right { padding: 2rem 1.5rem !important; }
          .fp-mob   { display: flex !important; }
        }
        @media (max-width: 400px) {
          .fp-right { padding: 1.5rem 1rem !important; }
        }
        .fp-input:focus {
          border-color: ${T.primary} !important;
          box-shadow:   0 0 0 2px rgba(16,185,129,0.2) !important;
          outline:      none;
        }
        .fp-btn:hover:not(:disabled) {
          filter:    brightness(1.08);
          transform: translateY(-1px);
        }
        .fp-btn:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>

      {/* ════════════ LEFT — Brand Panel ════════════ */}
      <div className="fp-left" style={{
        flex:            '1.15',
        position:        'relative',
        display:         'flex',
        flexDirection:   'column',
        justifyContent:  'space-between',
        padding:         '4rem',
        borderRight:     `1px solid ${T.border}`,
        overflow:        'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position:   'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(circle at 15% 55%, rgba(16,185,129,0.12) 0%, transparent 55%)',
        }} />

        {/* Logo */}
        <div style={{ zIndex: 1 }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
            <img src="/logo-dark-theme.png" alt="SmartFarmer"
              style={{ width:44, height:44, objectFit:'contain', borderRadius:10 }} />
            <span style={{ fontWeight:800, fontSize:'1.5rem', color:'#fff', letterSpacing:'-0.05em' }}>
              SmartFarmer
            </span>
          </Link>
        </div>

        {/* Hero copy */}
        <div style={{ zIndex: 1, maxWidth: 480 }}>
          <h2 style={{
            fontSize: '3.25rem', fontWeight: 800, lineHeight: 1.08,
            marginBottom: '1.5rem', letterSpacing: '-0.02em',
          }}>
            Regain access<br />to your{' '}
            <span style={{ color: T.primary }}>portfolio.</span>
          </h2>
          <p style={{ color: T.muted, fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            We'll send a secure reset link to your registered email address.
            It expires in 1&nbsp;hour for your protection.
          </p>
          {/* Trust badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 100,
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
              stroke={T.primary} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: T.primary }}>
              256-bit encrypted · Your data stays private
            </span>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ zIndex: 1, display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>2,400+</div>
            <div style={{ fontSize: '0.78rem', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Investors</div>
          </div>
          <div style={{ width: 1, background: T.border }} />
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>14.2%</div>
            <div style={{ fontSize: '0.78rem', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avg. Annual Yield</div>
          </div>
        </div>
      </div>

      {/* ════════════ RIGHT — Form Panel ════════════ */}
      <div className="fp-right" style={{
        flex:            1,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '3rem',
        minWidth:        0,
      }}>
        <div style={{
          width: '100%', maxWidth: 420,
          opacity:    show ? 1 : 0,
          transform:  show ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}>

          {/* Mobile-only logo (hidden on desktop via left panel showing) */}
          <div className="fp-mob" style={{
            display: 'none',
            justifyContent: 'center',
            marginBottom: '2.5rem',
          }}>
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
              <img src="/logo-dark-theme.png" alt="SmartFarmer"
                style={{ width:38, height:38, objectFit:'contain', borderRadius:8 }} />
              <span style={{ fontWeight:800, fontSize:'1.2rem', color:'#fff', letterSpacing:'-0.04em' }}>
                SmartFarmer
              </span>
            </Link>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize:'2rem', fontWeight:700, marginBottom:'0.4rem', letterSpacing:'-0.03em' }}>
              Reset password
            </h1>
            <p style={{ color: T.muted, fontSize:'0.95rem', margin:0 }}>
              Enter your email to receive a secure reset link.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              display:'flex', alignItems:'flex-start', gap:10,
              padding:'0.9rem 1rem',
              background:'rgba(239,68,68,0.08)',
              border:'1px solid rgba(239,68,68,0.2)',
              borderRadius:12, color:'#FCA5A5',
              fontSize:'0.875rem', marginBottom:'1.25rem', lineHeight:1.5,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Success banner */}
          {success && (
            <div style={{
              display:'flex', alignItems:'flex-start', gap:10,
              padding:'0.9rem 1rem',
              background:'rgba(16,185,129,0.08)',
              border:'1px solid rgba(16,185,129,0.2)',
              borderRadius:12, color:'#6EE7B7',
              fontSize:'0.875rem', marginBottom:'1.25rem', lineHeight:1.5,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleReset}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display:'block', fontSize:'0.72rem', fontWeight:700,
                color:T.muted, textTransform:'uppercase',
                marginBottom:'0.5rem', letterSpacing:'0.06em',
              }}>
                Email Address
              </label>
              <input
                type="email"
                className="fp-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
                style={{
                  width:'100%', padding:'0.875rem 1rem',
                  background:T.surface, border:`1px solid ${T.border}`,
                  borderRadius:10, color:'#fff', fontSize:'1rem',
                  transition:'border-color 0.2s, box-shadow 0.2s',
                  boxSizing:'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="fp-btn"
              style={{
                width:'100%', padding:'1rem',
                background: loading ? 'rgba(16,185,129,0.5)' : T.primary,
                color:'#000', border:'none', borderRadius:10,
                fontWeight:700, fontSize:'1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition:'all 0.2s ease',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    style={{ animation:'fp-spin 0.9s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Sending…
                </>
              ) : 'Send Reset Link'}
            </button>
          </form>

          <style>{`@keyframes fp-spin { to { transform: rotate(360deg); } }`}</style>

          {/* Divider */}
          <div style={{ margin:'1.75rem 0', display:'flex', alignItems:'center', gap:'1rem' }}>
            <div style={{ flex:1, height:1, background: T.border }} />
            <span style={{ fontSize:'0.65rem', color:'#333', fontWeight:800, letterSpacing:'0.1em' }}>OR</span>
            <div style={{ flex:1, height:1, background: T.border }} />
          </div>

          {/* Footer links */}
          <p style={{ textAlign:'center', color: T.muted, fontSize:'0.9rem', margin:0 }}>
            Remember your password?{' '}
            <Link to="/login" style={{ color:T.primary, textDecoration:'none', fontWeight:700 }}>
              Sign in
            </Link>
          </p>
          <p style={{ textAlign:'center', marginTop:'0.75rem', color: T.muted, fontSize:'0.9rem' }}>
            New to SmartFarmer?{' '}
            <Link to="/signup" style={{ color:T.primary, textDecoration:'none', fontWeight:700 }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
