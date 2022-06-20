
class TwitterView{
    getOAuthToken(res, content){
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
    getAccessToken(res, content){
        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
    getTwitterImages(res, content){
        var newResult = [];
        
        if(content['code'] === 200){
            for(var i = 0; i < content.message['meta']['result_count']; i++){
                var url = 'https://about.twitter.com/content/dam/about-twitter/en/brand-toolkit/brand-download-img-1.jpg.twimg.1920.jpg'
                var media_key;
                var hasPhoto = true;
                try {
                    media_key = content.message['data'][i]['attachments']['media_keys'];
                }
                catch{
                    hasPhoto = false;
                }

                if(hasPhoto === true)
                {
                    for(var j = 0; j < content.message['meta']['result_count']; j++)
                    {
                        if(content.message['includes']['media'][j]['media_key'] == media_key) {
                            url = content.message['includes']['media'][j]['url'];
                            break;
                        }
                    }
                }
                
                const obj = {
                    text: content.message['data'][i]['text'],
                    public_metrics: content.message['data'][i]['public_metrics'],
                    url
                    
                    
                }
                newResult.push(obj);
            }
            content.message = newResult;
        }

        res.statusCode = content['code'];
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: content['message']}));
    }
}

let view = new TwitterView();

module.exports = view;