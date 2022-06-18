import isAuth from '../../utils/isAuth.js';
(async () => {
  if (!isAuth()) {
    document.querySelector('.gallery').innerHTML =
      '<h3 class="not-auth"><a href="../../pages/auth/login.html">Login</a> to view gallery</h3>';
    return;
  }
})();
