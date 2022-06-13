const { randomFillSync } = require('crypto');
const fs = require('fs');
const path = require('path');
const busboy = require('busboy');
const pool = require("../db")
var request = require('request');

const random = (() => {
  const buf = Buffer.alloc(16);
  return () => randomFillSync(buf).toString('hex');
})();

function doRequest(url) {
    return new Promise(function (resolve, reject) {
      request(url, function (error, res, body) {
            body =  JSON.parse(body);
            body["statusCode"] = res.statusCode;
            resolve(body);
      });
    });
  }
  

class ImageModel{

    async saveImage(req, res){
        try{
            let token = req['rawHeaders'][1].slice(7)
            var options = {
                'method': 'GET',
                'url': 'http://109.74.194.74:8801/api/user/read', //TODO : de adaugat in env calea catre api-ul de auth &&  de lucrat la view
                'headers': {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
            };
            var response = await doRequest(options); 
            if(response['statusCode'] == 400){
                return {code :400, message:response['message']}
            }

        }catch(error){
            return {code : 403, message: error.message}
        }
        const user_id =  response['message']['id'];
        const image_id = random();
        let image_type = new URLSearchParams(req.url).get('/api/image/upload?type');
        if(image_type !== 'private' && image_type !== 'public'){
            return {code : 400, message : "type must be private or public!"}
        }
        const bb = busboy({ headers: req.headers });
        bb.on('file', (name, file, info) => {
            const saveTo = path.join("./uploads", `${image_id}.${info.filename.split(".").pop()}`);
            file.pipe(fs.createWriteStream(saveTo));
        });
        req.pipe(bb);
        var dbRes = await pool.query("INSERT INTO images (image_id, owner_id, is_private) VALUES ($1, $2, $3)", [image_id, user_id, image_type === 'private'])
        if(dbRes.rowCount ===1){
            return {code : 201, message: "Image saved!"}
        }
        else{
            return {code : 500, message : "Database error!"}
        }
    }

    async getPublicImages(){
        try{
        var images = await pool.query("SELECT image_id, name as username, email from users JOIN images on users.id = images.owner_id where images.is_private = false");
          return {code:200,  message: images.rows}
        }
        catch(e){
            return {code : 500, message : "Database error!"}
        }
    }

    async getPrivateImages(req){
        try{
            let token = req['rawHeaders'][1].slice(7)
            var options = {
                'method': 'GET',
                'url': 'http://109.74.194.74:8801/api/user/read',
                'headers': {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
            };
            var response = await doRequest(options); 
            if(response['statusCode'] == 400){
                return {code :400, message:response['message']}
            }

        }catch(error){
            return {code : 403, message: error.message}
        }
        try{
        const user_id =  response['message']['id'];
        const images = (await pool.query("SELECT image_id FROM images WHERE owner_id = $1", [user_id])).rows
        return {code : 200, message: images}
        }
        catch(error){
            return {code : 500, message : error.message}
        }
    }
}

let model = new ImageModel();

module.exports = model;