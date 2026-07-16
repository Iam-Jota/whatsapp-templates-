
import { template } from "./models/template.js";

export const state = {
  plantillas: [],
  filtro: "",
  editandoId: null,
  orden: "recientes",
};

export const CLAVE = "whatsapp-templates";
export const CLAVE_FILTRO = "whatsapp-templates-filtro";

export function guardar() {
  state.plantillas.length === 0
    ? localStorage.removeItem(CLAVE)
    : localStorage.setItem(CLAVE, JSON.stringify(state.plantillas));
  localStorage.setItem(CLAVE_FILTRO, state.filtro ?? "");
}

export function cargar() {
  const guardado = localStorage.getItem(CLAVE);
  if (!guardado) return [];
  try { return JSON.parse(guardado); }
  catch { return []; }
}

export function contarPorHashtag(plantillas) {
  const conteo = {};
  plantillas.forEach(function (plantilla) {
    const elHashtag = plantilla.hashtag;
    if (conteo[elHashtag]) {
      conteo[elHashtag] = conteo[elHashtag] + 1;
    } else {
      conteo[elHashtag] = 1;
    }
  });
  return conteo;
}

function ordenar(plantillas) {
  const copia = [...plantillas];
  return state.orden === "antiguas"
    ? copia.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    : copia.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export function plantillasVisibles() {
  const filtroTexto = (state.filtro ?? "").toLowerCase();
  const filtradas = filtroTexto === ""
    ? state.plantillas
    : state.plantillas.filter(plantilla => plantilla.hashtag.toLowerCase().includes(filtroTexto));
  return ordenar(filtradas);
}

export function normalizarHashtag(texto) {
  const limpio = texto.trim().toLowerCase();
  return limpio.startsWith("#") ? limpio : "#" + limpio;
}
