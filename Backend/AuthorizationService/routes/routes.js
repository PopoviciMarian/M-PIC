let Router = require('../utils/router');
let userController = require('../controller/user');

let router = new Router();
router.post('/api/user/register', userController.register.bind(userController));
router.post('/api/user/login', userController.login.bind(userController));
router.delete('/api/user/delete', userController.delete.bind(userController));
router.patch('/api/user/update', userController.update.bind(userController));
router.get('/api/user/read', userController.read.bind(userController));

module.exports = router;
