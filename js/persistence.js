const CLAVE = "whatsapp-templates";   // la "etiqueta" bajo la que guardas en el navegador

function guardar() {
  // si no hay plantillas, borra la clave; si hay, guárdalas
  state.plantillas.length === 0
    ? localStorage.removeItem(CLAVE)
    : localStorage.setItem(CLAVE, JSON.stringify(state.plantillas));

  document.getElementById("estado").textContent = state.plantillas.length > 0 ? "Guardado ✓" : "Vacío";
}
function cargar() {
  const guardado = localStorage.getItem(CLAVE);
  if (!guardado) return [];
  try {
    return JSON.parse(guardado);          // intenta reconstruir
  } catch (error) {
    console.warn("Datos corruptos, empiezo de cero:", error);
    return [];                            // si falla, no rompas: lista vacía
  }
}