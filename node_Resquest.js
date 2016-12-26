var http = require('http');
var url = require('url');
var qs = require('querystring');
http.createServer(function(req, res) {
    // res.write('<head><meta charset="utf-8"/></head>');
    //服务端设置CORS跨域的请求头，设置为*代表响应任意请求的请求类型
    res.setHeader("Access-Control-Allow-Origin", "*");
    var resultData = '';//创建一个变量来接收返回的数据
    var query = url.parse(req.url).query;//提取出网址后面的参数
    console.info();
    var qs_parse = qs.parse(query);//把参数转换成对象
    console.info(qs_parse.myUrl);
    console.info();
    http.get(qs_parse.myUrl,function (resquest) {
        resquest.setEncoding('utf8');
        resquest.on('data',function (result) {
            // console.log(result);
            // console.info();
            resultData += result;
        });
        resquest.on('end',function () {
            var str = '';
            if (qs_parse.callback){
                str =  qs_parse.callback + '(' + JSON.stringify(resultData) + ')';//jsonp
            }else {
                str = JSON.stringify(resultData);
            }
            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
            res.end(str);
        })
    }).on('error',function (e) {
        console.log(e.message);
    })

}).listen(3000);
console.log("HTTP server is listening at port 3000.");