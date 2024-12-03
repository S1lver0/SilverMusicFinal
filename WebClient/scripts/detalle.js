document.addEventListener("DOMContentLoaded", function() {
    // Obtener el id_producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = parseInt(urlParams.get('id'));

    // Recuperar los productos desde localStorage
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    // Buscar el producto seleccionado
    const productoSeleccionado = productos.find(producto => producto.id_producto === idProducto);

    if (productoSeleccionado) {
        // Mostrar los detalles del producto
        const detalleProductoHTML = `
            <div class="col-md-6">
                <img src="${productoSeleccionado.url_producto}" class="img-fluid" alt="${productoSeleccionado.nombre_producto}">
            </div>
            <div class="col-md-6">
                <h1>${productoSeleccionado.nombre_producto}</h1>
                <p><strong>Marca:</strong> ${productoSeleccionado.nombre_marca}</p>
                <p><strong>Precio:</strong> S/.${productoSeleccionado.precio_unitario}</p>
                <p><strong>Descripción:</strong> ${productoSeleccionado.descripcion_producto}</p>
                <button id="btn-carrito" class="btn btn-dark">Añadir al carrito</button>
            </div>
        `;
        document.getElementById("detalle-producto").innerHTML = detalleProductoHTML;

        // Evento para añadir al carrito
        const btnCarrito = document.getElementById("btn-carrito");
        btnCarrito.addEventListener("click", () => {
            // Recuperar el carrito actual del localStorage
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            // Comprobar si el producto ya está en el carrito
            const productoEnCarrito = carrito.find(item => item.id_producto === idProducto);
            if (productoEnCarrito) {
                // Incrementar la cantidad si ya está en el carrito
                productoEnCarrito.cantidad++;
            } else {
                // Añadir el producto con cantidad inicial 1
                carrito.push({ ...productoSeleccionado, cantidad: 1 });
            }

            // Guardar el carrito actualizado en localStorage
            localStorage.setItem("carrito", JSON.stringify(carrito));

            // Mostrar mensaje de confirmación con SweetAlert2
            Swal.fire({
                title: 'Producto añadido al carrito',
                text: `${productoSeleccionado.nombre_producto} ha sido añadido a tu carrito.`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        });

        // Mostrar productos relacionados (aleatorios de la misma categoría)
        const productosRelacionados = productos
            .filter(producto => producto.id_categoria === productoSeleccionado.id_categoria && producto.id_producto !== idProducto)
            .sort(() => 0.5 - Math.random()) // Desordenar aleatoriamente
            .slice(0, 5); // Tomar los primeros 5 después de desordenar

        const productosRelacionadosHTML = productosRelacionados.map(producto => `
            <div class="col-md-2 mb-4">
                <div class="card" style="cursor: pointer;" onclick="window.location.href='detalles.html?id=${producto.id_producto}'">
                    <img src="${producto.url_producto}" class="card-img-top" alt="${producto.nombre_producto}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre_producto}</h5>
                        <p class="price">S/.${producto.precio_unitario}</p>
                    </div>
                </div>
            </div>
        `).join('');
        document.getElementById("productos-relacionados").innerHTML = productosRelacionadosHTML;
    } else {
        // Si no se encuentra el producto, mostrar un mensaje
        document.getElementById("detalle-producto").innerHTML = '<p>Producto no encontrado.</p>';
    }
});



