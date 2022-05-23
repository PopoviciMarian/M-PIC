let userModel = require('../model/user')
let userView = require("../view/user")

class UserController {

    async register(req, res, body){
        let modelRes = await userModel.saveUser(body);
        userView.registerView(res, modelRes);
        res.end();
    }

    async login(req, res, body){
        let modelRes = await userModel.loginUser(body);
        userView.loginView(res, modelRes);
        res.end();
    }

    async delete(req, res, body){
        let modelRes = await userModel.deleteUser(req);
        userView.deleteView(res, modelRes);
        res.end();
    }
    async update(req, res, body){
        let modelRes = await userModel.updateUser(req, body);
        userView.updateView(res, modelRes);
        res.end();
    }
    async read(req, res, body){
        let modelRes = await userModel.readUser(req);
        userView.readView(res, modelRes);
        res.end();
    }
}


let apiController = new UserController();



module.exports = apiController;