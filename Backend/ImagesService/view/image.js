require('dotenv').config();

class ImageView{
    uploadView(res, content){
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
    getPublicImages(res, content){
        for(var img of content['message']){
            img['img_url'] = `http://${process.env.IMAGES_HOST}:${process.env.IMAGES_PORT}/uploads/${img['image_id']}.${img['file_type']}`
            img['insert_date'] = new Date(img['insert_date'] * 1000)
            delete img['file_type']
        }
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
    getPrivateImages(res, content){
        for(var img of content['message']){
            img['img_url'] = `http://${process.env.IMAGES_HOST}:${process.env.IMAGES_PORT}/uploads/${img['image_id']}.${img['file_type']}`
            img['insert_date'] = new Date(img['insert_date'] * 1000)
            delete img['file_type']
        }
     
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
    deleteImageView(res, content){
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
}

let view = new ImageView();

module.exports = view;