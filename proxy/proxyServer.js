const http = require('http');
const url = require('url');

//creating a HTTP server;
const server = http.createServer((req, res) => {
  const { hostname, path } = url.parse(req.url);
  console.log(hostname, '/', path);
  // console.timeLog('process', url.parse(req.url));

  const clientRequest = http.request(
    {
      method: req.method,
      hostname: hostname,
      path: path,
      headers: {
        Host: hostname,
      },
    },
    (clientResponse) => {
      res.writeHead(clientResponse.statusCode, clientResponse.headers);
      console.log('res', res);
      clientResponse.pipe(res);
    }
  );

  req.pipe(clientRequest);

  clientRequest.on('error', (err) => {
    console.error(err);
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    res.write(
      'request successfully proxied to port 9000!' +
        '\n' +
        JSON.stringify(req.headers, true, 2)
    );

    res.end();
  });

  res.on('close', () => {
    console.log(res);
    clientRequest.destroy();
  });
});

server.listen(9000, () => {
  console.log('Proxy server listening on port 9000');
});

// // var http = require('http');

// http.createServer(function(request, response) {

//   var proxy = http.createClient(9000, 'localhost')

//   var proxyRequest = proxy.request(request.method, request.url, request.headers);

//   proxyRequest.on('response', function (proxyResponse) {

//     proxyResponse.pipe(response);

//   });

//   request.pipe(proxyRequest);

// }).listen(8080);

// http.createServer(function (req, res) {

//   res.writeHead(200, { 'Content-Type': 'text/plain' });

//   res.write('request successfully proxied to port 9000!' + '\n' + JSON.stringify(req.headers, true, 2));

//   res.end();

// }).listen(9000);
