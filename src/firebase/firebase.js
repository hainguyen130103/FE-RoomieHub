// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBA7fKM19OcVKGobNLIple6MkqYLzJZtuU",
  authDomain: "exe201-f7404.firebaseapp.com",
  databaseURL: "https://exe201-f7404-default-rtdb.firebaseio.com",
  projectId: "exe201-f7404",
  storageBucket: "exe201-f7404.firebasestorage.app",
  messagingSenderId: "636134960769",
  appId: "1:636134960769:web:e93bae3e6b8dc455fd6780",
  measurementId: "G-W02GVFKCVH",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
