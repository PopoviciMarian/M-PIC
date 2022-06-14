let url = require('url');

class Router{
    constructor(){
        this.routes = [];
    }

    get(path, controller, args){
        this.routes.push({
            path: path,
            controller: controller,
            args,
            method: 'GET'
        });
    }

    post(path, controller, args){
        this.routes.push({
            path: path,
            controller: controller,
            args,
            method: 'POST'
        });
    }

    patch(path, controller, args){
        this.routes.push({
            path: path,
            controller: controller,
            args,
            method: 'PATCH'
        });
    }

    delete(path, controller, args){
        this.routes.push({
            path: path,
            controller: controller,
            args,
            method: 'DELETE'
        });
    }

    reject(res){
        res.writeHead(404);
        res.write('Not found');
        res.end();
    }

    callRoute(req, res){
        let body = '';
       
        
        for (let route of this.routes){
            let _url = url.parse(req.url, true);
            if (route.path === _url.pathname && req.method === route.method){
                if (route.args !== undefined){
                        route.controller(req, res, JSON.parse(body), ...route.args);
                }
                else {
                        try{
                            route.controller(req, res, JSON.parse(body));
                        }
                        catch(e){
                            route.controller(req, res, body);
                        } 
                }
                return;
            }
        }
        this.reject(res);
    }
}

module.exports = Router;