
import { initializeApp, FirebaseApp, getApp } from "firebase/app";

export let app: FirebaseApp;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_APP_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_APP_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_APP_STORANGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_APP_MESSAGEING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_APP_MEASURMENT_ID
};

try {
  app = getApp("app") // 초기화된 Firebase 앱 가져오기
} catch (e) {
  app = initializeApp(firebaseConfig,"app"); // 없으면 새로 초기화
}

const firebase = initializeApp(firebaseConfig);

export default firebase;