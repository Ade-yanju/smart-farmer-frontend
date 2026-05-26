import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FiCreditCard, FiUser, FiHash, FiCheck, FiShield } from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

const NIGERIAN_BANKS = [
  'Access Bank', 'Citibank Nigeria', 'Ecobank Nigeria', 'Fidelity Bank',
  'First Bank of Nigeria', 'First City Monument Bank (FCMB)', 'Globus Bank',
  'GT Bank', 'Heritage Bank', 'Jaiz Bank', 'Keystone Bank', 'Kuda Bank',
  'Opay', 'Palmpay', 'Polaris Bank', 'Providus Bank', 'Stanbic IBTC Bank',
  'Standard Chartered Bank', 'Sterling Bank', 'SunTrust Bank', 'Titan Trust Bank',
  'UBA (United Bank for Africa)', 'Union Bank of Nigeria', 'Unity Bank',
  'VFD Microfinance Bank', 'Wema Bank', 'Zenith Bank', 'Other',
];

function WithdrawalSettings() {
  const [settings, setSettings] = useState({ bankName: '', accountNumber: '', accountName: '' });
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(true);

  const { showModal }  = useModal();
  const { theme }      = useTheme();
  const isDark         = theme === 'dark';
  const currentUser    = auth.currentUser;

  /* ── colour tokens ── */
  const txt    = isDark ? '#fff'                 : '#111';
  const muted  = isDark ? '#888'                 : '#666';
  const border = isDark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)';
  const inpBg  = isDark ? '#0A0A0A'              : '#F9FAFB';
  const green  = '#10B981';

  const fieldStyle = {
    width: '100%', padding: '12px 14px 12px 38px', borderRadius: 10,
    border: `1px solid ${border}`, background: inpBg, color: txt,
    fontSize: 15, outline: 'none', transition: 'border-color .2s',
    boxSizing: 'border-box', fontFamily: "'Inter',sans-serif",
  };
  const selectStyle = {
    ...fieldStyle,
    paddingLeft: 38, appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
  };
  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700, color: muted,
    textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 7,
  };

  useEffect(() => {
    const fetch_ = async () => {
      if (!currentUser) { setLoading(false); return; }
      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      if (snap.exists() && snap.data().withdrawalSettings) {
        setSettings(snap.data().withdrawalSettings);
      }
      setLoading(false);
    };
    fetch_();
  }, [currentUser]);

  const handleChange = e => setSettings(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { withdrawalSettings: settings });
      setSaved(true);
      showModal('Withdrawal settings saved successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      showModal('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ padding: '40px 0', textAlign: 'center', color: muted, fontSize: 14 }}>Loading…</div>
  );

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      {/* header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 5px', fontSize: 20, fontWeight: 800, color: txt, letterSpacing: '-0.5px' }}>Withdrawal Settings</h2>
        <p style={{ margin: 0, color: muted, fontSize: 13 }}>Set your bank account for receiving withdrawals.</p>
      </div>

      {/* security note */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px', background: isDark ? 'rgba(16,185,129,.07)' : 'rgba(16,185,129,.06)', border: `1px solid rgba(16,185,129,.18)`, borderRadius: 12, marginBottom: 24 }}>
        <FiShield color={green} size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 13, color: txt, lineHeight: 1.6 }}>
          Your bank details are encrypted and only used to process your approved withdrawal requests.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Bank Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Bank Name</label>
          <div style={{ position: 'relative' }}>
            <FiCreditCard style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: muted, pointerEvents: 'none' }} />
            <select
              name="bankName"
              value={settings.bankName}
              onChange={handleChange}
              required
              style={selectStyle}
              onFocus={e => e.target.style.borderColor = green}
              onBlur={e  => e.target.style.borderColor = border}
            >
              <option value="">Select your bank…</option>
              {NIGERIAN_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Account Number */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Account Number</label>
          <div style={{ position: 'relative' }}>
            <FiHash style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: muted, pointerEvents: 'none' }} />
            <input
              style={fieldStyle}
              name="accountNumber"
              value={settings.accountNumber}
              onChange={handleChange}
              placeholder="10-digit NUBAN number"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              required
              onFocus={e => e.target.style.borderColor = green}
              onBlur={e  => e.target.style.borderColor = border}
            />
          </div>
          <p style={{ margin: '5px 0 0', fontSize: 11, color: muted }}>Nigerian 10-digit NUBAN account number.</p>
        </div>

        {/* Account Name */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Account Holder Name</label>
          <div style={{ position: 'relative' }}>
            <FiUser style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: muted, pointerEvents: 'none' }} />
            <input
              style={fieldStyle}
              name="accountName"
              value={settings.accountName}
              onChange={handleChange}
              placeholder="Name exactly as on bank records"
              required
              onFocus={e => e.target.style.borderColor = green}
              onBlur={e  => e.target.style.borderColor = border}
            />
          </div>
          <p style={{ margin: '5px 0 0', fontSize: 11, color: muted }}>Must match the name registered on your bank account.</p>
        </div>

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
            fontFamily: "'Inter',sans-serif",
          }}
        >
          {saved ? <><FiCheck /> Saved!</> : saving ? 'Saving…' : 'Save Bank Details'}
        </button>
      </form>
    </div>
  );
}

export default WithdrawalSettings;
