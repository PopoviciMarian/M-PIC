
class FacebookView{
    registerView(res, content){
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
}

let view = new FacebookView();

module.exports = view;