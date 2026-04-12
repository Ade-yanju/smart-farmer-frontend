import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FiClipboard, FiSend, FiArrowLeft, FiCheckCircle, FiCopy } from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

function AddMoneyManually() {
    const [amount, setAmount] = useState('');
    const [senderName, setSenderName] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    const { showModal } = useModal();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const currentUser = auth.currentUser;

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = screenSize < 768;

    const companyAccounts = [
        { bankName: "Vfd Bank", accountNumber: "1040594549", accountName: "Smart Farmer" },
        { bankName: "Kolomoni", accountNumber: "0990028382", accountName: "Smart Farmer" }
    ];

    const selectedAccount = companyAccounts[selectedAccountIndex];

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        showModal(`'${text}' copied to clipboard!`);
    };

    const handleSubmitClaim = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);
        setStatus({ message: '', type: '' });
        try {
            await addDoc(collection(db, "manual_deposits"), {
                userId: currentUser.uid,
                email: currentUser.email,
                amount: Number(amount),
                senderName,
                status: 'pending',
                createdAt: serverTimestamp(),
                transferredTo: selectedAccount.bankName
            });
            setStatus({ message: 'Claim submitted! Reviewing within 24 hours.', type: 'success' });
            setAmount('');
            setSenderName('');
        } catch (error) {
            setStatus({ message: 'Error submitting claim.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // --- 2026 DESIGN TOKENS (Aceternity Inspired) ---
    const styles = {
        page: {
            minHeight: '100vh',
            padding: isMobile ? '20px' : '60px 20px',
            backgroundColor: isDark ? '#020202' : '#F8FAFC',
            fontFamily: "'Inter', sans-serif",
            color: isDark ? '#fff' : '#1e293b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        container: {
            width: '100%',
            maxWidth: '1100px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
        },
        headerArea: {
            textAlign: 'center',
            marginBottom: '20px'
        },
        backBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'color 0.2s',
            marginBottom: '10px'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr',
            gap: '24px',
            perspective: '1000px'
        },
        bentoCard: {
            background: isDark ? 'rgba(15, 15, 15, 0.7)' : '#ffffff',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.03)',
            transition: 'transform 0.3s ease'
        },
        stepBadge: {
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: '100px',
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
            color: '#3B82F6',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },
        toggleContainer: {
            display: 'flex',
            gap: '10px',
            backgroundColor: isDark ? '#000' : '#f1f5f9',
            padding: '6px',
            borderRadius: '16px',
            marginBottom: '24px'
        },
        toggleBtn: (active) => ({
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: active ? (isDark ? '#222' : '#fff') : 'transparent',
            color: active ? (isDark ? '#fff' : '#0f172a') : '#64748b',
            boxShadow: active ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
        }),
        infoBox: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            padding: '16px',
            borderRadius: '16px',
            border: `1px solid ${isDark ? '#222' : '#e2e8f0'}`,
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '0.5px'
        },
        input: {
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            border: `1px solid ${isDark ? '#333' : '#e2e8f0'}`,
            backgroundColor: isDark ? '#000' : '#fff',
            color: isDark ? '#fff' : '#000',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.2s',
            boxSizing: 'border-box'
        },
        primaryBtn: {
            width: '100%',
            padding: '18px',
            borderRadius: '16px',
            border: 'none',
            backgroundColor: isDark ? '#fff' : '#000',
            color: isDark ? '#000' : '#fff',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'transform 0.1s active',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <header style={styles.headerArea}>
                    <Link to="/dashboard" style={styles.backBtn}>
                        <FiArrowLeft /> Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: isMobile ? '32px' : '48px', fontWeight: '900', letterSpacing: '-2px', margin: '10px 0' }}>
                        Refill Wallet
                    </h1>
                    <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
                        Experience seamless manual funding with our verified institutional accounts.
                    </p>
                </header>

                <div style={styles.grid}>
                    {/* STEP 1: TRANSFER */}
                    <div style={styles.bentoCard}>
                        <span style={styles.stepBadge}>Step 01</span>
                        <h2 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>Bank Transfer</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Choose a secure gateway below.</p>

                        <div style={styles.toggleContainer}>
                            {companyAccounts.map((account, index) => (
                                <button
                                    key={index}
                                    style={styles.toggleBtn(selectedAccountIndex === index)}
                                    onClick={() => setSelectedAccountIndex(index)}
                                >
                                    {account.bankName}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Account Number</label>
                                <div style={styles.infoBox}>
                                    <span style={{ fontFamily: 'monospace' }}>{selectedAccount.accountNumber}</span>
                                    <button 
                                        onClick={() => handleCopy(selectedAccount.accountNumber)} 
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3B82F6', fontSize: '20px' }}
                                    >
                                        <FiCopy />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Account Name</label>
                                <div style={{ ...styles.infoBox, justifyContent: 'flex-start', gap: '10px' }}>
                                    <FiCheckCircle color="#10B981" />
                                    <span>{selectedAccount.accountName}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STEP 2: CLAIM */}
                    <div style={styles.bentoCard}>
                        <span style={styles.stepBadge}>Step 02</span>
                        <h2 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>Confirm Payment</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Our AI-enhanced review team will verify your claim.</p>

                        <form onSubmit={handleSubmitClaim} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={styles.inputLabel}>Amount Sent (₦)</label>
                                <input 
                                    style={styles.input} 
                                    type="number" 
                                    placeholder="5,000" 
                                    value={amount} 
                                    onChange={(e) => setAmount(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div>
                                <label style={styles.inputLabel}>Sender Display Name</label>
                                <input 
                                    style={styles.input} 
                                    type="text" 
                                    placeholder="Full Name on Transfer Receipt" 
                                    value={senderName} 
                                    onChange={(e) => setSenderName(e.target.value)} 
                                    required 
                                />
                            </div>

                            {status.message && (
                                <div style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: status.type === 'success' ? '#10B981' : '#EF4444',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    textAlign: 'center'
                                }}>
                                    {status.message}
                                </div>
                            )}

                            <button type="submit" style={styles.primaryBtn} disabled={loading}>
                                <FiSend />
                                {loading ? 'Securing Claim...' : 'Submit Deposit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddMoneyManually;
