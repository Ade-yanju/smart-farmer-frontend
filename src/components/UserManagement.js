import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../axiosConfig';
import {
  FiUser, FiShield, FiTrash2, FiSearch,
  FiCheckSquare, FiSquare, FiX, FiRefreshCw, FiUsers, FiEdit2,
} from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

function UserManagement() {
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filter, setFilter]             = useState('all');
  const [searchQuery, setSearchQuery]   = useState('');
  const [isDeleting, setIsDeleting]     = useState(false);
  const [confirmDel, setConfirmDel]     = useState(null);  // { uids: [], label: '' }
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
    violet: '#8B5CF6',
  };

  const fetchUsers = async () => {
    setLoading(true); setError('');
    try {
      const res = await apiClient.get('/admin/users');
      setUsers(res.data);
    } catch { setError('Could not load users. Check backend connectivity.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = useMemo(() =>
    users.filter(u => {
      const s = u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const f = filter === 'all' || u.role === filter;
      return s && f;
    }), [users, searchQuery, filter]);

  const toggleSelectAll = () => setSelectedUsers(
    selectedUsers.length === filteredUsers.length && filteredUsers.length > 0
      ? [] : filteredUsers.map(u => u.uid)
  );
  const toggleSelect = uid => setSelectedUsers(p => p.includes(uid) ? p.filter(i => i !== uid) : [...p, uid]);

  const executeDelete = async (uids) => {
    setConfirmDel(null);
    setIsDeleting(true);
    let ok = 0, fail = 0;
    for (const uid of uids) {
      try { await apiClient.delete(`/admin/users/${uid}`); ok++; }
      catch { fail++; }
    }
    setIsDeleting(false);
    setSelectedUsers([]);
    fetchUsers();
    showModal(fail ? `${ok} removed, ${fail} failed.` : `${ok} user${ok>1?'s':''} removed.`);
  };

  const handleSetRole = async (uid, email, current) => {
    const next = current === 'admin' ? 'user' : 'admin';
    try {
      await apiClient.post('/admin/users/setrole', { uid, role: next });
      showModal(`${email} → ${next}`);
      fetchUsers();
    } catch { showModal('Role update failed.'); }
  };

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-NG', { day:'2-digit', month:'short', year:'numeric' }) : 'N/A';

  const stats = [
    { label:'Total Users',  value:users.length,                              color:c.txt   },
    { label:'Admins',       value:users.filter(u=>u.role==='admin').length,  color:c.violet },
    { label:'Regular',      value:users.filter(u=>u.role!=='admin').length,  color:c.green  },
  ];

  return (
    <>
      <style>{`
        @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        .um-row:hover td{background:${isDark?'rgba(255,255,255,.025)!important':'rgba(0,0,0,.015)!important'}}
        .um-batch{transform:translateY(${selectedUsers.length>0?'0':'100px'});opacity:${selectedUsers.length>0?1:0};pointer-events:${selectedUsers.length>0?'all':'none'}}
        @media(max-width:639px){
          .um-hide-m{display:none!important}
          .um-table thead{display:none}
          .um-table,.um-table tbody,.um-table tr,.um-table td{display:block;width:100%;box-sizing:border-box}
          .um-table tr{margin-bottom:12px;border:1px solid ${isDark?'rgba(255,255,255,.08)':'rgba(0,0,0,.06)'};border-radius:14px;overflow:hidden;background:${isDark?'#0A0A0A':'#fff'}}
          .um-table td{text-align:right;padding-left:45%!important;position:relative;border-bottom:1px solid ${isDark?'rgba(255,255,255,.05)':'rgba(0,0,0,.04)'}!important}
          .um-table td:last-child{border-bottom:none!important}
          .um-table td::before{content:attr(data-label);position:absolute;left:14px;width:40%;text-align:left;font-weight:700;font-size:11px;color:${isDark?'#666':'#999'};text-transform:uppercase;top:50%;transform:translateY(-50%)}
        }
      `}</style>

      <div style={{ fontFamily:"'Inter',sans-serif", color:c.txt }}>

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div>
            <h2 style={{ margin:'0 0 4px', fontSize:20, fontWeight:800, letterSpacing:'-0.5px' }}>User Management</h2>
            <p style={{ margin:0, fontSize:13, color:c.muted }}>Manage roles and access across all accounts.</p>
          </div>
          <button onClick={fetchUsers} disabled={loading} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:10, border:`1px solid ${c.border}`, background:c.card, color:c.txt, fontWeight:700, fontSize:13, cursor:'pointer' }}>
            <FiRefreshCw size={14} style={{ animation:loading?'spin 1s linear infinite':'none' }}/> Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:14, padding:isMobile?'12px':'16px' }}>
              <div style={{ fontSize:10, color:c.muted, textTransform:'uppercase', letterSpacing:'.06em', fontWeight:700, marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:isMobile?18:22, fontWeight:800, color:s.color }}>{loading?'…':s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{ padding:'12px 16px', background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)', borderRadius:12, marginBottom:16, fontSize:13, color:c.red }}>
            {error}
          </div>
        )}

        {/* ── Controls ── */}
        <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
          {/* Filter pills */}
          <div style={{ display:'flex', gap:4, background:isDark?'#0A0A0A':'#f1f1f4', padding:4, borderRadius:12 }}>
            {['all','admin','user'].map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{ padding:'7px 14px', borderRadius:9, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', background:filter===t?(isDark?'#fff':'#000'):'transparent', color:filter===t?(isDark?'#000':'#fff'):c.muted, textTransform:'capitalize', transition:'all .2s' }}>
                {t==='all'?`All (${users.length})`:t==='admin'?`Admins (${users.filter(u=>u.role==='admin').length})`:`Users (${users.filter(u=>u.role!=='admin').length})`}
              </button>
            ))}
          </div>
          {/* Search */}
          <div style={{ position:'relative', flex:1, minWidth:isMobile?'100%':200 }}>
            <FiSearch style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:c.muted, pointerEvents:'none' }} size={14} />
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search by email…"
              style={{ width:'100%', padding:'9px 12px 9px 34px', borderRadius:10, border:`1px solid ${isDark?'#222':'#e2e8f0'}`, background:isDark?'#0A0A0A':'#fff', color:c.txt, fontSize:13, outline:'none', boxSizing:'border-box' }} />
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:16, overflow:'hidden' }}>
          {loading ? (
            <div style={{ padding:'60px 20px', textAlign:'center', color:c.muted }}>
              <div style={{ width:32, height:32, border:`3px solid ${c.green}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 12px' }} />
              Loading users…
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding:'60px 20px', textAlign:'center' }}>
              <FiUsers size={38} color="#444" style={{ marginBottom:12 }} />
              <p style={{ fontWeight:700, color:c.txt, margin:'0 0 4px' }}>No users found</p>
              <p style={{ color:c.muted, fontSize:13, margin:0 }}>Try adjusting your filters.</p>
            </div>
          ) : (
            <table className="um-table" style={{ width:'100%', borderCollapse:'separate', borderSpacing:'0 0' }}>
              <thead>
                <tr style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'.06em', color:c.muted }}>
                  <th style={{ padding:'12px 16px', fontWeight:700, textAlign:'left', width:40 }}>
                    <button onClick={toggleSelectAll} style={{ background:'none', border:'none', cursor:'pointer', color:c.green, fontSize:18, lineHeight:1, display:'flex' }}>
                      {selectedUsers.length===filteredUsers.length&&filteredUsers.length>0 ? <FiCheckSquare/> : <FiSquare color={c.muted}/>}
                    </button>
                  </th>
                  <th style={{ padding:'12px 16px', fontWeight:700, textAlign:'left' }}>User</th>
                  <th style={{ padding:'12px 16px', fontWeight:700, textAlign:'left' }}>Role</th>
                  <th className="um-hide-m" style={{ padding:'12px 16px', fontWeight:700, textAlign:'left' }}>Joined</th>
                  <th style={{ padding:'12px 16px', fontWeight:700, textAlign:'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => {
                  const sel = selectedUsers.includes(user.uid);
                  const isAdmin = user.role === 'admin';
                  return (
                    <tr key={user.uid} className="um-row" style={{ background:sel?(isDark?'rgba(139,92,246,.06)':'rgba(139,92,246,.03)'):'transparent' }}>
                      <td style={{ padding:'14px 16px', borderBottom:i<filteredUsers.length-1?`1px solid ${c.border}`:'none' }} data-label="Select">
                        <button onClick={() => toggleSelect(user.uid)} style={{ background:'none', border:'none', cursor:'pointer', color:sel?c.green:c.muted, fontSize:18, lineHeight:1, display:'flex' }}>
                          {sel ? <FiCheckSquare/> : <FiSquare/>}
                        </button>
                      </td>
                      <td style={{ padding:'14px 16px', borderBottom:i<filteredUsers.length-1?`1px solid ${c.border}`:'none' }} data-label="User">
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:'50%', background:isAdmin?'rgba(139,92,246,.15)':'rgba(16,185,129,.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            {isAdmin ? <FiShield size={14} color={c.violet}/> : <FiUser size={14} color={c.green}/>}
                          </div>
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontWeight:700, fontSize:13, color:c.txt, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</div>
                            <div style={{ fontSize:11, color:c.muted, fontFamily:'monospace' }}>{(user.uid||'').substring(0,12)}…</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'14px 16px', borderBottom:i<filteredUsers.length-1?`1px solid ${c.border}`:'none' }} data-label="Role">
                        <span style={{ padding:'3px 10px', borderRadius:100, fontSize:11, fontWeight:800, textTransform:'uppercase', background:isAdmin?'rgba(139,92,246,.12)':'rgba(16,185,129,.1)', color:isAdmin?c.violet:c.green, display:'inline-flex', alignItems:'center', gap:5 }}>
                          {isAdmin ? <FiShield size={11}/> : <FiUser size={11}/>} {user.role||'user'}
                        </span>
                      </td>
                      <td className="um-hide-m" style={{ padding:'14px 16px', borderBottom:i<filteredUsers.length-1?`1px solid ${c.border}`:'none', fontSize:12, color:c.muted }} data-label="Joined">
                        {fmtDate(user.createdAt)}
                      </td>
                      <td style={{ padding:'14px 16px', borderBottom:i<filteredUsers.length-1?`1px solid ${c.border}`:'none' }} data-label="Actions">
                        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                          <button onClick={() => handleSetRole(user.uid, user.email, user.role)} title={isAdmin?'Demote to User':'Promote to Admin'}
                            style={{ width:32, height:32, borderRadius:9, border:`1px solid ${c.border}`, background:c.card2, color:c.txt, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <FiEdit2 size={13}/>
                          </button>
                          <button onClick={() => setConfirmDel({ uids:[user.uid], label:`${user.email}'s account` })} title="Delete"
                            style={{ width:32, height:32, borderRadius:9, border:'1px solid rgba(239,68,68,.25)', background:'rgba(239,68,68,.06)', color:c.red, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <FiTrash2 size={13}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p style={{ textAlign:'center', color:isDark?'#555':'#aaa', fontSize:12, marginTop:12 }}>
          {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* ── Batch action bar ── */}
      <div className="um-batch" style={{ position:'fixed', bottom:80, left:'50%', transform:'translateX(-50%)', background:isDark?'rgba(255,255,255,.96)':'rgba(0,0,0,.93)', color:isDark?'#000':'#fff', padding:'12px 20px', borderRadius:100, display:'flex', alignItems:'center', gap:16, boxShadow:'0 20px 40px rgba(0,0,0,.3)', zIndex:1000, transition:'all .4s cubic-bezier(.17,.67,.35,1.2)', maxWidth:'90vw' }}>
        <span style={{ fontWeight:800, fontSize:13, whiteSpace:'nowrap' }}>{selectedUsers.length} selected</span>
        <div style={{ width:1, height:20, background:isDark?'rgba(0,0,0,.15)':'rgba(255,255,255,.2)' }} />
        <button onClick={() => setConfirmDel({ uids:selectedUsers, label:`${selectedUsers.length} accounts` })} disabled={isDeleting}
          style={{ background:c.red, color:'#fff', border:'none', padding:'7px 16px', borderRadius:50, fontWeight:800, fontSize:12, cursor:isDeleting?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap', opacity:isDeleting?.6:1 }}>
          <FiTrash2 size={13}/> {isDeleting?'Deleting…':'Delete All'}
        </button>
        <button onClick={() => setSelectedUsers([])} style={{ background:'none', border:'none', color:isDark?'rgba(0,0,0,.5)':'rgba(255,255,255,.5)', cursor:'pointer', display:'flex', padding:4 }}>
          <FiX size={18}/>
        </button>
      </div>

      {/* ── Delete confirm modal ── */}
      {confirmDel && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => setConfirmDel(null)}>
          <div style={{ background:isDark?'#111':'#fff', border:`1px solid ${c.border}`, borderRadius:20, padding:28, maxWidth:380, width:'100%', textAlign:'center' }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <FiTrash2 color={c.red} size={20}/>
            </div>
            <h3 style={{ margin:'0 0 8px', color:c.txt, fontWeight:800 }}>Delete Account?</h3>
            <p style={{ margin:'0 0 24px', color:c.muted, fontSize:14, lineHeight:1.6 }}>
              Permanently remove <strong style={{ color:c.txt }}>{confirmDel.label}</strong>. This cannot be undone.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <button onClick={() => setConfirmDel(null)} style={{ padding:'11px', borderRadius:10, border:`1px solid ${c.border}`, background:'transparent', color:c.txt, fontWeight:700, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>Cancel</button>
              <button onClick={() => executeDelete(confirmDel.uids)} style={{ padding:'11px', borderRadius:10, border:'none', background:c.red, color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserManagement;
