let twitterModel = require('../model/twitter')
let twitterView = require("../view/twitter")

class TwitterController {
    
    async getOAuthToken(req, res, body){
        let modelRes = await twitterModel.getOAuthToken(req, body);
        twitterView.getOAuthToken(res, modelRes);
        res.end();
    }
    async getAccessToken(req, res, body){
        let modelRes = await twitterModel.getAccessToken(req, body);
        twitterView.getAccessToken(res, modelRes);
        res.end();
    } 
    async getTwitterImages(req, res, body){
        let modelRes = await twitterModel.getTwitterImages(req, body);
        twitterView.getTwitterImages(res, modelRes);
        res.end();
    } 
    
}

let apiController = new TwitterController();



module.exports = apiController;