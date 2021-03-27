import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as fs from "fs";
import * as p from "path";
import {URL} from "url";

const server = http.createServer();
const publicDir = p.resolve(__dirname, 'public'); // relative 表示拼接两个路径， __dirname: 表示当前文件绝对路径
let cacheAge = 3600 * 24 * 365; // 将文件缓存时间调至 1 年

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const {method, url: path, headers} = request;

  // 此处参考：https://nodejs.org/docs/latest-v12.x/api/http.html#http_message_url
  const {pathname, search} = new URL(path, `http://${headers.host}`);

  if (method !== 'GET') {
    response.statusCode = 405;
    response.end('这是一个假响应');
    return;
  }

  let filename = pathname.substr(1);
  if (filename === '') {
    filename = 'index.html';
  }
  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error) {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      if (error.errno === -4058) {
        response.statusCode = 404;
        fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
          response.end(data);
        });
      } else if (error.errno === -4068) {
        response.statusCode = 403;
        response.end('没有权限访问该目录');
      } else {
        response.statusCode = 500;
        response.end('服务器繁忙，请稍后再试');
      }
    } else {
      response.setHeader('Cache-Control', `public, max-age=${cacheAge}`);
      response.end(data);
    }
  });
});

// 监听本地 8888 端口
server.listen(8888);