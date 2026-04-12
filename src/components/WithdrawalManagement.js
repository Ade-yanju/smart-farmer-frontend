import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../axiosConfig'; 
import { FiCheckCircle, FiXCircle, FiClock, FiCreditCard, FiFilter } from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext'; // Assuming you have this based on standard modern setups

function WithdrawalManagement() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // Added filtering
    
    const { showModal } = useModal();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/admin/withdrawals');
            setWithdrawals(response.data);
            setError('');
        } catch (err) {
            setError('Failed to sync financial ledger. Check connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        if (!window.confirm(`AUTHORIZATION REQUIRED: Mark transaction as '${status.toUpperCase()}'?`)) return;
        try {
            await apiClient.post('/admin/withdrawals/update', { id, status });
            showModal(`Transaction ${status} successfully.`);
            fetchWithdrawals(); 
        } catch (error) {
            showModal('Cryptographic handshake failed. Status not updated.');
        }
    };

    // --- ENHANCEMENT: Filtering Logic ---
    const filteredWithdrawals = useMemo(() => {
        if (filter === 'all') return withdrawals;
        return withdrawals.filter(req => req.status === filter);
    }, [withdrawals, filter]);

    // --- 2026 ULTRA-MODERN STYLES ---
    const styles = {
        container: {
            background: isDark ? 'linear-gradient(145deg, #0a0a0a, #141414)' : '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.7)' : '0 10px 40px rgba(0,0,0,0.04)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%',
            boxSizing: 'border-box'
        },
        badge: (status) => {
            const colors = {
                pending: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
                approved: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
                rejected: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }
            };
            const theme = colors[status] || colors.pending;
            return {
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                background: theme.bg,
                color: theme.text,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
            };
        },
        actionBtn: (type) => ({
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            background: type === 'approve' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: type === 'approve' ? '#10b981' : '#ef4444',
            transition: 'all 0.2s ease'
        })
    };

    if (loading) return <div style={{padding: '100px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px', color: '#888'}}>SYNCING LEDGER...</div>;
    if (error) return <div style={{padding: '24px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px'}}>{error}</div>;

    return (
        <div style={styles.container} className="withdrawal-wrapper">
            {/* Header & Filters */}
            <div className="header-section" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px'}}>
                <div>
                    <h1 style={{margin: 0, fontSize: '24px', fontWeight: 900, letterSpacing: '-1px'}}>Capital Deployment</h1>
                    <p style={{color: '#888', fontSize: '13px', marginTop: '4px'}}>Manage outbound liquidity requests</p>
                </div>
                <div style={{display: 'flex', background: isDark ? '#000' : '#f3f4f6', padding: '4px', borderRadius: '12px', flexWrap: 'wrap'}}>
                    {['all', 'pending', 'approved', 'rejected'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setFilter(t)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                background: filter === t ? (isDark ? '#222' : '#fff') : 'transparent',
                                color: filter === t ? (isDark ? '#fff' : '#000') : '#888',
                                boxShadow: filter === t ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.2s',
                                flex: 1
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Grid */}
            <div className="table-responsive-wrapper">
                <table className="responsive-table" style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px'}}>
                    <thead>
                        <tr style={{color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>
                            <th style={{textAlign: 'left', fontWeight: '600', padding: '0 12px'}}>Identity</th>
                            <th style={{textAlign: 'left', fontWeight: '600', padding: '0 12px'}}>Capital</th>
                            <th style={{textAlign: 'left', fontWeight: '600', padding: '0 12px'}}>Routing</th>
                            <th style={{textAlign: 'left', fontWeight: '600', padding: '0 12px'}}>Timestamp</th>
                            <th style={{textAlign: 'left', fontWeight: '600', padding: '0 12px'}}>State</th>
                            <th style={{textAlign: 'right', fontWeight: '600', padding: '0 12px'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWithdrawals.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center', padding: '40px', color: '#888'}}>No transactions found in this state.</td>
                            </tr>
                        ) : (
                            filteredWithdrawals.map(req => (
                                <tr key={req.id} style={{
                                    background: isDark ? 'rgba(255,255,255,0.02)' : 'transparent',
                                    borderRadius: '16px',
                                }}>
                                    <td data-label="Identity" style={{padding: '16px 12px', fontWeight: '600', color: isDark ? '#fff' : '#1a1a1a'}}>
                                        {req.email}
                                    </td>
                                    <td data-label="Capital" style={{padding: '16px 12px', fontWeight: '800', fontFamily: 'monospace', fontSize: '15px', color: isDark ? '#fff' : '#000'}}>
                                        ₦{req.amount.toLocaleString()}
                                    </td>
                                    <td data-label="Routing" style={{padding: '16px 12px'}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '13px'}}>
                                            <FiCreditCard size={14} />
                                            <span>{req.bankDetails?.bankName} ••• {req.bankDetails?.accountNumber?.slice(-4)}</span>
                                        </div>
                                    </td>
                                    <td data-label="Timestamp" style={{padding: '16px 12px', color: '#888', fontSize: '13px'}}>
                                        {req.createdAt ? new Date(req.createdAt.seconds * 1000).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}) : 'Unknown'}
                                    </td>
                                    <td data-label="State" style={{padding: '16px 12px'}}>
                                        <span style={styles.badge(req.status)}>
                                            {req.status === 'pending' && <FiClock size={12}/>}
                                            {req.status === 'approved' && <FiCheckCircle size={12}/>}
                                            {req.status === 'rejected' && <FiXCircle size={12}/>}
                                            {req.status}
                                        </span>
                                    </td>
                                    <td data-label="Actions" style={{padding: '16px 12px'}}>
                                        <div className="action-buttons" style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                                            {req.status === 'pending' ? (
                                                <>
                                                    <button onClick={() => handleUpdateStatus(req.id, 'approved')} style={styles.actionBtn('approve')} title="Authorize">
                                                        <FiCheckCircle size={18} />
                                                    </button>
                                                    <button onClick={() => handleUpdateStatus(req.id, 'rejected')} style={styles.actionBtn('reject')} title="Deny">
                                                        <FiXCircle size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <span style={{color: '#666', fontSize: '12px', fontStyle: 'italic'}}>Locked</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style>
                {`
                    .responsive-table tr {
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }
                    .responsive-table tr:hover {
                        transform: translateY(-2px);
                        box-shadow: ${isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.04)'};
                        background: ${isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb'} !important;
                    }
                    .responsive-table tr td:first-child { border-radius: 12px 0 0 12px; }
                    .responsive-table tr td:last-child { border-radius: 0 12px 12px 0; }

                    /* === MOBILE RESPONSIVE DESIGN === */
                    @media screen and (max-width: 850px) {
                        .withdrawal-wrapper {
                            padding: 16px !important;
                        }
                        
                        .header-section {
                            flex-direction: column;
                        }

                        .header-section > div:last-child {
                            width: 100%;
                            display: grid !important;
                            grid-template-columns: 1fr 1fr;
                            gap: 4px;
                        }

                        /* Transform Table into Cards */
                        .responsive-table, 
                        .responsive-table tbody, 
                        .responsive-table tr, 
                        .responsive-table td {
                            display: block;
                            width: 100%;
                            box-sizing: border-box;
                        }

                        .responsive-table thead {
                            display: none; /* Hide headers */
                        }

                        .responsive-table tr {
                            margin-bottom: 16px;
                            border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#eee'};
                            border-radius: 16px;
                            padding: 8px 0;
                        }

                        .responsive-table td {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            text-align: right;
                            padding: 12px 16px !important;
                            border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.04)' : '#f5f5f5'};
                        }
                        
                        .responsive-table td:last-child {
                            border-bottom: none;
                        }

                        /* Inject column names from data-label */
                        .responsive-table td::before {
                            content: attr(data-label);
                            font-weight: 700;
                            color: #888;
                            font-size: 11px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            text-align: left;
                        }

                        .action-buttons {
                            width: 100%;
                            justify-content: flex-end !important;
                        }
                    }
                `}
            </style>
        </div>
    );
}

export default WithdrawalManagement;
