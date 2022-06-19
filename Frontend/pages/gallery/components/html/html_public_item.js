const renderPublicItem = (username, image, likes, shares, id) => {
  return `
<div class="gallery-item public-item " id="${id}">
<div class="item-header">${username}</div>
<div class="item-content">
  <div class="item-image">
    <img
      src="${image}"
      alt="img.jpg"
    />
  </div>
  <ul class="item-comments">
    <li class="comment-item">
      <div class="commentator">Name Surname</div>
      <div class="comment-text">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        Impedit possimus consequuntur cupiditate dicta voluptatum
        ducimus nam illum cumque sequi tempore.
      </div>
    </li>
    <li class="comment-item">
      <div class="commentator">Name Surname</div>
      <div class="comment-text">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        Impedit possimus consequuntur cupiditate dicta voluptatum
        ducimus nam illum cumque sequi tempore.
      </div>
    </li>
    <li class="comment-item">
      <div class="commentator">Name Surname</div>
      <div class="comment-text">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        Impedit possimus consequuntur cupiditate dicta voluptatum
        ducimus nam illum cumque sequi tempore.
      </div>
    </li>
    <li class="comment-item">
      <div class="commentator">Name Surname</div>
      <div class="comment-text">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        Impedit possimus consequuntur cupiditate dicta voluptatum
        ducimus nam illum cumque sequi tempore.
      </div>
    </li>
    <li class="comment-item">
      <div class="commentator">Name Surname</div>
      <div class="comment-text">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        Impedit possimus consequuntur cupiditate dicta voluptatum
        ducimus nam illum cumque sequi tempore.
      </div>
    </li>
    <li class="comment-item">
      <div class="commentator">Name Surname</div>
      <div class="comment-text">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        Impedit possimus consequuntur cupiditate dicta voluptatum
        ducimus nam illum cumque sequi tempore.
      </div>
    </li>
  </ul>
</div>
<div class="item-footer">
  <div class="item-actions">
    <!-- <button class="btn delete">Delete</button>
    <button class="btn edit">Edit</button>
    <button class="btn share">Share</button> -->
    <div class="helper-div"></div>
  </div>
  <div class="item-reactions">
    <div class="reactions-wrapper">
      <div class="likes">
        <img src="../../resources/heart.svg" alt="heart.svg" />
        <p>${likes}</p>
      </div>
      <div class="shares">
        <img src="../../resources/share.svg" alt="share.svg" />
        <p>${shares}</p>
      </div>
    </div>
  </div>
</div>
</div>
`;
};

export { renderPublicItem };
