import { db } from './firebase.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. VERIFICAR ROL Y CONFIGURAR SIDEBAR ---
    const rolActual = localStorage.getItem('rolActivo');
    const saludoUsuario = document.getElementById('saludoUsuario');
    const btnNavAgentes = document.getElementById('navAgentes');
    
    if (rolActual === 'admin') {
        saludoUsuario.textContent = "🛡️ Admin Activo";
        btnNavAgentes.style.display = 'block'; // Mostrar opción de menú a admin
    } else {
        saludoUsuario.textContent = "👋 Agente Activo";
    }

    // --- 2. NAVEGACIÓN DEL MENÚ LATERAL ---
    const btnPropiedades = document.getElementById('navPropiedades');
    const seccionPropiedades = document.getElementById('seccionPropiedades');
    const seccionAgentes = document.getElementById('seccionAgentes');

    btnPropiedades.addEventListener('click', () => {
        btnPropiedades.classList.add('activo');
        btnNavAgentes.classList.remove('activo');
        seccionPropiedades.className = 'seccion-activa';
        seccionAgentes.className = 'seccion-oculta';
    });

    btnNavAgentes.addEventListener('click', () => {
        btnNavAgentes.classList.add('activo');
        btnPropiedades.classList.remove('activo');
        seccionAgentes.className = 'seccion-activa';
        seccionPropiedades.className = 'seccion-oculta';
    });

    // Cerrar sesión
    document.getElementById('btnCerrarSesion').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('rolActivo');
        window.location.href = 'index.html';
    });

    // --- 3. PREVISUALIZADOR DE FOTOS ---
    const inputFotos = document.getElementById('inputFotos');
    const previewContainer = document.getElementById('previewFotos');
    let fotoPrincipalIndex = 0; // Por defecto la primera es la principal

    inputFotos.addEventListener('change', function() {
        previewContainer.innerHTML = ''; // Limpiar anteriores
        const archivos = Array.from(this.files);

        if(archivos.length === 0) return;

        archivos.forEach((archivo, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const divContenedor = document.createElement('div');
                divContenedor.className = `foto-box ${index === 0 ? 'principal' : ''}`;
                divContenedor.innerHTML = `<img src="${e.target.result}">`;
                
                // Función para elegir la portada
                divContenedor.addEventListener('click', () => {
                    document.querySelectorAll('.foto-box').forEach(b => b.classList.remove('principal'));
                    divContenedor.classList.add('principal');
                    fotoPrincipalIndex = index;
                });

                previewContainer.appendChild(divContenedor);
            };
            reader.readAsDataURL(archivo);
        });
    });

    // --- 4. CARGAR CASAS DESDE FIREBASE ---
    const listaPropiedades = document.getElementById('listaPropiedades');

    async function cargarCasasGuardadas() {
        listaPropiedades.innerHTML = '<p style="padding: 20px;">Cargando inventario...</p>'; 
        try {
            const querySnapshot = await getDocs(collection(db, "casas"));
            listaPropiedades.innerHTML = ''; 
            
            if (querySnapshot.empty) {
                listaPropiedades.innerHTML = '<p>No hay casas registradas aún.</p>';
                return;
            }
            querySnapshot.forEach((doc) => {
                const casa = doc.data();
                crearTarjetaCasa(casa.titulo, casa.precio, casa.detalles, casa.descripcion);
            });
        } catch (error) {
            console.error("Error al cargar:", error);
            listaPropiedades.innerHTML = '<p style="color: red;">Error al cargar las propiedades.</p>';
        }
    }

    function crearTarjetaCasa(titulo, precio, detalles, descripcion = "Sin descripción") {
        const precioFormateado = Number(precio).toLocaleString('es-MX');
        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.className = 'card-propiedad';
        
        // El diseño CSS 'object-fit: cover' encuadra la imagen automáticamente
        nuevaTarjeta.innerHTML = `
            <div class="card-imagen" style="background-color: #333;">
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white;">🏠 Imagen Próximamente</div>
            </div>
            <div class="card-info">
                <h3>${titulo}</h3>
                <p class="precio">$${precioFormateado} MXN</p>
                <p style="font-weight: bold; font-size: 14px;">${detalles}</p>
                <p class="desc-corta">${descripcion}</p>
            </div>
        `;
        listaPropiedades.prepend(nuevaTarjeta);
    }

    // --- 5. MODAL Y GUARDADO DE DATOS (AÚN SIN SUBIR FOTOS) ---
    const modal = document.getElementById('modalRegistro');
    const formPropiedad = document.getElementById('formPropiedad');

    document.getElementById('btnNuevaPropiedad').addEventListener('click', () => modal.style.display = 'flex');
    document.querySelector('.cerrar-modal').addEventListener('click', () => modal.style.display = 'none');

    formPropiedad.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const titulo = document.getElementById('tituloCasa').value;
        const precio = document.getElementById('precioCasa').value;
        const detalles = document.getElementById('detallesCasa').value;
        const descripcion = document.getElementById('descCasa').value;
        
        // NOTA: Para guardar las fotos reales necesitamos activar Storage en el siguiente paso.
        const botonGuardar = formPropiedad.querySelector('button[type="submit"]');
        botonGuardar.textContent = "Guardando Datos...";
        botonGuardar.disabled = true;

        try {
            await addDoc(collection(db, "casas"), {
                titulo: titulo,
                precio: precio,
                detalles: detalles,
                descripcion: descripcion,
                fechaRegistro: new Date()
            });

            crearTarjetaCasa(titulo, precio, detalles, descripcion);
            formPropiedad.reset();
            previewContainer.innerHTML = '';
            modal.style.display = 'none';
        } catch (error) {
            alert("Error al guardar.");
            console.error(error);
        } finally {
            botonGuardar.textContent = "Guardar Propiedad Completa";
            botonGuardar.disabled = false;
        }
    });

    cargarCasasGuardadas();
});