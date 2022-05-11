import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import uniqid from 'uniqid';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    localStorage.setItem('user', uid)
  }
});

export default db;

export async function registrarUsuario(email, name, password, rol) {
  console.log('email, password, rol', email, password, rol)
  let flag = false
  await createUserWithEmailAndPassword(auth, email, password).then(() => {
    // Signed in
    flag = true
    // ...
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode)
    console.log(errorMessage)
    // ..
  })
  if (flag) {
    try {
      const id = uniqid()
      await setDoc(doc(db, "users", id), {
        name: name,
        email: email,
        rol: rol
      });
    } catch (error) {
      console.log(error)
    }
  }
}

export async function iniciarSesion(email, password) {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {}).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
    });
}

export function logout() {
  localStorage.removeItem('user')
  auth.signOut()
}