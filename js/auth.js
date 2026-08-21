// Prueba para ver si el archivo cargó correctamente
console.log("El archivo auth.js ha cargado con éxito.");

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SIMULACIÓN DE BASE DE DATOS ---
    function iniciarBaseDeDatos() {
        if (!localStorage.getItem('bd_fuencor_usuarios')) {
            const usuarios = [
                {
                    usuario: "ADMIN",
                    contrasena: "eavxr54hA"
                }
            ];
            localStorage.setItem('bd_fuencor_usuarios', JSON.stringify(usuarios));
        }
    }
    iniciarBaseDeDatos();

    // --- 2. LÓGICA DE INICIO DE SESIÓN ---
    const loginForm = document.getElementById('loginForm');
    const alerta = document.getElementById('alertaPersonalizada');

    // Verificamos si encontró el formulario
    if (!loginForm) {
        console.error("ERROR: No se encontró el formulario en el HTML.");
        return;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log("Botón presionado, iniciando validación...");

        try {
            const usuarioIngresado = document.getElementById('usuario').value;
            const passwordIngresada = document.getElementById('password').value;
            const boton = document.querySelector('.btn-rojo');

            boton.textContent = "Verificando...";
            boton.disabled = true; 
            alerta.className = 'alerta oculta'; 
            
            setTimeout(() => {
                const baseDeDatos = JSON.parse(localStorage.getItem('bd_fuencor_usuarios'));
                
                const usuarioValido = baseDeDatos.find(
                    (user) => user.usuario === usuarioIngresado && user.contrasena === passwordIngresada
                );

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
            }, 800);
        } catch (error) {
            // Si algo falla, lo mostrará en rojo en la página para que sepamos qué es
            alerta.textContent = "Hubo un error interno en el código.";
            alerta.className = 'alerta error';
            console.error("Detalle del error:", error);
        }
    });
});