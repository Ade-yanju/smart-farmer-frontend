import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../axiosConfig'; 
import { FiEdit, FiTrash2, FiUser, FiShield, FiFilter, FiCheckSquare, FiSquare, FiXCircle, FiSearch } from 'react-icons/fi';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filter, setFilter] = useState('all'); // all, admin, user
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

    // --- LOGIC: Filtering & Selection ---
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filter === 'all' || u.role === filter;
            return matchesSearch && matchesFilter;
        });
    }, [users, searchQuery, filter]);

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
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

    // --- ACTIONS ---
    const handleMassDelete = async () => {
        const count = selectedUsers.length;
        if (!window.confirm(`SECURITY PROTOCOL: Permanently terminate ${count} user accounts?`)) return;
        
        try {
            // Assuming backend supports batch delete or looping for now
            await Promise.all(selectedUsers.map(uid => apiClient.delete(`/admin/users/${uid}`)));
            showModal(`${count} accounts purged successfully.`);
            setSelectedUsers([]);
            fetchUsers();
        } catch (err) {
            showModal('Purge failed. Partial deletion may have occurred.');
        }
    };

    const handleSetRole = async (uid, email, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await apiClient.post('/admin/users/setrole', { uid, role: newRole });
            showModal(`Permissions updated for ${email}`);
            fetchUsers();
        } catch (error) {
            showModal('Authorization update failed.');
        }
    };

    // --- 2026 PREMIUM INLINE STYLES ---
    const styles = {
        wrapper: {
            padding: '24px',
            background: isDark ? 'rgba(10,10,10,0.4)' : '#fff',
            borderRadius: '24px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#eee'}`,
            fontFamily: "'Inter', sans-serif"
        },
        actionBar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
        },
        searchWrapper: {
            position: 'relative',
            flex: 1,
            minWidth: '280px'
        },
        input: {
            width: '100%',
            padding: '12px 16px 12px 40px',
            borderRadius: '12px',
            border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
            background: isDark ? '#000' : '#f9f9f9',
            color: isDark ? '#fff' : '#000',
            outline: 'none',
            fontSize: '14px'
        },
        filterPill: (active) => ({
            padding: '8px 16px',
            borderRadius: '100px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            background: active ? (isDark ? '#fff' : '#000') : (isDark ? '#222' : '#f0f0f0'),
            color: active ? (isDark ? '#000' : '#fff') : (isDark ? '#888' : '#666'),
            transition: 'all 0.2s ease'
        }),
        bulkDeleteBtn: {
            background: '#ff4d4d',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease'
        },
        table: {
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 8px'
        },
        tr: {
            background: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
            transition: 'transform 0.2s ease',
        },
        th: {
            padding: '12px',
            textAlign: 'left',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#888'
        },
        td: {
            padding: '16px 12px',
            borderBottom: isDark ? '1px solid #1a1a1a' : '1px solid #f5f5f5',
            fontSize: '14px'
        },
        badge: (role) => ({
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '800',
            textTransform: 'uppercase',
            background: role === 'admin' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: role === 'admin' ? '#8b5cf6' : '#10b981',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
        })
    };

    if (loading) return <div style={{padding: '40px', textAlign: 'center', color: '#888'}}>Decrypting User Directory...</div>;

    return (
        <div style={styles.wrapper}>
            <div style={styles.actionBar}>
                <div>
                    <h2 style={{margin: 0, fontWeight: 800, fontSize: '24px', letterSpacing: '-1px'}}>User Directory</h2>
                    <p style={{margin: '4px 0 0', color: '#888', fontSize: '13px'}}>Manage system access and permissions</p>
                </div>
                
                <div style={{display: 'flex', gap: '8px'}}>
                    {['all', 'admin', 'user'].map(t => (
                        <button 
                            key={t} 
                            style={styles.filterPill(filter === t)}
                            onClick={() => setFilter(t)}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div style={styles.actionBar}>
                <div style={styles.searchWrapper}>
                    <FiSearch style={{position: 'absolute', left: '14px', top: '14px', color: '#666'}} />
                    <input 
                        style={styles.input} 
                        placeholder="Search by email or UID..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {selectedUsers.length > 0 && (
                    <button style={styles.bulkDeleteBtn} onClick={handleMassDelete}>
                        <FiTrash2 /> Terminate ({selectedUsers.length})
                    </button>
                )}
            </div>

            <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{width: '40px'}}>
                                <button 
                                    onClick={toggleSelectAll}
                                    style={{background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#fff' : '#000', fontSize: '18px'}}
                                >
                                    {selectedUsers.length === filteredUsers.length ? <FiCheckSquare color="#7c3aed"/> : <FiSquare/>}
                                </button>
                            </th>
                            <th>User Identity</th>
                            <th>Permission Level</th>
                            <th>Joined</th>
                            <th style={{textAlign: 'right'}}>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => {
                            const isSelected = selectedUsers.includes(user.uid);
                            return (
                                <tr key={user.uid} style={styles.tr}>
                                    <td style={styles.td}>
                                        <button 
                                            onClick={() => toggleSelectUser(user.uid)}
                                            style={{background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#444' : '#ccc', fontSize: '18px'}}
                                        >
                                            {isSelected ? <FiCheckSquare color="#7c3aed"/> : <FiSquare/>}
                                        </button>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{fontWeight: 600}}>{user.email}</div>
                                        <div style={{fontSize: '11px', color: '#666', fontFamily: 'monospace'}}>{user.uid}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.badge(user.role)}>
                                            {user.role === 'admin' ? <FiShield /> : <FiUser />}
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td style={{...styles.td, textAlign: 'right'}}>
                                        <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                                            <button 
                                                onClick={() => handleSetRole(user.uid, user.email, user.role)}
                                                style={{background: isDark ? '#222' : '#f0f0f0', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: isDark ? '#fff' : '#000'}}
                                                title="Toggle Role"
                                            >
                                                <FiEdit size={16}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user.uid, user.email)}
                                                style={{background: 'rgba(255,77,77,0.1)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#ff4d4d'}}
                                                title="Delete"
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
            
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    tr:hover {
                        background: ${isDark ? 'rgba(255,255,255,0.05)' : '#fcfcfc'} !important;
                    }
                `}
            </style>
        </div>
    );
}

export default UserManagement;
