// Importar las herramientas de Firebase desde la nube de Google
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNt3t2oQaU2EinVt-4ceG8W2efmgedbYs",
  authDomain: "fuencor-bd.firebaseapp.com",
  projectId: "fuencor-bd",
  storageBucket: "fuencor-bd.firebasestorage.app",
  messagingSenderId: "1080885885688",
  appId: "1:1080885885688:web:b68a457b6516fca559d90d",
  measurementId: "G-F0MME2ED36"
};

// Inicializar la conexión
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("Firebase inicializado.");