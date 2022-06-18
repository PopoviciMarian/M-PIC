import isAuth from '../../../utils/isAuth.js';

const render = async (name) => {
  const html = await import(`../components/html/html_${name}.js`);
  const parser = new DOMParser();
  const content = parser
    .parseFromString(html.default, 'text/html')
    .querySelector('#' + name);

  return content;
};

const clear = () => {
  const imgContainer = document.querySelector('.image-to-edit');
  imgContainer.innerHTML = '';
  return imgContainer;
};

const hasGalleryAccess = () => {
  if (!isAuth()) {
    const container = document.querySelector('.gallery-grid');
    container.style.display = 'flex';

    container.innerHTML = `<h3 class="not-auth"><a href="../../pages/auth/login.html">Login</a> to select from gallery
    <button class="close-btn">X</button></h3>`;

    const closeBtn = document.querySelector('.close-btn');

    closeBtn.addEventListener('click', () => {
      document.querySelector('#gallery').remove();
    });

    return false;
  }
  return true;
};

export default { render, clear, hasGalleryAccess };
