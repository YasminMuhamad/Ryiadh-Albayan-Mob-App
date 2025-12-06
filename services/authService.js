// services/authService.js
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * registerUser(fullname, email, password)
 * - ينشئ مستخدم في Firebase Auth
 * - ينشئ doc في collection "users"
 * - يرجع { uid, role: "student", profile }
 */
export const registerUser = async (fullname, email, password) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const uid = res.user.uid;

  const profile = {
    name: fullname,
    name_ar: "",
    email,
    profile_pic: "",
    role: "student",
    subscriptionStatus: "Inactive",
    createdAt: new Date(),
    coursesCount: 0
  };

  await setDoc(doc(db, "users", uid), profile);

  return { uid, role: "student", profile };
};

/**
 * loginUser(email, password)
 * - يقوم signIn
 * - يجلب doc من "users" بالـ uid
 * - يرجع { uid, role: "student", profile }
 * - يرمي Error لو الدوك مش موجود
 */
export const loginUser = async (email, password) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  const uid = res.user.uid;

  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Student account not found in Firestore (users collection).");
  }

  const profile = docSnap.data();
  return { uid, role: "student", profile };
};
