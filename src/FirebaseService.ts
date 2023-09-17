import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  UserCredential,
} from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBGg0YNqXb_EXf05aOHKjMHwmaQZnVjhvI",
  authDomain: "dad-s-movie.firebaseapp.com",
  databaseURL: "https://dad-s-movie-default-rtdb.firebaseio.com",
  projectId: "dad-s-movie",
  storageBucket: "dad-s-movie.appspot.com",
  messagingSenderId: "497181386427",
  appId: "1:497181386427:web:5d9176656aac3897feab9e",
  measurementId: "G-DZP5LRB9KX",
};

// Initialize Firebase with your project configuration
const app = initializeApp(firebaseConfig);

// Get the Firebase auth instance
const auth: Auth = getAuth(app);

// Function to register a new user
export const registerNewUser = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Function to log in a user
export const loginUser = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};
