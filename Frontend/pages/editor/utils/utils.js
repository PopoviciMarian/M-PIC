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

const saveImage = async (id) => {
  switch (id) {
    case 'filters':
      await saveFilterImage();
      break;
    case 'collages':
      await saveCollageImage();
      break;
  }
};

const discardImages = async (id) => {
  switch (id) {
    case 'filters':
      discardFilters();
      break;
    case 'collages':
      await discardCollages();
      break;
  }
};

const saveFilterImage = async () => {
  const token = JSON.parse(localStorage.getItem('token'));

  const img = document.querySelector('.image-to-edit img');

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const context = canvas.getContext('2d');
  context.filter = getComputedStyle(img).filter;

  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageURL = canvas.toDataURL();
  const imageData = await fetch(imageURL);
  const imageBlob = await imageData.blob();

  const formData = new FormData();
  formData.append('image', imageBlob, 'image.png');

  const res = await fetch(
    'http://178.79.141.216:8803/api/image/upload?type=public',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    }
  );

  const data = await res.json();

  console.log(data);
};

const discardFilters = () => {
  const rangeInputs = document.querySelectorAll('input[type="range"]');
  const imageToEdit = document.querySelector('.image-to-edit img');

  imageToEdit.style.filter = '';

  rangeInputs.forEach((i) => {
    i.style.backgroundSize = '50% 100%';

    let resetValue = (i.value = i.max / 2);
    let oldText = i.nextElementSibling.textContent;
    let lastCh = oldText[oldText.length - 1];

    i.nextElementSibling.innerHTML = `${resetValue}${
      lastCh === '%' ? '%' : lastCh === '°' ? '°' : 'px'
    }`;
  });
};

const discardCollages = async () => {
  const container = clear();
  const template = await render('template1');
  container.append(template);
  document
    .querySelector('.template-btn')
    .dispatchEvent(new MouseEvent('click'));
};

const saveCollageImage = async () => {
  const token = JSON.parse(localStorage.getItem('token'));
  const canvas = await html2canvas(document.querySelector('.image-to-edit'));

  const imageURL = canvas.toDataURL();
  const imageData = await fetch(imageURL);
  const imageBlob = await imageData.blob();

  const formData = new FormData();
  formData.append('image', imageBlob, 'image.png');

  const res = await fetch(
    'http://178.79.141.216:8803/api/image/upload?type=public',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    }
  );

  const data = await res.json();

  console.log(data);
};

export default { render, clear, hasGalleryAccess, saveImage, discardImages };
