(async () => {
  const authModule = await import('../../../../utils/isAuth.js');
  const isAuth = authModule.default;

  const utilsModule = await import('../../utils/utils.js');
  const { render, clear, hasGalleryAccess } = utilsModule.default;

  // clear previous
  const container = clear();

  // render placeholder image
  const img = document.createElement('img');
  img.setAttribute('src', '../../resources/placeholder.png');
  container.append(img);

  //upload new image
  const uploadNewImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      let uploadedImage = reader.result;
      let img = document.querySelector('.image-to-edit img');
      img.setAttribute('src', uploadedImage);
    });

    reader.readAsDataURL(file);

    document.querySelector('.dialog').remove();
  };

  //choose image from gallery
  const chooseImageFromGallery = async () => {
    const gallery = await render('gallery');
    document.querySelector('body').append(gallery);

    if (!hasGalleryAccess()) {
      return;
    }

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        let img = document.querySelector('.image-to-edit img');
        img.setAttribute('src', e.target.src);

        document.querySelector('.gallery-selector').remove();
        document.querySelector('.dialog').remove();
      });
    });
  };

  // image click event
  img.addEventListener('click', async () => {
    const dialog = await render('dialog');
    document.querySelector('body').append(dialog);

    const uploadInput = document.querySelector('.editor-action-input');
    const chooseInput = document.querySelector('.choose-action');

    uploadInput.addEventListener('change', uploadNewImage);
    chooseInput.addEventListener('click', chooseImageFromGallery);
  });

  const discardBtn = document.querySelector('.discard');
  const rangeInputs = document.querySelectorAll('input[type="range"]');
  const imageToEdit = document.querySelector('.image-to-edit img');

  // filters actions
  function handleInputChange(e) {
    const filter = e.target.id;
    let target;
    let output;
    let unit;

    switch (filter) {
      case 'brightness':
        target = document.getElementById('brightness');
        output = target.nextElementSibling;
        unit = '%';
        break;

      case 'contrast':
        target = document.getElementById('contrast');
        output = target.nextElementSibling;
        unit = '%';
        break;

      case 'saturate':
        target = document.getElementById('saturate');
        output = target.nextElementSibling;
        unit = '%';
        break;

      case 'grayscale':
        target = document.getElementById('grayscale');
        output = target.nextElementSibling;
        unit = '%';
        break;

      case 'sepia':
        target = document.getElementById('sepia');
        output = target.nextElementSibling;
        unit = '%';
        break;

      case 'hue-rotate':
        target = document.getElementById('hue-rotate');
        output = target.nextElementSibling;
        unit = '°';
        break;

      case 'invert':
        target = document.getElementById('invert');
        output = target.nextElementSibling;
        unit = '%';
        break;

      case 'blur':
        target = document.getElementById('blur');
        output = target.nextElementSibling;
        unit = 'px';
        break;

      case 'opacity':
        target = document.getElementById('opacity');
        output = target.nextElementSibling;
        unit = '%';
        break;

      default:
        target = null;
    }

    if (!target || !output) {
      return;
    }

    const min = target.min;
    const max = target.max;
    const val = target.value;

    target.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%';

    let imageFilters = imageToEdit.style.filter;

    if (!imageFilters) {
      imageToEdit.style.filter = ` ${filter}(${val}${unit}) `;
    } else if (!imageFilters.includes(filter)) {
      imageToEdit.style.filter += ` ${filter}(${val}${unit}) `;
    } else {
      let text = imageFilters;
      let firstPos = text.indexOf(filter) + filter.length;
      let lastPos = text.indexOf(')', firstPos);
      let remainingText = text.slice(lastPos + 1);
      let newVal = `(${val}${unit})`;
      text = text.slice(0, firstPos) + newVal + remainingText;
      imageToEdit.style.filter = text;
    }

    output.innerHTML = `${val}${unit}`;
  }

  rangeInputs.forEach((input) => {
    input.addEventListener('input', handleInputChange);
  });

  discardBtn.addEventListener('click', () => {
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
  });

  //save
  const saveBtn = document.querySelector('.save');

  saveBtn.addEventListener('click', async () => {
    const token = JSON.parse(localStorage.getItem('token'));

    const img = document.querySelector('.image-to-edit img');

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const context = canvas.getContext('2d');
    context.filter = getComputedStyle(img).filter;

    // img.setAttribute('crossOrigin', 'anonymous');

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
  });
})();
