const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require("../db")
var request = require('request');
var FB = require('fb').default;

function doRequest(url) {
    return new Promise(function (resolve, reject) {
      request(url, function (error, res, body) {
            body =  JSON.parse(body);
            body["statusCode"] = res.statusCode;
            resolve(body);
      });
    });
  }

  function makeFacebookPhotoURL( id, accessToken ) {
    return 'https://graph.facebook.com/' + id + '/picture?access_token=' + accessToken;
}


function getPhotosForAlbumId( albumId) {
    return new Promise(async (resolve) => {
    FB.api(
            '/'+albumId+'/photos',
            {fields:"id,link,likes.summary(1),comments.summary(1)"},
            function(albumPhotosResponse) {
                //console.log( ' got photos for album ' + albumId );
                resolve(albumPhotosResponse);
            }
        );
    })
}

function getPhotos(body){
    return new Promise(async (resolve) => {
    FB.extend({appId: process.env.FACEBOOK_APP_ID, appSecret: process.env.FACEBOOK_APP_SECRET});
    FB.setAccessToken(body['facebook_tk']);
    FB.api('me?fields=albums{id,cover_photo}', async function (res) {
        if(!res || res.error) {
         console.log(!res ? 'error occurred' : res.error);
         return;
        }
        var allPhotos = [];

        var albumResponse = res['albums']
        var i, album;
        for (i = 0; i < albumResponse.data.length; i++) {
            album = albumResponse.data[i];
            const photos  = await getPhotosForAlbumId( album.id)
            for(var facebookPhoto of photos.data){
                allPhotos.push({
                    'url'	:makeFacebookPhotoURL( facebookPhoto.id, body['facebook_tk'] ),
                    'likes' : facebookPhoto.likes.summary.total_count,
                    'comments_number' : facebookPhoto.comments.summary.total_count
                })
            }
        }
        resolve(allPhotos)
       });
    });
    
}

class FacebookModel{
    async saveFacebook(req, body){
        try{
            let token = req['rawHeaders'][1].slice(7)
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
            if(response['statusCode'] === 200){
                
                return {code: 200, message :await getPhotos(body)}
            }
        }catch(error){
            return {code : 403, message: error.message}
        }

   
     
            
        
        return {code: 500, message : "Database error!"}
    }
}

let model = new FacebookModel();

module.exports = model;