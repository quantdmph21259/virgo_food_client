// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCoCcCUSrbrhE4zzbof4SnIhio7F6O-AXE",
    authDomain: "food-app-24bf2.firebaseapp.com",
    databaseURL: "https://food-app-24bf2-default-rtdb.firebaseio.com",
    projectId: "food-app-24bf2",
    storageBucket: "food-app-24bf2.appspot.com",
    messagingSenderId: "1039331567140",
    appId: "1:1039331567140:web:a98f22a937006ddba7dab1",
    measurementId: "G-J4EMYM7ZJ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export {
    storage
}