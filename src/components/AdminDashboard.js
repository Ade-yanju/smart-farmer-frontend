import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectManagement from './ProjectManagement';
import UserManagement from './UserManagement';
import WithdrawalManagement from './WithdrawalManagement';
import SystemActions from './SystemActions';
import TransactionManagement from './TransactionManagement';
import ManualDepositManagement from './ManualDepositManagement';
import { FiArrowLeft, FiBox, FiUsers, FiCreditCard, FiCpu, FiList, FiEdit } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('projects');
    const { theme } = useTheme();
    const logoSrc = theme === 'light' ? '/logo-light-theme.png' : '/logo-dark-theme.png';

    return (
        <div className="sv-page-container">
            {/* Upgraded Responsive Header */}
            <header className="sv-admin-header">
                <div className="sv-header-brand">
                    <img src={logoSrc} alt="Smart Farmer Logo" className="sv-header-logo" />
                    <div className="sv-header-text">
                        <h1>Admin Panel</h1>
                        <p>Manage your platform data securely.</p>
                    </div>
                </div>
                <Link to="/dashboard" className="sv-btn-back">
                    <FiArrowLeft className="sv-icon" /> Back to Dashboard
                </Link>
            </header>
            
            {/* Upgraded Dashboard Card */}
            <div className="sv-dashboard-card">
                {/* Scrollable Tabs for Mobile Compatibility */}
                <div className="sv-tabs-wrapper">
                    <div className="sv-admin-tabs">
                        <button className={`sv-tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
                            <FiBox className="sv-icon" /> Projects
                        </button>
                        <button className={`sv-tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                            <FiUsers className="sv-icon" /> Users
                        </button>
                        <button className={`sv-tab-btn ${activeTab === 'deposits' ? 'active' : ''}`} onClick={() => setActiveTab('deposits')}>
                            <FiEdit className="sv-icon" /> Deposits
                        </button>
                        <button className={`sv-tab-btn ${activeTab === 'withdrawals' ? 'active' : ''}`} onClick={() => setActiveTab('withdrawals')}>
                            <FiCreditCard className="sv-icon" /> Withdrawals
                        </button>
                        <button className={`sv-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
                            <FiList className="sv-icon" /> Transactions
                        </button>
                        <button className={`sv-tab-btn ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
                            <FiCpu className="sv-icon" /> System
                        </button>
                    </div>
                </div>

                {/* Tab Content Area */}
                <div className="sv-tab-content">
                    {activeTab === 'projects' && <ProjectManagement />}
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'withdrawals' && <WithdrawalManagement />}
                    {activeTab === 'deposits' && <ManualDepositManagement />}
                    {activeTab === 'transactions' && <TransactionManagement />}
                    {activeTab === 'system' && <SystemActions />}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
