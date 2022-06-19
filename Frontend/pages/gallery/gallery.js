import isAuth from '../../utils/isAuth.js';
import { renderPublicItem } from './components/html/html_public_item.js';
(async () => {
  if (!isAuth()) {
    const container = document.querySelector('.gallery-wrapper');
    const items = [];

    const res = await fetch('http://178.79.141.216:8803/api/images/public', {
      method: 'GET'
    });
    const data = await res.json();
    items.push(...data.message);

    console.log(items);

    items.forEach((item) => {
      const item_html = renderPublicItem(
        item.username,
        item.img_url,
        item.likes,
        item.shares
      );
      const parser = new DOMParser();
      const content = parser
        .parseFromString(item_html, 'text/html')
        .querySelector('#public-item');

      container.appendChild(content);
    });

    return;
  }

  const res = await fetch('http://178.79.141.216:8803/api/images/private', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });
  const data = await res.json();

  console.log(data);
})();
