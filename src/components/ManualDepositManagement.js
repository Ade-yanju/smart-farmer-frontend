import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../axiosConfig';
import { 
    FiCheckCircle, FiXCircle, FiUser, FiCreditCard, 
    FiCalendar, FiClock, FiSearch, FiInbox 
} from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

function ManualDepositManagement() {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { showModal } = useModal();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const fetchDeposits = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/admin/manual-deposits');
            setDeposits(response.data);
        } catch (err) {
            showModal('System Link Interrupted: Could not sync deposits.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDeposits(); }, []);

    // Logic: Quick Stats
    const totalPendingAmount = useMemo(() => 
        deposits.reduce((acc, curr) => acc + curr.amount, 0), [deposits]);

    const filteredDeposits = useMemo(() => 
        deposits.filter(d => 
            d.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            d.senderName?.toLowerCase().includes(searchQuery.toLowerCase())
        ), [deposits, searchQuery]);

    const handleUpdateStatus = async (id, status, userId, amount) => {
        const confirmMsg = status === 'approved' ? 'Authorize and credit user?' : 'Decline this deposit?';
        if (!window.confirm(`ACTION REQUIRED: ${confirmMsg}`)) return;
        
        try {
            await apiClient.post('/admin/manual-deposits/update', { id, status, userId, amount });
            showModal(`Transaction ${status.toUpperCase()} successfully.`);
            fetchDeposits();
        } catch (error) {
            showModal('Protocol Error: Update failed.');
        }
    };

    if (loading) return (
        <div className="modern-loader">
            <div className="spinner"></div>
            <span>DECRYPTING DATASTREAM...</span>
        </div>
    );

    return (
        <div className={`admin-root ${isDark ? 'dark-theme' : 'light-theme'}`}>
            {/* TOP COMMAND BAR */}
            <header className="admin-header">
                <div className="title-section">
                    <h1>Deposit Authorization</h1>
                    <p>Review and validate incoming liquidity flows.</p>
                </div>
                
                <div className="stats-pill">
                    <span className="label">Awaiting Clearance</span>
                    <span className="value">₦{totalPendingAmount.toLocaleString()}</span>
                </div>
            </header>

            {/* CONTROL PLANE */}
            <div className="control-plane">
                <div className="search-container">
                    <FiSearch />
                    <input 
                        placeholder="Filter by name or identity..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="entry-count">{filteredDeposits.length} Records found</div>
            </div>

            {/* DATA VIEW */}
            {filteredDeposits.length === 0 ? (
                <div className="empty-state">
                    <FiInbox size={48} />
                    <h3>Inbox Clear</h3>
                    <p>No pending manual deposits require attention.</p>
                </div>
            ) : (
                <div className="responsive-container">
                    <table className="neo-table desktop-only">
                        <thead>
                            <tr>
                                <th>Identity</th>
                                <th>Funding Details</th>
                                <th>Timestamp</th>
                                <th style={{ textAlign: 'right' }}>Authorization</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeposits.map(req => (
                                <tr key={req.id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="avatar"><FiUser /></div>
                                            <div>
                                                <div className="primary">{req.senderName}</div>
                                                <div className="secondary">{req.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="amount-cell">₦{req.amount.toLocaleString()}</div>
                                        <div className="secondary">Source: Bank Transfer</div>
                                    </td>
                                    <td>
                                        <div className="date-cell">
                                            <FiCalendar size={12} />
                                            {new Date(req.createdAt.seconds * 1000).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="actions-cell">
                                        <button onClick={() => handleUpdateStatus(req.id, 'approved', req.userId, req.amount)} className="btn-approve" title="Approve"><FiCheckCircle /> Approve</button>
                                        <button onClick={() => handleUpdateStatus(req.id, 'rejected', req.userId, req.amount)} className="btn-reject" title="Reject"><FiXCircle /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* MOBILE CARD VIEW (Responsive Switch) */}
                    <div className="mobile-cards mobile-only">
                        {filteredDeposits.map(req => (
                            <div key={req.id} className="request-card">
                                <div className="card-header">
                                    <span className="card-amount">₦{req.amount.toLocaleString()}</span>
                                    <div className="card-date"><FiClock /> {new Date(req.createdAt.seconds * 1000).toLocaleDateString()}</div>
                                </div>
                                <div className="card-body">
                                    <div className="detail"><FiUser /> <span>{req.senderName}</span></div>
                                    <div className="detail-sub">{req.email}</div>
                                </div>
                                <div className="card-actions">
                                    <button onClick={() => handleUpdateStatus(req.id, 'approved', req.userId, req.amount)} className="btn-approve-mob">Approve</button>
                                    <button onClick={() => handleUpdateStatus(req.id, 'rejected', req.userId, req.amount)} className="btn-reject-mob">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                .admin-root {
                    --accent: #007AFF;
                    --bg: ${isDark ? '#0A0A0B' : '#F2F4F7'};
                    --card-bg: ${isDark ? '#161618' : '#FFFFFF'};
                    --text: ${isDark ? '#FFFFFF' : '#101828'};
                    --text-muted: ${isDark ? '#8E8E93' : '#667085'};
                    --border: ${isDark ? '#2C2C2E' : '#E4E7EC'};
                    --success: #34C759;
                    --error: #FF3B30;

                    min-height: 100vh;
                    background: var(--bg);
                    color: var(--text);
                    padding: clamp(1rem, 5vw, 3rem);
                    font-family: 'Inter', -apple-system, sans-serif;
                }

                /* Header & Control Plane */
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }
                .admin-header h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; margin: 0; }
                .admin-header p { color: var(--text-muted); margin: 5px 0 0; }

                .stats-pill {
                    background: var(--accent);
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 10px 20px rgba(0, 122, 255, 0.2);
                }
                .stats-pill .label { font-size: 0.75rem; text-transform: uppercase; font-weight: 700; opacity: 0.8; }
                .stats-pill .value { font-size: 1.5rem; font-weight: 800; }

                .control-plane {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .search-container {
                    background: var(--card-bg);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 0.8rem 1.2rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    max-width: 400px;
                    transition: all 0.2s ease;
                }
                .search-container:focus-within { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1); }
                .search-container input { background: none; border: none; outline: none; color: inherit; width: 100%; font-size: 1rem; }
                .entry-count { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }

                /* Table Styles */
                .neo-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0 0.75rem;
                }
                .neo-table th { padding: 1rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; }
                .neo-table tr td { 
                    background: var(--card-bg); 
                    padding: 1.5rem 1rem; 
                    transition: transform 0.2s ease;
                }
                .neo-table tr td:first-child { border-radius: 16px 0 0 16px; border-left: 1px solid var(--border); }
                .neo-table tr td:last-child { border-radius: 0 16px 16px 0; border-right: 1px solid var(--border); }
                .neo-table tr td { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
                .neo-table tr:hover td { transform: scale(1.005); }

                .user-info { display: flex; align-items: center; gap: 12px; }
                .avatar { width: 40px; height: 40px; border-radius: 12px; background: rgba(0, 122, 255, 0.1); color: var(--accent); display: grid; place-items: center; }
                .primary { font-weight: 700; font-size: 1rem; }
                .secondary { font-size: 0.85rem; color: var(--text-muted); }
                .amount-cell { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 1.1rem; }

                /* Buttons */
                .actions-cell { text-align: right; display: flex; justify-content: flex-end; gap: 10px; }
                .btn-approve { 
                    background: var(--success); color: white; border: none; padding: 0.6rem 1.2rem; 
                    border-radius: 10px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer;
                }
                .btn-reject { 
                    background: rgba(255, 59, 48, 0.1); color: var(--error); border: 1px solid var(--error);
                    padding: 0.6rem; border-radius: 10px; cursor: pointer;
                }

                /* Mobile Card View */
                .mobile-only { display: none; }
                .desktop-only { display: table; }

                @media (max-width: 768px) {
                    .desktop-only { display: none; }
                    .mobile-only { display: flex; flex-direction: column; gap: 1rem; }
                    .admin-header h1 { font-size: 1.8rem; }
                    .request-card {
                        background: var(--card-bg);
                        border: 1px solid var(--border);
                        border-radius: 20px;
                        padding: 1.5rem;
                    }
                    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                    .card-amount { font-size: 1.4rem; font-weight: 900; }
                    .card-date { font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }
                    .detail { font-weight: 700; display: flex; align-items: center; gap: 8px; }
                    .detail-sub { font-size: 0.85rem; color: var(--text-muted); padding-left: 24px; margin-bottom: 1.5rem; }
                    .card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                    .card-actions button { padding: 1rem; border-radius: 12px; border: none; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; }
                    .btn-approve-mob { background: var(--success); color: white; }
                    .btn-reject-mob { background: var(--error); color: white; }
                }

                .modern-loader { 
                    height: 80vh; display: flex; flex-direction: column; align-items: center; 
                    justify-content: center; gap: 20px; font-weight: 800; letter-spacing: 2px;
                }
                .spinner { width: 50px; height: 50px; border: 5px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s infinite linear; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .empty-state { text-align: center; padding: 100px 20px; color: var(--text-muted); }
            `}</style>
        </div>
    );
}

export default ManualDepositManagement;
