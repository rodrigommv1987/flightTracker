const request = require('request');

class Request {

    static getProxiedRequest() {

        if (Request.proxyEnabled) {
            var proxyUrl = "http://178.219.171.43:45637";
            // var proxyUrl = "http://91.186.212.97:8080";

            return request.defaults({ 'proxy': proxyUrl });
        }
        else {
            return request;
        }
    }

    static request(params, cb) {
        const request = Request.getProxiedRequest(); 
        request(params,cb);
    }
}

Request.proxyEnabled = 0;

module.exports = Request;    