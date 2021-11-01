import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDcbR2dM4Ppl_I2cuzzn4nFNP54WABV0Wc",
  authDomain: "instagram-clone-a464a.firebaseapp.com",
  projectId: "instagram-clone-a464a",
  storageBucket: "instagram-clone-a464a.appspot.com",
  messagingSenderId: "998127390887",
  appId: "1:998127390887:web:76764d8bf93694e709cb82",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
