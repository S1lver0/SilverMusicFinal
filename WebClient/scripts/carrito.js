function cargarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedorCarrito = document.getElementById("carrito");
  const subtotalElement = document.getElementById("subtotal");

  let subtotal = 0;
  const jsonCompra = "";

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `<p class="text-center">No hay productos en el carrito.</p>`;
    subtotalElement.textContent = `S/. 0.00`;
    return;
  }

  // Construir el HTML del carrito
  const productosHTML = carrito
    .map((producto) => {
      const precioUnitario = parseFloat(producto.precio_unitario); // Asegurarse de que sea un número
      const totalProducto = producto.cantidad * precioUnitario;

      subtotal += totalProducto;

      return `
            <div class="d-flex align-items-center mb-3 border-bottom pb-3">
                <img src="${producto.url_producto}" alt="${
        producto.nombre_producto
      }" class="me-3" style="width: 80px; height: 80px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h5>${producto.nombre_producto}</h5>
                    <p>Precio: S/. ${precioUnitario.toFixed(2)}</p>
                    <p>Disponible: ${producto.stock_disponible}</p>
                </div>
                <div>
                    <input type="number" class="form-control cantidad" value="${
                      producto.cantidad
                    }" 
                           data-id="${producto.id_producto}" min="1" max="${
        producto.stock_disponible
      }" style="width: 100px;">
                    <p class="mt-2">Total: <span class="total-por-producto">S/. ${totalProducto.toFixed(
                      2
                    )}</span></p>
                    <button class="btn btn-danger btn-sm mt-2 eliminar-producto" data-id="${
                      producto.id_producto
                    }">Eliminar</button>
                </div>
            </div>
        `;
    })
    .join("");

  contenedorCarrito.innerHTML = productosHTML;
  subtotalElement.textContent = `S/. ${subtotal.toFixed(2)}`;

  // Añadir eventos a los inputs de cantidad
  document.querySelectorAll(".cantidad").forEach((input) => {
    input.addEventListener("change", (event) =>
      actualizarCantidad(event, carrito)
    );
  });

  // Añadir eventos a los botones de eliminar
  document.querySelectorAll(".eliminar-producto").forEach((boton) => {
    boton.addEventListener("click", (event) =>
      eliminarProducto(event, carrito)
    );
  });
}

function actualizarCantidad(event, carrito) {
  const input = event.target;
  const idProducto = parseInt(input.getAttribute("data-id"));
  const nuevaCantidad = parseInt(input.value);

  const producto = carrito.find((p) => p.id_producto === idProducto);

  if (nuevaCantidad > producto.stock_disponible) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No puedes añadir más cantidad que la disponible.",
    });
    input.value = producto.cantidad;
    return;
  }

  producto.cantidad = nuevaCantidad;

  const precioUnitario = parseFloat(producto.precio_unitario); // Asegurarse de que sea un número
  const totalPorProducto = input.parentElement.querySelector(
    ".total-por-producto"
  );
  totalPorProducto.textContent = `S/. ${(
    producto.cantidad * precioUnitario
  ).toFixed(2)}`;

  localStorage.setItem("carrito", JSON.stringify(carrito));

  recalcularSubtotal(carrito);
}

function eliminarProducto(event, carrito) {
  const idProducto = parseInt(event.target.getAttribute("data-id"));

  // Filtrar el carrito para eliminar el producto seleccionado
  const carritoActualizado = carrito.filter(
    (producto) => producto.id_producto !== idProducto
  );

  // Guardar el carrito actualizado en el localStorage
  localStorage.setItem("carrito", JSON.stringify(carritoActualizado));

  // Mostrar un mensaje de confirmación
  Swal.fire({
    icon: "success",
    title: "Producto eliminado",
    text: "El producto ha sido eliminado del carrito.",
    timer: 1500,
    showConfirmButton: false,
  });

  // Recargar el carrito
  cargarCarrito();
}

function recalcularSubtotal(carrito) {
  const subtotal = carrito.reduce(
    (sum, producto) =>
      sum + producto.cantidad * parseFloat(producto.precio_unitario),
    0
  );
  document.getElementById("subtotal").textContent = `S/. ${subtotal.toFixed(
    2
  )}`;
}

