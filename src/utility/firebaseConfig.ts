// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { Firestore, getFirestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBiQoRsCu7bQq-lkAHzI9WfsBPWIjVKAEo',
  authDomain: 'messenger-81270.firebaseapp.com',
  projectId: 'messenger-81270',
  storageBucket: 'messenger-81270.firebasestorage.app',
  messagingSenderId: '442590379321',
  appId: '1:442590379321:web:53fdef4ffe1aca8b00fce8',
}

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig)
const db: Firestore = getFirestore(app)
const auth: Auth = getAuth(app)

export { app as firebaseApp, db, auth }
