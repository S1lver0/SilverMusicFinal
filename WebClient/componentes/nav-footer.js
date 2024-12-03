// Función para cargar HTML de un archivo
async function loadComponent(containerId, filePath) {
  const container = document.getElementById(containerId);
  const response = await fetch(filePath);
  const html = await response.text();
  container.innerHTML = html;
}

// Cargar los componentes
loadComponent("nav-container", "componentes/nav.html");
loadComponent("footer-container", "componentes/footer.html");


