import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditProfile from './EditProfile';
import SecuritySettings from './SecuritySettings';
import AppearanceSettings from './AppearanceSettings';
import NotificationsSettings from './NotificationsSettings';
import WithdrawalSettings from './WithdrawalSettings';
import DeleteAccount from './DeleteAccount';
import Referrals from './Referrals';
import { FiUser, FiShield, FiEye, FiBell, FiCreditCard, FiTrash2, FiGift, FiArrowLeft, FiChevronRight } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

function Settings({ userData, refreshUserData }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [width, setWidth] = useState(window.innerWidth);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Handle Responsiveness
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width < 992;

    const menuItems = [
        { id: 'profile', label: 'Edit Profile', icon: <FiUser /> },
        { id: 'security', label: 'Security', icon: <FiShield /> },
        { id: 'appearance', label: 'Appearance', icon: <FiEye /> },
        { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
        { id: 'withdrawals', label: 'Withdrawals', icon: <FiCreditCard /> },
        { id: 'referrals', label: 'Referrals', icon: <FiGift /> },
        { id: 'deleteAccount', label: 'Delete Account', icon: <FiTrash2 />, isDanger: true },
    ];

    // --- 2026 PREMIUM UI TOKENS ---
    const styles = {
        container: {
            minHeight: '100vh',
            padding: isMobile ? '20px 16px' : '40px 24px',
            backgroundColor: isDark ? '#050505' : '#F9FAFB',
            color: isDark ? '#FFFFFF' : '#111827',
            fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        wrapper: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        topBar: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            marginBottom: '40px',
            gap: '20px'
        },
        backBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            color: isDark ? '#A1A1AA' : '#4B5563',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'transparent'}`
        },
        headerTitle: {
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '800',
            letterSpacing: '-1px',
            margin: 0,
        },
        layout: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '280px 1fr',
            gap: '32px',
            alignItems: 'start'
        },
        navCard: {
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            gap: '8px',
            overflowX: isMobile ? 'auto' : 'visible',
            padding: isMobile ? '4px' : '0',
            scrollbarWidth: 'none',
        },
        navBtn: (isActive, isDanger) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'center' : 'space-between',
            gap: '12px',
            padding: '14px 18px',
            borderRadius: '14px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: isActive 
                ? (isDark ? '#FFFFFF' : '#000000') 
                : 'transparent',
            color: isActive 
                ? (isDark ? '#000000' : '#FFFFFF') 
                : (isDanger ? '#EF4444' : (isDark ? '#A1A1AA' : '#6B7280')),
        }),
        contentCard: {
            backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.02)',
            minHeight: '500px'
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <EditProfile refreshUserData={refreshUserData} />;
            case 'security': return <SecuritySettings />;
            case 'appearance': return <AppearanceSettings />;
            case 'notifications': return <NotificationsSettings />;
            case 'withdrawals': return <WithdrawalSettings />;
            case 'referrals': return <Referrals userData={userData} />;
            case 'deleteAccount': return <DeleteAccount />;
            default: return <EditProfile refreshUserData={refreshUserData} />;
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                {/* TOP NAVIGATION */}
                <div style={styles.topBar}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/dashboard" style={styles.backBtn} 
                              onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}>
                            <FiArrowLeft /> Back to Dashboard
                        </Link>
                        <div>
                            <h1 style={styles.headerTitle}>Account Settings</h1>
                            {userData && (
                                <p style={{ margin: '8px 0 0', color: isDark ? '#71717A' : '#6B7280', fontWeight: '500' }}>
                                    {userData.email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* SETTINGS LAYOUT */}
                <div style={styles.layout}>
                    {/* SIDE NAVIGATION */}
                    <aside style={styles.navCard}>
                        {menuItems.map(item => (
                            <button 
                                key={item.id} 
                                style={styles.navBtn(activeTab === item.id, item.isDanger)}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {item.icon} {item.label}
                                </span>
                                {!isMobile && <FiChevronRight opacity={activeTab === item.id ? 1 : 0.3} />}
                            </button>
                        ))}
                    </aside>

                    {/* DYNAMIC CONTENT AREA */}
                    <main style={styles.contentCard}>
                        <div style={{ 
                            animation: 'fadeIn 0.4s ease-out',
                        }}>
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>

            {/* Injected Keyframes for smooth transitions */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    * { transition: background-color 0.2s ease, transform 0.1s ease; }
                    button:active { transform: scale(0.98); }
                `}
            </style>
        </div>
    );
}

export default Settings;
