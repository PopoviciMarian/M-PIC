(() => {
  const container = document.querySelector('.image-to-edit');
  container.innerHTML = '';

  const templates = document.querySelectorAll('.template');

  const importTemplate = (id) => {
    const t = container.querySelector('#template');

    if (t && t.classList.contains(id)) return;

    container.querySelector('#template')?.remove();

    return import(`../html/templates/${id}.js`).then((html) => {
      const parser = new DOMParser();
      const content = parser
        .parseFromString(html.default, 'text/html')
        .querySelector('#template');
      container.append(content);
    });
  };

  templates.forEach((t) => {
    t.addEventListener('click', () => {
      templates.forEach((te) => {
        te.classList.remove('active');
      });

      t.classList.add('active');

      importTemplate(t.id).then(() => selectImages());
    });
  });

  const selectImages = () => {
    document.querySelectorAll('.template-image img').forEach((img) => {
      img.addEventListener('click', (event) => {
        const body = document.querySelector('body');

        import('../dialog/html_dialog.js').then((html) => {
          const parser = new DOMParser();
          const content = parser
            .parseFromString(html.default, 'text/html')
            .querySelector('.dialog');
          body.append(content);

          const uploadInput = document.querySelector('.editor-action-input');

          uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.addEventListener('load', () => {
              let uploadedImage = reader.result;
              let img = document.querySelector('#' + event.target.id);

              img.setAttribute('src', uploadedImage);
            });

            reader.readAsDataURL(file);

            document.querySelector('.dialog').remove();
          });
        });
      });
    });
  };

  importTemplate('template1').then(() => {
    selectImages();
  });
})();
