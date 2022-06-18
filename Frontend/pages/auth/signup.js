import isAuth from '../../utils/isAuth.js';

(() => {
  if (isAuth()) {
    window.location.href = 'http://127.0.0.1:5501/pages/auth/profile.html';
    return;
  }

  const form = document.querySelector('#signup-form');

  const validatePassword = (password, confirmPassword) => {
    const regex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);

    if (password.match(regex) === null) return -1;
    if (password !== confirmPassword) return 1;

    return 0;
  };

  const validateEmail = (email) => {
    const regex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (email.toLowerCase().match(regex) === null) return false;
    return true;
  };

  const registerUser = async (user) => {
    const res = await fetch('http://109.74.194.74:8801/api/user/register', {
      method: 'POST',
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password: user.password
      })
    });
    if (res.ok) alert('Registered succesfully');
    else alert('Something went wrong !');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = {
      name: form.elements['name'].value,
      email: form.elements['email'].value,
      password: form.elements['password'].value,
      confirmPassword: form.elements['confirm-password'].value
    };

    if (!user.name) alert('Invalid name !');
    else if (!validateEmail(user.email)) alert('Invalid email !');
    else if (validatePassword(user.password, user.confirmPassword) === -1)
      alert('Invalid password format !');
    else if (validatePassword(user.password, user.confirmPassword) === 1)
      alert("Passwords don't match !");

    await registerUser(user);
  });
})();
