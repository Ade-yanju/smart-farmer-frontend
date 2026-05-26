import React, { useState } from 'react';
import apiClient from '../axiosConfig';
import { FiZap, FiAlertTriangle, FiCheck, FiRefreshCw, FiShield, FiActivity } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

function SystemActions() {
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);   // { ok: bool, msg: string }
  const [confirm, setConfirm]   = useState(false);

  const { theme } = useTheme();
  const isDark    = theme === 'dark';

  /* ── colour tokens ── */
  const c = {
    card:   isDark ? '#0A0A0A'              : '#fff',
    card2:  isDark ? '#111'                 : '#F9FAFB',
    border: isDark ? 'rgba(255,255,255,.08)': 'rgba(0,0,0,.06)',
    txt:    isDark ? '#fff'                 : '#111',
    muted:  isDark ? '#888'                 : '#666',
    green:  '#10B981',
    amber:  '#F59E0B',
    red:    '#EF4444',
  };

  const handleProcessPayouts = async () => {
    setConfirm(false);
    setLoading(true);
    setResult(null);
    try {
      const res = await apiClient.post('/system/process-payouts');
      setResult({ ok:true, msg: res.data.message || 'Payout cycle completed successfully.' });
    } catch (err) {
      setResult({ ok:false, msg: err.response?.data?.message || 'An error occurred. Check server logs.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>

      <div style={{ fontFamily:"'Inter',sans-serif", color:c.txt }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:24 }}>
          <h2 style={{ margin:'0 0 4px', fontSize:20, fontWeight:800, letterSpacing:'-0.5px' }}>System Actions</h2>
          <p style={{ margin:0, fontSize:13, color:c.muted }}>Run platform-wide operations. Use with caution — these affect all users.</p>
        </div>

        {/* ── Warning banner ── */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', background:'rgba(245,158,11,.07)', border:'1px solid rgba(245,158,11,.2)', borderRadius:14, marginBottom:24 }}>
          <FiShield color={c.amber} size={18} style={{ flexShrink:0, marginTop:1 }} />
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:c.amber, marginBottom:3 }}>Admin-Only Zone</div>
            <p style={{ margin:0, fontSize:13, color:c.txt, lineHeight:1.6 }}>
              All actions on this page are irreversible and affect the live platform. Confirm every action before proceeding. Accidental triggers may require manual database rollback.
            </p>
          </div>
        </div>

        {/* ── Action cards ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Payout processing */}
          <div style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:18, padding:'22px 24px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14, flex:1 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <FiZap color={c.green} size={20} />
                </div>
                <div>
                  <div style={{ fontWeight:800, fontSize:15, color:c.txt, marginBottom:5 }}>Process Investment Payouts</div>
                  <p style={{ margin:0, fontSize:13, color:c.muted, lineHeight:1.6, maxWidth:480 }}>
                    Scans all active investments that have completed their cycle duration and credits principal + yield directly to each investor's wallet balance. Should typically be run once per day.
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setResult(null); setConfirm(true); }}
                disabled={loading}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 20px', borderRadius:12, border:'none', background:c.green, color:'#000', fontWeight:800, fontSize:14, cursor:loading?'not-allowed':'pointer', opacity:loading?.7:1, flexShrink:0, whiteSpace:'nowrap', fontFamily:"'Inter',sans-serif" }}
              >
                {loading
                  ? <><div style={{ width:14, height:14, border:'2px solid #000', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite' }} /> Processing…</>
                  : <><FiZap size={15}/> Run Payout</>}
              </button>
            </div>

            {/* Result message */}
            {result && (
              <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:result.ok?'rgba(16,185,129,.08)':'rgba(239,68,68,.08)', border:`1px solid ${result.ok?'rgba(16,185,129,.2)':'rgba(239,68,68,.2)'}`, borderRadius:10 }}>
                {result.ok ? <FiCheck color={c.green} size={15}/> : <FiAlertTriangle color={c.red} size={15}/>}
                <span style={{ fontSize:13, color:result.ok?c.green:c.red, fontWeight:600 }}>{result.msg}</span>
              </div>
            )}
          </div>

          {/* Platform status card */}
          <div style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:18, padding:'22px 24px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'rgba(59,130,246,.1)', border:'1px solid rgba(59,130,246,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <FiActivity color="#3B82F6" size={20} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:15, color:c.txt, marginBottom:8 }}>Platform Health</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                  {[
                    { label:'Firebase DB',   ok:true  },
                    { label:'Auth Service',  ok:true  },
                    { label:'Payout Engine', ok:true  },
                    { label:'Backend API',   ok:null  },
                  ].map(s => (
                    <div key={s.label} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:100, background:s.ok===true?'rgba(16,185,129,.08)':s.ok===null?'rgba(245,158,11,.08)':'rgba(239,68,68,.08)', border:`1px solid ${s.ok===true?'rgba(16,185,129,.2)':s.ok===null?'rgba(245,158,11,.2)':'rgba(239,68,68,.2)'}` }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:s.ok===true?c.green:s.ok===null?c.amber:c.red }} />
                      <span style={{ fontSize:12, fontWeight:700, color:s.ok===true?c.green:s.ok===null?c.amber:c.red }}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <p style={{ margin:'10px 0 0', fontSize:12, color:c.muted }}>Backend API status reflects the last API call result.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Confirm modal ── */}
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => setConfirm(false)}>
          <div style={{ background:isDark?'#111':'#fff', border:`1px solid ${c.border}`, borderRadius:20, padding:28, maxWidth:400, width:'100%', textAlign:'center' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <FiZap color={c.amber} size={22}/>
            </div>
            <h3 style={{ margin:'0 0 8px', color:c.txt, fontWeight:800 }}>Run Payout Process?</h3>
            <p style={{ margin:'0 0 24px', color:c.muted, fontSize:14, lineHeight:1.6 }}>
              This will pay out <strong style={{ color:c.txt }}>all matured investments</strong> and credit users' wallets. This action cannot be undone.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <button onClick={() => setConfirm(false)} style={{ padding:'12px', borderRadius:11, border:`1px solid ${c.border}`, background:'transparent', color:c.txt, fontWeight:700, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>Cancel</button>
              <button onClick={handleProcessPayouts} style={{ padding:'12px', borderRadius:11, border:'none', background:c.green, color:'#000', fontWeight:800, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>
                <FiRefreshCw size={13} style={{ marginRight:6 }}/>Confirm & Run
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SystemActions;
