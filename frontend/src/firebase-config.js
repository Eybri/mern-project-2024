import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD4hSIabP3KDWwhE8NlFU-1xjfKFt7Laxs",
    authDomain: "mern-project-2024.firebaseapp.com",
    projectId: "mern-project-2024",
    storageBucket: "mern-project-2024.firebasestorage.app",
    messagingSenderId: "26180139285",
    appId: "1:26180139285:web:7f93065437a7f0ffc9111c",
    measurementId: "G-X2P1BFHKQH"
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export default firebaseApp;
