import { db } from './firebase.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. VERIFICAR ROL Y PERMISOS ---
    const rolActual = localStorage.getItem('rolActivo');
    const panelAdmin = document.getElementById('panelAdmin');
    const saludoUsuario = document.getElementById('saludoUsuario');

    if (rolActual === 'admin') {
        panelAdmin.style.display = 'block'; // Muestra el panel si es admin
        saludoUsuario.textContent = "Hola, Administrador";
    } else {
        panelAdmin.style.display = 'none'; // Lo oculta si es agente
        saludoUsuario.textContent = "Hola, Agente";
    }

    // --- 2. CERRAR SESIÓN ---
    document.getElementById('btnCerrarSesion').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('rolActivo'); // Borramos la memoria
        window.location.href = 'index.html'; // Lo sacamos de la página
    });

    // --- 3. REGISTRAR NUEVOS AGENTES (Solo Admin) ---
    const formNuevoAgente = document.getElementById('formNuevoAgente');
    if (formNuevoAgente) {
        formNuevoAgente.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correo = document.getElementById('nuevoCorreo').value;
            const pass = document.getElementById('nuevaPass').value;
            const boton = formNuevoAgente.querySelector('button');

            boton.textContent = "Creando...";
            boton.disabled = true;

            try {
                // Guardar nuevo agente en Firebase
                await addDoc(collection(db, "usuarios"), {
                    correo: correo,
                    contrasena: pass,
                    rol: "agente" // Los nuevos siempre son agentes
                });
                alert(`¡El agente ${correo} fue creado con éxito! Ya puede iniciar sesión.`);
                formNuevoAgente.reset();
            } catch (error) {
                alert("Hubo un error al crear al agente.");
                console.error(error);
            } finally {
                boton.textContent = "Crear Agente";
                boton.disabled = false;
            }
        });
    }

    // --- 4. MANEJO DE CASAS (Para todos) ---
    const modal = document.getElementById('modalRegistro');
    const btnAbrir = document.getElementById('btnNuevaPropiedad');
    const btnCerrar = document.querySelector('.cerrar-modal');
    const form = document.getElementById('formPropiedad');
    const listaPropiedades = document.getElementById('listaPropiedades');

    async function cargarCasasGuardadas() {
        listaPropiedades.innerHTML = '<p style="padding: 20px;">Cargando propiedades desde la nube...</p>'; 
        try {
            const querySnapshot = await getDocs(collection(db, "casas"));
            listaPropiedades.innerHTML = ''; 
            if (querySnapshot.empty) {
                listaPropiedades.innerHTML = '<p style="padding: 20px;">No hay casas registradas aún.</p>';
                return;
            }
            querySnapshot.forEach((doc) => {
                const casa = doc.data();
                crearTarjetaCasa(casa.titulo, casa.precio, casa.detalles);
            });
        } catch (error) {
            console.error("Error al cargar las casas:", error);
            listaPropiedades.innerHTML = '<p style="padding: 20px; color: red;">Hubo un error al cargar las propiedades.</p>';
        }
    }

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

    btnAbrir.addEventListener('click', () => modal.style.display = 'flex');
    btnCerrar.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titulo = document.getElementById('tituloCasa').value;
        const precio = document.getElementById('precioCasa').value;
        const detalles = document.getElementById('detallesCasa').value;
        const botonGuardar = form.querySelector('button[type="submit"]');

        botonGuardar.textContent = "Guardando...";
        botonGuardar.disabled = true;

        try {
            await addDoc(collection(db, "casas"), {
                titulo: titulo,
                precio: precio,
                detalles: detalles,
                fechaRegistro: new Date()
            });

            if (listaPropiedades.innerHTML.includes("No hay casas")) {
                listaPropiedades.innerHTML = '';
            }
            crearTarjetaCasa(titulo, precio, detalles);
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

    // Ejecutar al iniciar
    cargarCasasGuardadas();
});