// Importamos la conexión y las herramientas para guardar/leer documentos
import { db } from './firebase.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalRegistro');
    const btnAbrir = document.getElementById('btnNuevaPropiedad');
    const btnCerrar = document.querySelector('.cerrar-modal');
    const form = document.getElementById('formPropiedad');
    const listaPropiedades = document.getElementById('listaPropiedades');

    // --- 1. CARGAR CASAS DESDE FIREBASE ---
    async function cargarCasasGuardadas() {
        listaPropiedades.innerHTML = '<p style="padding: 20px;">Cargando propiedades desde la nube...</p>'; 
        
        try {
            const querySnapshot = await getDocs(collection(db, "casas"));
            listaPropiedades.innerHTML = ''; // Limpiar mensaje de carga
            
            if (querySnapshot.empty) {
                listaPropiedades.innerHTML = '<p style="padding: 20px;">No hay casas registradas aún.</p>';
                return;
            }

            // Pintar cada casa encontrada en la base de datos
            querySnapshot.forEach((doc) => {
                const casa = doc.data();
                crearTarjetaCasa(casa.titulo, casa.precio, casa.detalles);
            });
        } catch (error) {
            console.error("Error al cargar las casas:", error);
            listaPropiedades.innerHTML = '<p style="padding: 20px; color: red;">Hubo un error al cargar las propiedades.</p>';
        }
    }

    // --- 2. FUNCIÓN PARA CREAR LA TARJETA VISUAL ---
    function crearTarjetaCasa(titulo, precio, detalles) {
        const precioFormateado = Number(precio).toLocaleString('es-MX');
        
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
        
        listaPropiedades.prepend(nuevaTarjeta);
    }

    // --- 3. MANEJO DE LA VENTANA MODAL ---
    btnAbrir.addEventListener('click', () => modal.style.display = 'flex');
    btnCerrar.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // --- 4. GUARDAR NUEVA CASA EN FIREBASE ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const titulo = document.getElementById('tituloCasa').value;
        const precio = document.getElementById('precioCasa').value;
        const detalles = document.getElementById('detallesCasa').value;
        const botonGuardar = form.querySelector('button[type="submit"]');

        botonGuardar.textContent = "Guardando en la nube...";
        botonGuardar.disabled = true;

        try {
            // Guardar en la colección "casas" en Firebase
            await addDoc(collection(db, "casas"), {
                titulo: titulo,
                precio: precio,
                detalles: detalles,
                fechaRegistro: new Date() // Guarda la fecha y hora exacta
            });

            // Actualizar la pantalla
            if (listaPropiedades.innerHTML.includes("No hay casas registradas aún")) {
                listaPropiedades.innerHTML = '';
            }
            crearTarjetaCasa(titulo, precio, detalles);

            // Limpiar y cerrar
            form.reset();
            modal.style.display = 'none';

        } catch (error) {
            alert("Error al guardar la propiedad. Revisa la consola.");
            console.error("Error al guardar:", error);
        } finally {
            botonGuardar.textContent = "Guardar Propiedad";
            botonGuardar.disabled = false;
        }
    });

    // Ejecutar al iniciar la página
    cargarCasasGuardadas();
});