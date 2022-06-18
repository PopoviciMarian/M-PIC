let Router = require('../utils/router');
let facebookController = require('../controller/facebook');
let unsplashController = require('../controller/unsplash');


let router = new Router();
router.get('/api/user/facebook/images', facebookController.register.bind(facebookController));
router.get('/api/user/unsplash/access_token1', unsplashController.getAccessToken.bind(unsplashController));
router.get('/api/user/unsplash/images', unsplashController.getImages.bind(unsplashController));

module.exports = router;
