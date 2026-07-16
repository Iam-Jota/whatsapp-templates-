import { state, cargar, guardar, contarPorHashtag, plantillasVisibles, normalizarHashtag } from "./state.js";
import { template } from "./models/template.js";

state.plantillas = cargar();

function agregarPlantilla(titulo, mensaje, hashtag) {
  const nueva = new template(titulo, mensaje, hashtag);   // minúscula, igual que el import
  state.plantillas.push(nueva);
}

const selector = document.getElementById("selector");

function renderSelector() {
  selector.innerHTML = state.plantillas
    .map((plantilla, indice) => `<option value="${indice}">${plantilla.titulo}</option>`)
    .join("");
}

function renderStats() {
  const total = state.plantillas.length;
  const porTag = contarPorHashtag(state.plantillas);
  const detalle = Object.entries(porTag).map(([hashtag, cantidad]) => `${hashtag} : ${cantidad}`).join(" . ");
  document.getElementById("panel-stats").textContent = `Total : ${total} | ${detalle}`;
}

const lista = document.getElementById("listaPlantillas");

export function render() {
  const visibles = plantillasVisibles();
  lista.innerHTML = "";

  if (visibles.length === 0) {
    const vacio = state.plantillas.length === 0
      ? "Aún no tienes plantillas. ¡Crea la primera!"
      : "No se encontraron plantillas con ese filtro.";
    lista.innerHTML = `
      <li class="sm:col-span-2 text-center text-slate-400 py-10">
        <div class="text-4xl mb-2">📭</div>
        ${vacio}
      </li>`;
  } else {
    visibles.forEach(function (plantilla) {
      const fechaTexto = new Date(plantilla.fecha).toLocaleDateString("es-PE");
      const li = document.createElement("li");
      li.className = "bg-white p-4 rounded-lg shadow";
      li.innerHTML = `
        <div class="flex items-start justify-between gap-2">
          <strong class="text-slate-800">${plantilla.titulo}</strong>
          <span class="text-xs text-slate-400 shrink-0">${fechaTexto}</span>
        </div>
        <p class="text-sm text-slate-600 mt-1">${plantilla.mensaje}</p>
        <span class="inline-block text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full mt-2">${plantilla.hashtag}</span>
        <div class="flex gap-2 mt-3 pt-2 border-t border-slate-100">
          <button class="btn-eliminar text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition" data-id="${plantilla.id}">Eliminar</button>
          <button class="btn-editar text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition" data-id="${plantilla.id}">Editar</button>
        </div>
      `;
      lista.appendChild(li);
    });
  }

  renderSelector();
  renderStats();
  guardar();
}

render();

const form = document.getElementById("form-plantilla");




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
   if (evento.target.classList.contains("btn-eliminar")) {
  pedirConfirmacion("¿Eliminar esta plantilla?", () => eliminarPlantilla(id));
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




document.getElementById("buscador").addEventListener("input", function (evento) {
  state.filtro = evento.target.value;   // el filtro vive en el estado
  render();                             // mismo render, datos distintos
});

document.getElementById("btn-vaciar").addEventListener("click", function () {
  pedirConfirmacion("¿Vaciar todas las plantillas?", () => {
    state.plantillas = [];
    render();
  });
});
const modal = document.getElementById("modal");
let accionPendiente = null;     // qué ejecutar si el usuario acepta

function pedirConfirmacion(mensaje, accion) {
  document.getElementById("modal-texto").textContent = mensaje;
  accionPendiente = accion;
  modal.classList.remove("hidden");     // mostrar
}

document.getElementById("modal-cancelar").addEventListener("click", function () {
  modal.classList.add("hidden");        // ocultar, sin hacer nada
  accionPendiente = null;
});

document.getElementById("modal-confirmar").addEventListener("click", function () {
  if (accionPendiente) accionPendiente();   // ejecuta la acción guardada
  modal.classList.add("hidden");
  accionPendiente = null;
});

document.getElementById("orden").addEventListener("change", function (evento) {
  state.orden = evento.target.value;
  render();
});