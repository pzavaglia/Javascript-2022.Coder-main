const menu = document.querySelector(".menu-grilla");

const solicitarInfo = async () => {
    const response = await fetch('./js/data.json');
    const data = await response.json();

    data.forEach((mazo) => {
        let div = document.createElement("div");
        div.className = "mazos"
        div.innerHTML = `
            <img class="img-mazo" src="${mazo.img}">
            <span class="name-mazo">${mazo.name}</span>
            <h5 class="precio-mazo">$${mazo.precio}</h5>
            <button class="btn btn-primary btn-add" id="${mazo.id}">Agregar</button>
            `;
        document.querySelector(".menu-grilla").appendChild(div);
    });

    let btnAdd = document.querySelectorAll(".btn-add");

    btnAdd.forEach(boton => {
        boton.addEventListener("click", (e) => {
            datosProductos(e.target.parentElement);
        });
    });

    let carrito = [];

    function datosProductos(mazo) {
        const informacion = {
            id: mazo.querySelector(".btn").getAttribute("id"),
            img: mazo.querySelector(".img-mazo").src,
            name: mazo.querySelector(".name-mazo").textContent,
            precio: mazo.querySelector(".precio-mazo").textContent
        };

        carrito = [...carrito, informacion]
        pintarCarrito();
        // Añadir SweetAlert después de agregar producto
        swal({
            text: "Producto agregado al carrito!",
            icon: "success",
            timer: 750,
        });
    }

    const carritoFinal = document.querySelector(".mazos-carrito");

    function pintarCarrito() {
        resetPintarCarrito();

        carrito.forEach((mazo) => {
            let divCarrito = document.createElement("div");
            divCarrito.className = "fila-carrito"
            divCarrito.innerHTML = `
                <div class="mazo-carrito columna-carrito">
                    <img class="img-mazo-carrito" src="${mazo.img}">
                    <p class="mazo-name">${mazo.name}</p>
                </div>
                <p class="precio-carrito columna-carrito">${mazo.precio}</p>
                <div class="cantidad-carrito columna-carrito">
                    <input class="cantidad-carrito-input" type="number" value="1">
                    <button class="btn btn-danger" id="${mazo.id}">Eliminar</button>
                </div>
            `;
            document.querySelector(".mazos-carrito").appendChild(divCarrito);

            carritoFinal.getElementsByClassName("cantidad-carrito-input")[0].addEventListener("change", cambioCantidad);
            carritoFinal.addEventListener("click", eliminarItem);
            document.getElementsByClassName("btn-comprar")[0].addEventListener("click", btnComprar);
            actTotalCarrito();

        });
        let inputCantidad = document.getElementsByClassName("cantidad-carrito-input")
        for (let i = 0; i < inputCantidad.length; i++) {
            let input = inputCantidad[i]
            input.addEventListener("change", cambioCantidad)
        }
        const vaciarCarrito = document.createElement("button");
        vaciarCarrito.className = "btn btn-danger btn-vaciar-carrito";
        vaciarCarrito.textContent = "Vaciar Carrito";
        carritoFinal.appendChild(vaciarCarrito);

        vaciarCarrito.addEventListener("click", () => {
        carrito = [];
        resetPintarCarrito();
        actTotalCarrito();
});

    }

    function btnComprar() {
        let nameSaludo = localStorage.getItem("name")
        let correoSaludo = localStorage.getItem("correo")
        if (userName.value === "" || userCorreo.value === "") {
            swal({
                icon: 'error',
                title: 'Oops... Algo salio mal!',
                text: 'Por favor, ingresa tus datos para continuar con la compra.'
            })
        } else {
            swal(`Gracias por tu compra ${nameSaludo}!`, `En breve nos comunicaremos a: ${correoSaludo}`, "success");
            let mazosCarrito = document.getElementsByClassName("mazos-carrito")[0]
            while (mazosCarrito.hasChildNodes()) {
                mazosCarrito.removeChild(mazosCarrito.firstChild)
            }
        }
        actTotalCarrito();
    }

    function actTotalCarrito() {
        let contenedorItemCarrito = document.getElementsByClassName("mazos-carrito")[0]
        let filasCarrito = contenedorItemCarrito.getElementsByClassName("fila-carrito")
        let total = 0
        for (let i = 0; i < filasCarrito.length; i++) {
            let filaCarrito = filasCarrito[i]
            let precioMazo = filaCarrito.getElementsByClassName("precio-carrito")[0]
            let cantidadMazo = filaCarrito.getElementsByClassName("cantidad-carrito-input")[0]
            let precio = parseFloat(precioMazo.innerText.replace("$", ''))
            let cantidad = cantidadMazo.value
            total = total + (precio * cantidad)
        }
        document.getElementsByClassName("carrito-total-precio")[0].innerText = "$" + total
    }

    function cambioCantidad(e) {
        let input = e.target
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1
        }
        actTotalCarrito();
    }

    function eliminarItem(e) {
        if (e.target.classList.contains("btn-danger")) {
            let mazoID = e.target.getAttribute("id");
            carrito = carrito.filter(
                (mazo) => mazo.id !== mazoID
            );
            pintarCarrito();
            actTotalCarrito();
        }
    }

    function resetPintarCarrito() {
        carritoFinal.innerHTML = "";
    }

    let userName = document.querySelector("#name");
    let userCorreo = document.querySelector("#correo");
    let userDireccion = document.querySelector("#direccion");

    userName.addEventListener("input", function () {
        localStorage.setItem("name", userName.value)
    });

    userCorreo.addEventListener("input", function () {
        localStorage.setItem("correo", userCorreo.value)
    });

    userDireccion.addEventListener("input", function () {
        localStorage.setItem("direccion", userDireccion.value)
    });
    function resetPintarCarrito() {
        while (carritoFinal.hasChildNodes()) {
          carritoFinal.removeChild(carritoFinal.firstChild);
        }
      };      

};
solicitarInfo();