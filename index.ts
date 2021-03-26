import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as fs from "fs";
import * as p from "path";
import * as url from "url";
import { URL } from "url"

const server = http.createServer();
// relative 表示拼接两个路径， __dirname: 表示当前文件绝对路径
const publicDir = p.resolve(__dirname, 'public');
let cacheAge = 3600 * 24 * 100;
// 每次请求，都会触发箭头函数
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const {method, url: path, headers} = request;
  // const myURL = new URL(path)
  // console.log(myURL.hash)
  const {pathname, search} = url.parse(path); // 获取不带查询参数的路径，及查询参数

  if (method !== 'GET') {
    response.statusCode = 405
    response.end('这是一个假响应')
    return;
  }

  let filename = pathname.substr(1);
  // response.setHeader('Content-Type', 'text/css; charset=utf-8');
  if (filename === '') {
    filename = 'index.html'
  }
  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error) {
      if (error.errno === -4058) {
        response.statusCode = 404;
        fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
          response.end(data);
        });
      } else if (error.errno === -4068) {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.statusCode = 403;
        response.end('没有权限访问该目录');
      } else {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.statusCode = 500;
        response.end('服务器烦啊，请稍后再试');
      }
    } else {
      response.setHeader('Cache-Control', `public, max-age=${cacheAge}`)
      response.end(data);
    }
  });
});

// 监听本地 8888 端口
server.listen(8888);