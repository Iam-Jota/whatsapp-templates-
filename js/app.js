const state = { 
    plantillas: [] ,
};          // ← la única fuente de verdad

state.plantillas = cargar();
render();

function agregarPlantilla(titulo, mensaje, hashtag) {
  const nueva = new Template(titulo, mensaje, hashtag);
  state.plantillas.push(nueva);   // agrega la nueva plantilla al estado
}


const selector = document.getElementById("selector");

function renderSelector() {
  selector.innerHTML = state.plantillas
    .map((plantilla, indice) => `<option value="${indice}">${plantilla.titulo}</option>`)   // value = posición en el y
    .join("");
}

function contarPorHashtag(plantillas) {
  const conteo = {};                              // "caja" vacía
  plantillas.forEach(function (plantilla) {
    const elHashtag = plantilla.hashtag;
    if (conteo[elHashtag]) {
      conteo[elHashtag] = conteo[elHashtag] + 1;  // si ya existe, suma 1
    } else {
      conteo[elHashtag] = 1;                      // si es nuevo, empieza en 1
    }
  });
  return conteo;
}
function renderStats() {
  const total = state.plantillas.length;
  const porTag = contarPorHashtag(state.plantillas);
  const detalle = Object.entries(porTag) .map(([hashtag, cantidad]) =>`${hashtag} : ${cantidad}`).join(" . ");
  document.getElementById("panel-stats").textContent =`Total : ${total} | ${detalle}`;
    
}
const lista = document.getElementById("listaPlantillas");

function render() {
  lista.innerHTML = "";                       // 1. limpia lo anterior
  plantillasVisibles().forEach(function (plantilla) {
    const fechaTexto = new Date(plantilla.fecha).toLocaleDateString("es-PE");   // Date → te
    const li = document.createElement("li");
    li.className = "bg-white p-4 rounded-lg shadow";
    li.innerHTML = `
  <div class="flex items-start justify-between gap-2">
    <strong class="text-slate-800">${plantilla.titulo}</strong>
    <span class="text-xs text-slate-400 shrink-0">${plantilla.fecha.toLocaleDateString("es-PE")}</span>
  </div>
  <p class="text-sm text-slate-600 mt-1">${plantilla.mensaje}</p>
  <span class="inline-block text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full mt-2">${plantilla.hashtag}</span>
  <div class="flex gap-2 mt-3 pt-2 border-t border-slate-100">
    <button class="btn-eliminar text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition" data-id="${plantilla.id}">Eliminar</button>
  </div>
  <button class="btn-editar text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition" data-id="${plantilla.id}">Editar</button>
`;
    lista.appendChild(li);                     // 2. agrega un n

  });
  renderSelector();
  renderStats();
  guardar();
}
render();


const form = document.getElementById("form-plantilla");

function normalizarHashtag(texto) {
  const limpio = texto.trim().toLowerCase();           // sin espacios, en minúscula
  return limpio.startsWith("#") ? limpio : "#" + limpio; // asegura el #
}



form.addEventListener("submit", function (evento) {
  evento.preventDefault();
 
  const tituloTexto= titulo.value.trim();
const mensajeTexto= mensaje.value.trim();

  if (tituloTexto.length === 0 || mensajeTexto.length === 0) {              // validación
    alert("Título y mensaje son obligatorios");
    return;
  }
  if (state.editandoId) {
  state.plantillas = state.plantillas.map(plantilla =>     // actualiza solo esa, sin mutar
    plantilla.id === state.editandoId ? { ...plantilla, titulo: tituloTexto, mensaje: mensajeTexto, hashtag: normalizarHashtag(hashtag.value) } : plantilla
  );
  state.editandoId = null;
} else {
  agregarPlantilla(tituloTexto, mensajeTexto, normalizarHashtag(hashtag.value));
}
render();
form.reset();
});
function generarMensajeFinal(plantilla, valorNombre) {
  return plantilla.mensaje.replaceAll("{nombre}", valorNombre);
}

const salida = document.getElementById("mensaje-final");

document.getElementById("btn-generar").addEventListener("click", function () {
  const plantilla = state.plantillas[Number(selector.value)];   // la elegida en el select
  const nombre = document.getElementById("valorNombre").value.trim();
  salida.textContent = generarMensajeFinal(plantilla, nombre);
});

document.getElementById("btn-copiar").addEventListener("click", function () {
  navigator.clipboard.writeText(salida.textContent);
});


lista.addEventListener("click", function (evento) {
const id = evento.target.dataset.id; 
    if (evento.target.classList.contains("btn-eliminar")) {     // ¿se hizo clic en un botón eliminar?
    
     eliminarPlantilla(id);
    }
     if (evento.target.classList.contains("btn-editar"))  { 
        cargarEnFormulario(id);
}
});

function cargarEnFormulario(id) {
  const plantilla = state.plantillas.find(plantilla => plantilla.id === id);
  titulo.value = plantilla.titulo;
  mensaje.value = plantilla.mensaje;
  hashtag.value = plantilla.hashtag;
  state.editandoId = id;          // recordamos que estamos editando, no creando
}


function eliminarPlantilla(id) {
  state.plantillas = state.plantillas.filter(plantilla => plantilla.id !== id);  // sin mutar: filtra
  render();
}


function plantillasVisibles() {
  const filtroTexto = (state.filtro ?? "").toLowerCase();
  if (filtroTexto === "") return state.plantillas;
  return state.plantillas.filter(plantilla => plantilla.hashtag.toLowerCase().includes(filtroTexto));
}


document.getElementById("buscador").addEventListener("input", function (evento) {
  state.filtro = evento.target.value;   // el filtro vive en el estado
  render();                             // mismo render, datos distintos
});

document.getElementById("btn-vaciar").addEventListener("click", function () {
  state.plantillas = [];
  render();     // render → guardar(); como no queda nada, se borra la clave
});