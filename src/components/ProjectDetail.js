import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, runTransaction, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FiArrowLeft, FiTrendingUp, FiClock, FiTarget, FiPackage, FiDollarSign, FiInfo } from 'react-icons/fi';
import ROICalculator from './ROICalculator';
import { useTheme } from '../context/ThemeContext'; // Assuming you have this based on previous files

const StatCard = ({ icon, label, value, isDark }) => {
    const cardStyles = {
        container: {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}`,
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'transform 0.2s ease',
        },
        iconWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
            color: '#3B82F6',
            fontSize: '24px'
        },
        label: {
            color: '#64748b',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: '0 0 4px 0'
        },
        value: {
            color: isDark ? '#fff' : '#0f172a',
            fontSize: '20px',
            fontWeight: '700',
            margin: 0
        }
    };

    return (
        <div style={cardStyles.container} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={cardStyles.iconWrapper}>{icon}</div>
            <div>
                <p style={cardStyles.label}>{label}</p>
                <p style={cardStyles.value}>{value}</p>
            </div>
        </div>
    );
};

function ProjectDetail() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [units, setUnits] = useState('');
    const [loading, setLoading] = useState(true);
    const [investing, setInvesting] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [walletBalance, setWalletBalance] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const currentUser = auth.currentUser;
    const { theme } = useTheme(); 
    const isDark = theme === 'dark';

    // Handle screen resizing for responsive layout
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;

    useEffect(() => {
        const fetchProjectAndUser = async () => {
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setWalletBalance(userSnap.data().walletBalance);
                }
            }
            const docRef = doc(db, 'projects', projectId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProject({ id: docSnap.id, ...docSnap.data() });
            }
            setLoading(false);
        };
        fetchProjectAndUser();
    }, [projectId, currentUser]);

    const handleInvestNow = async () => {
        if (!project) return;
        const numberOfUnits = parseInt(units, 10);
        if (isNaN(numberOfUnits) || numberOfUnits <= 0) {
            setStatusMessage({ text: 'Please enter a valid number of units.', type: 'error' });
            return;
        }
        const investmentAmount = numberOfUnits * project.pricePerUnit;
        if (numberOfUnits > project.availableUnits) {
            setStatusMessage({ text: 'Number of units exceeds available units.', type: 'error' });
            return;
        }
        if (investmentAmount > walletBalance) {
            setStatusMessage({ text: 'Insufficient wallet balance for this number of units.', type: 'error' });
            return;
        }
        
        setInvesting(true);
        setStatusMessage({ text: 'Processing investment securely...', type: 'info' });
        
        try {
            await runTransaction(db, async (transaction) => {
                const projectRef = doc(db, 'projects', projectId);
                const userRef = doc(db, 'users', currentUser.uid);
                const projectDoc = await transaction.get(projectRef);
                const userDoc = await transaction.get(userRef);
                
                if (!projectDoc.exists() || !userDoc.exists()) throw new Error("Document not found");
                
                const newProjectAmount = projectDoc.data().currentAmount + investmentAmount;
                const newUserBalance = userDoc.data().walletBalance - investmentAmount;
                const newAvailableUnits = projectDoc.data().availableUnits - numberOfUnits;
                
                if (newUserBalance < 0) throw new Error("Insufficient funds.");
                if (newAvailableUnits < 0) throw new Error("Units no longer available.");
                
                transaction.update(projectRef, { currentAmount: newProjectAmount, availableUnits: newAvailableUnits });
                transaction.update(userRef, { walletBalance: newUserBalance });
                
                const newInvestmentRef = doc(collection(db, "investments"));
                transaction.set(newInvestmentRef, { projectId, userId: currentUser.uid, amount: investmentAmount, units: numberOfUnits, createdAt: serverTimestamp(), status: 'active' });
                
                const newTransactionRef = doc(collection(db, "transactions"));
                transaction.set(newTransactionRef, { userId: currentUser.uid, type: 'Investment', amount: investmentAmount, status: 'Completed', createdAt: serverTimestamp(), details: `${numberOfUnits} units in ${projectDoc.data().name}` });
            });
            
            setProject(prev => ({ ...prev, currentAmount: prev.currentAmount + investmentAmount, availableUnits: prev.availableUnits - numberOfUnits }));
            setWalletBalance(prev => prev - investmentAmount);
            setUnits('');
            setStatusMessage({ text: 'Investment successful! Units acquired.', type: 'success' });
        } catch (error) {
            console.error("Error investing:", error);
            setStatusMessage({ text: `Failed to invest: ${error.message}`, type: 'error' });
        } finally {
            setInvesting(false);
            setTimeout(() => setStatusMessage({ text: '', type: '' }), 5000);
        }
    };

    // --- DESIGN TOKENS ---
    const styles = {
        page: {
            minHeight: '100vh',
            padding: isMobile ? '20px' : '40px',
            backgroundColor: isDark ? '#020202' : '#F8FAFC',
            fontFamily: "'Inter', sans-serif",
            color: isDark ? '#fff' : '#1e293b',
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
        },
        backBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'color 0.2s',
            width: 'fit-content'
        },
        header: {
            borderBottom: `1px solid ${isDark ? '#222' : '#e2e8f0'}`,
            paddingBottom: '20px',
            marginBottom: '10px'
        },
        title: {
            fontSize: isMobile ? '28px' : '40px',
            fontWeight: '800',
            letterSpacing: '-1px',
            margin: '10px 0'
        },
        description: {
            color: '#64748b',
            fontSize: '16px',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: 0
        },
        layout: {
            display: 'grid',
            gridTemplateColumns: isMobile || isTablet ? '1fr' : '1.8fr 1fr',
            gap: '30px',
            alignItems: 'start'
        },
        sectionTitle: {
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '30px'
        },
        card: {
            background: isDark ? 'rgba(15, 15, 15, 0.7)' : '#ffffff',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '32px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: '20px'
        },
        progressBarContainer: {
            height: '12px',
            backgroundColor: isDark ? '#222' : '#e2e8f0',
            borderRadius: '10px',
            overflow: 'hidden',
            marginTop: '10px',
            marginBottom: '24px'
        },
        progressBarFilled: (percentage) => ({
            height: '100%',
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #3B82F6, #10B981)',
            borderRadius: '10px',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
        }),
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '20px'
        },
        label: {
            fontSize: '13px',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase'
        },
        walletBox: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5',
            border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.2)' : '#A7F3D0'}`,
            padding: '16px',
            borderRadius: '16px',
            marginBottom: '24px'
        },
        input: {
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            border: `1px solid ${isDark ? '#333' : '#e2e8f0'}`,
            backgroundColor: isDark ? '#000' : '#fff',
            color: isDark ? '#fff' : '#000',
            fontSize: '16px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s'
        },
        primaryBtn: {
            width: '100%',
            padding: '18px',
            borderRadius: '16px',
            border: 'none',
            backgroundColor: isDark ? '#fff' : '#000',
            color: isDark ? '#000' : '#fff',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'opacity 0.2s, transform 0.1s',
            opacity: investing ? 0.7 : 1
        },
        statusBox: (type) => ({
            padding: '14px',
            borderRadius: '12px',
            marginTop: '16px',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
            backgroundColor: type === 'error' ? 'rgba(239, 68, 68, 0.1)' : type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            color: type === 'error' ? '#EF4444' : type === 'success' ? '#10B981' : '#3B82F6',
        })
    };

    if (loading) return (
        <div style={{...styles.page, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#64748b' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <p>Loading Project Data...</p>
            </div>
        </div>
    );
    
    if (!project) return <div style={styles.page}><h2>Project Not Found</h2></div>;

    const fundingPercentage = project.targetAmount > 0 ? (project.currentAmount / project.targetAmount) * 100 : 0;
    const cappedPercentage = fundingPercentage > 100 ? 100 : fundingPercentage;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                
                {/* Header Section */}
                <div style={styles.header}>
                    <Link to="/invest" style={styles.backBtn} onMouseOver={(e) => e.target.style.color = '#3B82F6'} onMouseOut={(e) => e.target.style.color = '#64748b'}>
                        <FiArrowLeft /> Back to Investments
                    </Link>
                    <h1 style={styles.title}>{project.name}</h1>
                    <p style={styles.description}>{project.description}</p>
                </div>

                {/* Main Layout Grid */}
                <div style={styles.layout}>
                    
                    {/* Left Column: Stats */}
                    <div>
                        <h3 style={styles.sectionTitle}><FiInfo color="#3B82F6" /> Project Statistics</h3>
                        <div style={styles.statsGrid}>
                            <StatCard isDark={isDark} icon={<FiTrendingUp />} label="Expected Return" value={`${project.returnPercentage}%`} />
                            <StatCard isDark={isDark} icon={<FiClock />} label="Duration" value={`${project.durationDays} Days`} />
                            <StatCard isDark={isDark} icon={<FiPackage />} label="Available Units" value={project.availableUnits?.toLocaleString() || 0} />
                            <StatCard isDark={isDark} icon={<FiDollarSign />} label="Price Per Unit" value={`₦${project.pricePerUnit?.toLocaleString() || 0}`} />
                        </div>
                        
                        {/* Optional space for future content like charts, gallery, or detailed description */}
                        <div style={{...styles.card, padding: '24px', position: 'static'}}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>About this Investment</h4>
                            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
                                By acquiring units in this project, you are actively funding operations managed by our expert team. Returns are calculated based on the project's performance and are distributed directly to your wallet upon completion of the duration lifecycle.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Checkout/Action Card */}
                    <aside style={styles.card}>
                        <h3 style={{ fontSize: '24px', margin: '0 0 24px 0' }}>Invest Now</h3>
                        
                        {/* Funding Progress */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600' }}>
                            <span style={{ color: '#10B981' }}>{cappedPercentage.toFixed(1)}% Funded</span>
                            <span style={{ color: '#64748b' }}><b>{project.availableUnits?.toLocaleString() || 0}</b> units left</span>
                        </div>
                        <div style={styles.progressBarContainer}>
                            <div style={styles.progressBarFilled(cappedPercentage)}></div>
                        </div>

                        {/* Wallet Balance Display */}
                        <div style={styles.walletBox}>
                            <div>
                                <span style={{ fontSize: '12px', color: isDark ? '#A7F3D0' : '#059669', fontWeight: '700', textTransform: 'uppercase' }}>Available Balance</span>
                                <h4 style={{ margin: '4px 0 0 0', fontSize: '20px', color: isDark ? '#fff' : '#064E3B' }}>₦{walletBalance.toLocaleString()}</h4>
                            </div>
                            <FiTarget size={24} color={isDark ? '#34D399' : '#059669'} />
                        </div>

                        {/* Input Area */}
                        <div style={styles.inputGroup}>
                            <label htmlFor="units" style={styles.label}>Enter number of units to buy</label>
                            <input 
                                id="units" 
                                type="number" 
                                style={styles.input}
                                placeholder="e.g., 10" 
                                value={units} 
                                onChange={(e) => setUnits(e.target.value)}
                                min="1"
                                max={project.availableUnits}
                            />
                        </div>

                        {/* ROI Calculator wrapper */}
                        <div style={{ backgroundColor: isDark ? '#000' : '#f1f5f9', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
                            <ROICalculator units={units} project={project} />
                        </div>

                        {/* Status Message */}
                        {statusMessage.text && (
                            <div style={styles.statusBox(statusMessage.type)}>
                                {statusMessage.text}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            style={styles.primaryBtn} 
                            onClick={handleInvestNow} 
                            disabled={investing || project.availableUnits === 0}
                        >
                            {investing ? 'Processing...' : project.availableUnits === 0 ? 'Sold Out' : 'Confirm Investment'}
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetail;
