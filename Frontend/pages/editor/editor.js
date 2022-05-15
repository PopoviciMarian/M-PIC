const uploadInput = document.querySelector('.editor-action-input');

const discardBtn = document.querySelector('.discard');

let uploadedImage = null;

uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    uploadedImage = reader.result;
    let img = document.querySelector('.image-to-edit img');
    img.setAttribute('src', uploadedImage);
  });

  reader.readAsDataURL(file);
});

const rangeInputs = document.querySelectorAll('input[type="range"]');
const imageToEdit = document.querySelector('.image-to-edit img');

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
