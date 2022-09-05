import {initializeApp} from "firebase/app";
import {
    getFirestore,
    collection,
    getDoc,
    addDoc,
    deleteDoc,
    doc,
    setDoc,
} from "firebase/firestore"

import { getAuth, createUserWithEmailAndPassword,
   signInWithEmailAndPassword, updateProfile, signOut} from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDUqBm9jthKqiP21lZZyK88VuWNcYUbVb0",
    authDomain: "diary-afe01.firebaseapp.com",
    projectId: "diary-afe01",
    storageBucket: "diary-afe01.appspot.com",
    messagingSenderId: "93608321345",
    appId: "1:93608321345:web:fbe4c7e4f8892c2970c1c0",
    measurementId: "G-ZBEVWZJT8R"
  };

  initializeApp(firebaseConfig)


// Initialize Firebase Firestore database and get a reference to the service
  const db = getFirestore();
  
// Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth();
  // createUserWithEmailAndPassword(auth, email, password)
  // .then((userCredential) => {
  //   // Signed in 
  //   const user = userCredential.user;
  //   // ...
  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // ..
  // });



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
   updateProfile
  };
  