import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiCheck } from 'react-icons/fi';

const ACCENT_COLORS = [
  { hex: '#10B981', label: 'Emerald'  },
  { hex: '#3B82F6', label: 'Blue'     },
  { hex: '#8B5CF6', label: 'Violet'   },
  { hex: '#F59E0B', label: 'Amber'    },
  { hex: '#EF4444', label: 'Red'      },
  { hex: '#EC4899', label: 'Pink'     },
];

function AppearanceSettings() {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const isDark = theme === 'dark';

  /* ── colour tokens ── */
  const txt    = isDark ? '#fff'                  : '#111';
  const muted  = isDark ? '#888'                  : '#666';
  const border = isDark ? 'rgba(255,255,255,.1)'  : 'rgba(0,0,0,.1)';
  const cardBg = isDark ? '#111'                  : '#fff';
  const selBg  = isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.03)';
  const green  = '#10B981';

  const themeOptions = [
    {
      id: 'dark',
      label: 'Dark',
      desc: 'Easy on the eyes in low light.',
      icon: <FiMoon size={20} />,
      preview: { bg: '#050505', card: '#111', txt: '#fff', accent: green },
    },
    {
      id: 'light',
      label: 'Light',
      desc: 'Classic bright interface.',
      icon: <FiSun size={20} />,
      preview: { bg: '#F9FAFB', card: '#fff', txt: '#111', accent: green },
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter',sans-serif" }}>
      {/* header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 5px', fontSize: 20, fontWeight: 800, color: txt, letterSpacing: '-0.5px' }}>Appearance</h2>
        <p style={{ margin: 0, color: muted, fontSize: 13 }}>Customize the look and feel of SmartFarmer.</p>
      </div>

      {/* ── theme picker ── */}
      <section style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
          Theme
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {themeOptions.map(opt => {
            const active = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                style={{
                  background: active ? (isDark ? 'rgba(16,185,129,.12)' : 'rgba(16,185,129,.08)') : cardBg,
                  border: `2px solid ${active ? green : border}`,
                  borderRadius: 14, padding: '16px', cursor: 'pointer', textAlign: 'left',
                  transition: 'all .2s', position: 'relative',
                }}
              >
                {/* mini preview */}
                <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 12, border: `1px solid ${border}` }}>
                  <div style={{ background: opt.preview.bg, padding: '8px', display: 'flex', gap: 4 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ height: 6, borderRadius: 3, background: i === 0 ? opt.preview.accent : opt.preview.card, flex: i === 0 ? '0 0 30px' : 1 }} />
                    ))}
                  </div>
                  <div style={{ background: opt.preview.card, padding: '6px 8px', display: 'flex', gap: 3 }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ flex: 1, height: 18, borderRadius: 4, background: opt.preview.bg }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: txt, marginBottom: 2 }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: muted }}>{opt.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: active ? green : 'transparent' }}>
                    {active && <FiCheck size={16} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── accent colour ── */}
      <section style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
          Accent Color
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
          {ACCENT_COLORS.map(({ hex, label }) => {
            const active = accentColor === hex;
            return (
              <button
                key={hex}
                title={label}
                onClick={() => setAccentColor && setAccentColor(hex)}
                style={{
                  width: '100%', aspectRatio: '1', borderRadius: '50%', border: 'none',
                  background: hex, cursor: 'pointer', position: 'relative',
                  outline: active ? `3px solid ${hex}` : `3px solid transparent`,
                  outlineOffset: 2, transition: 'outline .2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {active && <FiCheck color="#fff" size={14} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.4))' }} />}
              </button>
            );
          })}
        </div>
        <p style={{ margin: '10px 0 0', fontSize: 12, color: muted }}>Selected: <strong style={{ color: accentColor || green }}>{ACCENT_COLORS.find(c => c.hex === accentColor)?.label ?? 'Emerald'}</strong></p>
      </section>

      {/* ── font size (display only — no persistence wired yet) ── */}
      <section>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
          Interface Density
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Compact', 'Comfortable'].map(opt => (
            <div
              key={opt}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 12,
                background: opt === 'Comfortable' ? selBg : cardBg,
                border: `1px solid ${opt === 'Comfortable' ? green : border}`,
                textAlign: 'center', fontSize: 13, fontWeight: 700, color: opt === 'Comfortable' ? green : muted,
                cursor: 'default',
              }}
            >
              {opt}
              {opt === 'Comfortable' && <span style={{ display: 'block', fontSize: 11, fontWeight: 400, color: muted, marginTop: 2 }}>Current</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AppearanceSettings;
