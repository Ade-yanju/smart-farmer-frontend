import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../axiosConfig';
import {
  FiArrowUpRight, FiArrowDownLeft, FiSearch, FiTrash2,
  FiCheckCircle, FiXCircle, FiActivity, FiCheckSquare,
  FiSquare, FiRefreshCw, FiInbox, FiTrendingUp, FiX,
} from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

const TYPE_CFG = {
  deposit:    { color:'#10B981', bg:'rgba(16,185,129,.1)',  bdr:'rgba(16,185,129,.2)',  Icon:FiArrowDownLeft, sign:'+' },
  withdrawal: { color:'#EF4444', bg:'rgba(239,68,68,.1)',   bdr:'rgba(239,68,68,.2)',   Icon:FiArrowUpRight,  sign:'-' },
  investment: { color:'#3B82F6', bg:'rgba(59,130,246,.1)',  bdr:'rgba(59,130,246,.2)',  Icon:FiTrendingUp,    sign:'-' },
};
const DEFAULT_TYPE = { color:'#888', bg:'rgba(128,128,128,.1)', bdr:'rgba(128,128,128,.2)', Icon:FiActivity, sign:'' };

function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchQuery, setSearch]        = useState('');
  const [filter, setFilter]             = useState('all');
  const [selectedIds, setSelectedIds]   = useState([]);
  const [confirm, setConfirm]           = useState(null);
  const [width, setWidth]               = useState(window.innerWidth);

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

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/transactions');
      setTransactions(res.data);
      setSelectedIds([]);
    } catch { showModal('Could not load transactions.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const filteredData = useMemo(() =>
    transactions.filter(tx => {
      const s = (tx.email||'').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tx.details||'').toLowerCase().includes(searchQuery.toLowerCase());
      const f = filter === 'all' || (tx.type||'').toLowerCase() === filter;
      return s && f;
    }), [transactions, searchQuery, filter]);

  const toggleAll = () => setSelectedIds(selectedIds.length === filteredData.length ? [] : filteredData.map(t => t.id));
  const toggleOne = id => setSelectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const executeBatch = async ({ ids, action }) => {
    setConfirm(null);
    try {
      await Promise.all(ids.map(id => apiClient.post('/admin/transactions/update', { id, status:action })));
      showModal(`${ids.length} transaction${ids.length>1?'s':''} ${action}.`);
      setSelectedIds([]);
      fetchTransactions();
    } catch { showModal('Batch action failed.'); }
  };

  const fmt = n => new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN', minimumFractionDigits:0 }).format(Number(n)||0);
  const fmtDate = ts => ts?.seconds ? new Date(ts.seconds*1000).toLocaleDateString('en-NG',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : 'N/A';

  const sum = type => transactions.filter(t=>(t.type||'').toLowerCase()===type).reduce((a,t)=>a+(t.amount||0),0);
  const stats = [
    { label:'Total',      value:transactions.length, color:c.txt   },
    { label:'Deposits',   value:fmt(sum('deposit')),  color:c.green },
    { label:'Withdrawn',  value:fmt(sum('withdrawal')),color:c.red  },
    { label:'Invested',   value:fmt(sum('investment')), color:'#3B82F6' },
  ];

  return (
    <>
      <style>{`
        @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        .tm-row:hover{background:${isDark?'rgba(255,255,255,.025)':'rgba(0,0,0,.015)'}!important}
        .tm-batch{transform:translateY(${selectedIds.length>0?'0':'100px'});opacity:${selectedIds.length>0?1:0};pointer-events:${selectedIds.length>0?'all':'none'}}
        @media(max-width:639px){
          .tm-hide{display:none!important}
          .tm-stats{grid-template-columns:1fr 1fr!important}
        }
      `}</style>

      <div style={{ fontFamily:"'Inter',sans-serif", color:c.txt }}>

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div>
            <h2 style={{ margin:'0 0 4px', fontSize:20, fontWeight:800, letterSpacing:'-0.5px' }}>Transactions</h2>
            <p style={{ margin:0, fontSize:13, color:c.muted }}>Full platform financial activity log.</p>
          </div>
          <button onClick={fetchTransactions} disabled={loading} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:10, border:`1px solid ${c.border}`, background:c.card, color:c.txt, fontWeight:700, fontSize:13, cursor:'pointer' }}>
            <FiRefreshCw size={14} style={{ animation:loading?'spin 1s linear infinite':'none' }}/> Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="tm-stats" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:14, padding:isMobile?'10px 12px':'14px 16px' }}>
              <div style={{ fontSize:10, color:c.muted, textTransform:'uppercase', letterSpacing:'.06em', fontWeight:700, marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:isMobile?14:17, fontWeight:800, color:s.color, wordBreak:'break-all' }}>{loading?'…':s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Controls ── */}
        <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:4, background:isDark?'#0A0A0A':'#f1f1f4', padding:4, borderRadius:12, flexWrap:'wrap' }}>
            {['all','deposit','withdrawal','investment'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding:'7px 12px', borderRadius:9, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', background:filter===f?(isDark?'#fff':'#000'):'transparent', color:filter===f?(isDark?'#000':'#fff'):c.muted, textTransform:'capitalize', transition:'all .2s', whiteSpace:'nowrap' }}>
                {f==='all'?'All':f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ position:'relative', flex:1, minWidth:isMobile?'100%':200 }}>
            <FiSearch style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:c.muted, pointerEvents:'none' }} size={14}/>
            <input value={searchQuery} onChange={e=>setSearch(e.target.value)} placeholder="Search email or details…"
              style={{ width:'100%', padding:'9px 12px 9px 34px', borderRadius:10, border:`1px solid ${isDark?'#222':'#e2e8f0'}`, background:isDark?'#0A0A0A':'#fff', color:c.txt, fontSize:13, outline:'none', boxSizing:'border-box' }}/>
          </div>
        </div>

        {/* ── List ── */}
        <div style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:18, overflow:'hidden' }}>
          {/* Select all bar */}
          {filteredData.length > 0 && (
            <div style={{ padding:'10px 16px', borderBottom:`1px solid ${c.border}`, display:'flex', alignItems:'center', gap:10 }}>
              <button onClick={toggleAll} style={{ background:'none', border:'none', cursor:'pointer', color:c.green, fontSize:18, display:'flex' }}>
                {selectedIds.length===filteredData.length&&filteredData.length>0 ? <FiCheckSquare/> : <FiSquare color={c.muted}/>}
              </button>
              <span style={{ fontSize:12, color:c.muted }}>Select all visible ({filteredData.length})</span>
            </div>
          )}

          {loading ? (
            <div style={{ padding:'60px 20px', textAlign:'center', color:c.muted }}>
              <div style={{ width:32, height:32, border:`3px solid ${c.green}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 12px' }}/>
              Loading transactions…
            </div>
          ) : filteredData.length === 0 ? (
            <div style={{ padding:'60px 20px', textAlign:'center' }}>
              <FiInbox size={40} color="#444" style={{ marginBottom:12 }}/>
              <p style={{ fontWeight:700, color:c.txt, margin:'0 0 4px' }}>No transactions found</p>
              <p style={{ color:c.muted, fontSize:13, margin:0 }}>Try adjusting your filters.</p>
            </div>
          ) : (
            <ul style={{ listStyle:'none', margin:0, padding:0 }}>
              {filteredData.map((tx, i) => {
                const conf = TYPE_CFG[(tx.type||'').toLowerCase()] || DEFAULT_TYPE;
                const { Icon } = conf;
                const sel = selectedIds.includes(tx.id);
                return (
                  <li key={tx.id} className="tm-row" style={{ padding:isMobile?'12px 14px':'14px 20px', borderBottom:i<filteredData.length-1?`1px solid ${c.border}`:'none', background:sel?(isDark?'rgba(16,185,129,.04)':'rgba(16,185,129,.02)'):undefined, transition:'background .15s' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:isMobile?10:14 }}>
                      {/* Checkbox */}
                      <button onClick={() => toggleOne(tx.id)} style={{ background:'none', border:'none', cursor:'pointer', color:sel?c.green:c.muted, fontSize:17, flexShrink:0, lineHeight:1, display:'flex' }}>
                        {sel ? <FiCheckSquare/> : <FiSquare/>}
                      </button>
                      {/* Icon */}
                      <div style={{ width:isMobile?34:40, height:isMobile?34:40, borderRadius:10, background:conf.bg, border:`1px solid ${conf.bdr}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Icon size={isMobile?14:16} color={conf.color}/>
                      </div>
                      {/* Email + details */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:isMobile?12:14, color:c.txt, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tx.email||'Unknown'}</div>
                        <div style={{ fontSize:11, color:c.muted }}>{tx.details||tx.type||'Transaction'}</div>
                      </div>
                      {/* Type badge — desktop */}
                      {!isMobile && (
                        <span className="tm-hide" style={{ padding:'3px 10px', borderRadius:100, background:conf.bg, color:conf.color, border:`1px solid ${conf.bdr}`, fontSize:11, fontWeight:700, flexShrink:0, textTransform:'capitalize' }}>{tx.type||'N/A'}</span>
                      )}
                      {/* Date — desktop */}
                      {!isMobile && <div className="tm-hide" style={{ fontSize:11, color:c.muted, flexShrink:0 }}>{fmtDate(tx.createdAt)}</div>}
                      {/* Amount */}
                      <div style={{ fontWeight:800, fontSize:isMobile?13:15, color:conf.color, fontFamily:'monospace', flexShrink:0 }}>
                        {conf.sign}{fmt(tx.amount)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p style={{ textAlign:'center', color:isDark?'#555':'#aaa', fontSize:12, marginTop:12 }}>
          {filteredData.length} of {transactions.length} transactions
        </p>
      </div>

      {/* ── Batch bar ── */}
      <div className="tm-batch" style={{ position:'fixed', bottom:80, left:'50%', transform:'translateX(-50%)', background:isDark?'rgba(255,255,255,.96)':'rgba(0,0,0,.92)', color:isDark?'#000':'#fff', padding:'12px 20px', borderRadius:100, display:'flex', alignItems:'center', gap:14, boxShadow:'0 20px 40px rgba(0,0,0,.3)', zIndex:1000, transition:'all .4s cubic-bezier(.17,.67,.35,1.2)', maxWidth:'90vw' }}>
        <span style={{ fontWeight:800, fontSize:13, whiteSpace:'nowrap' }}>{selectedIds.length} selected</span>
        <button onClick={() => setConfirm({ ids:selectedIds, action:'approved' })} style={{ background:c.green, color:'#000', border:'none', padding:'7px 14px', borderRadius:50, fontWeight:800, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:5, whiteSpace:'nowrap' }}>
          <FiCheckCircle size={12}/> Approve
        </button>
        <button onClick={() => setConfirm({ ids:selectedIds, action:'rejected' })} style={{ background:c.amber, color:'#000', border:'none', padding:'7px 14px', borderRadius:50, fontWeight:800, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:5, whiteSpace:'nowrap' }}>
          <FiXCircle size={12}/> Reject
        </button>
        <button onClick={() => setConfirm({ ids:selectedIds, action:'deleted' })} style={{ background:c.red, color:'#fff', border:'none', padding:'7px 12px', borderRadius:50, fontWeight:800, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center' }}>
          <FiTrash2 size={12}/>
        </button>
        <button onClick={() => setSelectedIds([])} style={{ background:'none', border:'none', color:isDark?'rgba(0,0,0,.4)':'rgba(255,255,255,.4)', cursor:'pointer', display:'flex', padding:4 }}><FiX size={17}/></button>
      </div>

      {/* ── Confirm modal ── */}
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => setConfirm(null)}>
          <div style={{ background:isDark?'#111':'#fff', border:`1px solid ${c.border}`, borderRadius:20, padding:28, maxWidth:380, width:'100%', textAlign:'center' }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <FiActivity color={c.amber} size={20}/>
            </div>
            <h3 style={{ margin:'0 0 8px', color:c.txt, fontWeight:800, textTransform:'capitalize' }}>
              {confirm.action === 'deleted' ? 'Delete' : confirm.action} {confirm.ids.length} item{confirm.ids.length>1?'s':''}?
            </h3>
            <p style={{ margin:'0 0 24px', color:c.muted, fontSize:14, lineHeight:1.6 }}>
              This applies to <strong style={{ color:c.txt }}>{confirm.ids.length} record{confirm.ids.length>1?'s':''}</strong> immediately.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <button onClick={() => setConfirm(null)} style={{ padding:'11px', borderRadius:10, border:`1px solid ${c.border}`, background:'transparent', color:c.txt, fontWeight:700, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>Cancel</button>
              <button onClick={() => executeBatch(confirm)} style={{ padding:'11px', borderRadius:10, border:'none', background:confirm.action==='approved'?c.green:c.red, color:confirm.action==='approved'?'#000':'#fff', fontWeight:800, cursor:'pointer', fontFamily:"'Inter',sans-serif", textTransform:'capitalize' }}>
                {confirm.action === 'deleted' ? 'Delete' : confirm.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TransactionManagement;
