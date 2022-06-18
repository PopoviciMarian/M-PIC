const render = async (name) => {
  const html = await import(`../components/html/html_${name}.js`);
  const parser = new DOMParser();
  const content = parser
    .parseFromString(html.default, 'text/html')
    .querySelector('#' + name);

  console.log(content);
  return content;
};

const clear = () => {
  const imgContainer = document.querySelector('.image-to-edit');
  imgContainer.innerHTML = '';
  return imgContainer;
};

export { render, clear };
