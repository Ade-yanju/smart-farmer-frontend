import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectManagement from './ProjectManagement';
import UserManagement from './UserManagement';
import WithdrawalManagement from './WithdrawalManagement';
import SystemActions from './SystemActions';
import TransactionManagement from './TransactionManagement';
import ManualDepositManagement from './ManualDepositManagement';
import { 
    FiArrowLeft, FiBox, FiUsers, FiCreditCard, 
    FiCpu, FiList, FiEdit, FiMenu, FiX 
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('projects');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const { theme } = useTheme();

    // Handle precise responsiveness and boundary crossing
    useEffect(() => {
        let prevWidth = window.innerWidth;
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            setWindowWidth(currentWidth);
            
            // Only auto-toggle when crossing the desktop boundary to prevent annoying UX
            if (prevWidth <= 1024 && currentWidth > 1024) {
                setSidebarOpen(true);
            } else if (prevWidth > 1024 && currentWidth <= 1024) {
                setSidebarOpen(false);
            }
            prevWidth = currentWidth;
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDark = theme === 'dark';
    const isDesktop = windowWidth > 1024;
    const isMobile = windowWidth <= 768;
    
    const logoSrc = isDark ? '/logo-dark-theme.png' : '/logo-light-theme.png';

    // --- 2026 SILICON VALLEY DESIGN SYSTEM ---
    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: isDark ? '#08090a' : '#f8fafc',
            color: isDark ? '#f8fafc' : '#0f172a',
            fontFamily: "'Inter', -apple-system, sans-serif",
            overflowX: 'hidden',
        },
        sidebar: {
            // Desktop: uses width to push content. Mobile/Tablet: uses fixed positioning and transform to slide over.
            width: '280px',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRight: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: isDesktop ? 'relative' : 'fixed',
            height: '100vh',
            zIndex: 1000,
            transform: isDesktop ? 'none' : (isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'),
            marginLeft: isDesktop && !isSidebarOpen ? '-280px' : '0',
            boxShadow: !isDesktop && isSidebarOpen ? '4px 0 24px rgba(0,0,0,0.1)' : 'none',
        },
        mainContent: {
            flex: 1,
            // Adjust padding based on screen size; add extra bottom padding on mobile for the floating button
            padding: isMobile ? '20px 16px 80px 16px' : '40px',
            overflowY: 'auto',
            width: '100%',
            transition: 'padding 0.3s ease',
            height: '100vh',
            boxSizing: 'border-box',
        },
        header: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            marginBottom: '32px',
            gap: '16px',
            flexWrap: 'wrap',
        },
        logoContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        },
        navItem: (isActive) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            margin: '6px 16px',
            borderRadius: '12px',
            cursor: 'pointer',
            border: 'none',
            fontSize: '15px',
            fontWeight: isActive ? '600' : '500',
            backgroundColor: isActive ? (isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff') : 'transparent',
            color: isActive ? '#3b82f6' : (isDark ? '#94a3b8' : '#64748b'),
            transition: 'all 0.2s ease',
            textAlign: 'left',
            width: 'calc(100% - 32px)',
        }),
        contentCard: {
            backgroundColor: isDark ? '#111827' : '#ffffff',
            borderRadius: '24px',
            padding: isMobile ? '16px' : '24px',
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.03)',
            border: `1px solid ${isDark ? '#1f2937' : '#f1f5f9'}`,
            width: '100%',
            boxSizing: 'border-box',
            overflowX: 'auto', // Ensures tables inside don't break the layout
        },
        mobileToggle: {
            display: !isDesktop ? 'flex' : 'none',
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '16px', // Modern squircle
            backgroundColor: '#3b82f6',
            color: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
            zIndex: 1001,
            cursor: 'pointer',
            border: 'none',
            transition: 'transform 0.2s ease, background-color 0.2s ease',
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(15, 23, 42, 0.4)',
            zIndex: 999,
            backdropFilter: 'blur(4px)',
            opacity: isSidebarOpen && !isDesktop ? 1 : 0,
            visibility: isSidebarOpen && !isDesktop ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }
    };

    const navItems = [
        { id: 'projects', label: 'Projects', icon: <FiBox size={18} /> },
        { id: 'users', label: 'Users', icon: <FiUsers size={18} /> },
        { id: 'deposits', label: 'Manual Deposits', icon: <FiEdit size={18} /> },
        { id: 'withdrawals', label: 'Withdrawals', icon: <FiCreditCard size={18} /> },
        { id: 'transactions', label: 'Transactions', icon: <FiList size={18} /> },
        { id: 'system', label: 'System', icon: <FiCpu size={18} /> },
    ];

    return (
        <div style={styles.container}>
            {/* --- MOBILE/TABLET OVERLAY --- */}
            <div 
                style={styles.overlay} 
                onClick={() => setSidebarOpen(false)}
            />

            {/* --- SIDEBAR --- */}
            <aside style={styles.sidebar}>
                <div style={{ padding: '32px 24px', marginBottom: '8px' }}>
                    <img src={logoSrc} alt="Logo" style={{ height: '36px', marginBottom: '24px' }} />
                    <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#64748b', fontWeight: 700 }}>Admin Menu</h2>
                </div>
                
                <nav style={{ flex: 1 }}>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            style={styles.navItem(activeTab === item.id)}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (!isDesktop) setSidebarOpen(false);
                            }}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* --- MAIN CONTENT area --- */}
            <main style={styles.mainContent}>
                <header style={styles.header}>
                    <div style={styles.logoContainer}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: isMobile ? '24px' : '32px', fontWeight: 800, letterSpacing: '-0.5px' }}>Admin Panel</h1>
                            <p style={{ margin: '6px 0 0', color: isDark ? '#94a3b8' : '#64748b', fontSize: '15px' }}>Precision monitoring for Smart Farmer.</p>
                        </div>
                    </div>
                    
                    <Link to="/dashboard" style={{ 
                        textDecoration: 'none', 
                        padding: '12px 20px', 
                        borderRadius: '12px',
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                        color: isDark ? '#f8fafc' : '#0f172a',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        boxSizing: 'border-box'
                    }}>
                        <FiArrowLeft /> Back to User Dashboard
                    </Link>
                </header>

                <div style={styles.contentCard}>
                    {activeTab === 'projects' && <ProjectManagement />}
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'withdrawals' && <WithdrawalManagement />}
                    {activeTab === 'deposits' && <ManualDepositManagement />}
                    {activeTab === 'transactions' && <TransactionManagement />}
                    {activeTab === 'system' && <SystemActions />}
                </div>
            </main>

            {/* --- MOBILE TOGGLE --- */}
            <button 
                style={styles.mobileToggle} 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isSidebarOpen ? <FiX /> : <FiMenu />}
            </button>
        </div>
    );
}

export default AdminDashboard;
