import React, { useState } from 'react';
import { auth } from '../firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiShield, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

function SecuritySettings() {
  const [form, setForm]           = useState({ current: '', next: '', confirm: '' });
  const [show, setShow]           = useState({ current: false, next: false, confirm: false });
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState('');

  const { theme } = useTheme();
  const isDark    = theme === 'dark';

  /* ── colour tokens ── */
  const txt    = isDark ? '#fff'                 : '#111';
  const muted  = isDark ? '#888'                 : '#666';
  const border = isDark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)';
  const inpBg  = isDark ? '#0A0A0A'              : '#F9FAFB';
  const cardBg = isDark ? '#111'                 : '#fff';
  const green  = '#10B981';
  const red    = '#EF4444';

  const fieldStyle = {
    width: '100%', padding: '12px 14px 12px 38px', borderRadius: 10,
    border: `1px solid ${border}`, background: inpBg, color: txt,
    fontSize: 15, outline: 'none', transition: 'border-color .2s',
    boxSizing: 'border-box', fontFamily: "'Inter',sans-serif",
  };
  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700, color: muted,
    textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 7,
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const toggle = key => setShow(s => ({ ...s, [key]: !s[key] }));

  /* password-strength meter */
  const strength = (() => {
    const p = form.next;
    if (!p) return { score: 0, label: '', color: '' };
    let s = 0;
    if (p.length >= 8)  s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    const map = [
      { label: 'Very Weak', color: '#EF4444' },
      { label: 'Weak',      color: '#F59E0B' },
      { label: 'Fair',      color: '#FBBF24' },
      { label: 'Strong',    color: green },
      { label: 'Very Strong', color: '#059669' },
    ];
    return { score: s, ...map[s] };
  })();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.next !== form.confirm) { setError('New passwords do not match.'); return; }
    if (form.next.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setSaving(true);
    try {
      const user       = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, form.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, form.next);
      setSaved(true);
      setForm({ current: '', next: '', confirm: '' });
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Current password is incorrect.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const PasswordField = ({ name, label, placeholder }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <FiLock style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: muted, pointerEvents: 'none' }} />
        <input
          type={show[name] ? 'text' : 'password'}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          required
          style={fieldStyle}
          onFocus={e  => e.target.style.borderColor = green}
          onBlur={e   => e.target.style.borderColor = border}
        />
        <button
          type="button"
          onClick={() => toggle(name)}
          style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: muted, cursor: 'pointer', padding: 0, display: 'flex' }}
        >
          {show[name] ? <FiEyeOff size={15} /> : <FiEye size={15} />}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      {/* header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 5px', fontSize: 20, fontWeight: 800, color: txt, letterSpacing: '-0.5px' }}>Security</h2>
        <p style={{ margin: 0, color: muted, fontSize: 13 }}>Manage your password and account security.</p>
      </div>

      {/* info banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px', background: isDark ? 'rgba(16,185,129,.07)' : 'rgba(16,185,129,.06)', border: `1px solid rgba(16,185,129,.18)`, borderRadius: 12, marginBottom: 24 }}>
        <FiShield color={green} size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 13, color: txt, lineHeight: 1.6 }}>
          Use a strong password you don't reuse anywhere else. Minimum 8 characters with numbers and symbols recommended.
        </p>
      </div>

      {/* error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'rgba(239,68,68,.08)', border: `1px solid rgba(239,68,68,.2)`, borderRadius: 10, marginBottom: 20 }}>
          <FiAlertTriangle color={red} size={14} />
          <span style={{ fontSize: 13, color: red }}>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <PasswordField name="current" label="Current Password" placeholder="Enter your current password" />
        <PasswordField name="next"    label="New Password"     placeholder="Enter a new password" />

        {/* strength meter */}
        {form.next && (
          <div style={{ marginTop: -8, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < strength.score ? strength.color : (isDark ? '#222' : '#e5e7eb'), transition: 'background .3s' }} />
              ))}
            </div>
            {strength.label && <span style={{ fontSize: 11, color: strength.color, fontWeight: 700 }}>{strength.label}</span>}
          </div>
        )}

        <PasswordField name="confirm" label="Confirm New Password" placeholder="Re-enter the new password" />

        <button
          type="submit"
          disabled={saving}
          style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: saved ? green : (isDark ? '#fff' : '#000'),
            color: saved ? '#000' : (isDark ? '#000' : '#fff'),
            fontWeight: 700, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? .7 : 1, transition: 'all .2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginTop: 8, fontFamily: "'Inter',sans-serif",
          }}
        >
          {saved ? <><FiCheck /> Password Updated!</> : saving ? 'Updating…' : 'Update Password'}
        </button>
      </form>

      {/* divider */}
      <div style={{ borderTop: `1px solid ${border}`, margin: '28px 0' }} />

      {/* sessions / tips card */}
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '18px 20px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: txt }}>Security Tips</h3>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            'Never share your password with anyone.',
            'Use a unique password not used on other sites.',
            'Enable two-factor authentication where possible.',
            'Log out from shared or public devices.',
          ].map((tip, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <FiCheck color={green} size={13} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 13, color: muted, lineHeight: 1.55 }}>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SecuritySettings;
