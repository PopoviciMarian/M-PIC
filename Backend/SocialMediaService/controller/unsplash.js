let unsplashModel = require('../model/unsplash')
let unsplashView = require("../view/unsplash")

class UnsplashController {

    async getAccessToken(req, res, body){
        let modelRes = await unsplashModel.getAccessToken(req, body);
        unsplashView.getAccessToken(res, modelRes);
        res.end();
    }
    async getImages(req, res, body){
        let modelRes = await unsplashModel.getImages(req, body);
        unsplashView.getImages(res, modelRes);
        res.end();
    }
}

let apiController = new UnsplashController();



module.exports = apiController;