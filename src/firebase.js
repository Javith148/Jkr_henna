import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFyk4NJO0nSNDZVDdpEjXIOZnN6tNDx_w",
  authDomain: "jkr-henna.firebaseapp.com",
  projectId: "jkr-henna",
  storageBucket: "jkr-henna.firebasestorage.app",
  messagingSenderId: "906468884747",
  appId: "1:906468884747:web:e48773eb4fca31b2ae220e",
  measurementId: "G-CEJL84HLJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Export Helper for Google Popup Login
export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      name: user.displayName || user.email.split('@')[0],
      email: user.email,
      avatar: user.photoURL,
      uid: user.uid
    };
  } catch (error) {
    console.error("Google Auth Error:", error);
    throw error;
  }
};
