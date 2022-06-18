import isAuth from '../../utils/isAuth.js';
(async () => {
  if (!isAuth()) {
    document.querySelector('.gallery').innerHTML =
      '<h3 class="not-auth"><a href="../../pages/auth/login.html">Login</a> to view gallery</h3>';
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

  console.log(data);
})();
