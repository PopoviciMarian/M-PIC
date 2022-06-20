let Router = require('../utils/router');
let imageController = require('../controller/image');

let router = new Router();
router.post('/api/image/upload', imageController.upload.bind(imageController));
router.get("/api/images/public", imageController.getPublicImages.bind(imageController));
router.get("/api/images/private", imageController.getPrivateImages.bind(imageController));
router.delete("/api/images/delete", imageController.deleteImage.bind(imageController));
router.get("/api/images/getbyid", imageController.getImageById.bind(imageController));
router.get("/api/images/search", imageController.search.bind(imageController));
module.exports = router;
