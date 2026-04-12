import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FiSettings, FiLogOut, FiTrendingUp, FiBriefcase, FiPlusCircle, FiGrid, FiSearch, FiClock } from 'react-icons/fi';
import { signOut } from 'firebase/auth'; // Ensure signOut is imported
import EmailVerificationBanner from './EmailVerificationBanner';
import CircularProgress from './CircularProgress';
import { useTheme } from '../context/ThemeContext'; 
import { useModal } from '../context/ModalContext';

const ProgressBar = ({ current, target }) => {
    const percentage = target > 0 ? (current / target) * 100 : 0;
    return (
        <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden', marginTop: '12px' }}>
            <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '10px', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
        </div>
    );
};

function Dashboard({ userData }) {
    const { theme } = useTheme();
    const { showModal } = useModal();
    const navigate = useNavigate(); // Hook for navigation
    const isDark = theme === 'dark';
    const logoSrc = isDark ? '/logo-dark-theme.png' : '/logo-light-theme.png';
    const currentUser = auth.currentUser;
    
    const [projects, setProjects] = useState([]);
    const [myInvestments, setMyInvestments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // --- LOGOUT LOGIC ---
    const handleLogout = async () => {
        try {
            await signOut(auth); // Clear Firebase session
            navigate('/', { replace: true }); // Redirect to landing page and clear history stack
        } catch (error) {
            console.error("Error logging out:", error);
            showModal("Failed to log out. Please try again.");
        }
    };

    // --- AUTH PROTECTION ---
    // If someone tries to access this page without a user, redirect them immediately
    useEffect(() => {
        if (!currentUser) {
            navigate('/', { replace: true });
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!currentUser) return;
        const fetchData = async () => {
            try {
                const projectsCollectionRef = collection(db, "projects");
                const projectsData = await getDocs(projectsCollectionRef);
                const projectsList = projectsData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setProjects(projectsList);
                
                const investmentsQuery = query(
                    collection(db, "investments"), 
                    where("userId", "==", currentUser.uid), 
                    where("status", "==", "active")
                );
                const investmentsSnapshot = await getDocs(investmentsQuery);
                const userInvestments = investmentsSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
                
                const myInvestmentsWithDetails = userInvestments.map(investment => {
                    const projectDetails = projectsList.find(p => p.id === investment.projectId);
                    return { ...investment, ...projectDetails };
                });
                setMyInvestments(myInvestmentsWithDetails);
            } catch (err) {
                console.error("Data fetch error:", err);
            }
        };
        fetchData();
    }, [currentUser]);

    const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const isMobile = windowWidth < 768;

    // Premium Styles Object (maintained from previous version)
    const styles = {
        page: {
            padding: isMobile ? '16px' : '40px 24px',
            maxWidth: '1280px',
            margin: '0 auto',
            backgroundColor: isDark ? '#050505' : '#fcfcfd',
            minHeight: '100vh',
            color: isDark ? '#ffffff' : '#000000',
            fontFamily: "'Inter', sans-serif",
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isMobile ? '24px' : '48px',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '20px'
        },
        greetingBox: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: isMobile ? '100%' : 'auto'
        },
        bentoCard: {
            backgroundColor: isDark ? '#121212' : '#ffffff',
            borderRadius: '28px',
            padding: isMobile ? '24px' : '32px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.02)',
            position: 'relative',
            overflow: 'hidden'
        },
        balanceValue: {
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '800',
            letterSpacing: '-2px',
            margin: '8px 0',
            color: '#10b981'
        },
        btnPrimary: {
            padding: '14px 28px',
            borderRadius: '16px',
            backgroundColor: isDark ? '#ffffff' : '#000000',
            color: isDark ? '#000000' : '#ffffff',
            fontWeight: '600',
            fontSize: '15px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            textDecoration: 'none',
            justifyContent: 'center'
        },
        actionButton: {
            padding: '10px 18px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            color: isDark ? '#ccc' : '#444',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            textDecoration: 'none'
        }
    };

    // Return null or a loader if user is not authenticated to prevent flickering
    if (!currentUser) return null;

    return (
        <div style={styles.page}>
            {currentUser && !currentUser.emailVerified && <EmailVerificationBanner />}
            
            <header style={styles.header}>
                <div style={styles.greetingBox}>
                    <img src={logoSrc} alt="Logo" style={{ height: '52px', width: '52px', objectFit: 'contain' }} />
                    <div>
                        <h1 style={{ margin: 0, fontSize: isMobile ? '20px' : '26px', fontWeight: 800 }}>
                            Hi, {userData?.username || 'Farmer'}
                        </h1>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px', fontWeight: 500 }}>Portfolio Snapshot</p>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', width: isMobile ? '100%' : 'auto' }}>
                    {userData?.role === 'admin' && (
                        <Link to="/admin" style={styles.actionButton}><FiGrid /> Admin</Link>
                    )}
                    <Link to="/settings" style={styles.actionButton}><FiSettings /></Link>
                    {/* Logout Button updated to trigger internal handleLogout */}
                    <button onClick={handleLogout} style={{ ...styles.actionButton, color: '#ff4d4d' }}>
                        <FiLogOut /> Logout
                    </button>
                </div>
            </header>

            {/* WALLET BENTO */}
            <div style={{ ...styles.bentoCard, marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                           <FiBriefcase style={{ marginRight: '6px' }} /> Available Capital
                        </span>
                        <h2 style={styles.balanceValue}>₦{userData?.walletBalance?.toLocaleString() || '0.00'}</h2>
                    </div>
                    <Link to="/add-money" style={{ ...styles.btnPrimary, width: isMobile ? '100%' : 'auto' }}>
                        <FiPlusCircle size={20} /> Add Funds
                    </Link>
                </div>
            </div>

            {/* ACTIVE INVESTMENTS */}
            {myInvestments.length > 0 && (
                <div style={{ marginBottom: '48px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Active Assets <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#10b981', color: 'white' }}>{myInvestments.length}</span>
                    </h3>
                    <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
                        {myInvestments.map(investment => {
                            const investmentDate = investment.createdAt.toDate();
                            const maturityDate = new Date(investmentDate);
                            maturityDate.setDate(maturityDate.getDate() + investment.durationDays);
                            const percentage = Math.min(((new Date() - investmentDate) / (maturityDate - investmentDate)) * 100, 100);
                            const daysLeft = Math.ceil((maturityDate - new Date()) / (1000 * 60 * 60 * 24));

                            return (
                                <Link to={`/project/${investment.projectId}`} key={investment.id} style={{ textDecoration: 'none', flex: isMobile ? '0 0 85%' : '0 0 320px', scrollSnapAlign: 'start' }}>
                                    <div style={{ ...styles.bentoCard, padding: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '8px' }}>Active</span>
                                            <CircularProgress percentage={percentage} size={40} strokeWidth={4} />
                                        </div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: isDark ? '#eee' : '#111' }}>{investment.name}</h4>
                                        <p style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '800' }}>₦{investment.amount.toLocaleString()}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888' }}>
                                            <span>Progress</span>
                                            <span style={{ color: daysLeft <= 0 ? '#10b981' : '#888', fontWeight: '600' }}>
                                                {daysLeft > 0 ? `${daysLeft} days left` : 'Completed'}
                                            </span>
                                        </div>
                                        <ProgressBar current={percentage} target={100} />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* MARKETPLACE SECTION (Rest of the original code follows...) */}
            <div style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Green Marketplace</h2>
                    <div style={{ position: 'relative', width: isMobile ? '100%' : '320px' }}>
                        <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                        <input 
                            type="text" 
                            placeholder="Search crops..." 
                            style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '18px', border: 'none', backgroundColor: isDark ? '#121212' : '#f0f0f2', color: isDark ? '#fff' : '#000', outline: 'none', fontSize: '15px' }}
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))', 
                    gap: '24px' 
                }}>
                    {filteredProjects.map(project => (
                        <Link to={`/project/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
                            <div style={styles.bentoCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{project.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: '700' }}>
                                        <FiTrendingUp /> {project.returnPercentage}%
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FiClock /> {project.durationDays} Days
                                    </span>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#666' }}>
                                        Risk: <span style={{ color: '#10b981' }}>{project.riskLevel}</span>
                                    </span>
                                </div>

                                <ProgressBar current={project.currentAmount} target={project.targetAmount} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', fontWeight: '700', color: '#888' }}>
                                    <span>₦{project.currentAmount?.toLocaleString()} raised</span>
                                    <span>Goal: ₦{project.targetAmount?.toLocaleString()}</span>
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
