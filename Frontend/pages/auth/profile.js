import isAuth from '../../utils/isAuth.js';

(async () => {
  if (!isAuth()) {
    window.location.href = './login.html';
  }

  console.log('x');
  const res = await fetch('http://109.74.194.74:8801/api/user/read', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    }
  });

  const data = await res.json();

  const user = { ...data.message };
  console.log(user);

  const welcome = document.querySelector('.welcome');
  welcome.innerHTML += ' ' + user.name;

  const name = document.querySelector('#username');
  const email = document.querySelector('#user-email');

  name.innerHTML += '  ' + user.name;
  email.innerHTML += '  ' + user.email;

  const logoutBtn = document.querySelector('#logout');

  logoutBtn.addEventListener('click', (e) => {
    localStorage.removeItem('token');
    location.reload();
  });
})();
