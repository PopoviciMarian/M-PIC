// import { render, clear } from '../../utils/utils.js';
// import isAuth from '../../../../utils/isAuth.js';

(async () => {
  console.log('collages script');

  const render = async (name) => {
    const html = await import(`../html/html_${name}.js`);
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
  // import collage template
  const importTemplate = async (name) => {
    const container = clear();
    const template = await render(name);
    return container.append(template);
  };

  // const userIsAuth = () => {
  //   if (!isAuth()) {
  //     const container = document.querySelector('.gallery-grid');
  //     container.style.display = 'flex';

  //     container.innerHTML = `<h3 class="not-auth"><a href="../../pages/auth/login.html">Login</a> to select from gallery
  //     <button class="close-btn">X</button></h3>`;

  //     const closeBtn = document.querySelector('.close-btn');

  //     closeBtn.addEventListener('click', () => {
  //       document.querySelector('#gallery').remove();
  //     });

  //     return false;
  //   }
  //   return true;
  // };

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

    // if (!userIsAuth()) {
    //   return;
    // }

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

  // discard
  const discardBtn = document.querySelector('.discard');
  discardBtn.addEventListener('click', async () => {
    await importTemplate('template1');
    document
      .querySelector('.template-btn')
      .dispatchEvent(new MouseEvent('click'));
  });

  // //save
  // const saveBtn = document.querySelector('.save');

  // saveBtn.addEventListener('click', async () => {
  //   const canvas = await html2canvas(document.querySelector('.image-to-edit'));

  //   const imageSrc = canvas.toDataURL('image/png');

  //   const image = await fetch(imageSrc);
  //   const imageBlog = await image.blob();
  //   const imageURL = URL.createObjectURL(imageBlog);

  //   const imageFormData = new FormData(imageSrc);

  //   imageFormData.append('userfile', JSON.stringify(imageBlog));
  //   console.log(imageFormData);
  // });

  // //   html2canvas($("#testdiv"), {
  // //     onrendered: function(canvas) {
  // //         // canvas is the final rendered <canvas> element
  // //         var myImage = canvas.toDataURL("image/png");
  // //         window.open(myImage);
  // //     }
  // // });
})();
