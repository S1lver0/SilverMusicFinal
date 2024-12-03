// Leer el término de búsqueda de la URL
const params = new URLSearchParams(window.location.search);
const terminoBusqueda = params.get("query").toLowerCase();

// Recuperar productos desde localStorage
const productos = JSON.parse(localStorage.getItem("productos")) || [];

// Filtrar productos iniciales según la búsqueda
let productosFiltrados = productos.filter((producto) =>
  producto.nombre_producto.toLowerCase().includes(terminoBusqueda)
);

// Referencias a elementos del DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const filtroCategoria = document.getElementById("filtro-categoria");
const filtroMarca = document.getElementById("filtro-marca");
const filtroPrecio = document.getElementById("filtro-precio");
const rangoPrecio = document.getElementById("rango-precio");

// Generar filtros dinámicamente según los productos filtrados
function inicializarFiltros() {
  // Limpiar filtros previos
  filtroCategoria.innerHTML = '<option value="">Todas</option>';
  filtroMarca.innerHTML = '<option value="">Todas</option>';

  // Extraer categorías y marcas únicas de los productos filtrados
  const categorias = [
    ...new Set(productosFiltrados.map((p) => p.nombre_categoria)),
  ];
  const marcas = [...new Set(productosFiltrados.map((p) => p.nombre_marca))];

  // Agregar categorías al filtro
  categorias.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filtroCategoria.appendChild(option);
  });

  // Agregar marcas al filtro
  marcas.forEach((marca) => {
    const option = document.createElement("option");
    option.value = marca;
    option.textContent = marca;
    filtroMarca.appendChild(option);
  });

  // Establecer el valor máximo para el filtro de precio
  const precioMaximo = Math.max(...productosFiltrados.map((p) => p.precio_unitario));
  filtroPrecio.max = precioMaximo;
  filtroPrecio.value = precioMaximo;
  rangoPrecio.textContent = `Hasta: S/.${precioMaximo}`;

  // Escuchar cambios en los filtros
  filtroCategoria.addEventListener("change", aplicarFiltros);
  filtroMarca.addEventListener("change", aplicarFiltros);
  filtroPrecio.addEventListener("input", () => {
    rangoPrecio.textContent = `Hasta: S/.${filtroPrecio.value}`;
    aplicarFiltros();
  });
}

// Aplicar filtros a los productos actuales
function aplicarFiltros() {
  const categoriaSeleccionada = filtroCategoria.value;
  const marcaSeleccionada = filtroMarca.value;
  const precioMaximo = parseInt(filtroPrecio.value);

  productosFiltrados = productos.filter((producto) => {
    const cumpleBusqueda = producto.nombre_producto
      .toLowerCase()
      .includes(terminoBusqueda);
    const cumpleCategoria =
      !categoriaSeleccionada ||
      producto.nombre_categoria === categoriaSeleccionada;
    const cumpleMarca =
      !marcaSeleccionada || producto.nombre_marca === marcaSeleccionada;
    const cumplePrecio = producto.precio_unitario <= precioMaximo;

    return cumpleBusqueda && cumpleCategoria && cumpleMarca && cumplePrecio;
  });

  mostrarProductos();
}

// Mostrar productos en la página
function mostrarProductos() {
  const footer = document.getElementById("foter");
  contenedorProductos.innerHTML = "";

  if (productosFiltrados.length === 0) {
    footer.classList.add("footer-fixed");
    contenedorProductos.innerHTML = `
      <div class="row mt-5">
        <div class="col-md-8">
          <h3>No se han encontrado productos relacionados con tu búsqueda.</h3>
          <p><strong>¿Qué hago?</strong></p>
          <p>
            Estamos constantemente cargando nuevo stock. Mientras tanto, ponte
            en contacto con nosotros al 923103692.
          </p>
        </div>
        <div class="col-md-4">
          <img
            src="https://audiomusica.vtexassets.com/assets/vtex/assets-builder/audiomusica.theme/8.4.13/not-found/search_not_found___4c32335f08ec48cbaec0d991c414c3b5.jpg"
            alt="Imagen de ayuda"
            class="img-fluid"
          />
        </div>
      </div>
    `;
    return;
  } else {
    // Si hay productos, eliminamos la clase 'footer-fixed'
    footer.classList.remove("footer-fixed");
  }

  productosFiltrados.forEach((producto) => {
    const productoHTML = `
      <div class="col-md-3 mb-4">
        <div class="card" onclick="redirigirADetalles(${producto.id_producto})" style="cursor: pointer;">
          <img src="${producto.url_producto}" class="card-img-top" alt="${producto.nombre_producto}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre_marca}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${producto.nombre_producto}</h6>
            <p class="price">S/.${producto.precio_unitario}</p>
          </div>
        </div>
      </div>
    `;
    contenedorProductos.innerHTML += productoHTML;
  });
}

// Redirigir a la página de detalles del producto
function redirigirADetalles(idProducto) {
  window.location.href = `detalles.html?id=${idProducto}`;
}

// Inicializar página
inicializarFiltros();
mostrarProductos();




