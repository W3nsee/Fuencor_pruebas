import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const alerta = document.getElementById('alertaPersonalizada');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const correoIngresado = document.getElementById('correo').value;
        const passwordIngresada = document.getElementById('password').value;
        const boton = document.querySelector('.btn-rojo');

        boton.textContent = "Verificando en la nube...";
        boton.disabled = true; 
        alerta.className = 'alerta oculta'; 
        
        try {
            // Buscamos en la colección "usuarios"
            const querySnapshot = await getDocs(collection(db, "usuarios"));
            let usuarioValido = false;
            let rolDelUsuario = "agente"; // Rol por defecto

            querySnapshot.forEach((doc) => {
                const user = doc.data();
                if (user.correo === correoIngresado && user.contrasena === passwordIngresada) {
                    usuarioValido = true;
                    rolDelUsuario = user.rol; // Extraemos el rol que pusiste en la base de datos
                }
            });

            if (usuarioValido) {
                // Guardamos el rol en la memoria temporal del navegador
                localStorage.setItem('rolActivo', rolDelUsuario);

                alerta.textContent = "Acceso correcto. Redirigiendo...";
                alerta.className = 'alerta exito';
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; 
                }, 1200);

            } else {
                alerta.textContent = "Correo o contraseña incorrectos.";
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