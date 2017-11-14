// selector
var menu = document.querySelector('#HamburguesaDerecha');

// method
function toggleMenu (event) {
  this.classList.toggle('is-active');
  document.querySelector( "#menuppalDerecha" ).classList.toggle("is_active");
  event.preventDefault();
}

// event
menu.addEventListener('click', toggleMenu, false);