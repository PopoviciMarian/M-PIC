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
      .querySelector('#' + id);

    return content;
  };

  if (!isAuth()) {
    const res = await fetch('http://178.79.141.216:8803/api/images/public', {
      method: 'GET'
    });
    const data = await res.json();
    items.push(...data.message);

    items.forEach((item) => {
      const item_html = renderPublicItem(
        item.username,
        item.img_url,
        item.likes,
        item.shares
      );

      const content = parser(item_html, 'public-item');
      container.appendChild(content);
    });

    title.innerHTML = 'Your Gallery';
    return;
  }

  const token = JSON.parse(localStorage.getItem('token'));

  const res = await fetch('http://178.79.141.216:8803/api/images/private', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });

  const data = await res.json();
  items.push(...data.message);

  items.forEach((item) => {
    const item_html = renderPrivateItem(item.img_url, item.likes, item.shares);
    const content = parser(item_html, 'private-item');
    container.appendChild(content);
  });

  title.innerHTML = 'Your Feed';
})();
