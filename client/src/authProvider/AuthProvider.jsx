import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import {auth} from '../firebase/firebase.init'


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // // OnAuth State Change handler =====================
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.email) {
        setUser(currentUser);
        // const userInfo = { email: currentUser?.email };
        
        // axiosPublic.post('jwt', userInfo)
        //   .then(res => {
        //     if (res.data.token) {
        //       localStorage.setItem('token', res.data.token);
        //     }
        //   });
      } else {
        setUser(null);
        setLoading(false);
      }
      setLoading(false);
    });
  
    return () => {
      unSubscribe();
    };
  }, []);
  

  // SignWithGoogle =========================
  const googleProvider = new GoogleAuthProvider();
  const signWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Sign Up user ==================================
  const signUpUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign In user ==================================
  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Update user profile =================================
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, { displayName: name, photoURL: photo });
  };

 // Sign out user =================================
const signOutUser = async () => {
  await signOut(auth);
  localStorage.removeItem('token');
};

  const authInfo = {
    loading,
    setLoading,
    user,
    setUser,
    signWithGoogle,
    signUpUser,
    signInUser,
    updateUserProfile,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );

}

export default AuthProvider;