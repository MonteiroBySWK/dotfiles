import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBcGLTBiVuihB4Ybg7P3-YAhXch_GBrJ88",
  authDomain: "dashboards-thera.firebaseapp.com",
  projectId: "dashboards-thera",
  storageBucket: "dashboards-thera.appspot.com",
  messagingSenderId: "36007351006",
  appId: "1:36007351006:web:7863320a2f662a22c5a84f",
  measurementId: "G-E6LL5F7RJB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
