// validación del formulario con JavaScript vainilla

// seleccion de elementos del formulario DOM
const form = document.querySelector('#form-contacto'); //el formulario completo
const alerta = document.querySelector('#alerta-form'); //mensaje de alerta bootstrap


const campoNombre = document.querySelector('#nombre');
const campoEmail = document.querySelector('#email');
const campoTelefono = document.querySelector('#telefono');
const campoMotivo = document.querySelector('#motivo');
const campoMensaje = document.querySelector('#mensaje');
const checkTerminos = document.querySelector('#terminos');

// expresiones regulares simples para comprobar el formato del texto ingresado
const reNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const reEmail  = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const reTelefono = /^[\d\s()+-]{6,20}$/;

//funcion para marcar campos validos o invalidos
//clases visuales de bootstrap verde si es valid rojo si es invalid
function marcarValido(input, valido) {
  input.classList.toggle('is-valid', !!valido); //agrega la clase si es valid
  input.classList.toggle('is-invalid', !valido); //agrega la clase si es invalid
}


//validacione sindividuales
function validarNombre() {
  const valor = campoNombre.value.trim(); //saca los espacios del principio y del final
  const ok = valor.length >= 3 && valor.length <= 60 && reNombre.test(valor);
  marcarValido(campoNombre, ok);
  return ok;
}

function validarEmail() {
  const valor = campoEmail.value.trim();
  const ok = reEmail.test(valor);
  marcarValido(campoEmail, ok);
  return ok;
}

function validarTelefono() {
  const valor = campoTelefono.value.trim();
  //como es opcional, si el campo esta vacio no lo marca de rojo ni de verde
  if (valor === '') {
    campoTelefono.classList.remove('is-valid', 'is-invalid');
    return true;
  }

  const ok = reTelefono.test(valor);
  marcarValido(campoTelefono, ok);
  return ok;
}

function validarMotivo() {
  const ok = campoMotivo.value !== ''; //el usuario elige una opcion
  marcarValido(campoMotivo, ok);
  return ok;
}

function validarMensaje() {
  const valor = campoMensaje.value.trim();
  const ok = valor.length >= 10 && valor.length <= 1000; //limite de caracteres
  marcarValido(campoMensaje, ok);
  return ok;
}

function validarTerminos() {
  const ok = checkTerminos.checked; //tiene q estar marcado
  checkTerminos.classList.toggle('is-invalid', !ok);
  checkTerminos.classList.toggle('is-valid', ok);
  return ok;
}

//usa clases visuales de bootstrap para el color de la alerta
function mostrarAlerta(tipo, texto) {
  alerta.className = `alert alert-${tipo}`; //cambia el color segun el tipo de alerta
  alerta.textContent = texto; //muestra el mensaje de alerta
}


//validacion automatica al salir de cada campo
//cuando el usuario pasa al siguiente, se valida el campo
[campoNombre, campoEmail, campoTelefono, campoMotivo, campoMensaje, checkTerminos]
  .forEach(el => {
    el.addEventListener('blur', () => {
      switch (el) {
        case campoNombre: validarNombre(); break;
        case campoEmail: validarEmail(); break;
        case campoTelefono: validarTelefono(); break;
        case campoMotivo: validarMotivo(); break;
        case campoMensaje: validarMensaje(); break;
        case checkTerminos: validarTerminos(); break;
      }
    });
  });


  //validacion final al enviar formulario
form.addEventListener('submit', function (e) {
  e.preventDefault();


  //se ejecutan todas las validaciones y se guardan los resultados
  const ok =
    validarNombre() &
    validarEmail() &
    validarTelefono() &
    validarMotivo() &
    validarMensaje() &
    validarTerminos(); // el & hace q se evaluen todas aunque alguna falle


    //si esta todo ok
  if (ok) {
    //alerta verde 
    mostrarAlerta('success', '¡Gracias! Tu mensaje fue enviado correctamente.');
    //limpia el formulario
    form.reset();
    //saca los bordes verdes o rojor
    [campoNombre, campoEmail, campoTelefono, campoMotivo, campoMensaje, checkTerminos]
      .forEach(el => el.classList.remove('is-valid', 'is-invalid'));
  } else {
    //alerta roja
    mostrarAlerta('danger', 'Revisá los campos marcados en rojo.');
    //enfoca el primer campo q fallo
    const primeroInvalido = document.querySelector('.is-invalid');
    if (primeroInvalido) primeroInvalido.focus();
  }
});
