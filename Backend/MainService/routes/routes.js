let Router = require('../utils/router');
let userController = require('../controller/user');

let router = new Router();
router.post('/api/user/register', userController.register.bind(userController));

module.exports = router;
