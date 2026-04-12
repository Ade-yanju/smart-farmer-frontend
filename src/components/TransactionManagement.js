import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../axiosConfig'; 
import { 
    FiArrowUpRight, FiArrowDownLeft, FiSearch, FiTrash2, 
    FiCheckCircle, FiXCircle, FiFilter, FiActivity, 
    FiSquare, FiCheckSquare, FiDownloadCloud 
} from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

function TransactionManagement() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]);
    
    const { showModal } = useModal();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/admin/transactions');
            setTransactions(response.data);
            setSelectedIds([]);
        } catch (err) {
            setError('Ledger synchronization failed. Encrypted link unstable.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTransactions(); }, []);

    // --- Search & Filter Engine ---
    const filteredData = useMemo(() => {
        return transactions.filter(tx => {
            const matchesSearch = tx.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 tx.details?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filter === 'all' || tx.type?.toLowerCase() === filter;
            return matchesSearch && matchesFilter;
        });
    }, [transactions, searchQuery, filter]);

    // --- Batch Action Logic ---
    const handleBatch = async (status) => {
        const confirmMsg = status === 'deleted' ? 'Purge records permanently?' : `Update ${selectedIds.length} items to ${status}?`;
        if (!window.confirm(`SECURITY OVERRIDE: ${confirmMsg}`)) return;

        try {
            await Promise.all(selectedIds.map(id => 
                apiClient.post('/admin/transactions/update', { id, status })
            ));
            showModal(`Successfully processed ${selectedIds.length} logs.`);
            fetchTransactions();
        } catch (err) {
            showModal('Batch sequence interrupted by server.');
        }
    };

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === filteredData.length ? [] : filteredData.map(t => t.id));
    };

    if (loading) return <div style={{padding: '100px', textAlign: 'center', letterSpacing: '4px', opacity: 0.5}}>ENCRYPTING DATASTREAM...</div>;

    return (
        <div className="tx-management-root">
            {/* Header Control Plane */}
            <div className="header-grid">
                <div className="title-block">
                    <div className="status-indicator"><FiActivity /> System Live</div>
                    <h1>Platform Ledger</h1>
                    <p>Audit and manage cross-platform liquidity movement.</p>
                </div>

                <div className="action-row">
                    <div className="search-box">
                        <FiSearch />
                        <input 
                            placeholder="Search identity or hash..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-dropdown">
                        <option value="all">All Flows</option>
                        <option value="deposit">Deposits</option>
                        <option value="withdrawal">Withdrawals</option>
                        <option value="transfer">Transfers</option>
                    </select>
                    <button className="export-btn" title="Export CSV"><FiDownloadCloud /></button>
                </div>
            </div>

            {/* Selection Status Bar */}
            {selectedIds.length > 0 && (
                <div className="selection-bar">
                    <span>{selectedIds.length} logs selected</span>
                    <div className="bar-actions">
                        <button onClick={() => handleBatch('approved')} className="batch-approve"><FiCheckCircle /> Approve</button>
                        <button onClick={() => handleBatch('rejected')} className="batch-reject"><FiXCircle /> Reject</button>
                        <button onClick={() => handleBatch('deleted')} className="batch-delete"><FiTrash2 /> Purge</button>
                    </div>
                </div>
            )}

            {/* Main Data Grid */}
            <div className="grid-container">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th style={{width: '40px'}} onClick={toggleSelectAll}>
                                {selectedIds.length > 0 && selectedIds.length === filteredData.length ? <FiCheckSquare /> : <FiSquare />}
                            </th>
                            <th>Flow Identity</th>
                            <th className="hide-mobile">Classification</th>
                            <th>Volume</th>
                            <th className="hide-tablet">Timeline</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(tx => (
                            <tr key={tx.id} className={selectedIds.includes(tx.id) ? 'row-selected' : ''}>
                                <td onClick={() => setSelectedIds(prev => prev.includes(tx.id) ? prev.filter(i => i !== tx.id) : [...prev, tx.id])}>
                                    {selectedIds.includes(tx.id) ? <FiCheckSquare color="#007AFF"/> : <FiSquare opacity={0.3}/>}
                                </td>
                                <td data-label="Identity">
                                    <div className="user-email">{tx.email}</div>
                                    <div className="tx-details">{tx.details}</div>
                                </td>
                                <td data-label="Type" className="hide-mobile">
                                    <span className={`type-tag ${tx.type?.toLowerCase()}`}>
                                        {tx.type === 'deposit' ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                                        {tx.type}
                                    </span>
                                </td>
                                <td data-label="Amount">
                                    <div className="amount-text">₦{tx.amount.toLocaleString()}</div>
                                </td>
                                <td data-label="Date" className="hide-tablet">
                                    <div className="date-text">
                                        {tx.createdAt ? new Date(tx.createdAt.seconds * 1000).toLocaleDateString([], {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'N/A'}
                                    </div>
                                </td>
                                <td data-label="Status">
                                    <span className={`status-pill ${tx.status?.toLowerCase()}`}>{tx.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>
                {`
                    .tx-management-root {
                        background: ${isDark ? '#050505' : '#fff'};
                        color: ${isDark ? '#eee' : '#111'};
                        padding: clamp(16px, 3vw, 40px);
                        border-radius: 30px;
                        min-height: 90vh;
                        font-family: 'Inter', system-ui, sans-serif;
                    }

                    /* --- Header Section --- */
                    .header-grid {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        margin-bottom: 40px;
                        gap: 24px;
                        flex-wrap: wrap;
                    }
                    .status-indicator {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        color: #10b981;
                        font-weight: 800;
                        margin-bottom: 8px;
                    }
                    .title-block h1 { font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1.2px; }
                    .title-block p { opacity: 0.5; margin-top: 5px; font-size: 14px; }

                    .action-row { display: flex; gap: 12px; align-items: center; }
                    .search-box {
                        background: ${isDark ? '#111' : '#f5f5f7'};
                        padding: 10px 16px;
                        border-radius: 14px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border: 1px solid ${isDark ? '#222' : '#eee'};
                    }
                    .search-box input { background: none; border: none; color: inherit; outline: none; width: 200px; }
                    
                    .filter-dropdown {
                        background: ${isDark ? '#111' : '#fff'};
                        border: 1px solid ${isDark ? '#222' : '#eee'};
                        color: inherit;
                        padding: 10px;
                        border-radius: 12px;
                        font-weight: 600;
                    }

                    /* --- Floating Selection Bar --- */
                    .selection-bar {
                        position: sticky;
                        top: 20px;
                        z-index: 100;
                        background: #007AFF;
                        color: white;
                        padding: 12px 24px;
                        border-radius: 100px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 20px 40px rgba(0,122,255,0.3);
                        margin-bottom: 24px;
                        animation: slideDown 0.3s ease-out;
                    }
                    .bar-actions { display: flex; gap: 10px; }
                    .bar-actions button {
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        padding: 6px 14px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 700;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        transition: 0.2s;
                    }
                    .bar-actions button:hover { background: rgba(255,255,255,0.3); }

                    /* --- Table Styles --- */
                    .modern-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
                    .modern-table th { padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; opacity: 0.4; }
                    .modern-table tr td { 
                        padding: 18px 12px; 
                        background: ${isDark ? '#0c0c0c' : '#fcfcfd'}; 
                        transition: 0.2s;
                    }
                    .modern-table tr td:first-child { border-radius: 16px 0 0 16px; }
                    .modern-table tr td:last-child { border-radius: 0 16px 16px 0; }
                    .modern-table tr:hover td { background: ${isDark ? '#161616' : '#f5f5f7'}; }
                    .row-selected td { background: ${isDark ? '#001a33' : '#e6f2ff'} !important; }

                    .user-email { font-weight: 700; font-size: 15px; }
                    .tx-details { font-size: 12px; opacity: 0.5; margin-top: 2px; }
                    .amount-text { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 16px; }

                    .type-tag {
                        display: inline-flex;
                        align-items: center;
                        gap: 5px;
                        padding: 4px 10px;
                        border-radius: 8px;
                        font-size: 11px;
                        font-weight: 700;
                        text-transform: uppercase;
                    }
                    .type-tag.deposit { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                    .type-tag.withdrawal { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

                    .status-pill {
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 800;
                        text-transform: uppercase;
                        background: ${isDark ? '#222' : '#eee'};
                    }
                    .status-pill.success { background: #10b981; color: white; }
                    .status-pill.pending { background: #f59e0b; color: white; }

                    @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                    /* === UNIVERSAL RESPONSIVITY === */
                    @media (max-width: 900px) {
                        .hide-tablet { display: none; }
                        .header-grid { flex-direction: column; align-items: flex-start; }
                        .action-row { width: 100%; flex-direction: column; }
                        .search-box { width: 100%; box-sizing: border-box; }
                        .search-box input { width: 100%; }
                        .filter-dropdown { width: 100%; }
                    }

                    @media (max-width: 600px) {
                        .hide-mobile { display: none; }
                        .modern-table thead { display: none; }
                        .modern-table tr { display: block; margin-bottom: 20px; }
                        .modern-table td { display: flex; justify-content: space-between; align-items: center; border: none !important; padding: 12px 16px !important; }
                        .modern-table td:first-child { border-radius: 16px 16px 0 0; }
                        .modern-table td:last-child { border-radius: 0 0 16px 16px; border-top: 1px solid ${isDark ? '#222' : '#eee'}; }
                        .modern-table td::before { content: attr(data-label); font-weight: 800; font-size: 10px; opacity: 0.4; text-transform: uppercase; }
                        .selection-bar { border-radius: 20px; flex-direction: column; gap: 10px; }
                    }
                `}
            </style>
        </div>
    );
}

export default TransactionManagement;
