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
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const { theme } = useTheme();

    // Handle responsiveness for sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) setSidebarOpen(true);
            else setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDark = theme === 'dark';
    const logoSrc = isDark ? '/logo-dark-theme.png' : '/logo-light-theme.png';

    // --- 2026 SILICON VALLEY DESIGN SYSTEM ---
    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: isDark ? '#08090a' : '#f8fafc',
            color: isDark ? '#f8fafc' : '#0f172a',
            fontFamily: "'Inter', -apple-system, sans-serif",
            transition: 'all 0.3s ease',
        },
        sidebar: {
            width: isSidebarOpen ? '280px' : '0px',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRight: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: window.innerWidth <= 1024 ? 'fixed' : 'relative',
            height: '100vh',
            zIndex: 1000,
        },
        mainContent: {
            flex: 1,
            padding: window.innerWidth <= 768 ? '20px' : '40px',
            overflowY: 'auto',
            width: '100%',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            gap: '15px',
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
            padding: '12px 20px',
            margin: '4px 15px',
            borderRadius: '12px',
            cursor: 'pointer',
            border: 'none',
            fontSize: '15px',
            fontWeight: isActive ? '600' : '400',
            backgroundColor: isActive ? (isDark ? '#3b82f6' : '#2563eb') : 'transparent',
            color: isActive ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
            transition: 'all 0.2s ease',
            textAlign: 'left',
        }),
        contentCard: {
            backgroundColor: isDark ? '#111827' : '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)',
            border: `1px solid ${isDark ? '#1f2937' : '#f1f5f9'}`,
        },
        mobileToggle: {
            display: window.innerWidth <= 1024 ? 'flex' : 'none',
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            color: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            zIndex: 1001,
            cursor: 'pointer',
            border: 'none',
        }
    };

    const navItems = [
        { id: 'projects', label: 'Projects', icon: <FiBox /> },
        { id: 'users', label: 'Users', icon: <FiUsers /> },
        { id: 'deposits', label: 'Manual Deposits', icon: <FiEdit /> },
        { id: 'withdrawals', label: 'Withdrawals', icon: <FiCreditCard /> },
        { id: 'transactions', label: 'Transactions', icon: <FiList /> },
        { id: 'system', label: 'System', icon: <FiCpu /> },
    ];

    return (
        <div style={styles.container}>
            {/* --- SIDEBAR --- */}
            <aside style={styles.sidebar}>
                <div style={{ padding: '30px 20px', marginBottom: '10px' }}>
                    <img src={logoSrc} alt="Logo" style={{ height: '40px', marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>Admin Menu</h2>
                </div>
                
                <nav style={{ flex: 1 }}>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            style={styles.navItem(activeTab === item.id)}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (window.innerWidth <= 1024) setSidebarOpen(false);
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
                            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>Admin Panel</h1>
                            <p style={{ margin: '4px 0 0', color: isDark ? '#94a3b8' : '#64748b' }}>Precision monitoring for Smart Farmer.</p>
                        </div>
                    </div>
                    
                    <Link to="/dashboard" className="btn" style={{ 
                        textDecoration: 'none', 
                        padding: '10px 20px', 
                        borderRadius: '12px',
                        backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
                        color: isDark ? '#f8fafc' : '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}>
                        <FiArrowLeft /> Back to User Dashboard
                    </Link>
                </header>

                <div style={styles.contentCard}>
                    {/* Logic remains untouched */}
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
            >
                {isSidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            
            {/* Overlay for mobile */}
            {window.innerWidth <= 1024 && isSidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(4px)'
                    }}
                />
            )}
        </div>
    );
}

export default AdminDashboard;
