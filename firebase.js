import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCXiYasi25gg9xO7EO7CyXm1Dw53lZfDgQ",
  authDomain: "education-8e2f9.firebaseapp.com",
  databaseURL: "https://education-8e2f9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "education-8e2f9",
  storageBucket: "education-8e2f9.firebasestorage.app",
  messagingSenderId: "273936285136",
  appId: "1:273936285136:web:80d4afb65c0174e215cdd5",
  measurementId: "G-YYF5ENH41X"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function addItem(path, data) {
  const dataRef = ref(db, path);
  const newItemRef = push(dataRef);
  return set(newItemRef, data);
}

function getItems(path, callback) {
  const dataRef = ref(db, path);
  // رجع unsubscribe باش تمسح الـ listener
  const unsubscribe = onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
  return unsubscribe;
}

export { addItem, getItems };
