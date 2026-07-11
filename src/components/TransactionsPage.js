import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { FiSearch, FiInbox, FiArrowDownCircle, FiArrowUpCircle, FiTrendingUp } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('All');
  const [search, setSearch]             = useState('');
  const [width, setWidth]               = useState(window.innerWidth);

  const currentUser = auth.currentUser;
  const { theme }   = useTheme();
  const isDark      = theme === 'dark';

  /* ── responsive ── */
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  /* ── fetch ── */
  const fetchTransactions = useCallback(async () => {
    if (!currentUser) { setLoading(false); return; }
    setLoading(true);
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [currentUser]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  /* ── helpers ── */
  const fmt = n =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n || 0);

  const typeConf = {
    Deposit:    { color: '#10B981', bg: 'rgba(16,185,129,.1)',  bdr: 'rgba(16,185,129,.18)',  sign: '+', Icon: FiArrowDownCircle },
    Investment: { color: '#3B82F6', bg: 'rgba(59,130,246,.1)',  bdr: 'rgba(59,130,246,.18)',  sign: '-', Icon: FiTrendingUp      },
    Withdrawal: { color: '#EF4444', bg: 'rgba(239,68,68,.1)',   bdr: 'rgba(239,68,68,.18)',   sign: '-', Icon: FiArrowUpCircle   },
  };

  const defaultConf = { color: '#888', bg: 'rgba(128,128,128,.1)', bdr: 'rgba(128,128,128,.18)', sign: '', Icon: FiInbox };

  const filters = ['All', 'Deposit', 'Investment', 'Withdrawal'];

  const filtered = transactions.filter(tx => {
    const typeOk   = filter === 'All' || tx.type === filter;
    const searchOk = !search || (tx.details || tx.type || '').toLowerCase().includes(search.toLowerCase());
    return typeOk && searchOk;
  });

  /* ── summary ── */
  const sum = (type) => transactions.filter(t => t.type === type).reduce((s, t) => s + (t.amount || 0), 0);
  const stats = [
    { label: 'Deposited',  value: fmt(sum('Deposit')),    color: '#10B981' },
    { label: 'Invested',   value: fmt(sum('Investment')), color: '#3B82F6' },
    { label: 'Withdrawn',  value: fmt(sum('Withdrawal')), color: '#EF4444' },
  ];

  /* ── colours ── */
  const bg      = isDark ? '#050505' : '#F9FAFB';
  const cardBg  = isDark ? '#0A0A0A' : '#FFFFFF';
  const border  = isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)';
  const txt     = isDark ? '#fff'    : '#111';
  const muted   = '#888';

  return (
    <>
      <style>{`
        @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        .tx-row:hover{ background: ${isDark ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.02)'}; }
        @media(max-width:639px){
          .tx-stats{ grid-template-columns:1fr 1fr !important; }
          .tx-controls{ flex-direction:column !important; }
          .tx-filters{ flex-wrap:wrap !important; }
          .tx-filter-btn{ flex:1 1 auto !important; }
        }
      `}</style>

      <div style={{ padding: isMobile ? '16px 12px 80px' : isTablet ? '24px 20px 80px' : '40px 24px 80px', maxWidth: 1000, margin: '0 auto', minHeight: '100vh', background: bg, fontFamily: "'Inter',sans-serif", color: txt }}>

        {/* ── header ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: isMobile ? 24 : 32, fontWeight: 800, letterSpacing: '-1px' }}>Transactions</h1>
          <p style={{ margin: 0, color: muted, fontSize: 14 }}>Your complete financial history</p>
        </div>

        {/* ── stats ── */}
        <div className="tx-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: isMobile ? '14px 12px' : '18px 20px' }}>
              <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: isMobile ? 15 : 20, fontWeight: 800, color: s.color, letterSpacing: '-0.5px', wordBreak: 'break-all' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── controls ── */}
        <div className="tx-controls" style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'stretch' }}>
          <div className="tx-filters" style={{ display: 'flex', gap: 5, background: isDark ? '#111' : '#f1f1f4', padding: 4, borderRadius: 12, flex: isMobile ? 1 : 'none' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} className="tx-filter-btn" style={{
                padding: '8px 14px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                transition: 'all .2s', background: filter === f ? (isDark ? '#fff' : '#000') : 'transparent',
                color: filter === f ? (isDark ? '#000' : '#fff') : muted, whiteSpace: 'nowrap',
              }}>{f}</button>
            ))}
          </div>
          <div style={{ position: 'relative', flex: isMobile ? 0 : '0 0 260px', width: isMobile ? 44 : 'auto' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: muted }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder={isMobile ? '' : 'Search…'}
              style={{
                width: '100%', padding: isMobile ? '10px 10px 10px 36px' : '10px 14px 10px 38px', borderRadius: 10,
                border: `1px solid ${isDark ? '#222' : '#e2e8f0'}`, background: isDark ? '#111' : '#fff',
                color: txt, fontSize: 14, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* ── list ── */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 18, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '64px 20px', textAlign: 'center', color: muted }}>
              <div style={{ width: 34, height: 34, border: '3px solid #10B981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              Loading transactions…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '72px 20px', textAlign: 'center' }}>
              <FiInbox size={44} color="#444" style={{ marginBottom: 14 }} />
              <h3 style={{ margin: '0 0 6px', fontWeight: 700, color: txt }}>Nothing here yet</h3>
              <p style={{ color: muted, margin: 0, fontSize: 14 }}>Adjust your filters or make your first investment.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {filtered.map((tx, i) => {
                const conf  = typeConf[tx.type] || defaultConf;
                const { Icon } = conf;
                const date  = tx.createdAt?.seconds ? new Date(tx.createdAt.seconds * 1000) : null;
                const label = tx.details || tx.type || 'Transaction';
                return (
                  <li key={tx.id} className="tx-row" style={{
                    display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 18,
                    padding: isMobile ? '14px 14px' : '16px 24px',
                    borderBottom: i < filtered.length - 1 ? `1px solid ${border}` : 'none',
                    transition: 'background .15s', cursor: 'default',
                  }}>
                    {/* icon */}
                    <div style={{ width: isMobile ? 38 : 44, height: isMobile ? 38 : 44, borderRadius: 11, background: conf.bg, border: `1px solid ${conf.bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={isMobile ? 16 : 18} color={conf.color} />
                    </div>
                    {/* label + date */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: isMobile ? 13 : 14, color: txt, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 11, color: muted }}>
                        {date ? date.toLocaleString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}
                      </div>
                    </div>
                    {/* type badge (tablet+) */}
                    {!isMobile && (
                      <div style={{ padding: '3px 10px', borderRadius: 100, background: conf.bg, color: conf.color, fontSize: 11, fontWeight: 700, border: `1px solid ${conf.bdr}`, flexShrink: 0 }}>{tx.type}</div>
                    )}
                    {/* amount */}
                    <div style={{ fontWeight: 800, fontSize: isMobile ? 14 : 16, color: conf.color, fontFamily: 'monospace', flexShrink: 0, textAlign: 'right' }}>
                      {conf.sign}{fmt(tx.amount)}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* count */}
        <p style={{ textAlign: 'center', color: isDark ? '#555' : '#aaa', fontSize: 12, marginTop: 14 }}>
          {filtered.length} of {transactions.length} transactions
        </p>
      </div>
    </>
  );
}
