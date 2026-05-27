import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiCreditCard, FiUser } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const GREEN = '#10B981';

const ITEMS = [
  { to: '/dashboard', Icon: FiHome,       label: 'Home'     },
  { to: '/invest',    Icon: FiTrendingUp,  label: 'Invest'   },
  { to: '/withdraw',  Icon: FiCreditCard,  label: 'Withdraw' },
  { to: '/settings',  Icon: FiUser,        label: 'Profile'  },
];

function NavItem({ to, Icon, label, isDark }) {
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(to);

  const linkStyle = {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            3,
    textDecoration: 'none',
    padding:        '6px 18px',
    borderRadius:   12,
    minWidth:       52,
    color:          isActive ? GREEN : (isDark ? '#4A4A4A' : '#9CA3AF'),
    transform:      isActive ? 'translateY(-2px)' : 'translateY(0)',
    transition:     'color 0.18s ease, transform 0.22s cubic-bezier(.34,1.56,.64,1)',
    fontFamily:     "'Inter', -apple-system, sans-serif",
    fontSize:       10,
    fontWeight:     700,
    letterSpacing:  '0.03em',
  };

  return (
    <NavLink to={to} style={linkStyle}>
      <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 1.75} />
      <span>{label}</span>
    </NavLink>
  );
}

function Navigation() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav style={{
      position:             'fixed',
      bottom:               0,
      left:                 0,
      right:                0,
      height:               64,
      display:              'flex',
      justifyContent:       'space-around',
      alignItems:           'center',
      background:           isDark
                              ? 'rgba(8,8,8,0.95)'
                              : 'rgba(255,255,255,0.95)',
      backdropFilter:       'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop:            `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
      zIndex:               1000,
      /* Respect notched-phone safe areas */
      paddingBottom:        'env(safe-area-inset-bottom, 0px)',
    }}>
      {ITEMS.map(item => (
        <NavItem key={item.to} {...item} isDark={isDark} />
      ))}
    </nav>
  );
}

export default Navigation;
