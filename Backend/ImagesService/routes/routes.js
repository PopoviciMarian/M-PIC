let Router = require('../utils/router');
let imageController = require('../controller/image');

let router = new Router();
router.post('/api/image/upload', imageController.upload.bind(imageController));
router.get("/api/images/public", imageController.getPublicImages.bind(imageController));
router.get("/api/images/private", imageController.getPrivateImages.bind(imageController));
module.exports = router;
