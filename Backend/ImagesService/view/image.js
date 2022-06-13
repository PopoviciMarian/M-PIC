
class ImageView{
    uploadView(res, content){
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
    getPublicImages(res, content){
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
    getPrivateImages(res, content){
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
}

let view = new ImageView();

module.exports = view;