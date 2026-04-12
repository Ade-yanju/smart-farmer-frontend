import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../axiosConfig'; 
import { FiEdit, FiTrash2, FiUser, FiShield, FiFilter, FiCheckSquare, FiSquare, FiX, FiSearch, FiMoreHorizontal } from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    const { showModal } = useModal();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/admin/users');
            setUsers(response.data);
            setError('');
        } catch (err) {
            setError('System link failure. Verify backend connectivity.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // --- NEW: LOGIC DEFINITIONS (Fixed the handleDeleteUser error) ---
    
    const handleDeleteUser = async (uid, email) => {
        if (!window.confirm(`CRITICAL: Permanently terminate account ${email}?`)) return;
        try {
            await apiClient.delete(`/admin/users/${uid}`);
            showModal('Identity purged successfully.');
            fetchUsers();
        } catch (err) {
            showModal('Operation failed. Check server logs.');
        }
    };

    const handleMassDelete = async () => {
        const count = selectedUsers.length;
        if (!window.confirm(`DESTRUCTION PROTOCOL: Purge ${count} accounts? This is irreversible.`)) return;
        try {
            await Promise.all(selectedUsers.map(uid => apiClient.delete(`/admin/users/${uid}`)));
            showModal(`${count} accounts removed.`);
            setSelectedUsers([]);
            fetchUsers();
        } catch (err) {
            showModal('Batch operation encountered errors.');
        }
    };

    const handleSetRole = async (uid, email, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await apiClient.post('/admin/users/setrole', { uid, role: newRole });
            showModal(`Access level for ${email} set to ${newRole}.`);
            fetchUsers();
        } catch (error) {
            showModal('Authorization handshake failed.');
        }
    };

    // --- FILTERING ---
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filter === 'all' || u.role === filter;
            return matchesSearch && matchesFilter;
        });
    }, [users, searchQuery, filter]);

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length && filteredUsers.length > 0) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(u => u.uid));
        }
    };

    const toggleSelectUser = (uid) => {
        setSelectedUsers(prev => 
            prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
        );
    };

    // --- 2026 ULTRA-MODERN STYLES ---
    const styles = {
        container: {
            position: 'relative',
            background: isDark ? 'linear-gradient(145deg, #0f0f0f, #1a1a1a)' : '#ffffff',
            borderRadius: '32px',
            padding: '32px',
            boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.04)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        batchOverlay: {
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: `translateX(-50%) translateY(${selectedUsers.length > 0 ? '0' : '100px'})`,
            background: isDark ? '#fff' : '#000',
            color: isDark ? '#000' : '#fff',
            padding: '12px 24px',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            zIndex: 1000,
            transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            opacity: selectedUsers.length > 0 ? 1 : 0
        },
        searchBar: {
            display: 'flex',
            alignItems: 'center',
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f3f4f6',
            borderRadius: '16px',
            padding: '0 16px',
            flex: 1,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
            transition: 'all 0.2s ease'
        },
        tableRow: (selected) => ({
            background: selected ? (isDark ? 'rgba(124, 58, 237, 0.08)' : 'rgba(124, 58, 237, 0.04)') : 'transparent',
            borderRadius: '16px',
            transition: 'background 0.2s ease'
        }),
        actionBtn: (type) => ({
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            background: type === 'delete' ? 'rgba(239, 68, 68, 0.1)' : (isDark ? 'rgba(255,255,255,0.05)' : '#fff'),
            color: type === 'delete' ? '#ef4444' : (isDark ? '#fff' : '#000'),
            boxShadow: type === 'delete' ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
        })
    };

    if (loading) return <div style={{padding: '100px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px'}}>SYNCHRONIZING...</div>;

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px'}}>
                <div>
                    <h1 style={{margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-1px'}}>Vault Access</h1>
                    <p style={{color: '#888', fontSize: '14px', marginTop: '4px'}}>Real-time user authority management</p>
                </div>
                <div style={{display: 'flex', background: isDark ? '#000' : '#f3f4f6', padding: '4px', borderRadius: '12px'}}>
                    {['all', 'admin', 'user'].map(t => (
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
                                transition: 'all 0.2s'
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions Bar */}
            <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
                <div style={styles.searchBar}>
                    <FiSearch color="#888" />
                    <input 
                        placeholder="Scan identities..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '14px',
                            color: isDark ? '#fff' : '#000',
                            width: '100%',
                            outline: 'none',
                            fontSize: '14px'
                        }}
                    />
                </div>
            </div>

            {/* Data Grid */}
            <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px'}}>
                    <thead>
                        <tr style={{color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>
                            <th style={{padding: '0 12px', width: '40px'}}>
                                <button onClick={toggleSelectAll} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', fontSize: '20px'}}>
                                    {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 ? <FiCheckSquare /> : <FiSquare color="#444"/>}
                                </button>
                            </th>
                            <th style={{textAlign: 'left', fontWeight: '600'}}>Identity</th>
                            <th style={{textAlign: 'left', fontWeight: '600'}}>Role</th>
                            <th style={{textAlign: 'left', fontWeight: '600'}}>Registration</th>
                            <th style={{textAlign: 'right', fontWeight: '600'}}>Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => {
                            const isSelected = selectedUsers.includes(user.uid);
                            return (
                                <tr key={user.uid} style={styles.tableRow(isSelected)}>
                                    <td style={{padding: '16px 12px'}}>
                                        <button onClick={() => toggleSelectUser(user.uid)} style={{background: 'none', border: 'none', cursor: 'pointer', color: isSelected ? '#7c3aed' : '#444', fontSize: '20px'}}>
                                            {isSelected ? <FiCheckSquare /> : <FiSquare />}
                                        </button>
                                    </td>
                                    <td style={{padding: '16px 12px'}}>
                                        <div style={{fontWeight: '700', color: isDark ? '#fff' : '#1a1a1a'}}>{user.email}</div>
                                        <div style={{fontSize: '11px', color: '#666', fontFamily: 'monospace', marginTop: '2px'}}>{user.uid.substring(0, 12)}...</div>
                                    </td>
                                    <td style={{padding: '16px 12px'}}>
                                        <span style={{
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            background: user.role === 'admin' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                            color: user.role === 'admin' ? '#a78bfa' : '#34d399',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            {user.role === 'admin' ? <FiShield size={12}/> : <FiUser size={12}/>}
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td style={{padding: '16px 12px', color: '#888', fontSize: '13px'}}>
                                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td style={{padding: '16px 12px'}}>
                                        <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                                            <button 
                                                style={styles.actionBtn('edit')} 
                                                onClick={() => handleSetRole(user.uid, user.email, user.role)}
                                                title="Elevate/Demote"
                                            >
                                                <FiEdit size={16}/>
                                            </button>
                                            <button 
                                                style={styles.actionBtn('delete')} 
                                                onClick={() => handleDeleteUser(user.uid, user.email)}
                                                title="Purge Identity"
                                            >
                                                <FiTrash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Batch Action Floating Overlay */}
            <div style={styles.batchOverlay}>
                <span style={{fontWeight: '800', fontSize: '14px'}}>{selectedUsers.length} Identities Selected</span>
                <div style={{width: '1px', height: '24px', background: isDark ? '#ddd' : '#333'}}></div>
                <button 
                    onClick={handleMassDelete}
                    style={{
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '100px',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <FiTrash2 /> Purge Selected
                </button>
                <button 
                    onClick={() => setSelectedUsers([])}
                    style={{background: 'none', border: 'none', color: isDark ? '#666' : '#ccc', cursor: 'pointer'}}
                >
                    <FiX size={20}/>
                </button>
            </div>

            <style>
                {`
                    tr:hover td {
                        background: ${isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb'};
                    }
                    tr td:first-child { border-radius: 12px 0 0 12px; }
                    tr td:last-child { border-radius: 0 12px 12px 0; }
                    input::placeholder { color: #555; }
                `}
            </style>
        </div>
    );
}

export default UserManagement;
