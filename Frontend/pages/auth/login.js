// import isAuth from '../../utils/isAuth.js';

// (async () => {
//   if (isAuth()) {
//     window.location.href = 'http://127.0.0.1:5501/pages/auth/profile.html';
//     return;
//   }

//   const form = document.querySelector('#login-form');

//   const loginUser = async (user) => {
//     const res = await fetch('http://109.74.194.74:8801/api/user/login', {
//       method: 'POST',
//       body: JSON.stringify({
//         email: user.email,
//         password: user.password
//       })
//     });
//     const data = await res.json();

//     localStorage.setItem('token', JSON.stringify(data.message.access_token));
//     localStorage.setItem('email', JSON.stringify(user.email));
//     localStorage.setItem('date', JSON.stringify(new Date(Date.now())));

//     if (res.ok) alert('Logged in succesfully');
//     else {
//       alert('Something went wrong !');
//       return;
//     }

//     window.location.href = 'http://127.0.0.1:5501/index.html';
//   };

//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const user = {
//       email: form.elements['email'].value,
//       password: form.elements['password'].value
//     };

//     await loginUser(user);
//   });
// })();
