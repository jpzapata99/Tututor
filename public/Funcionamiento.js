var menu = document.querySelector('#HamburguesaIzquierda');

// method
function toggleMenu (event) {
  this.classList.toggle('is-active');
  document.querySelector( "#menuppalIzquierda" ).classList.toggle("is_active");
  event.preventDefault();
}

// event
menu.addEventListener('click', toggleMenu, false);
