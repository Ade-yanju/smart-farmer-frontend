import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FiCreditCard, FiArrowUpRight, FiShield, FiInfo } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

function WithdrawalPage({ userData }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [width, setWidth] = useState(window.innerWidth);
    
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const currentUser = auth.currentUser;
    const logoSrc = isDark ? '/logo-dark-theme.png' : '/logo-light-theme.png';

    // Responsive Listener
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleWithdrawalRequest = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setStatus({ message: 'Authentication required.', type: 'error' });
            return;
        }

        const withdrawalAmount = parseFloat(amount);
        if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            setStatus({ message: 'Enter a valid numeric amount.', type: 'error' });
            return;
        }

        if (withdrawalAmount > userData.walletBalance) {
            setStatus({ message: 'Insufficient funds in wallet.', type: 'error' });
            return;
        }

        if (!userData.withdrawalSettings?.accountNumber) {
            setStatus({ message: 'Bank details missing in Settings.', type: 'error' });
            return;
        }

        setLoading(true);
        setStatus({ message: 'Verifying transaction...', type: 'info' });

        try {
            const withdrawalsCollectionRef = collection(db, "withdrawals");
            await addDoc(withdrawalsCollectionRef, {
                userId: currentUser.uid,
                email: currentUser.email,
                amount: withdrawalAmount,
                status: 'pending',
                createdAt: serverTimestamp(),
                bankDetails: userData.withdrawalSettings
            });

            setStatus({ message: 'Request submitted. Funds will arrive shortly.', type: 'success' });
            setAmount('');
        } catch (error) {
            setStatus({ message: 'Network error. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const isMobile = width <= 768;

    // --- 2026 PREMIUM DESIGN SYSTEM ---
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: isMobile ? '20px' : '60px 20px',
            backgroundColor: isDark ? '#050505' : '#F9FAFB',
            fontFamily: "'Inter', -apple-system, sans-serif",
            transition: 'all 0.3s ease'
        },
        header: {
            textAlign: 'center',
            marginBottom: '40px'
        },
        logo: {
            height: '50px',
            marginBottom: '24px',
            filter: isDark ? 'drop-shadow(0 0 8px rgba(255,255,255,0.1))' : 'none'
        },
        bentoCard: {
            width: '100%',
            maxWidth: '480px',
            backgroundColor: isDark ? '#111111' : '#FFFFFF',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(0,0,0,0.03)',
        },
        balanceBox: {
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.05)' : '#F0FDF4',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px',
            border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)'}`,
            textAlign: 'center'
        },
        balanceLabel: {
            fontSize: '12px',
            fontWeight: '700',
            color: '#10B981',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px',
            display: 'block'
        },
        balanceAmount: {
            fontSize: '32px',
            fontWeight: '800',
            color: isDark ? '#FFFFFF' : '#111827',
            margin: 0,
            letterSpacing: '-1px'
        },
        inputLabel: {
            fontSize: '14px',
            fontWeight: '600',
            color: isDark ? '#9CA3AF' : '#4B5563',
            marginBottom: '10px',
            display: 'block'
        },
        inputWrapper: {
            position: 'relative',
            marginBottom: '24px'
        },
        input: {
            width: '100%',
            padding: '16px 20px',
            fontSize: '18px',
            borderRadius: '14px',
            border: `1px solid ${isDark ? '#262626' : '#E5E7EB'}`,
            backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
            color: isDark ? '#FFFFFF' : '#111827',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box'
        },
        btn: {
            width: '100%',
            padding: '16px',
            borderRadius: '14px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            border: 'none',
            backgroundColor: isDark ? '#FFFFFF' : '#111827',
            color: isDark ? '#000000' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'transform 0.1s ease, opacity 0.2s ease',
            opacity: loading ? 0.7 : 1,
            marginTop: '10px'
        },
        status: {
            padding: '14px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 
                            status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            color: status.type === 'error' ? '#EF4444' : 
                   status.type === 'success' ? '#10B981' : '#3B82F6',
            border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
        },
        footerText: {
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#6B7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <img src={logoSrc} alt="Logo" style={styles.logo} />
                <h1 style={{ 
                    fontSize: isMobile ? '24px' : '32px', 
                    fontWeight: '800', 
                    color: isDark ? '#FFF' : '#111',
                    margin: 0,
                    letterSpacing: '-1px'
                }}>
                    Withdraw Capital
                </h1>
                <p style={{ color: '#6B7280', marginTop: '8px', fontSize: '15px' }}>
                    Securely move funds to your bank account
                </p>
            </header>

            <div style={styles.bentoCard}>
                <div style={styles.balanceBox}>
                    <span style={styles.balanceLabel}>Available for withdrawal</span>
                    <h2 style={styles.balanceAmount}>
                        ₦{userData?.walletBalance?.toLocaleString() || '0'}
                    </h2>
                </div>

                <form onSubmit={handleWithdrawalRequest}>
                    <div style={styles.inputWrapper}>
                        <label style={styles.inputLabel}>Withdrawal Amount</label>
                        <input 
                            style={styles.input}
                            id="amount" 
                            type="number" 
                            placeholder="0.00" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            required 
                            onFocus={(e) => e.target.style.borderColor = '#10B981'}
                            onBlur={(e) => e.target.style.borderColor = isDark ? '#262626' : '#E5E7EB'}
                        />
                    </div>

                    {status.message && (
                        <div style={styles.status}>
                            {status.type === 'error' ? <FiInfo /> : <FiShield />}
                            {status.message}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        style={styles.btn} 
                        disabled={loading}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <FiArrowUpRight size={20} /> Request Payout
                            </>
                        )}
                    </button>
                </form>

                <div style={styles.footerText}>
                    <FiShield size={14} /> Encrypted Secure Transaction
                </div>
            </div>
        </div>
    );
}

export default WithdrawalPage;
