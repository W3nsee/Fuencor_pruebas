document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const alerta = document.getElementById('alertaPersonalizada');

    loginForm.addEventListener('submit', (event) => {
        // Previene que la página se recargue
        event.preventDefault();

        const email = document.getElementById('email').value;
        const boton = document.querySelector('.btn-rojo');

        // Estado de carga
        boton.textContent = "Verificando...";
        boton.disabled = true; // Desactivar botón para evitar doble clic
        alerta.className = 'alerta oculta'; // Ocultar alertas previas
        
        // Simular conexión a base de datos
        setTimeout(() => {
            // Mostrar notificación integrada en la página
            alerta.textContent = "Acceso correcto. Redirigiendo...";
            alerta.className = 'alerta exito';
            
            // Regresar el botón a la normalidad
            boton.textContent = "Entrar al Sistema";
            boton.disabled = false;
            
            // Esperar un momento breve para que se vea el mensaje y luego redirigir
            setTimeout(() => {
                window.location.href = 'dashboard.html'; 
            }, 1200);
            
        }, 800);
    });
});