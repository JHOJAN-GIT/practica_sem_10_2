const API_URL = 'http://localhost:3000/api/productos';

// 1. Lógica de las pestañas
function cambiarPestana(idPestana) {
    // Ocultar todas las pestañas y quitar clase active a botones
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Mostrar la pestaña seleccionada y activar botón
    document.getElementById(idPestana).classList.add('active');
    event.target.classList.add('active');
}

// 2. Cargar productos (GET)
async function cargarProductos() {
    try {
        const respuesta = await fetch(API_URL);
        const productos = await respuesta.json();
        
        const tbody = document.getElementById('tabla-productos');
        tbody.innerHTML = ''; // Limpiar tabla

        productos.forEach(prod => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${prod.id}</td>
                <td>${prod.nombre}</td>
                <td>S/ ${parseFloat(prod.precio).toFixed(2)}</td>
                <td>${prod.stock}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarProducto(${prod.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
        alert("Asegúrate de que el servidor Node.js esté encendido.");
    }
}

// 3. Agregar producto (POST)
document.getElementById('form-producto').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const nuevoProducto = {
        nombre: document.getElementById('nombre').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value)
    };

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProducto)
        });

        if (respuesta.ok) {
            alert('¡Producto agregado con éxito!');
            document.getElementById('form-producto').reset(); // Limpiar formulario
            cargarProductos(); // Recargar la tabla
            cambiarPestana('ver-productos', { target: document.querySelector('.tab-btn') }); // Volver a la pestaña 1
        }
    } catch (error) {
        console.error("Error al guardar:", error);
    }
});

// 4. Eliminar producto (DELETE)
async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (respuesta.ok) {
            alert('Producto eliminado');
            cargarProductos(); // Recargar la tabla
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

// Iniciar la carga cuando se abra la página
document.addEventListener('DOMContentLoaded', cargarProductos);