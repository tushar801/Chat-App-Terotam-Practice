import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCFA1FxMt9ZkUG2FjSiuyN6BN9JJZBiuxw",
  authDomain: "chat-app-98cb2.firebaseapp.com",
  projectId: "chat-app-98cb2",
  storageBucket: "chat-app-98cb2.firebasestorage.app",
  messagingSenderId: "163334037484",
  appId: "1:163334037484:web:eb3965cd45cd5988642ac9",
  
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);