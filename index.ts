import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as fs from "fs";
import * as p from "path";
import * as url from "url";

const server = http.createServer();
// relative 表示拼接两个路径， __dirname: 表示当前文件绝对路径
const publicDir = p.resolve(__dirname, 'public')

// 每次请求，都会触发箭头函数
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const { method, url: path, headers } = request
  const { pathname, search } = url.parse(path) // 获取不带查询参数的路径，及查询参数

  switch(pathname) {
    case '/index.html':
      fs.readFile(p.resolve(publicDir, 'index.html'), (error, data)=>{
        if (error) throw error
        response.end(data.toString())
      })
      break;
    case '/style.css':
      response.setHeader('Content-Type', 'text/css; charset=utf-8');
      fs.readFile(p.resolve(publicDir, 'style.css'), (error, data)=>{
        if (error) throw error
        response.end(data.toString())
      })
      break;
    case '/main.js':
      response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
      fs.readFile(p.resolve(publicDir, 'main.js'), (error, data)=>{
        if (error) throw error
        response.end(data.toString())
      })
      break;
    default:
      response.statusCode = 404
      response.end()
  }
});

// 监听本地 8888 端口
server.listen(8888);