
class UnsplashView{
    getAccessToken(res, content){
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
    getImages(res, content){
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']['photos']}));
    }
}

let view = new UnsplashView();

module.exports = view;