// Cargar Departamentos, Provincias y Distritos
const ubicaciones = {
  Amazonas: {},
  Áncash: {},
  Apurímac: {},
  Arequipa: {
    Arequipa: ["Cercado", "Paucarpata", "Cayma", "Socabaya", "Cerro Colorado"],
    Camaná: ["Camaná", "Quilca", "Ocoña"],
    Mollendo: ["Mollendo", "Islay", "Punta de Bombón"],
  },
  Ayacucho: {},
  Cajamarca: {},
  Callao: {},
  Cusco: {
    Cusco: ["Cusco", "Wanchaq", "San Sebastián", "San Jerónimo", "Santiago"],
    Urubamba: ["Urubamba", "Ollantaytambo", "Pisac"],
    Quillabamba: ["Santa Ana", "Echarati"],
  },
  Huancavelica: {},
  Huánuco: {},
  Ica: {
    Ica: ["Ica", "Subtanjalla", "Pueblo Nuevo"],
    Nazca: ["Nazca", "Vista Alegre"],
    Pisco: ["Pisco", "San Andrés", "Tupac Amaru"],
  },
  Junín: {},
  "La Libertad": {
    Trujillo: ["Trujillo", "Víctor Larco Herrera", "Florencia de Mora"],
    Ascope: ["Chocope", "Casa Grande"],
    Otuzco: ["Otuzco", "Agallpampa"],
  },
  Lambayeque: {},
  Lima: {
    Lima: ["Miraflores", "San Isidro", "Barranco", "San Borja"],
    Huarochirí: ["Matucana", "San Mateo", "Surco"],
    Cañete: ["San Vicente", "Imperial", "Asia"],
  },
  Loreto: {},
  "Madre de Dios": {},
  Moquegua: {
    Moquegua: ["Moquegua", "Samegua", "Torata"],
    Ilo: ["Ilo", "Pacocha", "El Algarrobal"],
    Omate: ["Omate", "Chojata", "Ubinas"],
  },
  Pasco: {},
  Piura: {},
  Puno: {},
  "San Martín": {},
  Tacna: {
    Tacna: [
      "Tacna",
      "Alto de la Alianza",
      "Ciudad Nueva",
      "Pocollay",
      "Gregorio Albarracin",
    ],
    Tarata: ["Tarata", "Estique", "Estique Pampa"],
    "Jorge Basadre": ["Locumba", "Ilabaya"],
    Candarave: ["Candarave", "Cairani", "Curibaya"],
  },
  Tumbes: {},
  Ucayali: {},
};

function cargarDepartamentos() {
  const departamentoSelect = document.getElementById("departamento");
  Object.keys(ubicaciones).forEach((departamento) => {
    const option = document.createElement("option");
    option.value = departamento;
    option.textContent = departamento;
    departamentoSelect.appendChild(option);
  });

  departamentoSelect.addEventListener("change", cargarProvincias);
}

function cargarProvincias() {
  const departamento = document.getElementById("departamento").value;
  const provinciaSelect = document.getElementById("provincia");
  const distritoSelect = document.getElementById("distrito");

  // Resetear selectores
  provinciaSelect.innerHTML =
    '<option value="" disabled selected>Selecciona una provincia</option>';
  distritoSelect.innerHTML =
    '<option value="" disabled selected>Selecciona un distrito</option>';
  distritoSelect.disabled = true;

  if (departamento) {
    provinciaSelect.disabled = false;
    Object.keys(ubicaciones[departamento]).forEach((provincia) => {
      const option = document.createElement("option");
      option.value = provincia;
      option.textContent = provincia;
      provinciaSelect.appendChild(option);
    });

    provinciaSelect.addEventListener("change", cargarDistritos);
  }
}

function cargarDistritos() {
  const departamento = document.getElementById("departamento").value;
  const provincia = document.getElementById("provincia").value;
  const distritoSelect = document.getElementById("distrito");

  distritoSelect.innerHTML =
    '<option value="" disabled selected>Selecciona un distrito</option>';

  if (provincia) {
    distritoSelect.disabled = false;
    ubicaciones[departamento][provincia].forEach((distrito) => {
      const option = document.createElement("option");
      option.value = distrito;
      option.textContent = distrito;
      distritoSelect.appendChild(option);
    });
  }
}

/////////////MERCADO PAGO
const mp = new MercadoPago("APP_USR-712cf161-54ec-44b4-9610-62e254a108cc", {
  locale: "es-PE",
});
/////////////

