const isAuth = () => {
  const token = JSON.parse(localStorage.getItem('token'));

  if (token) {
    // TODO: place in "user profile" page
    // const res = await fetch('http://109.74.194.74:8801/api/user/read', {
    //   method: 'GET',
    //   headers: {
    //     Authorization: 'Bearer ' + token
    //   }
    // });
    // const data = await res.json();
    // console.log(data);

    const loggedInAt = new Date(JSON.parse(localStorage.getItem('date')));

    if ((Date.now() - loggedInAt) / 1000 / 60 / 60 > 1) {
      localStorage.removeItem('token');
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

export default isAuth;
