import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// Signs in with Google and makes sure a users/{uid} document exists, since a
// Google sign-in can be the first time we ever see this account. New documents
// must match the Firestore rules: walletBalance 0 and role 'user'.
export async function signInWithGoogle(referredBy = '') {
  const { user } = await signInWithPopup(auth, provider);

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    await setDoc(userRef, {
      email: user.email,
      username: user.displayName || '',
      createdAt: new Date(),
      walletBalance: 0,
      role: 'user',
      referralCode: user.uid.substring(0, 6).toUpperCase(),
      referredBy: referredBy || '',
      notificationPrefs: { activity: true, investment: true, promotions: false },
    });
  }
  // Google accounts arrive with email_verified already true, so no
  // verification email is needed for this flow.
  return user;
}

export function googleErrorMessage(err) {
  switch (err.code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return ''; // user dismissed the popup — nothing to show
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Allow popups for this site and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email. Sign in with your password instead.';
    default:
      return 'Google sign-in failed: ' + (err.message || 'Unknown error').replace('Firebase:', '').trim();
  }
}
