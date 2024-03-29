const pool = require("../db");
const request = require('request');
const { JsonWebTokenError } = require("jsonwebtoken");
const TwitterApi = require('twitter-api-v2').TwitterApi;

require('dotenv').config();


function doRequest(url) {
    return new Promise(function (resolve, reject) {
      request(url, function (error, res, body) {
            resolve(body);
      });
    });
  }
  


class TwitterModel{
    async getOAuthToken(req, body){
        try {
          const client = new TwitterApi({ appKey: process.env.TWITTER_CONSUMER_KEY, appSecret: process.env.TWITTER_SECRET_KEY });
          const authLink = await client.generateAuthLink("http://127.0.0.1:5501/pages/gallery/gallery.html");
          console.log(authLink);
          return {code: 200, message: authLink};
        }catch(error){
          return {code : 500, message : error.message };
        }
    }
    async getAccessToken(req, body){
      try {
        console.log(req.headers.code)
        const code = req.headers.code;
        const twitter_oauth_token = req.headers.twitter_oauth_token;
        console.log(code)
        console.log(twitter_oauth_token);

        const UrlLink = `https://api.twitter.com/oauth/access_token?oauth_token=${twitter_oauth_token}&oauth_verifier=${code}`
        var options = {
          'method': 'GET',
          'url': UrlLink, 
          'headers': {
            
          }
      };
        
        const res = await doRequest(options);
        let text = res.split('&')[2].split('=')[1]; 

        return {code: 200, message: text};
      }catch(error){
        return {code : 500, message : error.message };
      }
    }

    async getTwitterImages(req, body){
      const user_id = req.headers.user_id;
      const UrlLink = `https://api.twitter.com/2/users/${user_id}/tweets?tweet.fields=attachments,public_metrics,text&expansions=attachments.media_keys&media.fields=alt_text,media_key,public_metrics,url&user.fields=description`

      var options = {
        'method': 'GET',
        'url': UrlLink, 
        'headers': {
          'Authorization': `Bearer ${process.env.TWITTER_BEARER_KEY}`
        }
        }
      const res = await doRequest(options);
      
      
      return {code: 200, message: JSON.parse(res)};
    }catch(error){
      return {code : 500, message : error.message };
    }
 }

let model = new TwitterModel();

module.exports = model;