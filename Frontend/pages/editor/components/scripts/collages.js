(async () => {
  const authModule = await import('../../../../utils/isAuth.js');
  const isAuth = authModule.default;

  const utilsModule = await import('../../utils/utils.js');
  const { render, clear, hasGalleryAccess, saveImage } = utilsModule.default;

  // import collage template
  const importTemplate = async (name) => {
    const container = clear();
    const template = await render(name);
    return container.append(template);
  };

  // upload new image
  const uploadNewImage = (e, event) => {
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
  };

  // choose image from gallery
  const chooseImageFromGallery = async (event) => {
    const gallery = await render('gallery');
    document.querySelector('body').append(gallery);

    if (!hasGalleryAccess()) {
      return;
    }

    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        let img = document.querySelector('#' + event.target.id);
        img.setAttribute('src', e.target.src);

        document.querySelector('.gallery-selector').remove();
        document.querySelector('.dialog').remove();
      });
    });
  };

  // images selector
  const selectImages = async () => {
    const templateImagePlaceholders = document.querySelectorAll(
      '.template-image img'
    );

    templateImagePlaceholders.forEach(async (template) => {
      template.addEventListener('click', async (event) => {
        const dialog = await render('dialog');
        document.querySelector('body').append(dialog);

        const uploadInput = document.querySelector('.editor-action-input');
        const chooseInput = document.querySelector('.choose-action');

        uploadInput.addEventListener('change', async (e) => {
          uploadNewImage(e, event);
        });

        chooseInput.addEventListener('click', async () =>
          chooseImageFromGallery(event)
        );
      });
    });
  };

  // driver btns

  const templateBtns = document.querySelectorAll('.template-btn');
  templateBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      templateBtns.forEach((tBtn) => {
        tBtn.classList.remove('active');
      });

      btn.classList.add('active');

      await importTemplate(btn.id);
      selectImages();
    });
  });

  // default
  await importTemplate('template1');
  await selectImages();
})();
