import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import {
  FiCheck, FiClock, FiX, FiLink, FiCopy, FiShare2,
  FiAlertTriangle, FiUser, FiMail, FiPhone, FiArrowRight,
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useModal } from '../context/ModalContext';

const PLATFORMS = ['Instagram','X / Twitter','TikTok','YouTube','Telegram','WhatsApp','Blog / Website','Other'];

const STATUS_META = {
  pending:   { label:'Under Review',  color:'#F59E0B', bg:'rgba(245,158,11,.08)',  bdr:'rgba(245,158,11,.2)',  Icon: FiClock,          msg:'Your application is in the queue. Our team reviews all requests within 2–3 business days.' },
  contacted: { label:'In Discussion', color:'#3B82F6', bg:'rgba(59,130,246,.08)',  bdr:'rgba(59,130,246,.2)',  Icon: FiMail,           msg:'Our partnerships team has reached out. Please check your email inbox and spam folder.' },
  approved:  { label:'Approved',      color:'#10B981', bg:'rgba(16,185,129,.08)',  bdr:'rgba(16,185,129,.2)',  Icon: FiCheck,          msg:"You're an official SmartFarmer Affiliate! Your unique referral link is active below." },
  rejected:  { label:'Not Approved',  color:'#EF4444', bg:'rgba(239,68,68,.08)',   bdr:'rgba(239,68,68,.2)',   Icon: FiAlertTriangle,  msg:"Unfortunately your application wasn't approved this time. You may re-apply after 30 days." },
};

