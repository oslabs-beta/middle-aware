// const { createProxyMiddleware } = require('http-proxy-middleware');

// const options = {
//   target: 'http://localhost:5002', // Your target URL here
//   onProxyRes: (proxyRes, req, res) => {
//     // Modify the headers to prevent caching

//     delete proxyRes.headers['etag'];
//     delete proxyRes.headers['last-modified'];
//     proxyRes.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
//     proxyRes.headers["Pragma"] = "no-cache";
//     proxyRes.headers["Expires"] = 0;

//     let body = []
//     proxyRes.on('data', (data) => {
//       body.push(data);
//     });
//     proxyRes.on('end', () => {
//       const response = Buffer.concat(body).toString('utf8');
//       console.log('Request URL:', req.url);
//       console.log('Request method:', req.method);
//       console.log('Response body:', response);
//       console.log('Response status code:', proxyRes.statusCode);
//       // res.setHeader('Content-Type', 'application/json');
//       res.send();
//     });
//   },
// };

// const proxy = createProxyMiddleware(options);

// // Start server
// const express = require('express');
// const app = express();
// app.set('etag', false);
// app.use('/', proxy);
// app.listen(9000, () => {
//   console.log('Proxy server listening on port 9000');
// });

const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const app = express();
app.set('etag', false);
let startTime;
const options = {
  target: 'http://localhost:5002', // Your target URL here
  onProxyReq: (proxyReq, req, res) => {
    startTime = new Date().getTime();
  },
  onProxyRes: (proxyRes, req, res) => {
    // Modify the headers to prevent caching
    
    delete proxyRes.headers['etag'];
    delete proxyRes.headers['last-modified'];
    proxyRes.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    proxyRes.headers["Pragma"] = "no-cache";
    proxyRes.headers["Expires"] = 0;
    
    let body = []
    proxyRes.on('data', (data) => {
      body.push(data);
    });
    proxyRes.on('end', () => {
      const response = Buffer.concat(body).toString('utf8');
      const payload = {
        endpoint: req.url,
        method: req.method,
        body: response,
        statusCode: proxyRes.statusCode,
        roundTripTime: `${new Date().getTime()-startTime} ms`
      };
      console.log(payload);
      res.send();
    });
  },
};

const proxy = createProxyMiddleware(options);
// const setStartTime = (_req, _res, next) => {
//   startTime = new Date().getTime();
//   next();
// }
// Start server
app.use('**', proxy);
app.listen(9000, () => {
  console.log('Proxy server listening on port 9000');
});