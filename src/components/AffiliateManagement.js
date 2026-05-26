import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import {
  FiUsers, FiClock, FiCheck, FiX, FiPhone, FiMail,
  FiMessageSquare, FiRefreshCw, FiExternalLink, FiFilter,
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#F59E0B', bg: 'rgba(245,158,11,.1)',   bdr: 'rgba(245,158,11,.2)'   },
  contacted: { label: 'Contacted', color: '#3B82F6', bg: 'rgba(59,130,246,.1)',   bdr: 'rgba(59,130,246,.2)'   },
  approved:  { label: 'Approved',  color: '#10B981', bg: 'rgba(16,185,129,.1)',   bdr: 'rgba(16,185,129,.2)'   },
  rejected:  { label: 'Rejected',  color: '#EF4444', bg: 'rgba(239,68,68,.1)',    bdr: 'rgba(239,68,68,.2)'    },
};

const FILTERS = ['All', 'pending', 'contacted', 'approved', 'rejected'];

export default function AffiliateManagement() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('All');
  const [search, setSearch]             = useState('');
  const [updating, setUpdating]         = useState(null);   // doc id being updated
  const [expanded, setExpanded]         = useState(null);   // doc id with details open
  const [width, setWidth]               = useState(window.innerWidth);

  const { theme } = useTheme();
  const isDark    = theme === 'dark';

  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  const isMobile = width < 640;

  /* ── colour tokens ── */
  const c = {
    bg:     isDark ? '#050505'              : '#F9FAFB',
    card:   isDark ? '#111'                 : '#fff',
    border: isDark ? 'rgba(255,255,255,.08)': 'rgba(0,0,0,.06)',
    txt:    isDark ? '#fff'                 : '#111',
    muted:  isDark ? '#888'                 : '#666',
    input:  isDark ? '#0A0A0A'              : '#F9FAFB',
    green:  '#10B981',
  };

  /* ── fetch ── */
  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const q    = query(collection(db, 'affiliate_applications'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      // fallback without orderBy if index missing
      try {
        const snap = await getDocs(collection(db, 'affiliate_applications'));
        setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })).reverse());
      } catch (e2) { console.error(e2); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  /* ── update status ── */
  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, 'affiliate_applications', id), { status });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  /* ── filtered list ── */
  const filtered = applications.filter(a => {
    const fOk = filter === 'All' || a.status === filter;
    const term = search.toLowerCase();
    const sOk  = !term || [a.name, a.email, a.phone, a.platform, a.message]
      .some(v => (v || '').toLowerCase().includes(term));
    return fOk && sOk;
  });

  /* ── stats ── */
  const counts = ['pending','contacted','approved','rejected'].reduce((acc, s) => {
    acc[s] = applications.filter(a => (a.status || 'pending') === s).length;
    return acc;
  }, {});

  const statCards = [
    { label: 'Total',      value: applications.length, color: c.txt },
    { label: 'Pending',    value: counts.pending,      color: STATUS_CONFIG.pending.color   },
    { label: 'Approved',   value: counts.approved,     color: STATUS_CONFIG.approved.color  },
    { label: 'Rejected',   value: counts.rejected,     color: STATUS_CONFIG.rejected.color  },
  ];

  const fmtDate = ts => ts?.seconds
    ? new Date(ts.seconds * 1000).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';

  return (
    <>
      <style>{`
        .af-row:hover { background: ${isDark ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.02)'}; }
        .af-filter-btn { flex: 1 1 auto; }
        @media(max-width:639px){
          .af-stats { grid-template-columns: 1fr 1fr !important; }
          .af-controls { flex-direction: column !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Inter',sans-serif", color: c.txt }}>

        {/* ── header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: c.txt }}>Affiliate Applications</h2>
            <p style={{ margin: 0, fontSize: 13, color: c.muted }}>Review and manage all affiliate program requests.</p>
          </div>
          <button
            onClick={fetchApps}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: `1px solid ${c.border}`, background: c.card, color: c.txt, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            <FiRefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
        </div>

        {/* ── stats ── */}
        <div className="af-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 22 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: isMobile ? '12px 10px' : '16px' }}>
              <div style={{ fontSize: 10, color: c.muted, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: s.color }}>{loading ? '…' : s.value}</div>
            </div>
          ))}
        </div>

        {/* ── controls ── */}
        <div className="af-controls" style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {/* filter pills */}
          <div style={{ display: 'flex', gap: 5, background: isDark ? '#0A0A0A' : '#f1f1f4', padding: 4, borderRadius: 12, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} className="af-filter-btn" style={{
                padding: '7px 14px', borderRadius: 9, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: filter === f ? (isDark ? '#fff' : '#000') : 'transparent',
                color: filter === f ? (isDark ? '#000' : '#fff') : c.muted,
                whiteSpace: 'nowrap', textTransform: 'capitalize',
              }}>
                {f === 'All' ? `All (${applications.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f] ?? 0})`}
              </button>
            ))}
          </div>
          {/* search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, platform…"
            style={{
              flex: 1, minWidth: isMobile ? '100%' : 220, padding: '9px 14px', borderRadius: 10,
              border: `1px solid ${isDark ? '#222' : '#e2e8f0'}`, background: c.input,
              color: c.txt, fontSize: 13, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* ── list ── */}
        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 18, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: c.muted }}>
              <div style={{ width: 32, height: 32, border: `3px solid ${c.green}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              Loading applications…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <FiUsers size={40} color="#444" style={{ marginBottom: 14 }} />
              <p style={{ fontWeight: 700, color: c.txt, margin: '0 0 5px' }}>No applications found</p>
              <p style={{ color: c.muted, fontSize: 13, margin: 0 }}>
                {filter !== 'All' ? `No ${filter} applications.` : 'No affiliate applications yet.'}
              </p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {filtered.map((app, idx) => {
                const st     = STATUS_CONFIG[app.status || 'pending'];
                const isOpen = expanded === app.id;
                return (
                  <li key={app.id} className="af-row" style={{
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${c.border}` : 'none',
                    transition: 'background .15s',
                  }}>
                    {/* main row */}
                    <div
                      onClick={() => setExpanded(isOpen ? null : app.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16, padding: isMobile ? '14px 14px' : '16px 20px', cursor: 'pointer', flexWrap: 'wrap' }}
                    >
                      {/* avatar */}
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${st.bg}`, border: `1px solid ${st.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: st.color, flexShrink: 0 }}>
                        {(app.name || '?')[0].toUpperCase()}
                      </div>

                      {/* name + email */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: c.txt, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.name || 'N/A'}</div>
                        <div style={{ fontSize: 12, color: c.muted }}>{app.email || 'No email'}</div>
                      </div>

                      {/* platform badge */}
                      {!isMobile && app.platform && (
                        <span style={{ padding: '3px 10px', borderRadius: 100, background: isDark ? '#1a1a1a' : '#f1f5f9', color: c.muted, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {app.platform}
                        </span>
                      )}

                      {/* date */}
                      {!isMobile && (
                        <div style={{ fontSize: 12, color: c.muted, flexShrink: 0 }}>{fmtDate(app.createdAt)}</div>
                      )}

                      {/* status badge */}
                      <span style={{ padding: '4px 10px', borderRadius: 100, background: st.bg, color: st.color, fontSize: 11, fontWeight: 700, border: `1px solid ${st.bdr}`, flexShrink: 0 }}>
                        {st.label}
                      </span>
                    </div>

                    {/* expanded details */}
                    {isOpen && (
                      <div style={{ padding: isMobile ? '0 14px 16px' : '0 20px 20px', borderTop: `1px dashed ${c.border}` }}>
                        <div style={{ paddingTop: 16, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>

                          {/* contact info */}
                          <div style={{ background: isDark ? '#0A0A0A' : '#F9FAFB', borderRadius: 12, padding: '14px 16px', border: `1px solid ${c.border}` }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: c.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Contact Info</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: c.txt }}>
                                <FiMail size={13} color={c.muted} />
                                <a href={`mailto:${app.email}`} style={{ color: c.green, textDecoration: 'none' }}>{app.email || 'N/A'}</a>
                              </div>
                              {app.phone && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: c.txt }}>
                                  <FiPhone size={13} color={c.muted} />
                                  <a href={`tel:${app.phone}`} style={{ color: c.green, textDecoration: 'none' }}>{app.phone}</a>
                                </div>
                              )}
                              {app.platform && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: c.txt }}>
                                  <FiExternalLink size={13} color={c.muted} />
                                  <span>{app.platform}</span>
                                </div>
                              )}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: c.muted }}>
                                <FiClock size={13} />
                                Applied: {fmtDate(app.createdAt)}
                              </div>
                            </div>
                          </div>

                          {/* message */}
                          {app.message && (
                            <div style={{ background: isDark ? '#0A0A0A' : '#F9FAFB', borderRadius: 12, padding: '14px 16px', border: `1px solid ${c.border}` }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: c.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <FiMessageSquare size={11} /> Message
                              </div>
                              <p style={{ margin: 0, fontSize: 13, color: c.txt, lineHeight: 1.65 }}>{app.message}</p>
                            </div>
                          )}
                        </div>

                        {/* action buttons */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                          {[
                            { status: 'contacted', label: 'Mark Contacted', icon: <FiMail size={13} />, color: '#3B82F6' },
                            { status: 'approved',  label: 'Approve',         icon: <FiCheck size={13} />, color: '#10B981' },
                            { status: 'rejected',  label: 'Reject',          icon: <FiX size={13} />,    color: '#EF4444' },
                          ].map(btn => (
                            <button
                              key={btn.status}
                              disabled={updating === app.id || (app.status || 'pending') === btn.status}
                              onClick={() => updateStatus(app.id, btn.status)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 14px', borderRadius: 9, border: `1px solid ${btn.color}30`,
                                background: (app.status || 'pending') === btn.status ? `${btn.color}18` : 'transparent',
                                color: btn.color, fontWeight: 700, fontSize: 12, cursor: (app.status || 'pending') === btn.status ? 'default' : 'pointer',
                                opacity: updating === app.id ? .6 : 1, transition: 'all .2s',
                                fontFamily: "'Inter',sans-serif",
                              }}
                            >
                              {btn.icon} {btn.label}
                              {(app.status || 'pending') === btn.status && ' ✓'}
                            </button>
                          ))}
                          <button
                            onClick={() => setExpanded(null)}
                            style={{ marginLeft: 'auto', padding: '8px 14px', borderRadius: 9, border: `1px solid ${c.border}`, background: 'transparent', color: c.muted, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                          >
                            Collapse
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p style={{ textAlign: 'center', color: isDark ? '#555' : '#aaa', fontSize: 12, marginTop: 14 }}>
          {filtered.length} of {applications.length} application{applications.length !== 1 ? 's' : ''}
        </p>
      </div>
    </>
  );
}
