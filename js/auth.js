document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SIMULACIÓN DE BASE DE DATOS (Solo para pruebas) ---
    // Esto se ejecuta al abrir la página. Crea una "tabla" de usuarios.
    function iniciarBaseDeDatos() {
        if (!localStorage.getItem('bd_fuencor_usuarios')) {
            const usuarios = [
                {
                    usuario: "ADMIN",
                    contrasena: "eavxr54hA"
                }
            ];
            // Guardamos la información en el navegador simulando la DB
            localStorage.setItem('bd_fuencor_usuarios', JSON.stringify(usuarios));
        }
    }
    
    iniciarBaseDeDatos();

    // --- 2. LÓGICA DE INICIO DE SESIÓN ---
    const loginForm = document.getElementById('loginForm');
    const alerta = document.getElementById('alertaPersonalizada');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Obtener los datos que escribió la persona
        const usuarioIngresado = document.getElementById('usuario').value;
        const passwordIngresada = document.getElementById('password').value;
        const boton = document.querySelector('.btn-rojo');

        // Efectos visuales de carga
        boton.textContent = "Verificando...";
        boton.disabled = true; 
        alerta.className = 'alerta oculta'; 
        
        // Retardo para simular la conexión a internet
        setTimeout(() => {
            
            // CONECTAR A LA BASE DE DATOS Y BUSCAR EL USUARIO
            const baseDeDatos = JSON.parse(localStorage.getItem('bd_fuencor_usuarios'));
            
            // Verificar si los datos coinciden
            const usuarioValido = baseDeDatos.find(
                (user) => user.usuario === usuarioIngresado && user.contrasena === passwordIngresada
            );

            if (usuarioValido) {
                // ÉXITO: Los datos son correctos
                alerta.textContent = "Acceso correcto. Redirigiendo...";
                alerta.className = 'alerta exito';
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; 
                }, 1200);

            } else {
                // ERROR: Datos incorrectos
                alerta.textContent = "Usuario o contraseña incorrectos.";
                alerta.className = 'alerta error';
                
                // Habilitar el botón para que intente de nuevo
                boton.textContent = "Entrar al Sistema";
                boton.disabled = false;
            }
            
        }, 800);
    });
});