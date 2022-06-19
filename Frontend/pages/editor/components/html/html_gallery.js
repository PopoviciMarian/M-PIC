const createGallery = (images) => {
  const galleryItem = (id, url) => {
    return `
    <div class="gallery-item" id="${id}">
      <img src="${url}" alt="image.png" />
    </div>
    `;
  };

  let galleryGrid = `
  <section class="gallery-selector" id="gallery">
    <div class="gallery-grid"> 
`;

  //image_id
  //img_url
  images.forEach((img) => {
    galleryGrid += galleryItem(img.image_id, img.img_url);
  });

  galleryGrid.concat('</div></section>');

  console.log(galleryGrid);

  return galleryGrid;
};

export default createGallery;
