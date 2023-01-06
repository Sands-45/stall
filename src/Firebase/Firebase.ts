import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

//Config Firebase ==================================
export const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: "stall-d635a",
    storageBucket: "stall-d635a.appspot.com",
    messagingSenderId: process.env.REACT_APP_MS_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: "G-4PJ9S2MJP4",
  };  

// initializeApp() is called before getAuth() for sure 
export const app = initializeApp(firebaseConfig);

export const auth = getAuth();