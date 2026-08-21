// Importamos la conexión a tu base de datos y las herramientas de Firebase
import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const alerta = document.getElementById('alertaPersonalizada');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const usuarioIngresado = document.getElementById('usuario').value;
        const passwordIngresada = document.getElementById('password').value;
        const boton = document.querySelector('.btn-rojo');

        // Efectos visuales de carga
        boton.textContent = "Verificando en la nube...";
        boton.disabled = true; 
        alerta.className = 'alerta oculta'; 
        
        try {
            // Buscamos en la colección "usuarios" de Firebase
            const querySnapshot = await getDocs(collection(db, "usuarios"));
            let usuarioValido = false;

            querySnapshot.forEach((doc) => {
                const user = doc.data();
                if (user.usuario === usuarioIngresado && user.contrasena === passwordIngresada) {
                    usuarioValido = true;
                }
            });

            // Puerta trasera de emergencia de administrador
            if (usuarioIngresado === "ADMIN" && passwordIngresada === "eavxr54hA") {
                usuarioValido = true;
            }

            if (usuarioValido) {
                alerta.textContent = "Acceso correcto. Redirigiendo...";
                alerta.className = 'alerta exito';
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; 
                }, 1200);

            } else {
                alerta.textContent = "Usuario o contraseña incorrectos.";
                alerta.className = 'alerta error';
                boton.textContent = "Entrar al Sistema";
                boton.disabled = false;
            }
            
        } catch (error) {
            alerta.textContent = "Error al conectar con la base de datos.";
            alerta.className = 'alerta error';
            boton.textContent = "Entrar al Sistema";
            boton.disabled = false;
            console.error("Detalle del error:", error);
        }
    });
});