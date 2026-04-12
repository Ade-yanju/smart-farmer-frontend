import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../axiosConfig'; 
import { 
    FiCheckCircle, FiXCircle, FiClock, FiCreditCard, 
    FiTrash2, FiLayers, FiSquare, FiCheckSquare 
} from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

function WithdrawalManagement() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]); // Selection state
    
    const { showModal } = useModal();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/admin/withdrawals');
            setWithdrawals(response.data);
            setSelectedIds([]); // Reset selection on refresh
        } catch (err) {
            setError('System Link Failure: Unable to sync ledger.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWithdrawals(); }, []);

    // --- Selection Logic ---
    const filteredWithdrawals = useMemo(() => {
        if (filter === 'all') return withdrawals;
        return withdrawals.filter(req => req.status === filter);
    }, [withdrawals, filter]);

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredWithdrawals.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredWithdrawals.map(w => w.id));
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // --- Action Handlers ---
    const processAction = async (ids, status) => {
        const actionText = status === 'deleted' ? 'permanently delete' : `mark as ${status}`;
        if (!window.confirm(`CRITICAL: You are about to ${actionText} ${ids.length} record(s). Proceed?`)) return;

        try {
            // In 2026, we assume a bulk endpoint exists, otherwise we map
            await Promise.all(ids.map(id => 
                apiClient.post('/admin/withdrawals/update', { id, status })
            ));
            showModal(`Operation Successful: ${ids.length} records processed.`);
            fetchWithdrawals();
        } catch (err) {
            showModal('Operation Failed: Batch sequence interrupted.');
        }
    };

    // --- 2026 Aesthetics ---
    const styles = {
        container: {
            maxWidth: '1600px',
            margin: '0 auto',
            background: isDark ? '#000' : '#ffffff',
            borderRadius: '32px',
            padding: 'clamp(16px, 4vw, 40px)', // Fluid padding
            border: `1px solid ${isDark ? '#222' : '#f0f0f0'}`,
            position: 'relative',
            minHeight: '80vh'
        },
        batchBar: {
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            padding: '12px 24px',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: 'white',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            zIndex: 1000,
            border: '1px solid rgba(255,255,255,0.1)',
            visibility: selectedIds.length > 0 ? 'visible' : 'hidden',
            opacity: selectedIds.length > 0 ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        batchBtn: (color) => ({
            background: color,
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        }),
        checkbox: {
            cursor: 'pointer',
            fontSize: '20px',
            color: '#007AFF',
            display: 'flex',
            alignItems: 'center'
        }
    };

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '20px', flexWrap: 'wrap'}}>
                <div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', color: '#888', marginBottom: '8px'}}>
                        <FiLayers /> <span style={{fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase'}}>Treasury Control</span>
                    </div>
                    <h1 style={{fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 900, margin: 0, letterSpacing: '-1.5px'}}>Withdrawal Queue</h1>
                </div>
                
                {/* Filter Pill */}
                <div style={{display: 'flex', background: isDark ? '#111' : '#f4f4f4', padding: '6px', borderRadius: '16px'}}>
                    {['all', 'pending', 'approved', 'rejected'].map(t => (
                        <button key={t} onClick={() => setFilter(t)} className={filter === t ? 'active-pill' : 'pill'}>{t}</button>
                    ))}
                </div>
            </div>

            {/* Selection Info (Desktop only) */}
            <div style={{marginBottom: '16px', fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '10px'}}>
                <div onClick={toggleSelectAll} style={styles.checkbox}>
                    {selectedIds.length === filteredWithdrawals.length ? <FiCheckSquare /> : <FiSquare />}
                </div>
                <span>{selectedIds.length} items selected</span>
            </div>

            {/* Data Grid */}
            <div className="modern-grid-container">
                <table className="ultra-table">
                    <thead>
                        <tr>
                            <th style={{width: '40px'}}></th>
                            <th>Beneficiary</th>
                            <th>Amount</th>
                            <th className="hide-mobile">Network Details</th>
                            <th className="hide-tablet">Requested</th>
                            <th>Status</th>
                            <th style={{textAlign: 'right'}}>Manual Override</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWithdrawals.map(req => (
                            <tr key={req.id} className={selectedIds.includes(req.id) ? 'selected-row' : ''}>
                                <td onClick={() => toggleSelectOne(req.id)} style={styles.checkbox}>
                                    {selectedIds.includes(req.id) ? <FiCheckSquare /> : <FiSquare />}
                                </td>
                                <td data-label="Beneficiary">
                                    <div style={{fontWeight: 700}}>{req.email}</div>
                                    <div style={{fontSize: '11px', opacity: 0.6}}>{req.id.slice(0,8)}...</div>
                                </td>
                                <td data-label="Amount" style={{fontFamily: 'JetBrains Mono, monospace', fontWeight: 800}}>
                                    ₦{req.amount.toLocaleString()}
                                </td>
                                <td data-label="Routing" className="hide-mobile">
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px'}}>
                                        <FiCreditCard /> {req.bankDetails?.bankName} (••{req.bankDetails?.accountNumber?.slice(-4)})
                                    </div>
                                </td>
                                <td data-label="Date" className="hide-tablet" style={{fontSize: '12px', color: '#888'}}>
                                    {new Date(req.createdAt.seconds * 1000).toLocaleDateString()}
                                </td>
                                <td data-label="Status">
                                    <span className={`status-badge ${req.status}`}>{req.status}</span>
                                </td>
                                <td data-label="Actions" style={{textAlign: 'right'}}>
                                    {req.status === 'pending' && (
                                        <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                                            <button onClick={() => processAction([req.id], 'approved')} className="icon-btn approve"><FiCheckCircle/></button>
                                            <button onClick={() => processAction([req.id], 'rejected')} className="icon-btn reject"><FiXCircle/></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FLOATING BATCH BAR */}
            <div style={styles.batchBar}>
                <span style={{fontSize: '13px', fontWeight: 600, borderRight: '1px solid #444', paddingRight: '16px', marginRight: '8px'}}>
                    {selectedIds.length} Selected
                </span>
                <button onClick={() => processAction(selectedIds, 'approved')} style={styles.batchBtn('#10b981')}><FiCheckCircle/> Approve</button>
                <button onClick={() => processAction(selectedIds, 'rejected')} style={styles.batchBtn('#f59e0b')}><FiXCircle/> Reject</button>
                <button onClick={() => processAction(selectedIds, 'deleted')} style={styles.batchBtn('#ef4444')}><FiTrash2/> Delete</button>
                <button onClick={() => setSelectedIds([])} style={{background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px'}}>Cancel</button>
            </div>

            <style>
                {`
                    .modern-grid-container { width: 100%; overflow-x: auto; }
                    .ultra-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    .ultra-table th { text-align: left; padding: 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; }
                    .ultra-table td { padding: 20px 16px; border-bottom: 1px solid ${isDark ? '#111' : '#f9f9f9'}; transition: all 0.2s; }
                    
                    .selected-row td { background: ${isDark ? '#0A1A2F' : '#F0F7FF'} !important; }
                    
                    .pill, .active-pill { padding: 8px 16px; border: none; border-radius: 12px; cursor: pointer; font-size: 12px; font-weight: 700; transition: 0.2s; }
                    .pill { background: transparent; color: #888; }
                    .active-pill { background: ${isDark ? '#333' : '#fff'}; color: ${isDark ? '#fff' : '#000'}; shadow: 0 4px 10px rgba(0,0,0,0.1); }

                    .status-badge { padding: 4px 10px; borderRadius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
                    .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                    .status-badge.approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }

                    .icon-btn { background: none; border: none; cursor: pointer; font-size: 18px; transition: 0.2s; padding: 5px; }
                    .icon-btn.approve { color: #10b981; }
                    .icon-btn.reject { color: #ef4444; }
                    .icon-btn:hover { transform: scale(1.2); }

                    /* Responsive Shifting */
                    @media (max-width: 1024px) { .hide-tablet { display: none; } }
                    @media (max-width: 768px) {
                        .hide-mobile { display: none; }
                        .ultra-table thead { display: none; }
                        .ultra-table tr { display: block; border: 1px solid ${isDark ? '#222' : '#eee'}; border-radius: 20px; margin-bottom: 16px; padding: 10px; }
                        .ultra-table td { display: flex; justify-content: space-between; border: none; padding: 8px 12px; }
                        .ultra-table td::before { content: attr(data-label); font-weight: 800; color: #888; font-size: 10px; text-transform: uppercase; }
                        .batch-bar { width: 90%; flex-wrap: wrap; justify-content: center; }
                    }
                `}
            </style>
        </div>
    );
}

export default WithdrawalManagement;
