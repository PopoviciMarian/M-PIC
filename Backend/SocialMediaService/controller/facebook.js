let facebookModel = require('../model/facebook')
let facebookView = require("../view/facebook")

class FacebookController {

    async register(req, res, body){
        let modelRes = await facebookModel.saveFacebook(req, body);
        facebookView.registerView(res, modelRes);
        res.end();
    }
}

let apiController = new FacebookController();



module.exports = apiController;