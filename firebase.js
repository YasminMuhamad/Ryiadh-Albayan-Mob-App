//firebase.js
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD9KLFnZmu4RwsFAgG_BX_psdAFofCOYyE",
  authDomain: "grad-project-b11d3.firebaseapp.com",
  databaseURL: "https://grad-project-b11d3-default-rtdb.firebaseio.com",
  projectId: "grad-project-b11d3",
  storageBucket: "grad-project-b11d3.firebasestorage.app",
  messagingSenderId: "744759817993",
  appId: "1:744759817993:web:191cb4ad7563291eec45d8",
  measurementId: "G-ZVENF1PYSB",
};

// تهيئة Firebase مرة واحدة فقط
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// خدمات Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

// Messaging (FCM) مع التحقق من البيئة
let messagingInstance = null;

export const requestFirebaseNotificationPermission = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.log("Firebase messaging is not supported in this environment.");
      return null;
    }

    if (!messagingInstance) {
      messagingInstance = getMessaging(app);
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messagingInstance, {
        vapidKey:
          "BD0x5G8XEvVT85pTjhOeG2qjWsyxgAeXDa969HHgsVMnrM57ZLIukSoZLy5p24DVAaY4_yKcoxQVIFQ9hQJHAWI",
      });
      console.log("Device token:", token);
      return token;
    } else {
      console.log("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("FCM permission error:", error);
    return null;
  }
};