// context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { loginUser as loginService, registerUser as registerService } from "../services/authService";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null); // من Firebase Auth
  const [profile, setProfile] = useState(null); // doc من users collection
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const role = "student"; // ثابت

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const currentUid = user.uid;
        // جلب profile من كوليكشن users فقط
        try {
          const docRef = doc(db, "users", currentUid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setProfile(snap.data());
          } else {
            setProfile(null);
          }
          setFirebaseUser(user);
          setUid(currentUid);
        } catch (err) {
          console.error("Failed to load profile:", err);
          setProfile(null);
          setFirebaseUser(user);
          setUid(currentUid);
        }
      } else {
        setFirebaseUser(null);
        setProfile(null);
        setUid(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const register = async (fullname, email, password) => {
    // registerService يقوم بانشاء Auth user و doc في users
    const res = await registerService(fullname, email, password);
    // بعد التسجيل نحدث ال-state مباشرة (auth.currentUser متاح)
    setFirebaseUser(auth.currentUser);
    setProfile(res.profile || null);
    setUid(res.uid || (auth.currentUser ? auth.currentUser.uid : null));
    return res;
  };

  const login = async (email, password) => {
    const res = await loginService(email, password); // { uid, role, profile }
    setProfile(res.profile || null);
    setUid(res.uid);
    setFirebaseUser(auth.currentUser);
    return res;
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
    setFirebaseUser(null);
    setUid(null);
  };

  const value = useMemo(() => ({
    user: firebaseUser,
    profile,
    uid,
    role,
    loading,
    register,
    login,
    logout,
  }), [firebaseUser, profile, uid, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
