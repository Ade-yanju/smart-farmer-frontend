import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../axiosConfig'; 
import { 
    FiCheckCircle, FiXCircle, FiClock, FiCreditCard, 
    FiTrash2, FiLayers, FiSquare, FiCheckSquare, FiExternalLink, FiChevronRight, FiInfo, FiUser
} from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

function WithdrawalManagement() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]); 
    const [viewDetail, setViewDetail] = useState(null); // Detail Modal State
    
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
            showModal('System Link Failure: Ledger sync interrupted.');
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

    const toggleSelectOne = (e, id) => {
        e.stopPropagation(); // Prevent opening modal when clicking checkbox
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const processAction = async (ids, status) => {
        const actionText = status === 'deleted' ? 'purge' : `mark as ${status}`;
        if (!window.confirm(`AUTHORIZATION REQUIRED: Proceed with ${actionText} for ${ids.length} records?`)) return;

        try {
            await Promise.all(ids.map(id => 
                apiClient.post('/admin/withdrawals/update', { id, status })
            ));
            showModal(`Success: ${ids.length} entries updated.`);
            setViewDetail(null);
            fetchWithdrawals();
        } catch (err) {
            showModal('Action Failed: Batch sequence error.');
        }
    };

    return (
        <div className={`withdrawal-root ${isDark ? 'dark' : 'light'}`}>
            {/* Header Section */}
            <header className="mgmt-header">
                <div className="header-left">
                    <div className="status-pill-group">
                        <FiLayers className="brand-icon" />
                        <span>Treasury Ops</span>
                    </div>
                    <h1>Withdrawal Pipeline</h1>
                </div>
                
                <div className="filter-wrapper">
                    <div className="filter-scroll">
                        {['all', 'pending', 'approved', 'rejected'].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setFilter(t)} 
                                className={filter === t ? 'pill active' : 'pill'}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Selection Toolbar */}
            <div className="toolbar">
                <button className="select-all-btn" onClick={toggleSelectAll}>
                    {selectedIds.length === filteredWithdrawals.length && filteredWithdrawals.length > 0 ? <FiCheckSquare /> : <FiSquare />}
                    <span>{selectedIds.length} Selected</span>
                </button>
            </div>

            {/* Main Data Container */}
            <div className="data-container">
                <table className="neo-table">
                    <thead>
                        <tr>
                            <th className="w-check"></th>
                            <th>Beneficiary</th>
                            <th className="hide-sm">Amount</th>
                            <th className="hide-md">Routing Detail</th>
                            <th className="hide-lg">Date</th>
                            <th>Status</th>
                            <th className="text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWithdrawals.map(req => (
                            <tr 
                                key={req.id} 
                                className={`${selectedIds.includes(req.id) ? 'selected' : ''} ${req.status}`}
                                onClick={() => setViewDetail(req)}
                            >
                                <td className="w-check" onClick={(e) => toggleSelectOne(e, req.id)}>
                                    {selectedIds.includes(req.id) ? <FiCheckSquare className="active-icon" /> : <FiSquare />}
                                </td>
                                <td>
                                    <div className="user-blob">
                                        <span className="u-email">{req.email}</span>
                                        <span className="u-id hide-sm">{req.id.slice(0, 8)}</span>
                                        <span className="mobile-amount hide-lg">₦{req.amount.toLocaleString()}</span>
                                    </div>
                                </td>
                                <td className="hide-sm font-mono font-bold">₦{req.amount.toLocaleString()}</td>
                                <td className="hide-md">
                                    <div className="routing-preview">
                                        <FiCreditCard /> {req.bankDetails?.bankName} (••{req.bankDetails?.accountNumber?.slice(-4)})
                                    </div>
                                </td>
                                <td className="hide-lg date-text">
                                    {new Date(req.createdAt.seconds * 1000).toLocaleDateString()}
                                </td>
                                <td>
                                    <span className={`badge ${req.status}`}>{req.status}</span>
                                </td>
                                <td className="text-right">
                                    <FiChevronRight className="detail-arrow" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* DETAIL SLIDE-OVER MODAL */}
            {viewDetail && (
                <div className="modal-overlay" onClick={() => setViewDetail(null)}>
                    <div className="slide-over" onClick={e => e.stopPropagation()}>
                        <div className="so-header">
                            <button className="close-so" onClick={() => setViewDetail(null)}><FiXCircle /></button>
                            <h2>Transaction Detail</h2>
                        </div>
                        
                        <div className="so-content">
                            <div className="so-amount-card">
                                <label>Total Request</label>
                                <div className="amt">₦{viewDetail.amount.toLocaleString()}</div>
                                <span className={`badge ${viewDetail.status}`}>{viewDetail.status}</span>
                            </div>

                            <section className="so-section">
                                <h3><FiUser /> Beneficiary</h3>
                                <div className="info-box">
                                    <div className="row"><span>Email</span><strong>{viewDetail.email}</strong></div>
                                    <div className="row"><span>System ID</span><strong>{viewDetail.id}</strong></div>
                                </div>
                            </section>

                            <section className="so-section">
                                <h3><FiCreditCard /> Destination Routing</h3>
                                <div className="info-box">
                                    <div className="row"><span>Bank</span><strong>{viewDetail.bankDetails?.bankName}</strong></div>
                                    <div className="row"><span>Account No</span><strong>{viewDetail.bankDetails?.accountNumber}</strong></div>
                                    <div className="row"><span>Account Name</span><strong>{viewDetail.bankDetails?.accountName || 'N/A'}</strong></div>
                                </div>
                            </section>

                            <section className="so-section">
                                <h3><FiClock /> Timestamp</h3>
                                <div className="info-box">
                                    <div className="row"><span>Requested on</span><strong>{new Date(viewDetail.createdAt.seconds * 1000).toLocaleString()}</strong></div>
                                </div>
                            </section>

                            {viewDetail.status === 'pending' && (
                                <div className="so-actions">
                                    <button onClick={() => processAction([viewDetail.id], 'approved')} className="so-btn approve">Authorize Funds</button>
                                    <button onClick={() => processAction([viewDetail.id], 'rejected')} className="so-btn reject">Decline Request</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* BATCH ACTION BAR */}
            <div className={`batch-fab ${selectedIds.length > 0 ? 'active' : ''}`}>
                <div className="fab-info"><strong>{selectedIds.length}</strong> Records Selected</div>
                <div className="fab-btns">
                    <button onClick={() => processAction(selectedIds, 'approved')} className="f-btn app"><FiCheckCircle /> <span>Approve</span></button>
                    <button onClick={() => processAction(selectedIds, 'rejected')} className="f-btn rej"><FiXCircle /> <span>Reject</span></button>
                    <button onClick={() => processAction(selectedIds, 'deleted')} className="f-btn del"><FiTrash2 /></button>
                </div>
            </div>

            <style>{`
                .withdrawal-root {
                    --bg: ${isDark ? '#080808' : '#F9FAFB'};
                    --card: ${isDark ? '#121212' : '#FFFFFF'};
                    --border: ${isDark ? '#1F1F1F' : '#E5E7EB'};
                    --text: ${isDark ? '#F3F4F6' : '#111827'};
                    --muted: ${isDark ? '#9CA3AF' : '#6B7280'};
                    --accent: #007AFF;
                    --success: #10B981;
                    --error: #EF4444;

                    background: var(--bg);
                    color: var(--text);
                    min-height: 100vh;
                    padding: clamp(1rem, 4vw, 3rem);
                    font-family: 'Inter', system-ui, sans-serif;
                }

                .mgmt-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    flex-wrap: wrap;
                    gap: 2rem;
                    margin-bottom: 2.5rem;
                }

                .status-pill-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: ${isDark ? '#1F1F1F' : '#E5E7EB'};
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--muted);
                    margin-bottom: 0.75rem;
                }

                .mgmt-header h1 { font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 900; margin: 0; letter-spacing: -1.5px; }

                /* Pills */
                .filter-scroll { display: flex; gap: 8px; background: var(--card); border: 1px solid var(--border); padding: 4px; border-radius: 14px; }
                .pill { padding: 8px 16px; border: none; background: none; color: var(--muted); border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.2s; }
                .pill.active { background: var(--bg); color: var(--accent); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

                /* Table Design */
                .data-container { background: var(--card); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
                .neo-table { width: 100%; border-collapse: collapse; }
                .neo-table th { padding: 1.25rem; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); border-bottom: 1px solid var(--border); }
                .neo-table td { padding: 1.25rem; border-bottom: 1px solid var(--border); transition: 0.2s; cursor: pointer; }
                .neo-table tr:hover td { background: ${isDark ? '#1A1A1A' : '#F9FAFB'}; }
                
                .user-blob { display: flex; flex-direction: column; gap: 2px; }
                .u-email { font-weight: 700; font-size: 14px; }
                .u-id { font-size: 11px; color: var(--muted); font-family: monospace; }
                .mobile-amount { font-weight: 800; color: var(--accent); margin-top: 4px; }

                .badge { padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
                .badge.pending { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
                .badge.approved { background: rgba(16, 185, 129, 0.1); color: var(--success); }
                .badge.rejected { background: rgba(239, 68, 68, 0.1); color: var(--error); }

                /* Detail Slide-over */
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); z-index: 2000; display: flex; justify-content: flex-end; }
                .slide-over { width: 100%; max-width: 450px; background: var(--bg); height: 100%; box-shadow: -10px 0 50px rgba(0,0,0,0.2); animation: slideIn 0.3s ease-out; overflow-y: auto; }
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

                .so-header { padding: 2rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 1rem; }
                .so-header h2 { margin: 0; font-size: 1.25rem; font-weight: 800; }
                .close-so { background: none; border: none; font-size: 1.5rem; color: var(--muted); cursor: pointer; }

                .so-content { padding: 2rem; }
                .so-amount-card { background: var(--accent); color: white; padding: 2rem; border-radius: 20px; margin-bottom: 2rem; }
                .so-amount-card label { font-size: 11px; text-transform: uppercase; font-weight: 700; opacity: 0.8; }
                .so-amount-card .amt { font-size: 2.5rem; font-weight: 900; margin: 0.5rem 0; font-family: 'JetBrains Mono', monospace; }

                .so-section { margin-bottom: 2rem; }
                .so-section h3 { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--muted); margin-bottom: 1rem; }
                .info-box { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; }
                .info-box .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; }
                .info-box .row:not(:last-child) { border-bottom: 1px solid var(--border); }
                .info-box .row span { color: var(--muted); }

                .so-actions { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 2rem; }
                .so-btn { padding: 1rem; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
                .so-btn.approve { background: var(--success); color: white; }
                .so-btn.reject { background: rgba(239, 68, 68, 0.1); color: var(--error); border: 1px solid var(--error); }

                /* Floating Batch Bar */
                .batch-fab {
                    position: fixed; bottom: 30px; left: 50%; transform: translate(-50%, 150%);
                    background: ${isDark ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)'};
                    color: ${isDark ? '#000' : '#fff'};
                    padding: 12px 24px; border-radius: 100px; display: flex; align-items: center; gap: 20px;
                    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 3000; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }
                .batch-fab.active { transform: translate(-50%, 0); }
                .fab-btns { display: flex; gap: 8px; }
                .f-btn { border: none; padding: 8px 16px; border-radius: 50px; font-weight: 700; font-size: 12px; display: flex; align-items: center; gap: 6px; cursor: pointer; }
                .f-btn.app { background: var(--success); color: white; }
                .f-btn.rej { background: #F59E0B; color: white; }
                .f-btn.del { background: var(--error); color: white; }

                /* Media Queries */
                @media (max-width: 1024px) { .hide-lg { display: none; } }
                @media (max-width: 768px) {
                    .hide-md { display: none; }
                    .withdrawal-root { padding: 1rem; }
                    .mgmt-header { margin-bottom: 1.5rem; }
                    .fab-btns span { display: none; }
                    .fab-info { font-size: 12px; }
                    .neo-table th:nth-child(3), .neo-table td:nth-child(3) { display: none; } /* Hide amount column, moved to user-blob */
                }
                @media (max-width: 480px) {
                    .hide-sm { display: none; }
                    .slide-over { max-width: 100%; }
                }

                .font-mono { font-family: 'JetBrains Mono', monospace; }
                .text-right { text-align: right; }
            `}</style>
        </div>
    );
}

export default WithdrawalManagement;
