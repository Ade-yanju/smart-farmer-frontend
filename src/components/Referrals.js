import React, { useState, useEffect } from 'react';
import apiClient from '../axiosConfig';
import { FiCopy, FiShare2, FiUsers, FiGift, FiLink, FiCheck, FiExternalLink } from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

export default function Referrals({ userData }) {
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [copied, setCopied]               = useState(false);
  const [width, setWidth]                 = useState(window.innerWidth);

  const { showModal } = useModal();
  const { theme }     = useTheme();
  const isDark        = theme === 'dark';

  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  const isMobile = width < 640;

  const referralLink = userData?.referralCode
    ? `https://smartfarmer.ng/signup?ref=${userData.referralCode}`
    : '';

  useEffect(() => {
    const fetch_ = async () => {
      if (!userData?.referralCode) { setLoading(false); return; }
      try {
        // Fetched via the backend: security rules no longer let browsers
        // query the users collection directly.
        const res = await apiClient.get('/user/referrals');
        setReferredUsers(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch_();
  }, [userData]);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showModal('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share && referralLink) {
      try {
        await navigator.share({ title: 'Join SmartFarmer!', text: "Sign up using my link and let's grow together! 🌱", url: referralLink });
      } catch { handleCopy(); }
    } else { handleCopy(); }
  };

  /* ── colour tokens ── */
  const c = {
    card:     isDark ? '#111'                    : '#fff',
    border:   isDark ? 'rgba(255,255,255,.08)'   : 'rgba(0,0,0,.06)',
    muted:    isDark ? '#888'                    : '#666',
    text:     isDark ? '#fff'                    : '#111',
    input:    isDark ? '#000'                    : '#f9fafb',
    inputBdr: isDark ? '#2a2a2a'                 : '#e2e8f0',
    green:    isDark ? '#10B981'                 : '#059669',
    greenBg:  isDark ? 'rgba(16,185,129,.08)'    : 'rgba(16,185,129,.05)',
    greenBdr: isDark ? 'rgba(16,185,129,.18)'    : 'rgba(16,185,129,.14)',
  };

  const statCards = [
    { label: 'Your Code',      value: userData?.referralCode || '—',  color: c.green },
    { label: 'Total Referred', value: loading ? '…' : referredUsers.length, color: c.green },
    { label: 'Rewards',        value: 'Soon 🎉',                         color: '#F59E0B' },
  ];

  return (
    <>
      <style>{`
        .ref-row:hover{ background:${isDark?'rgba(255,255,255,.03)':'rgba(0,0,0,.02)'}; }
        @media(max-width:639px){
          .ref-stats{ grid-template-columns:1fr 1fr !important; }
          .ref-link-row{ flex-direction:column !important; }
          .ref-btns{ flex-direction:row !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Inter',sans-serif" }}>

        {/* ── header ── */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 5px', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: c.text }}>Referral Program</h2>
          <p style={{ margin: 0, color: c.muted, fontSize: 13 }}>Invite friends — earn real rewards when they invest.</p>
        </div>

        {/* ── stats ── */}
        <div className="ref-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 22 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: isMobile ? '14px 12px' : '16px' }}>
              <div style={{ fontSize: 10, color: c.muted, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 800, color: s.color, letterSpacing: '-0.3px' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── referral link ── */}
        <div style={{ background: c.greenBg, border: `1px solid ${c.greenBdr}`, borderRadius: 16, padding: isMobile ? '16px' : '20px', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <FiLink color={c.green} size={15} />
            <span style={{ fontWeight: 700, fontSize: 14, color: c.text }}>Your Unique Referral Link</span>
          </div>
          <div className="ref-link-row" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              readOnly
              value={referralLink || 'Generating link…'}
              style={{
                flex: 1, padding: '11px 13px', borderRadius: 10, border: `1px solid ${c.inputBdr}`,
                background: c.input, color: c.green, fontSize: 13, fontFamily: 'monospace', fontWeight: 600,
                outline: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                boxSizing: 'border-box', minWidth: 0,
              }}
            />
            <div className="ref-btns" style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={handleCopy} style={{
                padding: '11px 16px', borderRadius: 10, border: `1px solid ${c.border}`, background: isDark ? '#1a1a1a' : '#fff',
                color: copied ? c.green : c.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                fontWeight: 700, fontSize: 13, transition: 'all .2s', whiteSpace: 'nowrap',
              }}>
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleShare} style={{
                padding: '11px 16px', borderRadius: 10, border: 'none', background: c.green,
                color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap',
              }}>
                <FiShare2 size={14} /> Share
              </button>
            </div>
          </div>
          <p style={{ margin: '10px 0 0', color: c.muted, fontSize: 12, lineHeight: 1.55 }}>
            Anyone who opens this link lands on the signup page with your referral code pre-filled.
          </p>
        </div>

        {/* ── how it works ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 10, marginBottom: 22 }}>
          {[
            { step: '01', title: 'Share Your Link', desc: 'Send your unique link to friends, family, or your social audience.' },
            { step: '02', title: 'They Sign Up',    desc: 'Your referral is automatically tracked when they register.' },
            { step: '03', title: 'Earn Rewards',   desc: 'Receive commissions directly to your wallet when they invest.' },
          ].map(s => (
            <div key={s.step} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: '16px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: c.green, fontWeight: 800, letterSpacing: '.12em', marginBottom: 8 }}>{s.step}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: c.text, marginBottom: 4 }}>{s.title}</div>
              <p style={{ margin: 0, fontSize: 12, color: c.muted, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* ── referred users list ── */}
        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <FiUsers color={c.green} size={15} />
              <span style={{ fontWeight: 700, fontSize: 14, color: c.text }}>People You've Referred</span>
            </div>
            <span style={{ padding: '2px 9px', borderRadius: 100, background: c.greenBg, color: c.green, fontSize: 12, fontWeight: 700 }}>
              {loading ? '…' : referredUsers.length}
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: c.muted, fontSize: 14 }}>Loading…</div>
          ) : referredUsers.length === 0 ? (
            <div style={{ padding: '56px 20px', textAlign: 'center' }}>
              <FiGift size={38} color="#444" style={{ marginBottom: 12 }} />
              <p style={{ fontWeight: 700, color: c.text, margin: '0 0 5px', fontSize: 15 }}>No referrals yet</p>
              <p style={{ color: c.muted, fontSize: 13, margin: 0 }}>Share your link above to start earning.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {referredUsers.map((u, i) => (
                <li key={i} className="ref-row" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: isMobile ? '12px 14px' : '14px 18px',
                  borderBottom: i < referredUsers.length - 1 ? `1px solid ${c.border}` : 'none',
                  flexWrap: 'wrap', gap: 6, transition: 'background .15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', background: c.greenBg, border: `1px solid ${c.greenBdr}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.green, fontWeight: 800, fontSize: 13, flexShrink: 0,
                    }}>
                      {(u.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: c.text }}>{u.email || 'N/A'}</div>
                      <div style={{ fontSize: 11, color: c.muted }}>
                        Joined: {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 100, background: c.greenBg, color: c.green, fontSize: 11, fontWeight: 700, border: `1px solid ${c.greenBdr}` }}>
                    Referred
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </>
  );
}
