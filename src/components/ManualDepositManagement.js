import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../axiosConfig';
import {
  FiCheckCircle, FiXCircle, FiUser, FiCalendar, FiSearch,
  FiInbox, FiRefreshCw, FiAlertTriangle,
} from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

function ManualDepositManagement() {
  const [deposits, setDeposits]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearch]    = useState('');
  const [confirm, setConfirm]       = useState(null);  // { id, status, userId, amount, email }
  const [width, setWidth]           = useState(window.innerWidth);

  const { showModal } = useModal();
  const { theme }     = useTheme();
  const isDark        = theme === 'dark';

  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  const isMobile = width < 640;

  /* ── colour tokens ── */
  const c = {
    card:   isDark ? '#0A0A0A'              : '#fff',
    card2:  isDark ? '#111'                 : '#F9FAFB',
    border: isDark ? 'rgba(255,255,255,.08)': 'rgba(0,0,0,.06)',
    txt:    isDark ? '#fff'                 : '#111',
    muted:  isDark ? '#888'                 : '#666',
    green:  '#10B981',
    red:    '#EF4444',
    amber:  '#F59E0B',
  };

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/manual-deposits');
      setDeposits(res.data);
    } catch { showModal('Could not load deposits.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDeposits(); }, []);

  const filtered = useMemo(() =>
    deposits.filter(d =>
      (d.email||'').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.senderName||'').toLowerCase().includes(searchQuery.toLowerCase())
    ), [deposits, searchQuery]);

  const totalPending = useMemo(() => deposits.reduce((a, d) => a + (d.amount||0), 0), [deposits]);

  const executeUpdate = async ({ id, status, userId, amount }) => {
    setConfirm(null);
    try {
      await apiClient.post('/admin/manual-deposits/update', { id, status, userId, amount });
      showModal(`Deposit ${status}.`);
      fetchDeposits();
    } catch { showModal('Update failed.'); }
  };

  const fmt = n => new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN', minimumFractionDigits:0 }).format(Number(n)||0);
  // Timestamps arrive as {seconds} from the client SDK or {_seconds} when
  // serialized by the backend — handle both, and show date AND time for auditing.
  const fmtDate = ts => {
    const s = ts?.seconds ?? ts?._seconds;
    return s ? new Date(s * 1000).toLocaleString('en-NG', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'N/A';
  };

  return (
    <>
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>

      <div style={{ fontFamily:"'Inter',sans-serif", color:c.txt }}>

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div>
            <h2 style={{ margin:'0 0 4px', fontSize:20, fontWeight:800, letterSpacing:'-0.5px' }}>Manual Deposits</h2>
            <p style={{ margin:0, fontSize:13, color:c.muted }}>Review and approve incoming bank transfer requests.</p>
          </div>
          <button onClick={fetchDeposits} disabled={loading} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:10, border:`1px solid ${c.border}`, background:c.card, color:c.txt, fontWeight:700, fontSize:13, cursor:'pointer' }}>
            <FiRefreshCw size={14} style={{ animation:loading?'spin 1s linear infinite':'none' }}/> Refresh
          </button>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
          {[
            { label:'Total Requests', value:loading?'…':deposits.length,  color:c.txt   },
            { label:'Pending Value',  value:loading?'…':fmt(totalPending), color:c.amber },
            { label:'Showing',        value:loading?'…':filtered.length,   color:c.green },
          ].map(s => (
            <div key={s.label} style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:14, padding:isMobile?'12px':'16px' }}>
              <div style={{ fontSize:10, color:c.muted, textTransform:'uppercase', letterSpacing:'.06em', fontWeight:700, marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:isMobile?15:18, fontWeight:800, color:s.color, wordBreak:'break-all' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div style={{ position:'relative', marginBottom:16 }}>
          <FiSearch style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:c.muted, pointerEvents:'none' }} size={14}/>
          <input value={searchQuery} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email…"
            style={{ width:'100%', padding:'10px 14px 10px 36px', borderRadius:10, border:`1px solid ${isDark?'#222':'#e2e8f0'}`, background:isDark?'#0A0A0A':'#fff', color:c.txt, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
        </div>

        {/* ── List ── */}
        <div style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:18, overflow:'hidden' }}>
          {loading ? (
            <div style={{ padding:'60px 20px', textAlign:'center', color:c.muted }}>
              <div style={{ width:32, height:32, border:`3px solid ${c.green}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 12px' }}/>
              Loading deposits…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding:'60px 20px', textAlign:'center' }}>
              <FiInbox size={40} color="#444" style={{ marginBottom:12 }}/>
              <p style={{ fontWeight:700, color:c.txt, margin:'0 0 4px' }}>No deposits found</p>
              <p style={{ color:c.muted, fontSize:13, margin:0 }}>All clear — nothing to review.</p>
            </div>
          ) : (
            <ul style={{ listStyle:'none', margin:0, padding:0 }}>
              {filtered.map((req, i) => (
                <li key={req.id} style={{ padding:isMobile?'16px':'18px 22px', borderBottom:i<filtered.length-1?`1px solid ${c.border}`:'none' }}>
                  <div style={{ display:'flex', alignItems:isMobile?'flex-start':'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                    {/* Left: user info */}
                    <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, minWidth:0 }}>
                      <div style={{ width:40, height:40, borderRadius:11, background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <FiUser color={c.green} size={16}/>
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:14, color:c.txt }}>{req.senderName || 'Unknown'}</div>
                        <div style={{ fontSize:12, color:c.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{req.email}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:4, fontSize:11, color:c.muted }}>
                          <FiCalendar size={10}/> {fmtDate(req.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Right: amount + actions */}
                    <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0, flexWrap:'wrap' }}>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontWeight:800, fontSize:18, color:c.green, fontFamily:'monospace' }}>{fmt(req.amount)}</div>
                        <div style={{ fontSize:11, color:c.muted }}>Bank Transfer</div>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => setConfirm({ id:req.id, status:'approved', userId:req.userId, amount:req.amount, email:req.email })}
                          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, border:'none', background:c.green, color:'#000', fontWeight:800, fontSize:13, cursor:'pointer', whiteSpace:'nowrap', fontFamily:"'Inter',sans-serif" }}>
                          <FiCheckCircle size={13}/> {isMobile?'':'Approve'}
                        </button>
                        <button onClick={() => setConfirm({ id:req.id, status:'rejected', userId:req.userId, amount:req.amount, email:req.email })}
                          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, border:`1px solid rgba(239,68,68,.3)`, background:'rgba(239,68,68,.06)', color:c.red, fontWeight:800, fontSize:13, cursor:'pointer', whiteSpace:'nowrap', fontFamily:"'Inter',sans-serif" }}>
                          <FiXCircle size={13}/> {isMobile?'':'Reject'}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p style={{ textAlign:'center', color:isDark?'#555':'#aaa', fontSize:12, marginTop:12 }}>
          {filtered.length} of {deposits.length} requests
        </p>
      </div>

      {/* ── Confirm modal ── */}
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => setConfirm(null)}>
          <div style={{ background:isDark?'#111':'#fff', border:`1px solid ${c.border}`, borderRadius:20, padding:28, maxWidth:380, width:'100%', textAlign:'center' }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:confirm.status==='approved'?'rgba(16,185,129,.1)':'rgba(239,68,68,.1)', border:`1px solid ${confirm.status==='approved'?'rgba(16,185,129,.2)':'rgba(239,68,68,.2)'}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              {confirm.status==='approved' ? <FiCheckCircle color={c.green} size={22}/> : <FiAlertTriangle color={c.red} size={22}/>}
            </div>
            <h3 style={{ margin:'0 0 8px', color:c.txt, fontWeight:800 }}>
              {confirm.status==='approved' ? 'Approve Deposit?' : 'Reject Deposit?'}
            </h3>
            <p style={{ margin:'0 0 6px', color:c.muted, fontSize:13 }}>{confirm.email}</p>
            <p style={{ margin:'0 0 24px', fontWeight:800, fontSize:20, color:confirm.status==='approved'?c.green:c.red, fontFamily:'monospace' }}>
              {fmt(confirm.amount)}
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <button onClick={() => setConfirm(null)} style={{ padding:'11px', borderRadius:10, border:`1px solid ${c.border}`, background:'transparent', color:c.txt, fontWeight:700, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>Cancel</button>
              <button onClick={() => executeUpdate(confirm)} style={{ padding:'11px', borderRadius:10, border:'none', background:confirm.status==='approved'?c.green:c.red, color:confirm.status==='approved'?'#000':'#fff', fontWeight:800, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>
                {confirm.status==='approved' ? 'Approve & Credit' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManualDepositManagement;
