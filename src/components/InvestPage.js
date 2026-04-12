import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FiTrendingUp, FiSearch, FiClock, FiShield, FiInbox } from 'react-icons/fi';
import CircularProgress from './CircularProgress';
import { useTheme } from '../context/ThemeContext';

const ProgressBar = ({ current, target }) => {
    const percentage = target > 0 ? (current / target) * 100 : 0;
    return (
        <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden', marginTop: '12px' }}>
            <div style={{ 
                width: `${percentage}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #10b981, #34d399)', 
                borderRadius: '10px', 
                transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}></div>
        </div>
    );
};

function InvestPage() {
    const [allProjects, setAllProjects] = useState([]);
    const [myInvestments, setMyInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    const currentUser = auth.currentUser;
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const logoSrc = isDark ? '/logo-dark-theme.png' : '/logo-light-theme.png';

    // Handle Responsiveness
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const projectsCollectionRef = collection(db, "projects");
            const projectsData = await getDocs(projectsCollectionRef);
            const projectsList = projectsData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setAllProjects(projectsList);

            if (currentUser) {
                const investmentsQuery = query(collection(db, "investments"), where("userId", "==", currentUser.uid), where("status", "==", "active"));
                const investmentsSnapshot = await getDocs(investmentsQuery);
                const userInvestments = investmentsSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
                
                const myInvestmentsWithDetails = userInvestments
                    .map(investment => {
                        const projectDetails = projectsList.find(p => p.id === investment.projectId);
                        return projectDetails ? { ...investment, ...projectDetails } : null;
                    })
                    .filter(Boolean);

                setMyInvestments(myInvestmentsWithDetails);
            }
            setLoading(false);
        };
        fetchData();
    }, [currentUser]);

    const isMobile = windowWidth < 768;
    const filteredProjects = (activeTab === 'all' ? allProjects : myInvestments).filter(project =>
        project?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- 2026 DESIGN TOKENS ---
    const styles = {
        page: {
            padding: isMobile ? '16px' : '40px 24px',
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: isDark ? '#050505' : '#fcfcfd',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif"
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px'
        },
        tabContainer: {
            display: 'flex',
            backgroundColor: isDark ? '#111' : '#f1f1f4',
            padding: '4px',
            borderRadius: '16px',
            width: isMobile ? '100%' : 'fit-content'
        },
        tabBtn: (active) => ({
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: isMobile ? 1 : 'none',
            backgroundColor: active ? (isDark ? '#fff' : '#000') : 'transparent',
            color: active ? (isDark ? '#000' : '#fff') : (isDark ? '#888' : '#666'),
        }),
        searchWrapper: {
            position: 'relative',
            width: isMobile ? '100%' : '300px'
        },
        searchInput: {
            width: '100%',
            padding: '12px 16px 12px 44px',
            borderRadius: '16px',
            border: `1px solid ${isDark ? '#222' : '#e2e2e7'}`,
            backgroundColor: isDark ? '#111' : '#fff',
            color: isDark ? '#fff' : '#000',
            fontSize: '15px',
            outline: 'none',
            transition: 'border 0.2s ease'
        },
        card: {
            backgroundColor: isDark ? '#111' : '#fff',
            borderRadius: '24px',
            padding: '24px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            textDecoration: 'none',
            color: 'inherit',
            display: 'block'
        }
    };

    const renderContent = () => {
        if (loading) return (
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#888' }}>
                <div className="spinner"></div> {/* Assume you have a CSS spinner or just text */}
                <p>Curating opportunities...</p>
            </div>
        );

        if (filteredProjects.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: isDark ? '#0a0a0a' : '#f9f9fb', borderRadius: '32px', border: `1px dashed ${isDark ? '#333' : '#ccc'}` }}>
                    <FiInbox size={48} color="#888" style={{ marginBottom: '16px' }} />
                    <h3 style={{ margin: '0 0 8px 0', fontWeight: '700' }}>{activeTab === 'all' ? "No Projects Found" : "No Active Investments"}</h3>
                    <p style={{ color: '#666', margin: 0 }}>Try adjusting your search or explore new crops.</p>
                </div>
            );
        }

        return (
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', 
                gap: '24px',
                marginTop: '32px' 
            }}>
                {filteredProjects.map(project => (
                    <Link to={`/project/${project.id}`} key={project.id} style={styles.card} className="bento-hover">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>{project.name}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#10b981' }}>
                                    <FiShield size={14} /> 
                                    {activeTab === 'my' ? `Invested: ₦${project.amount.toLocaleString()}` : project.riskLevel}
                                </div>
                            </div>
                            <CircularProgress percentage={(project.currentAmount / project.targetAmount) * 100} size={42} strokeWidth={4} />
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FiTrendingUp color="#10b981" /> {project.returnPercentage}%
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', color: '#666' }}>
                                <FiClock /> {project.durationDays}d
                            </div>
                        </div>

                        <ProgressBar current={project.currentAmount} target={project.targetAmount} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', fontWeight: '700', color: '#888' }}>
                            <span>₦{project.currentAmount?.toLocaleString()}</span>
                            <span>Target: ₦{project.targetAmount?.toLocaleString()}</span>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div style={styles.page}>
            {/* TOP NAVIGATION BAR */}
            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={logoSrc} alt="Logo" style={{ height: '44px', width: '44px', objectFit: 'contain' }} />
                    <h1 style={{ margin: 0, fontSize: isMobile ? '24px' : '32px', fontWeight: '900', letterSpacing: '-1px' }}>Invest</h1>
                </div>
            </div>

            {/* CONTROLS AREA */}
            <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row', 
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'stretch' : 'center',
                gap: '20px',
                marginBottom: '8px'
            }}>
                <div style={styles.tabContainer}>
                    <button style={styles.tabBtn(activeTab === 'all')} onClick={() => setActiveTab('all')}>All Markets</button>
                    <button style={styles.tabBtn(activeTab === 'my')} onClick={() => setActiveTab('my')}>My Portfolio</button>
                </div>

                <div style={styles.searchWrapper}>
                    <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <input 
                        type="text" 
                        placeholder="Search assets..." 
                        style={styles.searchInput}
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            {renderContent()}
        </div>
    );
}

export default InvestPage;
