import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  UserCredential,
} from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { updateDoc, arrayUnion } from "firebase/firestore";
import firebase from "firebase/app";
import {
  getFirestore,
  setDoc,
  doc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import "firebase/auth";
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

// Reference to the Firebase Realtime Database
const db = getDatabase();
export const dbFireStore = getFirestore(app);
// Function to register a new user
export const getAuthContext = () => {
  const auth1 = getAuth();
  return auth1;
};
// Function to register a new user
export const registerNewUser = (user: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Register the user using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );

      // Get the user's UID
      const { uid } = userCredential.user;

      // Create a Firestore reference to the user's document
      const userDocRef = doc(getFirestore(), "users", uid); // Assuming "users" is the collection name

      // Set the user's name and avatar in the Firestore document
      await setDoc(userDocRef, {
        id: uid,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });

      resolve(userCredential);
    } catch (error) {
      reject(error);
    }
  });
};
export const updateWatchedMovieUser = async (
  uid: string, // Pass the user's UID as an argument
  movieName: string,
  category: number[],
  endTime: number
) => {
  try {
    const userRef = doc(dbFireStore, "users", uid);
    console.log(userRef, "userRef");
    // Create an object to represent the watched movie
    const watchedMovie = {
      name: movieName,
      categories: category,
      endTime: endTime,
    };

    // Update the user document to add the movie to the watchedMovies array
    await updateDoc(userRef, {
      watchedMovies: arrayUnion(watchedMovie),
    });
  } catch (error) {
    console.error("Error updating watched movies:", error);
  }
};

// Function to log in a user
export const loginUser = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Function to fetch and merge data
export const mergeMovieData = async () => {
  try {
    // Reference to the "movies" node in your database
    const moviesRef = ref(db, "movies");
    const moviesSnapshot = await get(moviesRef);

    // Reference to the "pictures" node in your database
    // const picturesRef = ref(db, "pictures");
    // const picturesSnapshot = await get(picturesRef);

    // Create an array to store the merged data
    const mergedData: any[] = [];

    // Loop through movies and merge data
    moviesSnapshot.forEach((movieSnapshot) => {
      const movieKey = movieSnapshot.key;
      const movieUrl = movieSnapshot.val();

      // Check if there's a matching picture
      // const pictureUrl = picturesSnapshot.child(movieKey).val();

      mergedData.push({
        name: movieKey,
        movieUrl: movieUrl,
      });
      // if (pictureUrl) {
      //   // Create an object for each movie with name, picture URL, and movie URL
      //   mergedData.push({
      //     name: movieKey,
      //     movieUrl: movieUrl,
      //   });
      // }
    });

    // Return the mergedData array containing movie objects
    return mergedData;
  } catch (error) {
    console.error("Error merging data:", error);
    throw error; // Make sure to throw the error so it's caught in your component
  }
};
