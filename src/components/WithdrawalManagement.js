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
    const [selectedIds, setSelectedIds] = useState([]); 
    
    const { showModal } = useModal();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/admin/withdrawals');
            setWithdrawals(response.data);
            setSelectedIds([]); 
        } catch (err) {
            setError('System Link Failure: Unable to sync ledger.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWithdrawals(); }, []);

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

    const processAction = async (ids, status) => {
        const actionText = status === 'deleted' ? 'permanently delete' : `mark as ${status}`;
        if (!window.confirm(`CRITICAL: You are about to ${actionText} ${ids.length} record(s). Proceed?`)) return;

        try {
            await Promise.all(ids.map(id => 
                apiClient.post('/admin/withdrawals/update', { id, status })
            ));
            showModal(`Operation Successful: ${ids.length} records processed.`);
            fetchWithdrawals();
        } catch (err) {
            showModal('Operation Failed: Batch sequence interrupted.');
        }
    };

    return (
        <div className="withdrawal-root">
            {/* Header Section */}
            <div className="management-header">
                <div className="header-title">
                    <div className="brand-badge">
                        <FiLayers /> <span>Treasury Control</span>
                    </div>
                    <h1>Withdrawal Queue</h1>
                </div>
                
                <div className="filter-scroll-container">
                    <div className="filter-pill-box">
                        {['all', 'pending', 'approved', 'rejected'].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setFilter(t)} 
                                className={filter === t ? 'active-pill' : 'pill'}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Selection Meta Info */}
            <div className="selection-info">
                <div onClick={toggleSelectAll} className="checkbox-wrapper">
                    {selectedIds.length === filteredWithdrawals.length && filteredWithdrawals.length > 0 ? <FiCheckSquare /> : <FiSquare />}
                    <span>{selectedIds.length} items selected</span>
                </div>
            </div>

            {/* Data Grid */}
            <div className="grid-wrapper">
                <table className="ultra-table">
                    <thead>
                        <tr>
                            <th style={{width: '50px'}}>Select</th>
                            <th>Beneficiary</th>
                            <th>Amount</th>
                            <th className="hide-mobile">Routing</th>
                            <th className="hide-tablet">Requested</th>
                            <th>Status</th>
                            <th style={{textAlign: 'right'}}>Override</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWithdrawals.map(req => (
                            <tr key={req.id} className={selectedIds.includes(req.id) ? 'selected-row' : ''}>
                                <td className="check-cell" onClick={() => toggleSelectOne(req.id)}>
                                    {selectedIds.includes(req.id) ? <FiCheckSquare className="icon-active" /> : <FiSquare />}
                                </td>
                                <td data-label="Beneficiary">
                                    <div className="user-email">{req.email}</div>
                                    <div className="user-id">{req.id.slice(0,8)}...</div>
                                </td>
                                <td data-label="Amount" className="amount-cell">
                                    ₦{req.amount.toLocaleString()}
                                </td>
                                <td data-label="Routing" className="hide-mobile">
                                    <div className="routing-info">
                                        <FiCreditCard /> {req.bankDetails?.bankName} (••{req.bankDetails?.accountNumber?.slice(-4)})
                                    </div>
                                </td>
                                <td data-label="Date" className="hide-tablet date-cell">
                                    {new Date(req.createdAt.seconds * 1000).toLocaleDateString()}
                                </td>
                                <td data-label="Status">
                                    <span className={`status-badge ${req.status}`}>{req.status}</span>
                                </td>
                                <td data-label="Actions" className="action-cell">
                                    {req.status === 'pending' && (
                                        <div className="action-group">
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
            <div className={`batch-bar ${selectedIds.length > 0 ? 'visible' : ''}`}>
                <div className="batch-count">
                    <strong>{selectedIds.length}</strong> <span>Selected</span>
                </div>
                <div className="batch-actions">
                    <button onClick={() => processAction(selectedIds, 'approved')} className="b-btn b-approve"><FiCheckCircle/> <span className="hide-mobile">Approve</span></button>
                    <button onClick={() => processAction(selectedIds, 'rejected')} className="b-btn b-reject"><FiXCircle/> <span className="hide-mobile">Reject</span></button>
                    <button onClick={() => processAction(selectedIds, 'deleted')} className="b-btn b-delete"><FiTrash2/> <span className="hide-mobile">Delete</span></button>
                    <button onClick={() => setSelectedIds([])} className="b-cancel">Cancel</button>
                </div>
            </div>

            <style>
                {`
                    .withdrawal-root {
                        max-width: 1600px;
                        margin: 0 auto;
                        background: ${isDark ? '#000' : '#ffffff'};
                        border-radius: 32px;
                        padding: clamp(16px, 3vw, 40px);
                        border: 1px solid ${isDark ? '#222' : '#f0f0f0'};
                        min-height: 85vh;
                        font-family: 'Inter', system-ui, sans-serif;
                    }

                    /* Header Logic */
                    .management-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 40px;
                        gap: 20px;
                    }

                    .brand-badge {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        color: #888;
                        font-size: 11px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 8px;
                    }

                    .management-header h1 {
                        font-size: clamp(22px, 4vw, 34px);
                        font-weight: 900;
                        margin: 0;
                        letter-spacing: -1.5px;
                    }

                    /* Filter Scroll for Mobile */
                    .filter-scroll-container {
                        overflow-x: auto;
                        padding-bottom: 5px;
                        -webkit-overflow-scrolling: touch;
                    }
                    .filter-pill-box {
                        display: flex;
                        background: ${isDark ? '#111' : '#f4f4f4'};
                        padding: 4px;
                        border-radius: 14px;
                        white-space: nowrap;
                    }

                    .pill, .active-pill {
                        padding: 8px 18px;
                        border: none;
                        border-radius: 11px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 700;
                        transition: 0.2s;
                        text-transform: capitalize;
                    }
                    .pill { background: transparent; color: #888; }
                    .active-pill { 
                        background: ${isDark ? '#333' : '#fff'}; 
                        color: ${isDark ? '#fff' : '#000'};
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    }

                    .selection-info {
                        margin-bottom: 16px;
                        display: flex;
                        align-items: center;
                    }
                    .checkbox-wrapper {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        color: #007AFF;
                    }

                    /* Table Refinement */
                    .grid-wrapper { width: 100%; }
                    .ultra-table { width: 100%; border-collapse: collapse; }
                    .ultra-table th {
                        text-align: left;
                        padding: 16px;
                        font-size: 11px;
                        text-transform: uppercase;
                        color: #666;
                        border-bottom: 1px solid ${isDark ? '#222' : '#eee'};
                    }
                    .ultra-table td {
                        padding: 18px 16px;
                        border-bottom: 1px solid ${isDark ? '#111' : '#f9f9f9'};
                    }

                    .check-cell { font-size: 20px; color: #007AFF; cursor: pointer; width: 40px; }
                    .user-email { font-weight: 700; font-size: 15px; }
                    .user-id { font-size: 11px; opacity: 0.5; font-family: monospace; }
                    .amount-cell { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${isDark ? '#fff' : '#000'}; }
                    .routing-info { display: flex; align-items: center; gap: 8px; font-size: 13px; opacity: 0.8; }
                    .action-group { display: flex; gap: 12px; justify-content: flex-end; }

                    .status-badge {
                        padding: 5px 12px;
                        border-radius: 8px;
                        font-size: 10px;
                        font-weight: 900;
                        text-transform: uppercase;
                    }
                    .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                    .status-badge.approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                    .status-badge.rejected { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

                    .icon-btn { background: none; border: none; cursor: pointer; font-size: 20px; transition: 0.2s; }
                    .icon-btn.approve { color: #10b981; }
                    .icon-btn.reject { color: #ef4444; }
                    .icon-btn:hover { transform: scale(1.2) translateY(-2px); }

                    /* Floating Batch Bar */
                    .batch-bar {
                        position: fixed;
                        bottom: 24px;
                        left: 50%;
                        transform: translate(-50%, 100px);
                        background: ${isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)'};
                        backdrop-filter: blur(20px);
                        padding: 12px 24px;
                        border-radius: 100px;
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        z-index: 1000;
                        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        width: max-content;
                        max-width: 95vw;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                    }
                    .batch-bar.visible { transform: translate(-50%, 0); }
                    .batch-count { 
                        color: ${isDark ? '#000' : '#fff'}; 
                        border-right: 1px solid #555; 
                        padding-right: 15px;
                        font-size: 14px;
                    }
                    .batch-actions { display: flex; gap: 10px; align-items: center; }
                    .b-btn { 
                        border: none; padding: 8px 16px; border-radius: 50px; 
                        color: #fff; font-weight: 700; cursor: pointer; 
                        display: flex; align-items: center; gap: 8px; font-size: 12px;
                    }
                    .b-approve { background: #10b981; }
                    .b-reject { background: #f59e0b; }
                    .b-delete { background: #ef4444; }
                    .b-cancel { background: transparent; border: none; color: #888; cursor: pointer; padding: 0 10px; }

                    /* Responsiveness Matrix */
                    @media (max-width: 1100px) {
                        .hide-tablet { display: none; }
                    }

                    @media (max-width: 768px) {
                        .management-header { flex-direction: column; align-items: flex-start; }
                        .filter-scroll-container { width: 100%; }
                        
                        .hide-mobile { display: none; }
                        .ultra-table thead { display: none; }
                        
                        .ultra-table tr { 
                            display: block; 
                            background: ${isDark ? '#080808' : '#fff'};
                            border: 1px solid ${isDark ? '#1a1a1a' : '#eee'};
                            border-radius: 24px;
                            margin-bottom: 16px;
                            padding: 12px;
                        }

                        .ultra-table td { 
                            display: flex; 
                            justify-content: space-between; 
                            align-items: center; 
                            border: none; 
                            padding: 10px 12px; 
                        }

                        .ultra-table td::before { 
                            content: attr(data-label); 
                            font-weight: 800; 
                            color: #888; 
                            font-size: 10px; 
                            text-transform: uppercase; 
                        }

                        .check-cell { order: -1; width: 100% !important; border-bottom: 1px solid ${isDark ? '#1a1a1a' : '#f0f0f0'} !important; margin-bottom: 8px; }
                        .check-cell::before { content: "Select Record"; }

                        .batch-bar { border-radius: 20px; width: 90vw; flex-direction: column; bottom: 10px; gap: 10px; padding: 16px; }
                        .batch-count { border: none; padding: 0; }
                        .batch-actions { flex-wrap: wrap; justify-content: center; }
                    }
                `}
            </style>
        </div>
    );
}

export default WithdrawalManagement;
