import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_KUw9LfyQesBQ8u-XsR63zqKFfXdqmQI",
  authDomain: "polkoloniewachowscy.firebaseapp.com",
  projectId: "polkoloniewachowscy",
  storageBucket: "polkoloniewachowscy.firebasestorage.app",
  messagingSenderId: "387020196373",
  appId: "1:387020196373:web:a006f42a66bb835eb29c1c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
