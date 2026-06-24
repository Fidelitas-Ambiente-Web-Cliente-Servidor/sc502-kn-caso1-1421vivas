// Array con los platillos del restaurante (no se modifica, viene dado por la profesora)
const menu = [
  { nombre: 'Bruschetta Clásica',     descripcion: 'Pan tostado con tomate y albahaca fresca',    precio: 4500,  categoria: 'Entrada'      },
  { nombre: 'Tabla de Quesos',         descripcion: 'Selección de quesos importados con mermelada', precio: 7800,  categoria: 'Entrada'      },
  { nombre: 'Lomo al Vino Tinto',      descripcion: 'Lomo de res en reducción de vino tinto',       precio: 15500, categoria: 'Plato Fuerte' },
  { nombre: 'Pasta Carbonara',         descripcion: 'Pasta con tocino, huevo y queso parmesano',    precio: 10200, categoria: 'Plato Fuerte' },
  { nombre: 'Salmón a la Plancha',     descripcion: 'Filete de salmón con vegetales al vapor',      precio: 13800, categoria: 'Plato Fuerte' },
  { nombre: 'Tiramisú',               descripcion: 'Postre italiano con café y mascarpone',          precio: 5200,  categoria: 'Postre'       },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá',    precio: 4800,  categoria: 'Postre'       },
];

// Aquí se van guardando las reservas que el usuario va agregando
const reservas = [];


// Dibuja en pantalla las cards de los platillos que se le pasen en "lista"
function renderMenu(lista) {
  // si no me pasan una lista, muestro el menu completo
  if (lista === undefined) {
    lista = menu;
  }

  const contenedor = document.getElementById("menu-container");
  contenedor.innerHTML = ""; // limpio lo que estaba antes para no duplicar

  for (let i = 0; i < lista.length; i++) {
    const platillo = lista[i];

    // creo la card con createElement, no puedo escribirla directo en el HTML
    const card = document.createElement("div");
    card.className = "card-plato col-md-4";

    const titulo = document.createElement("h3");
    titulo.innerText = platillo.nombre;

    const descripcion = document.createElement("p");
    descripcion.innerText = platillo.descripcion;

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.innerText = "₡" + platillo.precio.toLocaleString("es-CR");

    const categoria = document.createElement("p");
    categoria.className = "categoria";
    categoria.innerText = platillo.categoria;

    card.appendChild(titulo);
    card.appendChild(descripcion);
    card.appendChild(precio);
    card.appendChild(categoria);

    contenedor.appendChild(card);
  }
}


// Filtra el menu por categoria y vuelve a pintar las cards
function filtrarCategoria(categoria) {
  if (categoria === "Todos") {
    renderMenu(menu);
  } else {
    const menuFiltrado = menu.filter(function (platillo) {
      return platillo.categoria === categoria;
    });
    renderMenu(menuFiltrado);
  }

  // marco visualmente cual boton de filtro quedo activo
  const botones = document.querySelectorAll(".btn-filtro");
  botones.forEach(function (boton) {
    if (boton.dataset.categoria === categoria) {
      boton.classList.add("activo");
    } else {
      boton.classList.remove("activo");
    }
  });
}


// Revisa cada campo del formulario y muestra el error debajo del input si algo esta mal
function validarFormulario() {
  let formularioValido = true;

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const fecha = document.getElementById("fecha").value;
  const personas = document.getElementById("personas").value;

  const errorNombre = document.getElementById("error-nombre");
  const errorCorreo = document.getElementById("error-correo");
  const errorFecha = document.getElementById("error-fecha");
  const errorPersonas = document.getElementById("error-personas");

  // limpio los mensajes de error antes de validar de nuevo
  errorNombre.innerText = "";
  errorCorreo.innerText = "";
  errorFecha.innerText = "";
  errorPersonas.innerText = "";

  // nombre: minimo 5 caracteres y solo letras y espacios (incluye tildes y ñ)
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
  if (nombre === "") {
    errorNombre.innerText = "El nombre es obligatorio";
    formularioValido = false;
  } else if (nombre.length < 5) {
    errorNombre.innerText = "El nombre debe tener al menos 5 caracteres";
    formularioValido = false;
  } else if (!regexNombre.test(nombre)) {
    errorNombre.innerText = "El nombre solo puede tener letras y espacios";
    formularioValido = false;
  }

  // correo: formato valido con regex sencilla
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo === "") {
    errorCorreo.innerText = "El correo es obligatorio";
    formularioValido = false;
  } else if (!regexCorreo.test(correo)) {
    errorCorreo.innerText = "El formato del correo no es valido";
    formularioValido = false;
  }

  // fecha: obligatoria y no puede ser anterior a hoy
  if (fecha === "") {
    errorFecha.innerText = "La fecha es obligatoria";
    formularioValido = false;
  } else {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // para comparar solo el dia, sin la hora
    const fechaReserva = new Date(fecha + "T00:00:00");
    if (fechaReserva < hoy) {
      errorFecha.innerText = "La fecha no puede ser pasada";
      formularioValido = false;
    }
  }

  // personas: obligatorio, entre 1 y 20
  if (personas === "") {
    errorPersonas.innerText = "El numero de personas es obligatorio";
    formularioValido = false;
  } else if (personas < 1 || personas > 20) {
    errorPersonas.innerText = "Debe ser entre 1 y 20 personas";
    formularioValido = false;
  }

  // habilito o deshabilito el boton de enviar segun el resultado
  document.getElementById("btn-reservar").disabled = !formularioValido;

  return formularioValido;
}


