import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FiCopy, FiShare2 } from 'react-icons/fi';
import { useModal } from '../context/ModalContext';

function Referrals({ userData }) {
    const [referredUsers, setReferredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showModal } = useModal();

    // Build the full referral link using the user's referral code
    const referralLink = userData?.referralCode
        ? `https://smartfarmer.ng/signup?ref=${userData.referralCode}`
        : '';

    useEffect(() => {
        const fetchReferredUsers = async () => {
            if (userData && userData.referralCode) {
                setLoading(true);
                try {
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where("referredBy", "==", userData.referralCode));
                    const querySnapshot = await getDocs(q);
                    const usersList = querySnapshot.docs.map(doc => doc.data());
                    setReferredUsers(usersList);
                } catch (error) {
                    console.error("Error fetching referred users: ", error);
                }
                setLoading(false);
            } else {
                setLoading(false);
            }
        };
        fetchReferredUsers();
    }, [userData]);

    const handleCopyLink = () => {
        if (referralLink) {
            navigator.clipboard.writeText(referralLink);
            showModal('Referral link copied to clipboard!');
        }
    };

    const handleShare = async () => {
        if (navigator.share && referralLink) {
            try {
                await navigator.share({
                    title: 'Join me on SmartFarmer!',
                    text: 'Sign up on SmartFarmer using my referral link and let\'s grow together! 🌱',
                    url: referralLink,
                });
            } catch (error) {
                // User cancelled share or share failed — fall back to copy
                handleCopyLink();
            }
        } else {
            handleCopyLink();
        }
    };

    return (
        <div>
            <h2>Referrals</h2>
            <p>
                Share your personal referral link with friends and family. When they sign up
                using your link, they'll be connected to your account automatically — and
                you get rewarded! <strong>(Rewards coming soon 🎉)</strong>
            </p>

            <div className="form-group">
                <label>Your Unique Referral Link</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        value={referralLink || 'Loading...'}
                        readOnly
                        style={{
                            backgroundColor: 'var(--bg-color)',
                            fontWeight: '500',
                            fontSize: '14px',
                            flex: 1,
                            minWidth: '200px',
                            color: 'var(--primary-color)',
                        }}
                    />
                    <button className="btn btn-secondary" onClick={handleCopyLink}>
                        <FiCopy /> Copy
                    </button>
                    <button className="btn btn-primary" onClick={handleShare}>
                        <FiShare2 /> Share
                    </button>
                </div>
                <small style={{ color: 'var(--text-secondary)', marginTop: '6px', display: 'block' }}>
                    Anyone who opens this link will be taken directly to the signup page with your referral pre-filled.
                </small>
            </div>

            <div className="card" style={{ marginTop: '30px' }}>
                <h3 style={{ marginTop: 0 }}>
                    Users You've Referred ({referredUsers.length})
                </h3>
                {loading ? (
                    <p>Loading referrals...</p>
                ) : referredUsers.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {referredUsers.map((user, index) => (
                            <li
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 0',
                                    borderBottom: '1px solid var(--border-color)',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                }}
                            >
                                <span>{user.email}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                                    Joined:{' '}
                                    {user.createdAt?.seconds
                                        ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                                        : 'N/A'}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>
                        You haven't referred anyone yet. Share your link to get started!
                    </p>
                )}
            </div>
        </div>
    );
}

export default Referrals;
