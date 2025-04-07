
import { initializeApp, FirebaseApp, getApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

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
  // firebase 설정을 담은 하나의 앱 객체
  // 이 설정(firebaseConfig)으로 Firebase 프로젝트에 연결된 하나의 앱 인스턴스를 의미한다.
  // 인스턴스란 어떠한 설계도(클래스, 설정 등)를 바탕으로 실제 만들어진 실체
  // app 기준으로 인증, DB등 기능을 꺼내 쓰는것
  app = initializeApp(firebaseConfig,"app"); // 없으면 새로 초기화
}

const firebase = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export default firebase;