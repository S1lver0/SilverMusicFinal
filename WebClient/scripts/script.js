// Control de carrusel para que cambie automáticamente cada 3 segundos
var myCarousel = document.querySelector("#carouselExample");
var carousel = new bootstrap.Carousel(myCarousel, {
  interval: 3000, // Cambia de imagen cada 3000ms (3 segundos)
  ride: "carousel",
});

//INICIO PRODUCTOS AGREGADOS
// Función para guardar los productos en localStorage
function guardarEnLocalStorage(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

// Función para obtener los productos desde localStorage
function obtenerDeLocalStorage(clave) {
  const datos = localStorage.getItem(clave);
  return datos ? JSON.parse(datos) : null;
}

// Función para renderizar productos en el contenedor
function renderizarProductos(productos) {
  $("#productos-container").empty(); // Limpiar contenedor antes de renderizar
  for (var i = 0; i < 4; i++) {
    if (i >= productos.length) break; // Asegurarnos de no exceder el número de productos
    var producto = productos[i];
    var productoCard = `
            <div class="col-md-3 mb-4">
                <div class="card">
                    <img src="${producto.url_producto}" class="card-img-top" alt="${producto.nombre_producto}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre_marca}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${producto.nombre_producto}</h6>
                        <p class="price">S/.${producto.precio_unitario}</p>
                    </div>
                </div>
            </div>
        `;
    $("#productos-container").append(productoCard);
  }
}

$(document).ready(function () {
  // Realizamos la solicitud AJAX para obtener los productos más recientes
  $.ajax({
    url: "http://localhost:3000/inventario/detallesInventario", // URL del backend donde obtendremos los productos
    type: "GET",
    dataType: "json",
    success: function (data) {
      // Guardamos todos los productos en localStorage
      guardarEnLocalStorage("productos", data);

      // Extraemos las categorías únicas de los productos
      const categoriasUnicas = [...new Set(data.map((producto) => producto.nombre_categoria))];

      // Guardamos las categorías únicas en localStorage
      guardarEnLocalStorage("categorias", categoriasUnicas);

      console.log("Productos y categorías únicas guardados en localStorage.");
      console.log("Categorías únicas:", categoriasUnicas);

      // Llenamos las tarjetas con los productos
      renderizarProductos(data);
    },
    error: function (xhr, status, error) {
      console.error("Error al obtener los productos:", error);
    },
  });
});

// Función para guardar datos en localStorage
function guardarEnLocalStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Función para obtener datos del localStorage
function obtenerDeLocalStorage(clave) {
  const datos = localStorage.getItem(clave);
  return datos ? JSON.parse(datos) : null;
}

