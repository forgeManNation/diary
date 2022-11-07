import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getStorage,
  ref,
  uploadBytes,
  getBlob,
  listAll,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUqBm9jthKqiP21lZZyK88VuWNcYUbVb0",
  authDomain: "diary-afe01.firebaseapp.com",
  projectId: "diary-afe01",
  storageBucket: "diary-afe01.appspot.com",
  messagingSenderId: "93608321345",
  appId: "1:93608321345:web:fbe4c7e4f8892c2970c1c0",
  measurementId: "G-ZBEVWZJT8R",
};

initializeApp(firebaseConfig);

// Initialize Firebase Firestore database and get a reference to the service
const db = getFirestore();

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

const storage = getStorage();

export {
  signOut,
  db,
  collection,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  storage,
  ref,
  uploadBytes,
  getBlob,
  listAll,
};
