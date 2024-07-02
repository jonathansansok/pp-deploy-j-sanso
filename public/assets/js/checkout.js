// Función para generar el texto que se copiará al portapapeles, incluyendo nombre, apellido y dirección
const generarTextoACopiar = (productos, nombre, apellido, direccion) => {
  let texto = `😊 Hola, soy ${nombre} ${apellido}, y esta es mi dirección: ${direccion}. Este es mi pedido:\n\n`;
  texto += "🛒 Descripción:\n";
  for (const prod of productos) {
    texto += `${prod.titulo} - Cant.: ${prod.cantidad} - Precio Total: $${
      prod.precio * prod.cantidad
    }\n`;
  }
  return texto;
};

document.addEventListener("DOMContentLoaded", () => {
  const productos = JSON.parse(localStorage.getItem("carrito")) || [];
  const containerCheckout = document.querySelector(".containerCheckout");

  const renderProductos = () => {
    containerCheckout.innerHTML = "";

    if (productos.length === 0) {
      mostrarCarritoVacio();
    } else {
      productos.forEach((prod, index) => {
        const productoHTML = `
          <div class="producto">
            <h3>${prod.titulo}</h3>
            <p>Precio: $${prod.precio * prod.cantidad}</p>
            <p>Cantidad: 
              <button class="btnCantidad btnMenos">-</button>
              <span class="cantidad">${prod.cantidad}</span>
              <button class="btnCantidad btnMas">+</button>
              <button class="btnEliminar">🗑️</button>
            </p>
            <p>Descripción: ${prod.descrip}</p>
          </div>
        `;
        containerCheckout.innerHTML += productoHTML;
      });

      mostrarTotal();
      agregarListenersCantidad();
      agregarListenerEliminar();
    }
  };

  const mostrarCarritoVacio = () => {
    Swal.fire({
      title: "Carrito de compras vacío",
      text: "Tu carrito de compras está vacío. Serás redirigido a la página de ventas.",
      icon: "warning",
      confirmButtonText: "Aceptar",
    }).then(() => {
      window.location.href = "/src/views/ventas.html";
    });
  };

  const mostrarTotal = () => {
    let totalPagar = productos.reduce((total, prod) => {
      return total + prod.precio * prod.cantidad;
    }, 0);

    const totalHTML = `
      <div class="total">
        <h4>Total a pagar: $${totalPagar}</h4>
      </div>
    `;
    containerCheckout.insertAdjacentHTML("beforeend", totalHTML);
  };

  const actualizarLocalStorage = () => {
    localStorage.setItem("carrito", JSON.stringify(productos));
  };

  const agregarListenersCantidad = () => {
    const btnMenosArray = document.querySelectorAll(".btnMenos");
    const btnMasArray = document.querySelectorAll(".btnMas");

    btnMenosArray.forEach((btnMenos, index) => {
      btnMenos.addEventListener("click", () => {
        if (productos[index].cantidad > 1) {
          productos[index].cantidad--;
          actualizarLocalStorage();
          renderProductos();
        }
      });
    });

    btnMasArray.forEach((btnMas, index) => {
      btnMas.addEventListener("click", () => {
        productos[index].cantidad++;
        actualizarLocalStorage();
        renderProductos();
      });
    });
  };

  const agregarListenerEliminar = () => {
    const btnEliminarArray = document.querySelectorAll(".btnEliminar");

    btnEliminarArray.forEach((btnEliminar, index) => {
      btnEliminar.addEventListener("click", () => {
        eliminarProducto(index);
      });
    });
  };

  const eliminarProducto = (index) => {
    productos.splice(index, 1); // Eliminar el producto del array
    actualizarLocalStorage(); // Actualizar localStorage
    renderProductos(); // Volver a renderizar los productos actualizados
  };

  const btnEnviarWhatsApp = document.getElementById("btnEnviarWhatsApp");
  btnEnviarWhatsApp.addEventListener("click", (event) => {
    event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
    enviarPorWhatsApp();
  });

  const enviarPorWhatsApp = () => {
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    if (nombre === "" || apellido === "" || direccion === "") {
      alert("Por favor completa todos los campos: Nombre, Apellido y Dirección.");
      return;
    }

    let mensaje = generarTextoACopiar(productos, nombre, apellido, direccion);

    Swal.fire({
      title: "Quiero saber mas sobre estos servicios",
      html: mensaje,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Volver a Home",
      cancelButtonText: "Copiar y enviar por What's App",
      customClass: {
        cancelButton: "copy-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        vaciarCarrito();
        volverATienda();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        copiarAlPortapapeles(mensaje);
      }
    });
  };

  const copiarAlPortapapeles = (texto) => {
    const telefono = "+5491169123268";
    const mensaje = encodeURIComponent(texto);
    const whatsappURL = `https://wa.me/${telefono}?text=${mensaje}`;

    window.open(whatsappURL, "_blank");

    const textarea = document.createElement("textarea");
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    Swal.fire("Copiado al portapapeles", "", "success");
  };

  const vaciarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify([]));
  };

  const volverATienda = () => {
    window.location.href = "/../../src/index.html";
  };

  renderProductos();
});