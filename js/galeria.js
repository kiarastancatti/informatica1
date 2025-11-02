document.addEventListener("DOMContentLoaded", iniciarGaleria);

function iniciarGaleria() {
  // MODAL - bootstrap
  //toma el elemento del DOM que es el modal. el div con id modalVisor
  const elementoModal = document.getElementById("modalVisor");
  //lo guarda acá
  let modalBootstrap = null;

  try {
    //verifica que esté cargado bootstrap y que exista el elemento
    if (window.bootstrap && elementoModal) {
      //creo la instancia de modal usando la PI de bootstrap
      //bootstrap.Modal(element) permite abrir y cerrar el modal por js
      modalBootstrap = new bootstrap.Modal(elementoModal); 
    }
  } catch (e) {
    console.warn("No se pudo inicializar el modal de Bootstrap:", e);
  }

  // elementos internos del modal
  const imagenModal = document.getElementById("modalImagen"); //<img> donde muestra la img grande
  const leyendaModal = document.getElementById("modalLeyenda"); //donde muestra el titulo de la img
  const botonAnterior = document.getElementById("botonAnterior"); //boton de navegacion dentro del modal
  const botonSiguiente = document.getElementById("botonSiguiente"); //boton de navegacion dentro del modal

  // datos de la galería 
  const contenedorGaleria = document.getElementById("galeria"); //contenedor principal de la galeria
  const botonesFiltro = document.querySelectorAll(".boton-filtro"); //botones q filtran por categoria
  const items = Array.from(document.querySelectorAll(".item-galeria")); //tarjetas de la galeria
  const miniaturas = Array.from(document.querySelectorAll(".miniatura")); //todas las miniaturas

  // estado de navegación 
  //guarda los indices absolutos que estan visibles despues de aplicarle el filtro
  let indicesVisibles = [];
  //posicion actial dentro de indicesVisibles
  let indiceActual = 0;
  //lista de visibles
  reconstruirVisibles();

  //  apertura de modal al hacer click en miniatura 
  //recorre las miniatars y agrega un click a cada una
  miniaturas.forEach((img, indiceAbsoluto) => {
    img.addEventListener("click", () => {
      //busca en q posicion visible esta la miniatura
      const posicion = indicesVisibles.indexOf(indiceAbsoluto);
      if (posicion === -1) return; //si no esta visible no hace nada
      indiceActual = posicion; //actualiza posicion
      mostrarEnModal(indiceAbsoluto); //carga imagen y titulo en modal

      //si crea la instancia de modal, lo abre por js
      if (modalBootstrap) modalBootstrap.show(); // bootstrap -- abrir modal
    }, { passive: true });
  });

  // ----- navegación en modal -----
  if (botonAnterior)  botonAnterior.addEventListener("click", () => navegar(-1));
  if (botonSiguiente) botonSiguiente.addEventListener("click", () => navegar(+1));

  //atajos del teclado
  if (elementoModal) {
    elementoModal.addEventListener("shown.bs.modal", () => {
      document.addEventListener("keydown", manejoTeclas);
    });
    elementoModal.addEventListener("hidden.bs.modal", () => {
      document.removeEventListener("keydown", manejoTeclas);
    });
  }

  //teclado flecha izq y der para navegar
  function manejoTeclas(e) {
    if (e.key === "ArrowLeft")  navegar(-1);
    if (e.key === "ArrowRight") navegar(+1);
  }

  // filtros. delegación y directo
  // escucha clikc en el contenedor de filtros
  //sirve si un boton no tiene la clase .boton-filtro pero si el atributo data-filtro
  document.getElementById("filtros").addEventListener("click", (ev) => {
    const boton = ev.target.closest("[data-filtro]");
    if (!boton) return;
    aplicarFiltro(boton.dataset.filtro, boton);
  });

  // listeners a cada boton con .boton-filtro
  botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => aplicarFiltro(boton.dataset.filtro, boton));
  });

  function aplicarFiltro(categoria, botonActivo) {
    // bootstrap -- estados visuales de los botones//saca el color solido y ponemos contorno por defecto
    document.querySelectorAll(".boton-filtro").forEach(b => {
      b.classList.remove("activo", "btn-primary");
      b.classList.add("btn-outline-primary");
    });
    //activa visualmente el boton seleccioado
    if (botonActivo) {
      botonActivo.classList.add("activo");
      botonActivo.classList.remove("btn-outline-primary");
      botonActivo.classList.add("btn-primary");
    }

    // mostrar/ocultar según categoría
    //d-none es una clase de bootstrap q oculta el elemnto
    items.forEach(item => {
      const coincide = (categoria === "todas") || (item.dataset.categoria === categoria);
      item.classList.toggle("d-none", !coincide); // bootstrap -- d-none oculta
    });

    //chekea q indices quedaron visibles tras el filtro
    reconstruirVisibles();
  }

  //reconstruye los indices visibles, los que no tienen d-none
  function reconstruirVisibles() {
    indicesVisibles = items
      .map((item, i) => ({ i, oculto: item.classList.contains("d-none") }))
      .filter(o => !o.oculto)
      .map(o => o.i);
  }

  //cambia la imagen dentro del conjunto visible
  function navegar(direccion) {
    if (!indicesVisibles.length) return;
    indiceActual = (indiceActual + direccion + indicesVisibles.length) % indicesVisibles.length;
    const indiceAbsoluto = indicesVisibles[indiceActual];
    mostrarEnModal(indiceAbsoluto);
  }

  //carga en el modal la miniatura sellecioinada y su titulo
  function mostrarEnModal(indiceAbsoluto) {
    const img = miniaturas[indiceAbsoluto];
    const categoria = items[indiceAbsoluto].dataset.categoria || "sin categoría";

    // esto es por si la imagen no existe, que no quede el modal en blanco
    const src = img?.getAttribute("src");
    imagenModal.src = src || "";
    imagenModal.alt = img?.alt || "";

    //usa data-titulo y si no existe, usa el alt y agrega la categoria
    leyendaModal.textContent = `${img?.dataset?.titulo || img?.alt || "Imagen"} — ${categoria}`;
  }
}
