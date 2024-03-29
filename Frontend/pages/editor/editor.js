import * as utils from './utils/utils.js';

const editSelector = document.querySelector('#editor-select');

// dynamic script load
const loadScript = (name) => {
  const head = document.querySelector('head');

  head.querySelectorAll('#script')?.forEach((s) => {
    s.remove();
  });

  const script = document.createElement('script');
  script.setAttribute('src', `./components/scripts/${name}.js`);
  script.setAttribute('id', 'script');

  head.appendChild(script);
};

// dynamic html redering
const renderEditor = async (name) => {
  const container = document.querySelector('.filters-container');

  container.querySelector('#dynamic-rendered')?.remove();

  const html = await import(`./components/html/html_${name}.js`);

  const parser = new DOMParser();
  const content = parser
    .parseFromString(html.default, 'text/html')
    .querySelector('#dynamic-rendered');
  container.append(content);

  return html;
};

// default
let value = 'filters';
renderEditor(value).then(() => {
  loadScript(value);
});

// driver
editSelector.addEventListener('change', async () => {
  value = editSelector.value.toLowerCase();
  await renderEditor(value);
  loadScript(value);
});

const saveBtn = document.querySelector('.save');
saveBtn.addEventListener('click', async () => utils.default.saveImage(value));

const discardBtn = document.querySelector('.discard');
discardBtn.addEventListener('click', async () =>
  utils.default.discardImages(value)
);
