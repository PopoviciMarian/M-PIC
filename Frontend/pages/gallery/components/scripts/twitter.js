import isAuth from '../../../../utils/isAuth.js';
import { renderUnsplashItem } from '../html/html_unsplash_item.js';
import {renderPrivateItem} from '../html/html_private_item.js'

(async () => {
  if (!isAuth()) return;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.get('oauth_token') === null) {
    const res = await fetch(
      'http://109.74.194.74:8893/api/user/twitter/oauthtoken'
    );
    const data = await res.json();

    if (!localStorage.getItem('twitterToken')) {
    }
    const url = data.message.url;
    const twitterToken = data.message.oauth_token;

    localStorage.setItem('twitterURL', url);
    localStorage.setItem('twitterToken', twitterToken);
    const twitterLoginBtn = document.querySelector('#twitter-login-btn');
    console.log(twitterLoginBtn);
    twitterLoginBtn.addEventListener('click', () => {
      window.location.href = localStorage.getItem('twitterURL');
    });
  } else {
    const twitterVerifier = urlParams.get('oauth_verifier');
    localStorage.setItem('twitterVerifier', twitterVerifier);

    const res = await fetch(
      'http://109.74.194.74:8893/api/user/twitter/access_token',
      {
        method: 'GET',
        headers: {
          twitter_oauth_token: localStorage.getItem('twitterToken'),
          code: localStorage.getItem('twitterVerifier')
        }
      }
    );
    const data = await res.json();

    console.log(data);
    localStorage.setItem('twitterUserId', data.message);
    console.log('twitter');

    // parser
    const parser = (item_html, id) => {
      const parser = new DOMParser();
      const content = parser
        .parseFromString(item_html, 'text/html')
        .querySelector('.' + id);

      return content;
    };

    const title = document.querySelector('#gallery-title');
    title.innerHTML = 'Your Feed';

    const social_filters_html = await import('../html/html_social_filters.js');
    const content = parser(social_filters_html.default, 'social-filters');

    const filtersPlace = document.querySelector('#gallery-title');

    filtersPlace.insertAdjacentElement('afterEnd', content);

    const twitterLoginBtn = document.querySelector('#twitter-login-btn');
    console.log(twitterLoginBtn);
    twitterLoginBtn.addEventListener('click', () => {
      window.location.href = localStorage.getItem('twitterURL');
    });

    // twitter photos request
    console.log('xxx');
    const tRes = await fetch(
      'http://109.74.194.74:8893/api/user/twitter/get_twitter_images',
      {
        headers: {
          user_id: localStorage.getItem('twitterUserId')
        }
      }
    );

    const twitterData = await tRes.json();
    const photosData = [...twitterData.message];

    // render filtered pics
    const photos = [];

    photosData.forEach((p) => {
      photos.push({
        username: '@' + (p.text.split('@')[1] || 'unknown'),
        src: p.url,
        likes: p.public_metrics.like_count,
        shares: p.public_metrics.retweet_count,
        id: p.url
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

    const editBtns = document.querySelectorAll('.edit');

    editBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.target.id;
        window.location.href =
          '../../pages/editor/editor.html?id=' + id + '&type=unsplash';
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

    //mpic
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
      const items = [];
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
  }
})();
