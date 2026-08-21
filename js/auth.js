document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (event) => {
        // Previene que la página se recargue al enviar el formulario
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Aquí irá la lógica de conexión a tu base de datos en el futuro
        console.log("Intentando iniciar sesión con:", email);
        
        // Simulación de carga
        const boton = document.querySelector('.btn-rojo');
        boton.textContent = "Verificando...";
        
        setTimeout(() => {
            alert(`¡Bienvenido al sistema de Fuencor, ${email}!`);
            boton.textContent = "Entrar al Sistema";
            
            // Redirección directa al panel de control de los agentes
            window.location.href = 'dashboard.html'; 
            
        }, 1000);
    });
});