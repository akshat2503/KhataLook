// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBB194O8BXhZ4pGviwo0Oeqg7vEKKY9TNM",
  authDomain: "khatalook.firebaseapp.com",
  projectId: "khatalook",
  storageBucket: "khatalook.appspot.com",
  messagingSenderId: "840700509151",
  appId: "1:840700509151:web:79837a1f27ad622086a26a",
  measurementId: "G-SJX4KHQ8MR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
