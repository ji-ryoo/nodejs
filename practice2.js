//モジュールを拡張機能として読み込む
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var url = 'http://api.moemoe.tokyo/anime/v1/master/2018/1?ogp=1';//取得するjsonファイル


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    hostname   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var server = http.createServer();//httpのサーバを作成するぞー、という関数

server.on('request', function(req, res) {//httpリクエストがあった(=アクセスされた)時に呼ばれる  

    http.get(url, function(apiRes) {//指定したURLが取得出来たら呼ばれる

        var body = '';
        apiRes.setEncoding('utf8');
    
        apiRes.on('data', function(chunk) {//データが受信されたら呼ばれる
            body += chunk;
        });

        apiRes.on('end', function() {//データの受信が終わったら呼ばれる
            var data = {};
            data.animes = JSON.parse(body);
            var template = fs.readFileSync('./practice2.ejs', 'utf-8');
            var page = ejs.render(template, data);
            res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
            res.write(page);
            res.end();
        });
    });
});

server.listen(port, hostname, function() {//サーバ起動時に呼ばれる
    console.log(`Server runnning at http://${hostname}:${port}/`);
});
