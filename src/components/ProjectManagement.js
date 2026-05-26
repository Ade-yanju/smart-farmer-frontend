import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertTriangle, FiRefreshCw, FiBox } from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

const EMPTY = { name:'', description:'', pricePerUnit:'', availableUnits:'', returnPercentage:'', durationDays:'', riskLevel:'Low' };

const RISK_CFG = {
  Low:    { color:'#10B981', bg:'rgba(16,185,129,.1)',  bdr:'rgba(16,185,129,.2)'  },
  Medium: { color:'#F59E0B', bg:'rgba(245,158,11,.1)',  bdr:'rgba(245,158,11,.2)'  },
  High:   { color:'#EF4444', bg:'rgba(239,68,68,.1)',   bdr:'rgba(239,68,68,.2)'   },
};

function ProjectManagement() {
  const [projects, setProjects]   = useState([]);
  const [form, setForm]           = useState(EMPTY);
  const [editing, setEditing]     = useState(null);   // project id or null
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(null);   // project id being deleted
  const [width, setWidth]         = useState(window.innerWidth);

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
    inpBg:  isDark ? '#0A0A0A'             : '#F9FAFB',
    green:  '#10B981',
    red:    '#EF4444',
  };

  const inpStyle = {
    width:'100%', padding:'11px 14px', borderRadius:10,
    border:`1px solid ${c.border}`, background:c.inpBg, color:c.txt,
    fontSize:14, outline:'none', boxSizing:'border-box',
    fontFamily:"'Inter',sans-serif", transition:'border-color .2s',
  };
  const lblStyle = {
    display:'block', fontSize:11, fontWeight:700, color:c.muted,
    textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6,
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'projects'));
      setProjects(snap.docs.map(d => ({ id:d.id, ...d.data() })));
    } catch (e) { showModal('Error loading projects: ' + e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const clearForm = () => { setForm(EMPTY); setEditing(null); };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    const data = {
      name:             form.name,
      description:      form.description,
      pricePerUnit:     Number(form.pricePerUnit),
      availableUnits:   Number(form.availableUnits),
      returnPercentage: Number(form.returnPercentage),
      durationDays:     Number(form.durationDays),
      riskLevel:        form.riskLevel,
      imageUrl:         '',
      targetAmount:     Number(form.pricePerUnit) * Number(form.availableUnits),
    };
    try {
      if (editing) {
        await updateDoc(doc(db, 'projects', editing), data);
        showModal('Project updated!');
      } else {
        await addDoc(collection(db, 'projects'), { ...data, currentAmount:0, status:'Open', createdAt:serverTimestamp() });
        showModal('Project created!');
      }
      clearForm(); fetchProjects();
    } catch (err) { showModal('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const startEdit = p => {
    setEditing(p.id);
    setForm({ name:p.name, description:p.description||'', pricePerUnit:p.pricePerUnit||'', availableUnits:p.availableUnits||'', returnPercentage:p.returnPercentage||'', durationDays:p.durationDays||'', riskLevel:p.riskLevel||'Low' });
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleDelete = async id => {
    setDeleting(id);
  };

  const confirmDelete = async id => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      showModal('Project deleted.');
      fetchProjects();
    } catch (err) { showModal('Error: ' + err.message); }
    finally { setDeleting(null); }
  };

  const fmt = n => new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN', minimumFractionDigits:0 }).format(Number(n)||0);

  return (
    <>
      <style>{`
        @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        .pm-inp:focus{border-color:#10B981!important;box-shadow:0 0 0 1px rgba(16,185,129,.2)}
        .pm-row:hover{background:${isDark?'rgba(255,255,255,.025)':'rgba(0,0,0,.015)'}!important}
        @media(max-width:639px){
          .pm-grid{grid-template-columns:1fr!important}
          .pm-grid2{grid-template-columns:1fr 1fr!important}
        }
      `}</style>

      <div style={{ fontFamily:"'Inter',sans-serif", color:c.txt }}>

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
          <div>
            <h2 style={{ margin:'0 0 4px', fontSize:20, fontWeight:800, letterSpacing:'-0.5px' }}>
              {editing ? 'Edit Project' : 'Projects'}
            </h2>
            <p style={{ margin:0, fontSize:13, color:c.muted }}>
              {editing ? 'Update project details below.' : 'Create and manage farm investment projects.'}
            </p>
          </div>
          <button onClick={fetchProjects} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:10, border:`1px solid ${c.border}`, background:c.card, color:c.txt, fontWeight:700, fontSize:13, cursor:'pointer' }}>
            <FiRefreshCw size={14} style={{ animation:loading?'spin 1s linear infinite':'none' }}/> Refresh
          </button>
        </div>

        {/* ── Form ── */}
        <div style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:18, padding:isMobile?'18px':'24px', marginBottom:28 }}>
          <div style={{ fontWeight:700, fontSize:15, color:c.txt, marginBottom:16 }}>
            {editing ? '✏️ Editing Project' : '➕ Add New Project'}
          </div>
          <form onSubmit={handleSubmit}>
            {/* Row 1: Name (full width) */}
            <div style={{ marginBottom:14 }}>
              <label style={lblStyle}>Project Name *</label>
              <input className="pm-inp" style={inpStyle} name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Maize Cycle Q3" />
            </div>

            {/* Row 2: Price, Units, Target */}
            <div className="pm-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:14 }}>
              <div>
                <label style={lblStyle}>Price / Unit (₦) *</label>
                <input className="pm-inp" style={inpStyle} type="number" name="pricePerUnit" value={form.pricePerUnit} onChange={handleChange} required placeholder="50000" />
              </div>
              <div>
                <label style={lblStyle}>Available Units *</label>
                <input className="pm-inp" style={inpStyle} type="number" name="availableUnits" value={form.availableUnits} onChange={handleChange} required placeholder="100" />
              </div>
              <div>
                <label style={lblStyle}>Calculated Target</label>
                <input style={{ ...inpStyle, opacity:.6, cursor:'not-allowed' }} readOnly value={fmt(Number(form.pricePerUnit||0)*Number(form.availableUnits||0))} />
              </div>
            </div>

            {/* Row 3: Return, Duration, Risk */}
            <div className="pm-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:14 }}>
              <div>
                <label style={lblStyle}>Return (%) *</label>
                <input className="pm-inp" style={inpStyle} type="number" name="returnPercentage" value={form.returnPercentage} onChange={handleChange} required placeholder="14" />
              </div>
              <div>
                <label style={lblStyle}>Duration (Days) *</label>
                <input className="pm-inp" style={inpStyle} type="number" name="durationDays" value={form.durationDays} onChange={handleChange} required placeholder="180" />
              </div>
              <div>
                <label style={lblStyle}>Risk Level</label>
                <select className="pm-inp" style={{ ...inpStyle, cursor:'pointer', appearance:'none', WebkitAppearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center' }}
                  name="riskLevel" value={form.riskLevel} onChange={handleChange}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom:20 }}>
              <label style={lblStyle}>Description *</label>
              <textarea className="pm-inp" style={{ ...inpStyle, resize:'vertical', minHeight:80 }} name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Describe the project…" />
            </div>

            {/* Buttons */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <button type="submit" disabled={saving} style={{ display:'flex', alignItems:'center', gap:7, padding:'11px 22px', borderRadius:11, border:'none', background:c.green, color:'#000', fontWeight:800, fontSize:14, cursor:saving?'not-allowed':'pointer', opacity:saving?.7:1, fontFamily:"'Inter',sans-serif" }}>
                {saving ? 'Saving…' : editing ? <><FiCheck size={14}/> Save Changes</> : <><FiPlus size={14}/> Create Project</>}
              </button>
              {editing && (
                <button type="button" onClick={clearForm} style={{ display:'flex', alignItems:'center', gap:7, padding:'11px 18px', borderRadius:11, border:`1px solid ${c.border}`, background:'transparent', color:c.muted, fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>
                  <FiX size={14}/> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── Projects List ── */}
        <div style={{ fontWeight:700, fontSize:15, color:c.txt, marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
          <FiBox color={c.green} size={16}/> All Projects
          <span style={{ padding:'2px 9px', borderRadius:100, background:`rgba(16,185,129,.1)`, color:c.green, fontSize:12, fontWeight:700 }}>{projects.length}</span>
        </div>

        <div style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:18, overflow:'hidden' }}>
          {loading ? (
            <div style={{ padding:'60px 20px', textAlign:'center', color:c.muted }}>
              <div style={{ width:32, height:32, border:`3px solid ${c.green}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 12px' }} />
              Loading projects…
            </div>
          ) : projects.length === 0 ? (
            <div style={{ padding:'60px 20px', textAlign:'center', color:c.muted }}>
              <FiBox size={40} color="#444" style={{ marginBottom:12 }} />
              <p style={{ fontWeight:700, color:c.txt, margin:'0 0 4px' }}>No projects yet</p>
              <p style={{ fontSize:13, margin:0 }}>Use the form above to create your first project.</p>
            </div>
          ) : (
            <ul style={{ listStyle:'none', margin:0, padding:0 }}>
              {projects.map((p, i) => {
                const risk = RISK_CFG[p.riskLevel] || RISK_CFG.Low;
                const progress = p.targetAmount ? Math.min(100, ((p.currentAmount||0)/p.targetAmount)*100) : 0;
                return (
                  <li key={p.id} className="pm-row" style={{ padding:isMobile?'14px':'18px 22px', borderBottom:i<projects.length-1?`1px solid ${c.border}`:'none', transition:'background .15s' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                          <span style={{ fontWeight:800, fontSize:15, color:c.txt }}>{p.name}</span>
                          <span style={{ padding:'2px 9px', borderRadius:100, background:risk.bg, color:risk.color, border:`1px solid ${risk.bdr}`, fontSize:11, fontWeight:700 }}>{p.riskLevel}</span>
                          {p.status && <span style={{ padding:'2px 9px', borderRadius:100, background:`rgba(16,185,129,.08)`, color:c.green, fontSize:11, fontWeight:700 }}>{p.status}</span>}
                        </div>
                        <div className="pm-grid2" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px 24px', marginBottom:10 }}>
                          {[
                            { l:'Price/Unit',  v:fmt(p.pricePerUnit)      },
                            { l:'Units',       v:(p.availableUnits||0).toLocaleString() },
                            { l:'Target',      v:fmt(p.targetAmount)      },
                            { l:'Return',      v:`${p.returnPercentage}%` },
                          ].map(stat => (
                            <div key={stat.l}>
                              <div style={{ fontSize:10, color:c.muted, textTransform:'uppercase', letterSpacing:'.06em', fontWeight:700, marginBottom:2 }}>{stat.l}</div>
                              <div style={{ fontSize:13, fontWeight:700, color:c.txt }}>{stat.v}</div>
                            </div>
                          ))}
                        </div>
                        {/* Progress bar */}
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ flex:1, height:4, borderRadius:2, background:isDark?'rgba(255,255,255,.08)':'rgba(0,0,0,.06)', overflow:'hidden' }}>
                            <div style={{ width:`${progress}%`, height:'100%', background:c.green, borderRadius:2, transition:'width .4s' }} />
                          </div>
                          <span style={{ fontSize:11, color:c.muted, whiteSpace:'nowrap' }}>{progress.toFixed(0)}% funded</span>
                        </div>
                      </div>
                      {/* Actions */}
                      <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                        <button onClick={() => startEdit(p)} style={{ width:34, height:34, borderRadius:9, border:`1px solid ${c.border}`, background:c.card2, color:c.txt, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }} title="Edit">
                          <FiEdit2 size={14}/>
                        </button>
                        <button onClick={() => handleDelete(p.id)} style={{ width:34, height:34, borderRadius:9, border:'1px solid rgba(239,68,68,.25)', background:'rgba(239,68,68,.06)', color:c.red, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }} title="Delete">
                          <FiTrash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ── Delete confirmation modal ── */}
      {deleting && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', backdropFilter:'blur(4px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => setDeleting(null)}>
          <div style={{ background:isDark?'#111':'#fff', border:`1px solid ${c.border}`, borderRadius:20, padding:28, maxWidth:380, width:'100%', textAlign:'center' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <FiAlertTriangle color={c.red} size={20}/>
            </div>
            <h3 style={{ margin:'0 0 8px', color:c.txt, fontWeight:800 }}>Delete Project?</h3>
            <p style={{ margin:'0 0 24px', color:c.muted, fontSize:14, lineHeight:1.6 }}>
              This will permanently remove the project and cannot be undone.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <button onClick={() => setDeleting(null)} style={{ padding:'11px', borderRadius:10, border:`1px solid ${c.border}`, background:'transparent', color:c.txt, fontWeight:700, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>Cancel</button>
              <button onClick={() => confirmDelete(deleting)} style={{ padding:'11px', borderRadius:10, border:'none', background:c.red, color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectManagement;
