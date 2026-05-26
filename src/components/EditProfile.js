import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FiUser, FiPhone, FiMail, FiCheck } from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

export default function EditProfile({ refreshUserData }) {
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '', username: '' });
  const [loading, setLoading]  = useState(true);
  const [saving, setSaving]    = useState(false);
  const [saved, setSaved]      = useState(false);

  const { showModal } = useModal();
  const { theme }     = useTheme();
  const isDark        = theme === 'dark';
  const currentUser   = auth.currentUser;

  useEffect(() => {
    const fetch_ = async () => {
      if (!currentUser) return;
      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      if (snap.exists()) setProfile(prev => ({ ...prev, ...snap.data() }));
      setLoading(false);
    };
    fetch_();
  }, [currentUser]);

  const handleChange = e => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        firstName: profile.firstName || '',
        lastName:  profile.lastName  || '',
        phone:     profile.phone     || '',
        username:  profile.username  || '',
      });
      await refreshUserData?.();
      setSaved(true);
      showModal('Profile updated successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      showModal('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── tokens ── */
  const txt    = isDark ? '#fff'                  : '#111';
  const muted  = isDark ? '#888'                  : '#666';
  const border = isDark ? 'rgba(255,255,255,.1)'  : 'rgba(0,0,0,.1)';
  const inpBg  = isDark ? '#0A0A0A'              : '#F9FAFB';
  const green  = '#10B981';

  const fieldStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: `1px solid ${border}`, background: inpBg, color: txt,
    fontSize: 15, outline: 'none', transition: 'border-color .2s', boxSizing: 'border-box',
    fontFamily: "'Inter',sans-serif",
  };
  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700, color: muted,
    textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 7,
  };

  if (loading) return (
    <div style={{ padding: '40px 0', textAlign: 'center', color: muted, fontSize: 14 }}>Loading profile…</div>
  );

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 5px', fontSize: 20, fontWeight: 800, color: txt, letterSpacing: '-0.5px' }}>Edit Profile</h2>
        <p style={{ margin: 0, color: muted, fontSize: 13 }}>Update your personal information.</p>
      </div>

      {/* Avatar block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, padding: '16px', background: isDark ? '#111' : '#F9FAFB', borderRadius: 14, border: `1px solid ${border}` }}>
        <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'linear-gradient(135deg,#10B981,#047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#000' }}>
            {(profile.firstName?.[0] || profile.email?.[0] || '?').toUpperCase()}
          </span>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: txt, fontSize: 15 }}>{currentUser?.email}</div>
          <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>Verified account</div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>First Name</label>
            <input style={fieldStyle} name="firstName" value={profile.firstName || ''} onChange={handleChange} placeholder="First name"
              onFocus={e => e.target.style.borderColor = green}
              onBlur={e  => e.target.style.borderColor = border}
            />
          </div>
          <div>
            <label style={labelStyle}>Last Name</label>
            <input style={fieldStyle} name="lastName" value={profile.lastName || ''} onChange={handleChange} placeholder="Last name"
              onFocus={e => e.target.style.borderColor = green}
              onBlur={e  => e.target.style.borderColor = border}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Username</label>
          <div style={{ position: 'relative' }}>
            <FiUser style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: muted }} />
            <input style={{ ...fieldStyle, paddingLeft: 38 }} name="username" value={profile.username || ''} onChange={handleChange} placeholder="your_username"
              onFocus={e => e.target.style.borderColor = green}
              onBlur={e  => e.target.style.borderColor = border}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <FiMail style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: muted }} />
            <input style={{ ...fieldStyle, paddingLeft: 38, opacity: .6, cursor: 'not-allowed' }} value={currentUser?.email || ''} readOnly />
          </div>
          <p style={{ margin: '5px 0 0', fontSize: 11, color: muted }}>Email cannot be changed here. Contact support.</p>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Phone Number</label>
          <div style={{ position: 'relative' }}>
            <FiPhone style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: muted }} />
            <input style={{ ...fieldStyle, paddingLeft: 38 }} name="phone" type="tel" value={profile.phone || ''} onChange={handleChange} placeholder="+234 000 000 0000"
              onFocus={e => e.target.style.borderColor = green}
              onBlur={e  => e.target.style.borderColor = border}
            />
          </div>
        </div>

        <button type="submit" disabled={saving} style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: saved ? green : (isDark ? '#fff' : '#000'),
          color: saved ? '#000' : (isDark ? '#000' : '#fff'),
          fontWeight: 700, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? .7 : 1, transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: "'Inter',sans-serif",
        }}>
          {saved ? <><FiCheck /> Saved!</> : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