export default function AffiliateStatus({ userData }) {
  const [app, setApp]           = useState(undefined);  // undefined=loading, null=none, obj=found
  const [form, setForm]         = useState({ name:'', email:'', phone:'', platform:'', message:'' });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied]     = useState(false);
  const [shareErr, setShareErr] = useState('');

  const { theme }     = useTheme();
  const { showModal } = useModal();
  const isDark        = theme === 'dark';
  const currentUser   = auth.currentUser;

  /* ── colour tokens ── */
  const c = {
    txt:    isDark ? '#fff'                  : '#111',
    muted:  isDark ? '#888'                  : '#666',
    border: isDark ? 'rgba(255,255,255,.1)'  : 'rgba(0,0,0,.08)',
    card:   isDark ? '#111'                  : '#fff',
    inpBg:  isDark ? '#0A0A0A'              : '#F9FAFB',
    green:  '#10B981',
  };

  const fieldStyle = {
    width:'100%', padding:'12px 14px 12px 38px', borderRadius:10,
    border:`1px solid ${c.border}`, background:c.inpBg, color:c.txt,
    fontSize:15, outline:'none', transition:'border-color .2s',
    boxSizing:'border-box', fontFamily:"'Inter',sans-serif",
  };
  const labelStyle = {
    display:'block', fontSize:11, fontWeight:700, color:c.muted,
    textTransform:'uppercase', letterSpacing:'.06em', marginBottom:7,
  };

  /* ── Pre-fill form from user data ── */
  useEffect(() => {
    if (userData || currentUser) {
      setForm(f => ({
        ...f,
        // Support both username (new) and firstName/lastName (legacy)
        name: userData?.username
          ? userData.username
          : userData?.firstName
          ? `${userData.firstName} ${userData.lastName || ''}`.trim()
          : f.name,
        email: currentUser?.email  || f.email,
        phone: userData?.phone     || f.phone,
      }));
    }
  }, [userData, currentUser]);

  /* ── Fetch existing application ── */
  useEffect(() => {
    const fetch_ = async () => {
      if (!currentUser) { setApp(null); return; }
      try {
        // First match by userId (set when applying from settings)
        let snap = await getDocs(query(
          collection(db, 'affiliate_applications'),
          where('userId', '==', currentUser.uid)
        ));
        // Fallback: match by email (catches landing-page submissions)
        if (snap.empty) {
          snap = await getDocs(query(
            collection(db, 'affiliate_applications'),
            where('email', '==', currentUser.email)
          ));
        }
        setApp(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
      } catch (e) {
        console.error(e);
        setApp(null);
      }
    };
    fetch_();
  }, [currentUser]);

  /* ── Submit new application ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShareErr('');

    // Guard: must be authenticated
    if (!currentUser) {
      setShareErr('You must be logged in to apply. Please refresh and try again.');
      return;
    }

    setSubmitting(true);
    try {
      const ref = await addDoc(collection(db, 'affiliate_applications'), {
        ...form,
        userId:    currentUser.uid,
        createdAt: new Date(),
        status:    'pending',
      });
      setApp({ id: ref.id, ...form, userId: currentUser.uid, status:'pending', createdAt: new Date() });
      showModal('Application submitted! We\'ll review it within 2–3 business days.');
    } catch (err) {
      console.error('Affiliate submit error:', err.code, err.message);
      // Translate Firebase error codes into user-friendly messages
      let msg = 'Submission failed — please try again.';
      if (err.code === 'permission-denied') {
        msg = 'Permission denied. Please log out, log back in, and try again.';
      } else if (err.code === 'unavailable' || err.code === 'network-request-failed') {
        msg = 'Network error — check your connection and try again.';
      } else if (err.message) {
        msg = `Submission failed: ${err.message}`;
      }
      setShareErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const referralLink = userData?.referralCode
    ? `https://smartfarmer.ng/signup?ref=${userData.referralCode}`
    : '';

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showModal('Referral link copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share && referralLink) {
      try {
        await navigator.share({ title:'Join SmartFarmer!', text:"Sign up using my affiliate link 🌱", url: referralLink });
      } catch { handleCopy(); }
    } else { handleCopy(); }
  };

  /* ── Loading ── */
  if (app === undefined) return (
    <div style={{ padding:'40px 0', textAlign:'center', color:c.muted, fontSize:14 }}>Loading…</div>
  );

  /* ── Status view (app found) ── */
  if (app !== null) {
    const status = app.status || 'pending';
    const meta   = STATUS_META[status] || STATUS_META.pending;
    const { Icon } = meta;

    return (
      <div style={{ fontFamily:"'Inter',sans-serif" }}>
        {/* Header */}
        <div style={{ marginBottom:24 }}>
          <h2 style={{ margin:'0 0 5px', fontSize:20, fontWeight:800, color:c.txt, letterSpacing:'-0.5px' }}>Affiliate Program</h2>
          <p style={{ margin:0, color:c.muted, fontSize:13 }}>Your application status and partner tools.</p>
        </div>

        {/* Status banner */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'18px 20px', background:meta.bg, border:`1px solid ${meta.bdr}`, borderRadius:16, marginBottom:24 }}>
          <div style={{ width:40, height:40, borderRadius:11, background:meta.bg, border:`1px solid ${meta.bdr}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Icon size={18} color={meta.color} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:15, color:meta.color, marginBottom:4 }}>{meta.label}</div>
            <p style={{ margin:0, fontSize:13, color:c.txt, lineHeight:1.6 }}>{meta.msg}</p>
          </div>
        </div>

        {/* Approved state — show referral link + stats */}
        {status === 'approved' && (
          <>
            <div style={{ background:isDark?'rgba(16,185,129,.06)':'rgba(16,185,129,.04)', border:`1px solid rgba(16,185,129,.18)`, borderRadius:16, padding:'20px', marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:12 }}>
                <FiLink color={c.green} size={15} />
                <span style={{ fontWeight:700, fontSize:14, color:c.txt }}>Your Affiliate Link</span>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <input
                  readOnly
                  value={referralLink || 'Loading…'}
                  style={{ flex:1, minWidth:0, padding:'11px 13px', borderRadius:10, border:`1px solid rgba(16,185,129,.2)`, background:c.inpBg, color:c.green, fontSize:13, fontFamily:'monospace', fontWeight:600, outline:'none', boxSizing:'border-box' }}
                />
                <button onClick={handleCopy} style={{ padding:'11px 16px', borderRadius:10, border:`1px solid ${c.border}`, background:c.card, color:copied?c.green:c.txt, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontWeight:700, fontSize:13, transition:'all .2s', whiteSpace:'nowrap' }}>
                  {copied ? <FiCheck size={14}/> : <FiCopy size={14}/>} {copied?'Copied!':'Copy'}
                </button>
                <button onClick={handleShare} style={{ padding:'11px 16px', borderRadius:10, border:'none', background:c.green, color:'#000', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontWeight:700, fontSize:13, whiteSpace:'nowrap' }}>
                  <FiShare2 size={14}/> Share
                </button>
              </div>
              <p style={{ margin:'10px 0 0', color:c.muted, fontSize:12, lineHeight:1.55 }}>
                Anyone who opens this link lands on the signup page with your referral code pre-filled.
              </p>
            </div>

            {/* Quick stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
              {[
                { label:'Commission Rate', value:'5%',     color:c.green  },
                { label:'Your Code',       value:userData?.referralCode||'—', color:c.green },
                { label:'Payout',          value:'Monthly', color:c.txt   },
              ].map(s => (
                <div key={s.label} style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:14, padding:'14px 16px' }}>
                  <div style={{ fontSize:10, color:c.muted, textTransform:'uppercase', letterSpacing:'.06em', fontWeight:700, marginBottom:5 }}>{s.label}</div>
                  <div style={{ fontSize:18, fontWeight:800, color:s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:14, padding:'18px 20px' }}>
              <div style={{ fontWeight:700, fontSize:14, color:c.txt, marginBottom:12 }}>How to maximise earnings</div>
              <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:9 }}>
                {[
                  'Share your link on all social channels — Instagram stories work best.',
                  'Post educational content about agricultural investing to build trust.',
                  'Join our affiliate Telegram group for marketing materials and tips.',
                  'Reach out to savings groups, cooperatives, and WhatsApp communities.',
                ].map((tip, i) => (
                  <li key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <FiArrowRight color={c.green} size={13} style={{ flexShrink:0, marginTop:2 }} />
                    <span style={{ fontSize:13, color:c.muted, lineHeight:1.55 }}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Application details card */}
        <div style={{ background:c.card, border:`1px solid ${c.border}`, borderRadius:14, padding:'18px 20px', marginTop:20 }}>
          <div style={{ fontWeight:700, fontSize:13, color:c.txt, marginBottom:12 }}>Application Details</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Name',     value:app.name     || '—' },
              { label:'Email',    value:app.email    || '—' },
              { label:'Phone',    value:app.phone    || '—' },
              { label:'Platform', value:app.platform || '—' },
              { label:'Applied',  value:app.createdAt?.seconds ? new Date(app.createdAt.seconds*1000).toLocaleDateString('en-NG',{day:'2-digit',month:'short',year:'numeric'}) : 'Today' },
              { label:'Status',   value:meta.label, valueColor:meta.color },
            ].map(row => (
              <div key={row.label}>
                <div style={{ fontSize:11, fontWeight:700, color:c.muted, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:3 }}>{row.label}</div>
                <div style={{ fontSize:13, color:row.valueColor||c.txt, fontWeight:600 }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rejected: re-apply note */}
        {status === 'rejected' && (
          <p style={{ marginTop:16, fontSize:12, color:c.muted, textAlign:'center' }}>
            To re-apply, please contact us at{' '}
            <a href="mailto:partners@smartfarmer.ng" style={{ color:c.green, textDecoration:'none' }}>partners@smartfarmer.ng</a>
          </p>
        )}
      </div>
    );
  }

  /* ── Application form (no existing app) ── */
  return (
    <div style={{ fontFamily:"'Inter',sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ margin:'0 0 5px', fontSize:20, fontWeight:800, color:c.txt, letterSpacing:'-0.5px' }}>Affiliate Program</h2>
        <p style={{ margin:0, color:c.muted, fontSize:13 }}>Apply to become a SmartFarmer partner and earn commission on every referral.</p>
      </div>

      {/* Perks strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:24 }}>
        {[
          { icon:'💰', label:'5% commission per referred investment' },
          { icon:'📊', label:'Real-time dashboard & tracking link'   },
          { icon:'⚡', label:'Monthly bank payouts, no delays'        },
          { icon:'🎯', label:'Free branded marketing kit'            },
        ].map((p, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:c.card, border:`1px solid ${c.border}`, borderRadius:12 }}>
            <span style={{ fontSize:18 }}>{p.icon}</span>
            <span style={{ fontSize:13, color:c.txt, fontWeight:600 }}>{p.label}</span>
          </div>
        ))}
      </div>

      {shareErr && (
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 14px', background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)', borderRadius:10, marginBottom:16 }}>
          <FiAlertTriangle color="#EF4444" size={14} />
          <span style={{ fontSize:13, color:'#EF4444' }}>{shareErr}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom:16 }}>
          <label style={labelStyle}>Full Name *</label>
          <div style={{ position:'relative' }}>
            <FiUser style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:c.muted, pointerEvents:'none' }} />
            <input style={fieldStyle} required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your full name"
              onFocus={e=>e.target.style.borderColor=c.green} onBlur={e=>e.target.style.borderColor=c.border} />
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom:16 }}>
          <label style={labelStyle}>Email Address *</label>
          <div style={{ position:'relative' }}>
            <FiMail style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:c.muted, pointerEvents:'none' }} />
            <input style={{ ...fieldStyle, opacity:.7, cursor:'not-allowed' }} readOnly value={form.email} />
          </div>
          <p style={{ margin:'4px 0 0', fontSize:11, color:c.muted }}>Your account email is used for correspondence.</p>
        </div>

        {/* Phone + Platform */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          <div>
            <label style={labelStyle}>Phone</label>
            <div style={{ position:'relative' }}>
              <FiPhone style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:c.muted, pointerEvents:'none' }} />
              <input style={fieldStyle} type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+234 000 0000"
                onFocus={e=>e.target.style.borderColor=c.green} onBlur={e=>e.target.style.borderColor=c.border} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Main Platform</label>
            <select
              style={{ ...fieldStyle, appearance:'none', WebkitAppearance:'none', paddingLeft:14,
                backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center' }}
              value={form.platform} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}
              onFocus={e=>e.target.style.borderColor=c.green} onBlur={e=>e.target.style.borderColor=c.border}
            >
              <option value="">Select…</option>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Message */}
        <div style={{ marginBottom:24 }}>
          <label style={labelStyle}>How will you promote SmartFarmer?</label>
          <textarea
            style={{ ...fieldStyle, paddingLeft:14, resize:'vertical', minHeight:88 }}
            rows={3}
            value={form.message}
            onChange={e=>setForm(f=>({...f,message:e.target.value}))}
            placeholder="Tell us about your audience and your strategy…"
            onFocus={e=>e.target.style.borderColor=c.green} onBlur={e=>e.target.style.borderColor=c.border}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width:'100%', padding:'14px', borderRadius:12, border:'none',
            background: isDark?'#fff':'#000',
            color: isDark?'#000':'#fff',
            fontWeight:700, fontSize:15, cursor:submitting?'not-allowed':'pointer',
            opacity:submitting?.7:1, transition:'all .2s',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            fontFamily:"'Inter',sans-serif",
          }}
        >
          {submitting ? 'Submitting…' : 'Submit Application →'}
        </button>
        <p style={{ textAlign:'center', marginTop:10, fontSize:12, color:c.muted }}>
          Questions? Email{' '}
          <a href="mailto:partners@smartfarmer.ng" style={{ color:c.green, textDecoration:'none' }}>partners@smartfarmer.ng</a>
        </p>
      </form>
    </div>
  );
}