// Agrega una fila nueva a la tabla de reservas con los datos del formulario
function agregarReserva() {
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const personas = parseInt(document.getElementById("personas").value);

  // guardo la reserva en el arreglo para poder calcular el resumen despues
  reservas.push({
    nombre: nombre,
    correo: correo,
    fecha: fecha,
    hora: hora,
    personas: personas,
  });

  const fila = document.createElement("tr");
  fila.className = "fila-reserva";

  // si el grupo es de 6 o mas personas se resalta la fila
  if (personas >= 6) {
    fila.classList.add("grupo-grande");
  }

  const celdaNombre = document.createElement("td");
  celdaNombre.innerText = nombre;

  const celdaCorreo = document.createElement("td");
  celdaCorreo.innerText = correo;

  const celdaFecha = document.createElement("td");
  celdaFecha.innerText = fecha;

  const celdaHora = document.createElement("td");
  celdaHora.innerText = hora;

  const celdaPersonas = document.createElement("td");
  celdaPersonas.innerText = personas;

  fila.appendChild(celdaNombre);
  fila.appendChild(celdaCorreo);
  fila.appendChild(celdaFecha);
  fila.appendChild(celdaHora);
  fila.appendChild(celdaPersonas);

  document.getElementById("tabla-reservas").appendChild(fila);

  actualizarResumen();

  // limpio el formulario para la siguiente reserva
  document.getElementById("form-reserva").reset();
  document.getElementById("btn-reservar").disabled = true;
}


// Calcula y muestra los totales de las reservas registradas hasta el momento
function actualizarResumen() {
  let totalPersonas = 0;
  let reservaMasGrande = reservas[0];

  for (let i = 0; i < reservas.length; i++) {
    totalPersonas += reservas[i].personas;

    if (reservas[i].personas > reservaMasGrande.personas) {
      reservaMasGrande = reservas[i];
    }
  }

  const resumen = document.getElementById("resumen-reservas");
  resumen.innerHTML =
    "<p>Total de reservas: " + reservas.length + "</p>" +
    "<p>Total de personas esperadas: " + totalPersonas + "</p>" +
    "<p>Reserva con mas personas: " + reservaMasGrande.nombre + " (" + reservaMasGrande.personas + " personas)</p>";
}


document.addEventListener('DOMContentLoaded', function () {
  renderMenu(menu);

  // dejo "Todos" marcado como filtro activo al inicio
  document.querySelector('[data-categoria="Todos"]').classList.add("activo");

  // cada boton de filtro llama a filtrarCategoria con su propia categoria
  const botonesFiltro = document.querySelectorAll(".btn-filtro");
  botonesFiltro.forEach(function (boton) {
    boton.addEventListener("click", function () {
      filtrarCategoria(boton.dataset.categoria);
    });
  });

  // valido en vivo cada vez que el usuario escribe o cambia un campo
  const campos = ["nombre", "correo", "fecha", "personas"];
  campos.forEach(function (idCampo) {
    document.getElementById(idCampo).addEventListener("input", validarFormulario);
  });

});


document.getElementById('form-reserva').addEventListener('submit', function (e) {
  e.preventDefault(); // Evitar recarga de página

  if (validarFormulario()) {
    agregarReserva();
  }
});
