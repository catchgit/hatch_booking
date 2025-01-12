// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxlVZM5aK0wac2HO9bEWKNTlnteSwemIU",
    authDomain: "hatch-booking.firebaseapp.com",
    projectId: "hatch-booking",
    storageBucket: "hatch-booking.firebasestorage.app",
    messagingSenderId: "657218738758",
    appId: "1:657218738758:web:89ee436f4ce736b8bfc847"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };