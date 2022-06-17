const editSelector = document.querySelector('#editor-select');

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

const renderEditor = (name) => {
  const container = document.querySelector('.filters-container');

  container.querySelector('#dynamic-rendered')?.remove();

  import(`./components/html/html_${name}.js`).then((html) => {
    const parser = new DOMParser();
    const content = parser
      .parseFromString(html.default, 'text/html')
      .querySelector('#dynamic-rendered');
    container.append(content);
  });
};

let value = 'filters';

renderEditor(value);
loadScript(value);

editSelector.addEventListener('change', () => {
  value = editSelector.value.toLowerCase();

  renderEditor(value);
  loadScript(value);
});
