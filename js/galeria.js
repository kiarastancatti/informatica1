// ====== galería con FILTROS + MODAL ======



document.addEventListener("DOMContentLoaded", iniciarGaleria);

function iniciarGaleria() {
  // ----- MODAL -- bootstrap) -----
  const elementoModal = document.getElementById("modalVisor");
  let modalBootstrap = null;
  try {
    if (window.bootstrap && elementoModal) {
      modalBootstrap = new bootstrap.Modal(elementoModal); // (Bootstrap) API modal
    }
  } catch (e) {
    console.warn("No se pudo inicializar el modal de Bootstrap:", e);
  }

  // elementos internos del modal
  const imagenModal   = document.getElementById("modalImagen");
  const leyendaModal  = document.getElementById("modalLeyenda");
  const botonAnterior = document.getElementById("botonAnterior");
  const botonSiguiente= document.getElementById("botonSiguiente");

  // ----- datos de la galería -----
  const contenedorGaleria = document.getElementById("galeria");
  const botonesFiltro     = document.querySelectorAll(".boton-filtro");
  const items             = Array.from(document.querySelectorAll(".item-galeria"));
  const miniaturas        = Array.from(document.querySelectorAll(".miniatura"));

  // estado de navegación dentro de la selección visible
  let indicesVisibles = [];
  let indiceActual = 0;
  reconstruirVisibles();

  // ----- apertura de modal al hacer click en miniatura -----
  miniaturas.forEach((img, indiceAbsoluto) => {
    img.addEventListener("click", () => {
      const posicion = indicesVisibles.indexOf(indiceAbsoluto);
      if (posicion === -1) return;
      indiceActual = posicion;
      mostrarEnModal(indiceAbsoluto);
      if (modalBootstrap) modalBootstrap.show(); // bootstrap -- abrir modal
    }, { passive: true });
  });

  // ----- navegación en modal -----
  if (botonAnterior)  botonAnterior.addEventListener("click", () => navegar(-1));
  if (botonSiguiente) botonSiguiente.addEventListener("click", () => navegar(+1));

  if (elementoModal) {
    elementoModal.addEventListener("shown.bs.modal", () => {
      document.addEventListener("keydown", manejoTeclas);
    });
    elementoModal.addEventListener("hidden.bs.modal", () => {
      document.removeEventListener("keydown", manejoTeclas);
    });
  }

  function manejoTeclas(e) {
    if (e.key === "ArrowLeft")  navegar(-1);
    if (e.key === "ArrowRight") navegar(+1);
  }

  // ----- Filtros -- delegación + normal -----
  // delegación es por si algún botón no tiene la clase, para q funcione igual
  document.getElementById("filtros").addEventListener("click", (ev) => {
    const boton = ev.target.closest("[data-filtro]");
    if (!boton) return;
    aplicarFiltro(boton.dataset.filtro, boton);
  });

  // modo directo para mantener ambos
  botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => aplicarFiltro(boton.dataset.filtro, boton));
  });

  function aplicarFiltro(categoria, botonActivo) {
    // bootstrap -- estados visuales de los botones
    document.querySelectorAll(".boton-filtro").forEach(b => {
      b.classList.remove("activo", "btn-primary");
      b.classList.add("btn-outline-primary");
    });
    if (botonActivo) {
      botonActivo.classList.add("activo");
      botonActivo.classList.remove("btn-outline-primary");
      botonActivo.classList.add("btn-primary");
    }

    // mostrar/ocultar según categoría
    items.forEach(item => {
      const coincide = (categoria === "todas") || (item.dataset.categoria === categoria);
      item.classList.toggle("d-none", !coincide); // bootstrap -- d-none oculta
    });

    reconstruirVisibles();
  }

  function reconstruirVisibles() {
    indicesVisibles = items
      .map((item, i) => ({ i, oculto: item.classList.contains("d-none") }))
      .filter(o => !o.oculto)
      .map(o => o.i);
  }

  function navegar(direccion) {
    if (!indicesVisibles.length) return;
    indiceActual = (indiceActual + direccion + indicesVisibles.length) % indicesVisibles.length;
    const indiceAbsoluto = indicesVisibles[indiceActual];
    mostrarEnModal(indiceAbsoluto);
  }

  function mostrarEnModal(indiceAbsoluto) {
    const img = miniaturas[indiceAbsoluto];
    const categoria = items[indiceAbsoluto].dataset.categoria || "sin categoría";

    // esto es por si la imagen no existe, que no quede el modal en blanco
    const src = img?.getAttribute("src");
    imagenModal.src = src || "";
    imagenModal.alt = img?.alt || "";
    leyendaModal.textContent = `${img?.dataset?.titulo || img?.alt || "Imagen"} — ${categoria}`;
  }
}
