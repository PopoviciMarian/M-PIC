import { renderPrivateItem } from '../html/html_private_item.js';
import { renderPublicItem } from '../html/html_public_item.js';
import { renderUnsplashItem } from '../html/html_unsplash_item.js';
(async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (!urlParams.has('code')) return;

  // parser
  const parser = (item_html, id) => {
    const parser = new DOMParser();
    const content = parser
      .parseFromString(item_html, 'text/html')
      .querySelector('.' + id);

    return content;
  };

  // render default pics
  const renderUserPicsDefault = (data) => {
    console.log(data);

    const photos = [];

    data.photos.forEach((p) => {
      photos.push({
        id: p.id,
        src: p.urls.regular,
        likes: p.likes | 0,
        shares: p.shares | 0,
        username: data.username
      });
    });

    const container = document.querySelector('.gallery-wrapper');
    // container.innerHTML = '';

    photos.forEach((item) => {
      const item_html = renderPublicItem(
        item.username,
        item.src,
        item.likes,
        item.shares,
        item.id
      );
      const content = parser(item_html, 'public-item');
      container.appendChild(content);
    });
  };

  // render filtered pics
  const renderFilteredPics = (data) => {
    const photos = [];

    data.forEach((p) => {
      photos.push({
        id: p.id,
        src: p.urls.regular,
        likes: p.likes | 0,
        shares: p.shares | 0,
        username: p.user.username
      });
    });

    const container = document.querySelector('.gallery-wrapper');
    container.innerHTML = '';

    photos.forEach((item) => {
      const item_html = renderUnsplashItem(
        item.username,
        item.src,
        item.likes,
        item.shares,
        item.id
      );
      const content = parser(item_html, 'unsplash-item');
      container.appendChild(content);
    });
  };

  const code = urlParams.get('code');
  localStorage.setItem('unsplashToken', code);

  // get token
  const res = await fetch(
    'http://109.74.194.74:8893/api/user/unsplash/access_token1',
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + code
      }
    }
  );

  const data = await res.json();

  const token = data.message.access_token;

  // get user pics
  const res2 = await fetch(`https://api.unsplash.com/me`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });

  const data2 = await res2.json();
  const username = data2.username;

  //
  //
  //
  //
  //
  //
  //

  // render user pics
  //   renderUserPicsDefault(data2);

  //
  //
  // OR
  //
  //

  const res3 = await fetch(
    `https://api.unsplash.com/users/${username}/photos`,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
  );

  const data3 = await res3.json();
  renderFilteredPics(data3);

  //
  //
  //
  //
  //
  //
  //
  //
  //

  const title = document.querySelector('#gallery-title');
  title.innerHTML = 'Your Feed';

  const social_filters_html = await import('../html/html_social_filters.js');
  const content = parser(social_filters_html.default, 'social-filters');

  const filtersPlace = document.querySelector('#gallery-title');
  filtersPlace.insertAdjacentElement('afterEnd', content);

  const editBtns = document.querySelectorAll('.edit');

  editBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.target.id;
      window.location.href = '../../pages/editor/editor.html?id=' + id;
    });
  });

  const unsplashLoginBtn = document.querySelector('.unsplash-btn');
  unsplashLoginBtn.addEventListener('click', () => {
    location.href =
      'https://unsplash.com/oauth/authorize?client_id=RUKYUnMEMgpNhG6iBbkAG6x_ctw2Uv_Bu7ksTR-sGSU&redirect_uri=http%3A%2F%2F127.0.0.1%3A5501%2Fpages%2Fgallery%2Fgallery.html&response_type=code&scope=public+read_user+write_user+read_photos+write_photos+write_likes+write_followers+read_collections+write_collections';
  });

  // unsplash filters
  let isChecked = true;
  let randomValue = 0;
  let queryValue = '';

  const myPicsCheck = document.querySelector('#check-my-pics');
  const randomInput = document.querySelector('#random-input');
  const unsplashSearch = document.querySelector('#unsplash-search-input');

  const unsplashApply = document.querySelector('#unsplash-apply-btn');

  myPicsCheck.addEventListener('change', () => {
    if (isChecked == false) {
      randomInput.value = '';
      unsplashSearch.value = '';
    }

    isChecked = !isChecked;
    console.log(isChecked);
  });

  randomInput.addEventListener('input', (e) => {
    if (isChecked === true) {
      randomInput.value = '';
    } else {
      randomValue = e.target.value;
      unsplashSearch.value = '';
      queryValue = '';
    }
    console.log(randomValue);
  });

  unsplashSearch.addEventListener('input', (e) => {
    if (isChecked === true) {
      unsplashSearch.value = '';
    } else {
      queryValue = e.target.value;
      randomInput.value = '';
      randomValue = 0;
    }
    console.log(queryValue);
  });

  unsplashApply.addEventListener('click', async () => {
    if (isChecked == true) {
      console.log('get my pics');
      const res = await fetch(
        `https://api.unsplash.com/users/${username}/photos`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );

      const data = await res.json();
      renderFilteredPics(data);
    } else if (randomValue > 0 && randomValue < 31) {
      console.log('get random pics');

      const res = await fetch(
        `https://api.unsplash.com/photos/random?count=` + randomValue,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );

      const data = await res.json();

      renderFilteredPics(data);
    } else if (queryValue !== '') {
      console.log('get searched image');

      const res = await fetch(
        'https://api.unsplash.com/search/photos?query=' + queryValue,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );

      const data = await res.json();

      console.log(data);

      renderFilteredPics(data.results);
    } else {
      console.log('wrong input');
    }
  });
})();