document
  .getElementById("confirmar-compra")
  .addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value;
    const celular = document.getElementById("celular").value;
    const direccion = document.getElementById("direccion").value;
    const departamento = document.getElementById("departamento").value;
    const provincia = document.getElementById("provincia").value;
    const distrito = document.getElementById("distrito").value;

    if (
      !nombre ||
      !celular ||
      !direccion ||
      !departamento ||
      !provincia ||
      !distrito
    ) {
      Swal.fire({
        icon: "error",
        title: "Faltan datos",
        text: "Por favor, completa todos los campos antes de confirmar la compra.",
      });
      return;
    }

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalVenta = carrito.reduce(
      (total, producto) =>
        total + producto.cantidad * parseFloat(producto.precio_unitario),
      0
    );

    const productos = carrito.map((producto) => ({
      key: producto.id_producto,
      nombre: producto.nombre_producto,
      cantidad: producto.cantidad,
      precio_unitario: parseFloat(producto.precio_unitario),
      importe: producto.cantidad * parseFloat(producto.precio_unitario),
    }));

    const fechaActual = new Date();
    const fechaBoleta = fechaActual.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Obtener el username del localStorage
    const usuarioCliente =
      localStorage.getItem("username") || "Usuario desconocido";

    const jsonCompra = {
      cliente_nombre: nombre,
      celular_cliente: celular,
      direccion_cliente: `${departamento}, ${provincia}, ${distrito} - ${direccion}`,
      usuario_cliente: usuarioCliente,
      fecha_registro: fechaBoleta,
      metodo_pago: 1,
      fecha_boleta: fechaBoleta,
      metodo_entrega: 1,
      total_venta: totalVenta,
      productos,
    };
    // Guardar en localStorage
    localStorage.setItem("datosCompra", JSON.stringify(jsonCompra));
    console.log(jsonCompra);

    //MERCADO PAGO
    const response = await fetch("http://localhost:3000/mercado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonCompra),
    });

    const preference = await response.json();
    createCheckoutButton(preference.id);

    // Aquí puedes enviar el JSON a Mercado Pago o hacer lo que necesites.
    Swal.fire({
      icon: "success",
      title: "Datos Confirmados",
      text: "Proceda con el pago usando MercadoPago",
    });
  });

const createCheckoutButton = (preferenceId) => {
  const bricksBuilder = mp.bricks();

  const renderComponent = async () => {
    if (window.checkoutButton) window.checkoutButton.unmount();
    await bricksBuilder.create("wallet", "wallet_container", {
      initialization: {
        preferenceId: preferenceId,
      },
    });
  };

  renderComponent();
};

///////PARTE URL

async function handlePaymentResponse() {
  const params = getQueryParams();

  // Validar si el pago fue aprobado
  if (params.collectionStatus === "approved") {
    // Obtener datos desde localStorage
    const jsonCompra = JSON.parse(localStorage.getItem("datosCompra"));

    try {
      // Espacio para la petición al backend
      const response = await fetch("http://localhost:3000/ventas/WebsubirVenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonCompra),
      });

      // Validar respuesta del backend
      if (response.ok) {
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: "success",
          title: "Pago realizado exitosamente",
          text: "Gracias por tu compra.",
          confirmButtonText: "Regresar al menú principal",
        }).then(() => {
          // Redireccionar al menú principal
          window.location.href = "https://silvermusic.netlify.app/index.html";
        });
      } else {
        const errorMsg = await response.text();
        Swal.fire({
          icon: "error",
          title: "Error en el servidor",
          text: `No pudimos procesar la información: ${errorMsg}`,
        });
      }
    } catch (error) {
      // Manejo de errores en la conexión al backend
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Hubo un problema al contactar al servidor: ${error.message}`,
      });
    }
  }
}


function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    collectionId: params.get("collection_id"),
    collectionStatus: params.get("collection_status"),
    paymentId: params.get("payment_id"),
    status: params.get("status"),
    externalReference: params.get("external_reference"),
    preferenceId: params.get("preference_id"),
    siteId: params.get("site_id"),
  };
}


// Ejecutar la función al cargar la página
document.addEventListener("DOMContentLoaded", handlePaymentResponse);

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  cargarDepartamentos();
});
