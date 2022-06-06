import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
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

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const email = user.email;
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', uid)
    }
    const dataUsers = await queryData('users')
    const users = dataUsers.docs
    if (users) {
      let id = ''
      users.forEach(async (doc) => {
        if (doc.data().email.toLowerCase() === email && !doc.data().uid) {
          id = doc.id
          await updateData('users', id, { uid: uid })
        }
        if (doc.data().email.toLowerCase() === email && !localStorage.getItem('rol')) {
          localStorage.setItem('rol', doc.data().rol)
        }
      })
    }
  }
});

export default db;

export async function registrarUsuario(email, name, password, rol, admin, recyclePoint) {
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
      if (admin) {
        await setDoc(doc(db, "users", id), {
          name: name,
          email: email,
          rol: rol,
          password: password,
          recyclePoint: recyclePoint
        });
      } else {
        await setDoc(doc(db, "users", id), {
          name: name,
          email: email,
          rol: rol,
          password: password
        });
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export async function iniciarSesion(email, password) {
  let flag = false
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => { flag = true }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
    });
    return flag
}

export function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('rol')
  auth.signOut()
}

export async function queryDoc(collectionName, documentName) {
  let queryCollection = doc(db, collectionName, documentName);
  return await getDoc(queryCollection);
}

export async function queryData(collectionName) {
  let queryCollection = collection(db, collectionName)
  return await getDocs(queryCollection)
}

export async function updateData(collection, document, collectionObject) {
  const docRef = doc(db, collection, document);
  await updateDoc(docRef, collectionObject);
}

export async function addDocs(collectionName, data) {
  let queryCollection = collection(db, collectionName)
  await addDoc(queryCollection, data);
}

export async function DeleteDoc(collectionName, documentName) {
  await deleteDoc(doc(db, collectionName, documentName));
}