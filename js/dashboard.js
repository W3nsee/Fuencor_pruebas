document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalRegistro');
    const btnAbrir = document.getElementById('btnNuevaPropiedad');
    const btnCerrar = document.querySelector('.cerrar-modal');
    const form = document.getElementById('formPropiedad');
    const listaPropiedades = document.getElementById('listaPropiedades');

    // Abrir y cerrar modal
    btnAbrir.addEventListener('click', () => modal.style.display = 'flex');
    btnCerrar.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Registrar nueva casa
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener valores
        const titulo = document.getElementById('tituloCasa').value;
        const precio = document.getElementById('precioCasa').value;
        const detalles = document.getElementById('detallesCasa').value;

        // Formatear precio básico
        const precioFormateado = Number(precio).toLocaleString('es-MX');

        // Crear nueva tarjeta HTML
        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.className = 'card-propiedad';
        nuevaTarjeta.innerHTML = `
            <div class="card-imagen" style="background-color: #ddd;">🏠</div>
            <div class="card-info">
                <h3>${titulo}</h3>
                <p class="precio">$${precioFormateado} MXN</p>
                <p class="detalles">${detalles}</p>
            </div>
        `;

        // Agregar al inicio del grid
        listaPropiedades.prepend(nuevaTarjeta);

        // Limpiar y cerrar
        form.reset();
        modal.style.display = 'none';
    });
});