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

const closeBtnHelper = () => {
  const confirmDialog = document.querySelector('#confirm');
  const closeConfirmBtn = confirmDialog.querySelector('#close-confirm');
  closeConfirmBtn.addEventListener('click', () => {
    document.querySelector('#confirm').remove();
  });
};

const saveImage = async (id) => {
  const confirmDialog = await render('confirm');
  document.body.appendChild(confirmDialog);

  const publicBtn = confirmDialog.querySelector('#public');
  const privateBtn = confirmDialog.querySelector('#private');

  [publicBtn, privateBtn].forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const type = e.target.id;

      if (!isAuth()) {
        document.querySelector('.confirm-msg').remove();
        document.querySelector('.confirm-actions').remove();
        const wrapper = document.querySelector('.confirm-wrapper');
        wrapper.innerHTML +=
          '<h2 class="confirm-msg">You are not logged in</h2>';
        closeBtnHelper();
      } else {
        switch (id) {
          case 'filters':
            await saveFilterImage(type);
            break;
          case 'collages':
            await saveCollageImage(type);
            break;
        }
      }
    });
  });

  closeBtnHelper();
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

const saveFilterImage = async (type) => {
  const token = JSON.parse(localStorage.getItem('token'));

  const img = document.querySelector('.image-to-edit img');

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const context = canvas.getContext('2d');

  context.filter = getComputedStyle(img).filter;

  img.setAttribute('crossOrigin', 'Anonymous');
 

  context.drawImage(img, 0, 0);

  img.removeAttribute('crossOrigin');
  var img1 = new Image;
  img1.src = canvas.toDataURL();
  const imageURL = canvas.toDataURL();
  
  const imageData = await fetch(imageURL);
  const imageBlob = await imageData.blob();
  const formData = new FormData();
  formData.append('image', imageBlob, 'image.png');

  const res = await fetch(
    'http://178.79.141.216:8803/api/image/upload?type=' + type,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*'
      },
      body: formData
    }
  );

  let msg;
  if (res.ok) {
    let data = await res.json();
    msg = data.message;
  } else {
    msg = 'You are not logged in';
  }

  const wrapper = document.querySelector('.confirm-wrapper');
  document.querySelector('.confirm-msg').remove();
  document.querySelector('.confirm-actions').remove();
  wrapper.innerHTML += `<h2 class="confirm-msg">${msg}</h2>`;
  closeBtnHelper();
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

const saveCollageImage = async (type) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const canvas = await html2canvas(document.querySelector('.image-to-edit'));

  const imageURL = canvas.toDataURL();
  const imageData = await fetch(imageURL);
  const imageBlob = await imageData.blob();

  const formData = new FormData();
  formData.append('image', imageBlob, 'image.png');

  const res = await fetch(
    'http://178.79.141.216:8803/api/image/upload?type=' + type,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    }
  );

  let msg;
  if (res.ok) {
    let data = await res.json();
    msg = data.message;
  } else {
    msg = 'You are not logged in';
  }

  const wrapper = document.querySelector('.confirm-wrapper');
  document.querySelector('.confirm-msg').remove();
  document.querySelector('.confirm-actions').remove();
  wrapper.innerHTML += `<h2 class="confirm-msg">${msg}</h2>`;
  closeBtnHelper();
};

const renderGallery = async () => {
  const galleryModule = await import('../components/html/html_gallery.js');
  const createGallery = galleryModule.default;

  const token = JSON.parse(localStorage.getItem('token'));

  const res = await fetch('http://178.79.141.216:8803/api/images/private', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });

  const data = await res.json();
  const items = [...data.message];
  const html_gallery = createGallery(items);

  const parser = new DOMParser();
  const content = parser
    .parseFromString(html_gallery, 'text/html')
    .querySelector('#gallery');

  return content;
};

export default {
  render,
  clear,
  hasGalleryAccess,
  saveImage,
  discardImages,
  renderGallery
};
