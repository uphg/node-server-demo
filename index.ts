import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";

const server = http.createServer();

// 每次请求，都会触发箭头函数
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  console.log('request.method');
  console.log(request.method);
  console.log('request.url');
  console.log(request.url);
  console.log('request.headers');
  console.log(request.headers);

  const array = []
  request.on('data', (chunk) => {
    array.push(chunk)
  })
  request.on('end', () => {
    const body = Buffer.concat(array).toString()
    console.log('body')
    console.log(body);

    response.statusCode = 404
    response.setHeader('T-avengers', `I'm Iron Man`)
    response.write('1\n')
    response.write('2\n')
    response.write('3\n')
    response.end(); // 结束相应
  })
});

// 监听本地 8888 端口
server.listen(8888);