document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/new-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Solo mostrar el menú si el inicio de sesión fue exitoso
        localStorage.setItem("username", username);
        showAccountSection(username);
      } else {
        // Usar SweetAlert2 para mostrar el mensaje de error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Error al iniciar sesión",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al iniciar sesión. Inténtalo de nuevo.',
      });
    }
  });

function togglePassword(passwordId, iconId) {
  const passwordField = document.getElementById(passwordId);
  const icon = document.getElementById(iconId);

  if (passwordField.type === "password") {
    passwordField.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("registerForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Previene el envío del formulario

    const username = document.getElementById("username2").value;
    const password = document.getElementById("registerPassword").value;

    // Validaciones
    if (!validateInputs(username, password)) {
      // Usar SweetAlert2 para mostrar el mensaje de error
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El usuario y la contraseña no pueden contener espacios ni ser menores a 8 caracteres. La contraseña debe incluir al menos un número.',
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_cliente: username,
          password_cliente: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Solo mostrar el menú si el registro fue exitoso
        localStorage.setItem("username", username);
        showAccountSection(username);
      } else {
        // Usar SweetAlert2 para mostrar el mensaje de error
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'Error al registrarse',
          });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al registrarse. Inténtalo de nuevo.',
      });
    }
  });
});

// Función de validación
function validateInputs(username, password) {
  const usernamePattern = /^\S+$/; // Sin espacios
  const passwordPattern = /^(?=.*\d).{8,}$/; // Mínimo 8 caracteres y al menos un número

  return usernamePattern.test(username) && passwordPattern.test(password);
}

// Función para mostrar la sección de cuenta
function showAccountSection(username) {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("account-container").style.display = "block";
  document.getElementById("welcome-username").innerText = username;
  document.getElementById("welcome-username2").innerText = username;
}

// Verificar si hay un usuario guardado en localStorage al cargar la página
window.onload = function () {
  const storedUsername = localStorage.getItem("username");
  if (storedUsername) {
    showAccountSection(storedUsername);
  }
};

// Manejo del cierre de sesión
function logout() {
  localStorage.removeItem("username"); // Eliminar el usuario de localStorage
  document.getElementById("login-container").style.display = "block";
  document.getElementById("account-container").style.display = "none";
}
