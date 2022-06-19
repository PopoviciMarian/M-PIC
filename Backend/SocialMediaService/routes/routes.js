let Router = require('../utils/router');
let facebookController = require('../controller/facebook');
let unsplashController = require('../controller/unsplash');
let twitterController  = require('../controller/twitter');

let router = new Router();
router.get('/api/user/facebook/images', facebookController.register.bind(facebookController));
router.get('/api/user/unsplash/access_token1', unsplashController.getAccessToken.bind(unsplashController));
router.get('/api/user/unsplash/images', unsplashController.getImages.bind(unsplashController));
router.get('/api/user/twitter/oauthtoken', twitterController.getOAuthToken.bind(twitterController));
router.get('/api/user/twitter/access_token', twitterController.getAccessToken.bind(twitterController));
module.exports = router;
