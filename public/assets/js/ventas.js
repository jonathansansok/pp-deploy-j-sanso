document.addEventListener("DOMContentLoaded", () => {
  let tratandoJson = [];

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const agregarItem = (idProducto) => {
    let producto = tratandoJson.find((producto) => producto.id == idProducto);
    if (carrito.findIndex((producto) => producto.id == idProducto) == -1) {
      producto.cantidad = 1;
      carrito.push(producto);
    } else {
      carrito.map((producto) => {
        if (producto.id == idProducto) {
          producto.cantidad++;
        }
      });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCantidadCarrito();
    console.log("Carrito actualizado:", carrito);
  };

  const quitarItem = (idProducto) => {
    let index = carrito.findIndex((producto) => producto.id == idProducto);
    if (index !== -1) {
      if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
      } else {
        carrito.splice(index, 1);
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCantidadCarrito();
      console.log("Carrito actualizado:", carrito);
    }
  };

  function cargarJson() {
    fetch("../public/assets/json/productos.json")
      .then((resp) => resp.json())
      .then((data) => {
        tratandoJson = data.map(({ id, precio, origen, descrip, titulo }) => ({
          id,
          precio,
          origen,
          descrip,
          titulo,
        }));
        renderizarProductos(tratandoJson);
        darAccionABotones(tratandoJson);
      });
  }
  cargarJson();

  const renderizarProductos = (array) => {
    let seccion = document.getElementById("renderProds");
    seccion.innerHTML = "";
    for (const prod of array) {
      seccion.innerHTML += `
                <section class="buyApi">
                    <h3 class="titleBuy">${prod.titulo}</h3>
                    <p class="textoDeBuy">${prod.descrip}</p>
                    <p class="price">Price: USD ${prod.precio}.-</p>
                    <div class="botonesCarrito">
                    <input type="button" value="Quitar Unidad" class="botonRemove" id="botonRemove${prod.id}"/>
                        <input type="button" value="Agregar Unidad" class="botonAdd" id="botonAdd${prod.id}"/>
                    </div>
                </section>
            `;
    }
  };

  function darAccionABotones(productos = []) {
    for (const prod of productos) {
      document
        .getElementById("botonAdd" + prod.id)
        .addEventListener("click", function () {
          agregarItem(prod.id);
        });
      document
        .getElementById("botonRemove" + prod.id)
        .addEventListener("click", function () {
          quitarItem(prod.id);
        });
    }
  }

  const actualizarCantidadCarrito = () => {
    let cantidad = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    document.getElementById("contadorId").innerHTML = cantidad;
  };
  actualizarCantidadCarrito();

  let buscando = document.getElementById("selectContainer");

  buscando.addEventListener("change", (e) => {
    let origen = e.target.value;
    filtrarOrigen(origen);
  });

  function filtrarOrigen(parametroOrigen) {
    if (parametroOrigen == "") {
      renderizarProductos(tratandoJson);
      darAccionABotones(tratandoJson);
    } else {
      let productosFiltrados = tratandoJson.filter(
        (prod) => prod.origen == parametroOrigen
      );
      renderizarProductos(productosFiltrados);
      darAccionABotones(productosFiltrados);
    }
  }
});
