import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { FiSettings, FiLogOut, FiTrendingUp, FiTarget, FiBriefcase, FiPlusCircle, FiGrid, FiSearch, FiClock, FiChevronRight } from 'react-icons/fi';
import EmailVerificationBanner from './EmailVerificationBanner';
import apiClient from '../axiosConfig';
import CircularProgress from './CircularProgress';
import { useTheme } from '../context/ThemeContext'; 
import { useModal } from '../context/ModalContext';

const ProgressBar = ({ current, target }) => {
    const percentage = target > 0 ? (current / target) * 100 : 0;
    return (
        <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden', marginTop: '12px' }}>
            <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #10b981)', borderRadius: '10px', transition: 'width 1s ease-in-out' }}></div>
        </div>
    );
};

function Dashboard({ handleLogout, userData }) {
    const { theme } = useTheme();
    const { showModal } = useModal();
    const isDark = theme === 'dark';
    const logoSrc = isDark ? '/logo-dark-theme.png' : '/logo-light-theme.png';
    const currentUser = auth.currentUser;
    const [projects, setProjects] = useState([]);
    const [myInvestments, setMyInvestments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!currentUser) return;
        const fetchData = async () => {
            const projectsCollectionRef = collection(db, "projects");
            const projectsData = await getDocs(projectsCollectionRef);
            const projectsList = projectsData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProjects(projectsList);
            
            const investmentsQuery = query(collection(db, "investments"), where("userId", "==", currentUser.uid), where("status", "==", "active"));
            const investmentsSnapshot = await getDocs(investmentsQuery);
            const userInvestments = investmentsSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            
            const myInvestmentsWithDetails = userInvestments.map(investment => {
                const projectDetails = projectsList.find(p => p.id === investment.projectId);
                return { ...investment, ...projectDetails };
            });
            setMyInvestments(myInvestmentsWithDetails);
        };
        fetchData();
    }, [currentUser]);

    const handleAddMoney = async () => {
        if (!currentUser) return showModal("Please log in.");
        const amountStr = prompt("Enter amount:", "1000");
        if (!amountStr || isNaN(amountStr) || Number(amountStr) <= 0) return showModal("Please enter a valid amount.");
        const amount = Number(amountStr);
        try {
            const response = await apiClient.post('/payment/initialize', {
                email: currentUser.email,
                amount: amount,
                callbackUrl: `${window.location.origin}/payment/callback`,
                metadata: { userId: currentUser.uid }
            });
            window.location.href = response.data.data.authorization_url;
        } catch (error) {
            console.error("Error initializing payment:", error);
            showModal("Failed to start payment.");
        }
    };

    const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // --- 2026 DESIGN SYSTEM TOKENS ---
    const styles = {
        page: {
            padding: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: isDark ? '#08090a' : '#f8fafc',
            minHeight: '100vh',
            fontFamily: "'Inter', -apple-system, sans-serif"
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 0',
            flexWrap: 'wrap',
            gap: '20px'
        },
        bentoCard: {
            backgroundColor: isDark ? '#111827' : '#ffffff',
            borderRadius: '24px',
            padding: '32px',
            border: `1px solid ${isDark ? '#1f2937' : '#e2e8f0'}`,
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.03)',
        },
        balanceValue: {
            fontSize: '42px',
            fontWeight: '800',
            letterSpacing: '-1.5px',
            margin: '8px 0',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        btnPrimary: {
            padding: '12px 24px',
            borderRadius: '14px',
            backgroundColor: '#10b981',
            color: 'white',
            fontWeight: '600',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            textDecoration: 'none'
        },
        btnOutline: {
            padding: '12px 24px',
            borderRadius: '14px',
            backgroundColor: 'transparent',
            border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
            color: isDark ? '#f3f4f6' : '#1f2937',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            textDecoration: 'none'
        },
        pill: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
            textTransform: 'uppercase'
        }
    };

    return (
        <div style={styles.page}>
            {currentUser && !currentUser.emailVerified && <EmailVerificationBanner />}
            
            {/* HEADER */}
            <header style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={logoSrc} alt="Logo" style={{ height: '48px', borderRadius: '12px' }} />
                    <div>
                        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>
                            Hi, {userData?.firstName || 'Farmer'}
                        </h1>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Market is looking green today.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {userData?.role === 'admin' && (
                        <Link to="/admin" style={styles.btnOutline}><FiGrid /> Admin</Link>
                    )}
                    <Link to="/settings" style={styles.btnOutline}><FiSettings /></Link>
                    <button onClick={handleLogout} style={{ ...styles.btnOutline, color: '#ef4444' }}><FiLogOut /></button>
                </div>
            </header>

            {/* WALLET SECTION */}
            <div style={{ ...styles.bentoCard, marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
                    <div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FiBriefcase /> TOTAL WALLET BALANCE
                        </span>
                        <h2 style={styles.balanceValue}>₦{userData?.walletBalance?.toLocaleString() || '0.00'}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/add-money" style={styles.btnOutline}><FiPlusCircle /> Manual</Link>
                        <button onClick={handleAddMoney} style={styles.btnPrimary}><FiPlusCircle /> Add Money</button>
                    </div>
                </div>
            </div>

            {/* ACTIVE INVESTMENTS CAROUSEL */}
            {myInvestments.length > 0 && (
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Active Assets</h2>
                        <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>{myInvestments.length} Active</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' }}>
                        {myInvestments.map(investment => {
                            const investmentDate = investment.createdAt.toDate();
                            const maturityDate = new Date(investmentDate);
                            maturityDate.setDate(maturityDate.getDate() + investment.durationDays);
                            const totalDuration = maturityDate - investmentDate;
                            const timeElapsed = new Date() - investmentDate;
                            const percentage = Math.min((timeElapsed / totalDuration) * 100, 100);
                            const daysLeft = Math.ceil((maturityDate - new Date()) / (1000 * 60 * 60 * 24));

                            return (
                                <Link to={`/project/${investment.projectId}`} key={investment.id} style={{ textDecoration: 'none', flex: '0 0 300px' }}>
                                    <div style={{ ...styles.bentoCard, padding: '20px', height: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                            <span style={styles.pill}>{investment.riskLevel}</span>
                                            <CircularProgress percentage={percentage} />
                                        </div>
                                        <h4 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '700', color: isDark ? '#fff' : '#1f2937' }}>{investment.name}</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Investment</p>
                                                <p style={{ margin: 0, fontWeight: '700' }}>₦{investment.amount.toLocaleString()}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Status</p>
                                                <p style={{ margin: 0, fontWeight: '700', color: '#10b981' }}>{daysLeft > 0 ? `${daysLeft}d left` : 'Matured'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* CROP LISTING */}
            <div style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Available Crops</h2>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input 
                            type="text" 
                            placeholder="Search investments..." 
                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '14px', border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`, backgroundColor: isDark ? '#111827' : '#fff', color: isDark ? '#fff' : '#000', outline: 'none' }}
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                    {filteredProjects.map(project => (
                        <Link to={`/project/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
                            <div style={{ ...styles.bentoCard, padding: '24px', transition: 'transform 0.2s ease' }} className="project-hover-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: isDark ? '#fff' : '#111827' }}>{project.name}</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Risk: <span style={{ fontWeight: '700', color: '#10b981' }}>{project.riskLevel}</span></p>
                                    </div>
                                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '10px' }}>
                                        <FiTrendingUp style={{ color: '#10b981', fontSize: '20px' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}>
                                        <FiTrendingUp style={{ color: '#10b981' }} /> {project.returnPercentage}%
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}>
                                        <FiClock style={{ color: '#64748b' }} /> {project.durationDays} Days
                                    </div>
                                </div>

                                <ProgressBar current={project.currentAmount} target={project.targetAmount} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
                                    <span>₦{project.currentAmount?.toLocaleString()}</span>
                                    <span>Target: ₦{project.targetAmount?.toLocaleString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
