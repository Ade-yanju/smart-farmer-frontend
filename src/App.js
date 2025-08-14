import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useTheme } from "./context/ThemeContext";

// Import ALL necessary components
import Navigation from "./components/Navigation";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProjectDetail from "./components/ProjectDetail";
import ForgotPassword from "./components/ForgotPassword";
import AdminDashboard from "./components/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Settings from "./components/Settings";
import TransactionsPage from "./components/TransactionsPage";
import InvestPage from "./components/InvestPage";
import PaymentCallback from "./components/PaymentCallback";
import WithdrawalPage from "./components/WithdrawalPage";
import LoadingSpinner from "./components/LoadingSpinner"; // Import the new spinner
import LandingPage from "./components/LandingPage";

// Import Firebase services
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import AddMoneyManually from "./components/AddMoneyManually";
import Modal from "./components/Modal";
import { useModal } from "./context/ModalContext";

function App() {
  const { theme } = useTheme();
  const { show, message, type, hideModal } = useModal();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        if (!data.referralCode) {
          const newReferralCode = user.uid.substring(0, 6).toUpperCase();
          await updateDoc(userDocRef, { referralCode: newReferralCode });
          data.referralCode = newReferralCode;
        }
        setUserData(data);
      }
    } else {
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await fetchUserData(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserData]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  // This is the updated loading section
  if (loading) {
    return <LoadingSpinner message="Loading Application..." />;
  }

  return (
    <BrowserRouter>
      <div className={`App ${theme}`}>
        <Modal show={show} message={message} type={type} onClose={hideModal} />
        <main className="main-content">
          <Routes>
            {currentUser ? (
              <>
                <Route
                  path="/dashboard"
                  element={
                    <Dashboard
                      handleLogout={handleLogout}
                      userData={userData}
                    />
                  }
                />
                <Route path="/invest" element={<InvestPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route
                  path="/withdraw"
                  element={<WithdrawalPage userData={userData} />}
                />
                <Route path="/project/:projectId" element={<ProjectDetail />} />
                <Route
                  path="/settings"
                  element={
                    <Settings
                      userData={userData}
                      refreshUserData={() => fetchUserData(currentUser)}
                    />
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute userData={userData}>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="/payment/callback" element={<PaymentCallback />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
                <Route path="/add-money" element={<AddMoneyManually />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/" element={<LandingPage />} />
              </>
            )}
          </Routes>
        </main>
        {currentUser && <Navigation />}
      </div>
    </BrowserRouter>
  );
}

export default App;
