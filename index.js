const container = document.getElementById("productos_container");
const formulario = document.getElementById("formulario");
const anioActual = new Date().getFullYear();
const pagar = document.getElementById("pagar");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const template = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragmento = document.createDocumentFragment();
let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
    data();
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
        mostrarCarrito();
        
    }

});

container.addEventListener("click", e =>{
    agregarAlCarrito(e)
});

items.addEventListener("click", e =>{
    accionDeLosBotones(e)
});

const data = async () => {
    try {
        const response = await fetch("productos.json");
        const productos = await response.json();
        crearTarjetas(productos);
    } catch (reject) {
        console.log(reject); 
    }

};

const crearTarjetas = productos => {
    productos.forEach(producto => {
        template.querySelector("h4").textContent = producto.nombre;
        template.querySelector("h6").textContent = producto.descripcion;
        template.querySelector("p").textContent =  producto.precio;
        template.querySelector("img").setAttribute("src", producto.img);
        template.querySelector("small").textContent = producto.talles;
        template.querySelector(".botonAgregar").dataset.id = producto.id;

        const clon = template.cloneNode(true);
        fragmento.appendChild(clon)
    });
    container.appendChild(fragmento);
    
};

const agregarAlCarrito = e => {

    if (e.target.classList.contains("botonAgregar")){
        definirCarrito( e.target.parentElement);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Añadido al carrito',
            showConfirmButton: false,
            timer: 900
          });

    };
    e.stopPropagation();
};

const definirCarrito = objeto => {
    const producto = {
        nombre: objeto.querySelector("h4").textContent,
        precio: objeto.querySelector("p").textContent,
        id: objeto.querySelector(".botonAgregar").dataset.id,
        cantidad: 1
    };

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
        
    };

    carrito[producto.id] = {...producto};
    mostrarCarrito();
};

const mostrarCarrito = () => {
    items.innerHTML = " ";
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelector(".title").textContent = producto.nombre;
        templateCarrito.querySelector(".cant").textContent = producto.cantidad;
        templateCarrito.querySelector(".mas").dataset.id = producto.id;
        templateCarrito.querySelector(".menos").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;

        const clon = templateCarrito.cloneNode(true);
        fragmento.appendChild(clon);
    });

    items.appendChild(fragmento);

    crearFooter();

    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const crearFooter = () => {
    footer.innerHTML = " ";

    if (Object.keys(carrito).length === 0) {
            
            footer.innerHTML = `<th scope="row" colspan="5">El carrito se encuentra vacío - vamos a comprar!</th>`;
            return
    };

    const cantidadTotal =  Object.values(carrito).reduce((acumulador, {cantidad})=> acumulador + cantidad,0);
    const precioFinal = Object.values(carrito).reduce((acumulador, {cantidad, precio}) => acumulador + cantidad * precio,0);
    
    
    templateFooter.querySelector(".cantidadTotal").textContent = cantidadTotal;
    templateFooter.querySelector(".precioFinal").textContent = precioFinal;
    
    const clon = templateFooter.cloneNode(true);
    fragmento.appendChild(clon);
    footer.appendChild(fragmento);
    
    const pintarTotal = document.getElementById("total");
    const comprar = document.getElementById("botonComprar");

    comprar.addEventListener ("click", () => {
        pintarTotal.innerHTML = `Total: $${precioFinal}`;

    });

    const vaciar = document.getElementById("vaciarCarrito");
    vaciar.addEventListener("click", () => {
        carrito = {};
        mostrarCarrito();
    });
};


const accionDeLosBotones = (e) => {
    
    if (e.target.classList.contains("mas")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = {...producto}
        mostrarCarrito();
    };

    if (e.target.classList.contains("menos")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        };
        mostrarCarrito();

    }

    e.stopPropagation();
};

// AUTOMATIZAMOS LA CREACION DE LOS MESES EN LOS OPTION DE MES
for (let i = 1; i <= 12; i++) {
    let opcion = document.createElement("option");
    opcion.value = i;
    opcion.innerText = i;
    formulario.seleccionMes.appendChild(opcion);
    
};

// AUTOMATIZAMOS LA CREACION DE LOS AÑOS EN LOS OPTION DE AÑO

for (let i = anioActual; i < anioActual + 12; i++) {
    let opcion = document.createElement("option");
    opcion.value = i;
    opcion.innerText = i;
    formulario.seleccionAnio.appendChild(opcion);
    
};

formulario.addEventListener("submit", (e) => {
    let form = e.target;
    let nombre = form.children[0].value;
    let numeroTarjeta = form.children[1].value;
    let mes = form.children[2].value
    let año = form.children[3].value;
    let clave = form.children[4].value;

    carrito = {};
    mostrarCarrito();

});



 