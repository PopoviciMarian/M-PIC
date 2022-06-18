const { randomFillSync } = require('crypto');
const fs = require('fs');
const path = require('path');
const busboy = require('busboy');
const pool = require("../db")
var request = require('request');
require('dotenv').config();

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
            let token = '';
            for(var header of req['rawHeaders']){
                if(header.startsWith("Bearer ")){
                    token = header.slice(7)
                    break
                }
            }
            if(token === ''){
                return {code: 400, message : "Access token is missing!"}
            }
            var options = {
                'method': 'GET',
                'url': process.env.VALIDATE_TOKEN_URL, 
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
        var file_type = ""
        let image_type = new URLSearchParams(req.url).get('/api/image/upload?type');
        if(image_type !== 'private' && image_type !== 'public'){
            return {code : 400, message : "type must be private or public!"}
        }
        
        const bb = busboy({ headers: req.headers });
        bb.on('file', (name, file, info) => {
            file_type = info.filename.split(".").pop();
            const saveTo = path.join("./uploads", `${image_id}.${file_type}`);
            file.pipe(fs.createWriteStream(saveTo));
            var date = Math.round(Date.now() / 1000);
            var dbRes =  pool.query("INSERT INTO images (image_id, owner_id, is_private, insert_date, file_type) VALUES ($1, $2, $3, $4, $5)", [image_id, user_id, image_type === 'private', date, file_type])
        });
        req.pipe(bb);
        return {code : 201, message: "Image saved!"}
    }

    async getPublicImages(){
        try{
        var images = await pool.query("SELECT image_id, name as username, email, insert_date, file_type from users JOIN images on users.id = images.owner_id where images.is_private = false");
          return {code:200,  message: images.rows}
        }
        catch(e){
            return {code : 500, message : "Database error!"}
        }
    }

    async getPrivateImages(req){
        try{
            
            let token = '';
            for(var header of req['rawHeaders']){
                if(header.startsWith("Bearer ")){
                    token = header.slice(7)
                    break
                }
            }
            if(token === ''){
                return {code: 400, message : "Access token is missing!"}
            }
            var options = {
                'method': 'GET',
                'url': process.env.VALIDATE_TOKEN_URL, 
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
        const images = (await pool.query("SELECT image_id, insert_date, file_type, is_private FROM images WHERE owner_id = $1", [user_id])).rows
        return {code : 200, message: images}
        }
        catch(error){
            return {code : 500, message : error.message}
        }
    }

    async deleteImage(req){
        try{
            let token = '';
            for(var header of req['rawHeaders']){
                if(header.startsWith("Bearer ")){
                    token = header.slice(7)
                    break
                }
            }
            if(token === ''){
                return {code: 400, message : "Access token is missing!"}
            }
            var options = {
                'method': 'GET',
                'url': process.env.VALIDATE_TOKEN_URL, 
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
            let image_id = new URLSearchParams(req.url).get('/api/images/delete?image_id');
            const idRes = await pool.query("SELECT owner_id FROM images WHERE image_id = $1", [image_id])
            if ('rows' in idRes && idRes.rows.length > 0){
                if(idRes.rows[0].owner_id !== user_id){
                    return {code: 403, message: "Only the image owner can delete it!"}
                }
                pool.query("DELETE FROM images WHERE image_id = $1", [image_id])
                return {code: 200, message: "Image deleted!"}
            }else{
                return {code : 400, message: `Could not find image owner with id ${image_id}`}
            }
            
        }  catch(error){
            return {code : 500, message : error.message}
        }
    }
}

let model = new ImageModel();

module.exports = model;