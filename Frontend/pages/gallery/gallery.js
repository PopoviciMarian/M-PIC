import isAuth from '../../utils/isAuth.js';
import { renderPublicItem } from './components/html/html_public_item.js';
import { renderPrivateItem } from './components/html/html_private_item.js';
(async () => {
  const items = [];
  const container = document.querySelector('.gallery-wrapper');
  const title = document.querySelector('#gallery-title');

  const parser = (item_html, id) => {
    const parser = new DOMParser();
    const content = parser
      .parseFromString(item_html, 'text/html')
      .querySelector('.' + id);

    return content;
  };

  if (!isAuth()) {
    console.log('before');
    const res = await fetch('http://178.79.141.216:8803/api/images/public', {
      method: 'GET'
    });
    const data = await res.json();
    items.push(...data.message);

    items.reverse().forEach((item) => {
      const item_html = renderPublicItem(
        item.username,
        item.img_url,
        item.likes | 0,
        item.shares | 0,
        item.image_id
      );

      const content = parser(item_html, 'public-item');
      container.appendChild(content);
    });

    title.innerHTML = 'Public Feed';

    return;
  }

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  console.log('stop');
  if (urlParams.has('code') || urlParams.has('oauth_token')) return;

  const token = JSON.parse(localStorage.getItem('token'));

  const res = await fetch('http://178.79.141.216:8803/api/images/private', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });

  const data = await res.json();
  console.log(data);
  [...data.message].forEach((img) => {
    if (img.is_private === true) {
      items.push(img);
    }
  });
  console.log(items);

  items.reverse().forEach((item) => {
    const item_html = renderPrivateItem(
      // item.username,
      item.img_url,
      item.likes | 0,
      item.shares | 0,
      item.image_id
    );
    const content = parser(item_html, 'private-item');
    container.appendChild(content);
  });

  title.innerHTML = 'Your Feed';

  const social_filters_html = await import(
    './components/html/html_social_filters.js'
  );
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

  const applyMPicBtn = document.querySelector('#apply-mpic-btn');
  const privacySelect = document.querySelector('#privacy-select');
  const mPicQueryInput = document.querySelector('#mpic-search-input');

  let privacyStatus = '';
  let queryInput = '';

  privacySelect.addEventListener('change', (e) => {
    privacyStatus = e.target.value;
    queryInput = '';
    mPicQueryInput.value = '';
  });

  mPicQueryInput.addEventListener('input', (e) => {
    queryInput = e.target.value;
    privacyStatus = '';
  });

  applyMPicBtn.addEventListener('click', async () => {
    if (queryInput == '' && privacyStatus !== '') {
      console.log(privacyStatus);

      const res = await fetch(
        'http://178.79.141.216:8803/api/images/' + privacyStatus,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      const data = await res.json();

      const items = [];
      items.push(...data.message);
      container.innerHTML = '';

      console.log(items);

      items.reverse().forEach((item) => {
        if (privacyStatus === 'public') {
          const item_html = renderPublicItem(
            item.username,
            item.img_url,
            item.likes | 0,
            item.shares | 0,
            item.image_id
          );
          const content = parser(item_html, 'public-item');
          container.appendChild(content);
        } else if (privacyStatus === 'private') {
          if (item.is_private === true) {
            const item_html = renderPrivateItem(
              item.img_url,
              item.likes | 0,
              item.shares | 0,
              item.image_id
            );

            const content = parser(item_html, 'private-item');
            container.appendChild(content);
          }
        }
      });
      const editBtns = document.querySelectorAll('.edit');

      editBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.target.id;
          window.location.href = '../../pages/editor/editor.html?id=' + id;
        });
      });
    }
  });

  console.log(applyMPicBtn, privacySelect);

  const mpicBtn = document.querySelector('.mpic-btn');

  mpicBtn.addEventListener('click', async () => {
    const token = JSON.parse(localStorage.getItem('token'));

    const res = await fetch('http://178.79.141.216:8803/api/images/private', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    });

    const data = await res.json();
    console.log(data);
    [...data.message].forEach((img) => {
      if (img.is_private === true) {
        items.push(img);
      }
    });
    console.log(items);

    items.reverse().forEach((item) => {
      const item_html = renderPrivateItem(
        // item.username,
        item.img_url,
        item.likes | 0,
        item.shares | 0,
        item.image_id
      );
      const content = parser(item_html, 'private-item');
      container.innerHTML = '';
      container.appendChild(content);
    });

    title.innerHTML = 'Your Feed';
  });

  const unsplashLoginBtn = document.querySelector('.unsplash-btn');
  unsplashLoginBtn.addEventListener('click', () => {
    location.href =
      'https://unsplash.com/oauth/authorize?client_id=RUKYUnMEMgpNhG6iBbkAG6x_ctw2Uv_Bu7ksTR-sGSU&redirect_uri=http%3A%2F%2F127.0.0.1%3A5501%2Fpages%2Fgallery%2Fgallery.html&response_type=code&scope=public+read_user+write_user+read_photos+write_photos+write_likes+write_followers+read_collections+write_collections';
  });

  const twitterLoginBtn = document.querySelector('#twitter-login-btn');
  console.log(twitterLoginBtn);
  twitterLoginBtn.addEventListener('click', () => {
    window.location.href = localStorage.getItem('twitterURL');
  });
})();
