const pool = require("../db");
const request = require('request');
const { compareSync } = require("bcrypt");

require('dotenv').config();


function doRequest(url) {
    return new Promise(function (resolve, reject) {
      request(url, function (error, res, body) {
            resolve(body);
      });
    });
  }
  


class UnsplashModel{
    async getAccessToken(req, body){
        let code = new URLSearchParams(req.url).get('/api/user/unsplash/access_token1?code');
        console.log(code)
        const options = {
            method: 'POST',
            url: 'https://unsplash.com/oauth/token', 
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                grant_type : "authorization_code",
                client_id: process.env.UNSPLASH_ACCESS_KEY,
                client_secret: process.env.UNSPLASH_SECRET_KEY,
                redirect_uri : "http://localhost:8893/api/user/unsplash/access_token1",
                code : code
            })
        }
        const response = await doRequest(options);
        console.log(response);
        return {code : 200, message:JSON.parse(response)}
    }
    async getImages(req, body){
        console.log(body['unsplash_token'])

        const options = {
            method :"GET",
            url : "https://api.unsplash.com/me",
            headers:{
                'Authorization': `Bearer ${body['unsplash_token']}`
            }
        }
        const response = await doRequest(options);
        return {code : 200, message:JSON.parse(response)}
    }
}

let model = new UnsplashModel();

module.exports = model;