const render = async (name) => {
  const html = await import(`../components/html/html_${name}.js`);
  const parser = new DOMParser();
  const content = parser
    .parseFromString(html.default, 'text/html')
    .querySelector('#' + name);

  return content;
};

export default render;
