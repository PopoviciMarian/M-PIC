(() => {
  const container = document.querySelector('.image-to-edit');
  container.innerHTML = '';

  const importTemplate = async (id) => {
    const t = container.querySelector('#template');

    container.querySelector('#template')?.remove();

    const done = await import(`../html/templates/${id}.js`).then((html) => {
      const parser = new DOMParser();
      const content = parser
        .parseFromString(html.default, 'text/html')
        .querySelector('#template');
      container.append(content);
    });

    return document.querySelectorAll('.template');
  };

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
          const chooseInput = document.querySelector('.choose-action');

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

          chooseInput.addEventListener('click', () => {
            import('../html/html_gallery.js').then((html) => {
              const parser = new DOMParser();
              const content = parser
                .parseFromString(html.default, 'text/html')
                .querySelector('.gallery-selector');
              const body = document.querySelector('body');
              body.append(content);
              const galleryItems = document.querySelectorAll('.gallery-item');
              galleryItems.forEach((item) => {
                item.addEventListener('click', (e) => {
                  let img = document.querySelector('#' + event.target.id);
                  img.setAttribute('src', e.target.src);
                  document.querySelector('.gallery-selector').remove();
                  document.querySelector('.dialog').remove();
                });
              });
            });
          });
        });
      });
    });
  };

  importTemplate('template1').then((templates) => {
    templates.forEach((t) => {
      t.addEventListener('click', (event) => {
        console.log(event);
        templates.forEach((te) => {
          te.classList.remove('active');
        });

        t.classList.add('active');

        importTemplate(t.id).then(() => selectImages());
      });
    });
    selectImages();
  });
})();
