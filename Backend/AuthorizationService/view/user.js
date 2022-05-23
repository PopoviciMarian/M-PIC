
class UserView{
    registerView(res, content){
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }

    loginView(res, content){
        res.statusCode =  content["code"];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({"message" : content['message']})); 
    }

    deleteView(res, content){
        res.statusCode =  content["code"];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({"message" : content['message']})); 
    }
    
    updateView(res, content){
        res.statusCode =  content["code"];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({"message" : content['message']})); 
    }

    readView(res, content){
        res.statusCode =  content["code"];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({"message" : content['message']})); 
    }
}

let view = new UserView();

module.exports = view;