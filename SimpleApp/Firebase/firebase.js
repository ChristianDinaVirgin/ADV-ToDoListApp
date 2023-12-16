// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl5IyY5obQnfbqmY0shW8izaBEjKYqlko",
  authDomain: "remindifyadv-46425.firebaseapp.com",
  databaseURL: "https://remindifyadv-46425-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "remindifyadv-46425",
  storageBucket: "remindifyadv-46425.appspot.com",
  messagingSenderId: "409519632117",
  appId: "1:409519632117:web:a23cba5f76cf75ee2a9fbc",
  measurementId: "G-R8BXKVEK8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export{app}