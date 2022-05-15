const nav = document.querySelector('.menu');
const menu = document.querySelector('.link-list');

nav.addEventListener('click', () => {
  nav.classList.toggle('cross');
  menu.classList.toggle('show');

  if (menu.classList.contains('show')) {
    document.querySelector('body').style.overflow = 'hidden';
  } else {
    document.querySelector('body').style.overflow = 'auto';
  }
});
