// const isAuth = () => {
//   const token = JSON.parse(localStorage.getItem('token'));

//   if (token) {
//     const loggedInAt = new Date(JSON.parse(localStorage.getItem('date')));

//     if ((Date.now() - loggedInAt) / 1000 / 60 / 60 > 1) {
//       localStorage.removeItem('token');
//       return false;
//     } else {
//       return true;
//     }
//   } else {
//     return false;
//   }
// };

// export default isAuth;
