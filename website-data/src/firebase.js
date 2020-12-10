import firebase from 'firebase'


const firebaseConfig = {
  apiKey: "AIzaSyAaW8ic-QFVptBujF3hUPdcfeJwJQbQNnw",
  authDomain: "arduino-pollution.firebaseapp.com",
  databaseURL: "https://arduino-pollution-default-rtdb.firebaseio.com",
  projectId: "arduino-pollution",
  storageBucket: "arduino-pollution.appspot.com",
  messagingSenderId: "328226383805",
  appId: "1:328226383805:web:9c1ab2006a124f140ad4d4",
  measurementId: "G-HNJFTZZDYQ"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();

  const auth = firebase.auth()

  const provider = new firebase.auth.GoogleAuthProvider();

  const fv = firebase.firestore.FieldValue;

  export {auth, provider, fv}

  export default db