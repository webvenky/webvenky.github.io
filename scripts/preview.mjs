import http from 'node:http';
import handler from 'serve-handler';
http.createServer((req, res) => handler(req, res, { public: '_site', cleanUrls: true })).listen(8080, '127.0.0.1', () => console.log('Website: http://localhost:8080/ — Atlas: http://localhost:8080/embodied-ai/'));
