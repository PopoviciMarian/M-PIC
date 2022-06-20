let imageModel = require('../model/image')
let imageView = require("../view/image")

class ImageController {
    async upload(req, res, body){
        let modelRes = await imageModel.saveImage(req, res);
        imageView.uploadView(res, modelRes);
        res.end();
    }
    async getPublicImages(req, res, body){
        let modelRes = await imageModel.getPublicImages();
        imageView.getPublicImages(res, modelRes);
        res.end();
    }
    async getPrivateImages(req, res, body){
        let modelRes = await imageModel.getPrivateImages(req);
        imageView.getPrivateImages(res, modelRes);
        res.end();
    }
    async deleteImage(req, res, body){
        let modelRes = await imageModel.deleteImage(req);
        imageView.deleteImageView(res, modelRes);
        res.end();
    }
    async getImageById(req, res, body){
        let modelRes = await imageModel.getImageById(req);
        imageView.getImageById(res, modelRes);
        res.end();
    }
    async search(req, res, body){
        let modelRes = await imageModel.search(req);
        imageView.search(res, modelRes);
        res.end();
    }
}


let apiController = new ImageController();
module.exports = apiController;