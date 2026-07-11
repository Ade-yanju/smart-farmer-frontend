import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../axiosConfig';
import {
  FiCheckCircle, FiXCircle, FiClock, FiCreditCard, FiTrash2,
  FiCheckSquare, FiSquare, FiX, FiRefreshCw, FiChevronRight,
  FiUser, FiAlertTriangle,
} from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

const STATUS_CFG = {
  pending:  { color:'#F59E0B', bg:'rgba(245,158,11,.1)',  bdr:'rgba(245,158,11,.2)',  Icon:FiClock       },
  approved: { color:'#10B981', bg:'rgba(16,185,129,.1)',  bdr:'rgba(16,185,129,.2)',  Icon:FiCheckCircle },
  rejected: { color:'#EF4444', bg:'rgba(239,68,68,.1)',   bdr:'rgba(239,68,68,.2)',   Icon:FiXCircle     },
};

function WithdrawalManagement() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [detail, setDetail]           = useState(null);
  const [confirm, setConfirm]         = useState(null);  // { ids, action }
  const [width, setWidth]             = useState(window.innerWidth);

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

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/withdrawals');
      setWithdrawals(res.data);
      setSelectedIds([]);
    } catch { showModal('Could not load withdrawals.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWithdrawals(); }, []);

  const filtered = useMemo(() =>
    filter === 'all' ? withdrawals : withdrawals.filter(w => w.status === filter),
    [withdrawals, filter]);

  const toggleAll = () => setSelectedIds(
    selectedIds.length === filtered.length && filtered.length > 0 ? [] : filtered.map(w => w.id)
  );
  const toggleOne = (e, id) => { e.stopPropagation(); setSelectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]); };

  const executeAction = async ({ ids, action }) => {
    setConfirm(null);
    try {
      await Promise.all(ids.map(id => apiClient.post('/admin/withdrawals/update', { id, status:action })));
      showModal(`${ids.length} request${ids.length>1?'s':''} ${action}.`);
      setDetail(null);
      setSelectedIds([]);
      fetchWithdrawals();
    } catch { showModal('Action failed.'); }
  };

  const fmt = n => new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN', minimumFractionDigits:0 }).format(Number(n)||0);
  // Timestamps arrive as {seconds} from the client SDK or {_seconds} when
  // serialized by the backend — handle both, and show date AND time for auditing.
  const fmtDate = ts => {
    const s = ts?.seconds ?? ts?._seconds;
    return s ? new Date(s * 1000).toLocaleString('en-NG', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'N/A';
  };

  const counts = ['pending','approved','rejected'].reduce((a, s) => {
    a[s] = withdrawals.filter(w => w.status === s).length;
    return a;
  }, {});

  return (
    <>
      <style>{`
        @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        .wm-row:hover{background:${isDark?'rgba(255,255,255,.025)':'rgba(0,0,0,.015)'}!important}
        .wm-batch{transform:translateY(${selectedIds.length>0?'0':'100px'});opacity:${selectedIds.length>0?1:0};pointer-events:${selectedIds.length>0?'all':'none'}}
      `}</style>

      <div style={{ fontFamily:"'Inter',sans-serif", color:c.txt }}>

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div>
            <h2 style={{ margin:'0 0 4px', fontSize:20, fontWeight:800, letterSpacing:'-0.5px' }}>Withdrawal Requests</h2>
            <p style={{ margin:0, fontSize:13, color:c.muted }}>Review and process user withdrawal requests.</p>
          </div>
          <button onClick={fetchWithdrawals} disabled={loading} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:10, border:`1px solid ${c.border}`, background:c.card, color:c.txt, fontWeight:700, fontSize:13, cursor:'pointer' }}>
            <FiRefreshCw size={14} style={{ animation:loading?'spin 1s linear infinite':'none' }}/> Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
          {[
            { label:'Total',    value:withdrawals.length, color:c.txt   },
            { label:'Pending',  value:counts.pending,     color:c.amber },
            { label:'Approved', value:counts.approved,    color:c.green },
            { label:'Rejected', value:counts.rejected,    color:c.red   },
          ].map(s => (
            <div key={s.label} style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:14, padding:isMobile?'10px 12px':'14px 16px' }}>
              <div style={{ fontSize:10, color:c.muted, textTransform:'uppercase', letterSpacing:'.06em', fontWeight:700, marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:isMobile?16:20, fontWeight:800, color:s.color }}>{loading?'…':s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Filter pills ── */}
        <div style={{ display:'flex', gap:4, background:isDark?'#0A0A0A':'#f1f1f4', padding:4, borderRadius:12, marginBottom:16, width:'fit-content', flexWrap:'wrap' }}>
          {['all','pending','approved','rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:'7px 14px', borderRadius:9, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', background:filter===f?(isDark?'#fff':'#000'):'transparent', color:filter===f?(isDark?'#000':'#fff'):c.muted, textTransform:'capitalize', transition:'all .2s', whiteSpace:'nowrap' }}>
              {f==='all'?`All (${withdrawals.length})`:`${f.charAt(0).toUpperCase()+f.slice(1)} (${counts[f]||0})`}
            </button>
          ))}
        </div>

        {/* ── List ── */}
        <div style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:18, overflow:'hidden' }}>
          {loading ? (
            <div style={{ padding:'60px 20px', textAlign:'center', color:c.muted }}>
              <div style={{ width:32, height:32, border:`3px solid ${c.green}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 12px' }}/>
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding:'60px 20px', textAlign:'center' }}>
              <FiCreditCard size={40} color="#444" style={{ marginBottom:12 }}/>
              <p style={{ fontWeight:700, color:c.txt, margin:'0 0 4px' }}>No requests</p>
              <p style={{ color:c.muted, fontSize:13, margin:0 }}>Nothing to review here.</p>
            </div>
          ) : (
            <ul style={{ listStyle:'none', margin:0, padding:0 }}>
              {filtered.map((req, i) => {
                const st = STATUS_CFG[req.status] || STATUS_CFG.pending;
                const sel = selectedIds.includes(req.id);
                return (
                  <li key={req.id} className="wm-row"
                    style={{ padding:isMobile?'14px':'16px 20px', borderBottom:i<filtered.length-1?`1px solid ${c.border}`:'none', background:sel?(isDark?'rgba(16,185,129,.04)':'rgba(16,185,129,.02)'):undefined, cursor:'pointer', transition:'background .15s' }}
                    onClick={() => setDetail(req)}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                      {/* Checkbox */}
                      <button onClick={e=>toggleOne(e,req.id)} style={{ background:'none', border:'none', cursor:'pointer', color:sel?c.green:c.muted, fontSize:18, flexShrink:0, lineHeight:1, display:'flex' }}>
                        {sel ? <FiCheckSquare/> : <FiSquare/>}
                      </button>
                      {/* User info */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:13, color:c.txt, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{req.email}</div>
                        {!isMobile && <div style={{ fontSize:11, color:c.muted }}>{req.bankDetails?.bankName} ••{(req.bankDetails?.accountNumber||'').slice(-4)}</div>}
                      </div>
                      {/* Amount */}
                      <div style={{ fontWeight:800, fontSize:15, color:c.txt, fontFamily:'monospace', flexShrink:0 }}>{fmt(req.amount)}</div>
                      {/* Date — desktop */}
                      {!isMobile && <div style={{ fontSize:12, color:c.muted, flexShrink:0 }}>{fmtDate(req.createdAt)}</div>}
                      {/* Status badge */}
                      <span style={{ padding:'3px 10px', borderRadius:100, background:st.bg, color:st.color, border:`1px solid ${st.bdr}`, fontSize:11, fontWeight:700, flexShrink:0 }}>{req.status}</span>
                      <FiChevronRight color={c.muted} size={14} style={{ flexShrink:0 }}/>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p style={{ textAlign:'center', color:isDark?'#555':'#aaa', fontSize:12, marginTop:12 }}>
          {filtered.length} of {withdrawals.length} requests
        </p>
      </div>

      {/* ── Batch bar ── */}
      <div className="wm-batch" style={{ position:'fixed', bottom:80, left:'50%', transform:'translateX(-50%)', background:isDark?'rgba(255,255,255,.96)':'rgba(0,0,0,.92)', color:isDark?'#000':'#fff', padding:'12px 20px', borderRadius:100, display:'flex', alignItems:'center', gap:14, boxShadow:'0 20px 40px rgba(0,0,0,.3)', zIndex:1000, transition:'all .4s cubic-bezier(.17,.67,.35,1.2)', maxWidth:'90vw' }}>
        <span style={{ fontWeight:800, fontSize:13, whiteSpace:'nowrap' }}>{selectedIds.length} selected</span>
        <button onClick={() => setConfirm({ ids:selectedIds, action:'approved' })} style={{ background:c.green, color:'#000', border:'none', padding:'7px 14px', borderRadius:50, fontWeight:800, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
          <FiCheckCircle size={12}/> Approve
        </button>
        <button onClick={() => setConfirm({ ids:selectedIds, action:'rejected' })} style={{ background:c.amber, color:'#000', border:'none', padding:'7px 14px', borderRadius:50, fontWeight:800, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
          <FiXCircle size={12}/> Reject
        </button>
        <button onClick={() => setConfirm({ ids:selectedIds, action:'deleted' })} style={{ background:c.red, color:'#fff', border:'none', padding:'7px 12px', borderRadius:50, fontWeight:800, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center' }}>
          <FiTrash2 size={12}/>
        </button>
        <button onClick={() => setSelectedIds([])} style={{ background:'none', border:'none', color:isDark?'rgba(0,0,0,.4)':'rgba(255,255,255,.4)', cursor:'pointer', display:'flex', padding:4 }}><FiX size={17}/></button>
      </div>

      {/* ── Detail slide-over ── */}
      {detail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', zIndex:2000, display:'flex', justifyContent:'flex-end' }} onClick={() => setDetail(null)}>
          <div style={{ width:'100%', maxWidth:440, background:isDark?'#0A0A0A':'#fff', height:'100%', overflow:'y-auto', animation:'slideIn .3s ease-out', boxShadow:'-10px 0 50px rgba(0,0,0,.25)', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding:'24px 24px 20px', borderBottom:`1px solid ${c.border}`, display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, background:isDark?'#0A0A0A':'#fff', zIndex:1 }}>
              <button onClick={() => setDetail(null)} style={{ background:'none', border:'none', color:c.muted, cursor:'pointer', display:'flex', fontSize:20 }}><FiX/></button>
              <div>
                <div style={{ fontWeight:800, fontSize:16, color:c.txt }}>Withdrawal Detail</div>
                <div style={{ fontSize:12, color:c.muted }}>ID: {detail.id.slice(0,12)}…</div>
              </div>
            </div>
            <div style={{ padding:24 }}>
              {/* Amount card */}
              <div style={{ background:'linear-gradient(135deg,#064E3B,#065F46)', borderRadius:16, padding:24, marginBottom:20 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6 }}>Total Request</div>
                <div style={{ fontSize:36, fontWeight:900, color:'#fff', fontFamily:'monospace', marginBottom:10 }}>{fmt(detail.amount)}</div>
                <span style={{ padding:'4px 12px', borderRadius:100, background:'rgba(255,255,255,.15)', color:'#fff', fontSize:11, fontWeight:800, textTransform:'uppercase' }}>{detail.status}</span>
              </div>
              {/* Info sections */}
              {[
                { title:'Beneficiary', Icon:FiUser, rows:[['Email',detail.email],['System ID',detail.id]] },
                { title:'Bank Details', Icon:FiCreditCard, rows:[['Bank',detail.bankDetails?.bankName||'N/A'],['Account No',detail.bankDetails?.accountNumber||'N/A'],['Account Name',detail.bankDetails?.accountName||'N/A']] },
                { title:'Timeline', Icon:FiClock, rows:[
                  ['Requested', fmtDate(detail.createdAt)],
                  ...(detail.processedAt ? [['Processed', fmtDate(detail.processedAt)]] : []),
                  ...(detail.processedBy ? [['Processed By', detail.processedBy]] : []),
                ] },
              ].map(sec => (
                <div key={sec.title} style={{ marginBottom:18 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10, fontSize:12, fontWeight:700, color:c.muted, textTransform:'uppercase', letterSpacing:'.06em' }}>
                    <sec.Icon size={13}/> {sec.title}
                  </div>
                  <div style={{ background:c.card2, border:`1px solid ${c.border}`, borderRadius:12, overflow:'hidden' }}>
                    {sec.rows.map(([label, val], ri) => (
                      <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', borderBottom:ri<sec.rows.length-1?`1px solid ${c.border}`:'none', gap:12 }}>
                        <span style={{ fontSize:12, color:c.muted, flexShrink:0 }}>{label}</span>
                        <span style={{ fontSize:12, fontWeight:700, color:c.txt, textAlign:'right', wordBreak:'break-all' }}>{val||'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {/* Actions */}
              {detail.status === 'pending' && (
                <div style={{ display:'grid', gap:10, marginTop:8 }}>
                  <button onClick={() => setConfirm({ ids:[detail.id], action:'approved' })}
                    style={{ padding:'14px', borderRadius:12, border:'none', background:c.green, color:'#000', fontWeight:800, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:"'Inter',sans-serif" }}>
                    <FiCheckCircle size={16}/> Authorize Funds
                  </button>
                  <button onClick={() => setConfirm({ ids:[detail.id], action:'rejected' })}
                    style={{ padding:'14px', borderRadius:12, border:`1px solid rgba(239,68,68,.3)`, background:'rgba(239,68,68,.06)', color:c.red, fontWeight:800, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:"'Inter',sans-serif" }}>
                    <FiXCircle size={16}/> Decline Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm modal ── */}
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', backdropFilter:'blur(4px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => setConfirm(null)}>
          <div style={{ background:isDark?'#111':'#fff', border:`1px solid ${c.border}`, borderRadius:20, padding:28, maxWidth:380, width:'100%', textAlign:'center' }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <FiAlertTriangle color={c.amber} size={22}/>
            </div>
            <h3 style={{ margin:'0 0 8px', color:c.txt, fontWeight:800, textTransform:'capitalize' }}>
              {confirm.action === 'deleted' ? 'Delete' : confirm.action} {confirm.ids.length} request{confirm.ids.length>1?'s':''}?
            </h3>
            <p style={{ margin:'0 0 24px', color:c.muted, fontSize:14, lineHeight:1.6 }}>This action will be applied immediately.</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <button onClick={() => setConfirm(null)} style={{ padding:'11px', borderRadius:10, border:`1px solid ${c.border}`, background:'transparent', color:c.txt, fontWeight:700, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>Cancel</button>
              <button onClick={() => executeAction(confirm)} style={{ padding:'11px', borderRadius:10, border:'none', background:confirm.action==='approved'?c.green:c.red, color:confirm.action==='approved'?'#000':'#fff', fontWeight:800, cursor:'pointer', fontFamily:"'Inter',sans-serif", textTransform:'capitalize' }}>
                {confirm.action === 'deleted' ? 'Delete' : confirm.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WithdrawalManagement;
