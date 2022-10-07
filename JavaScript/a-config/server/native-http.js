'use strict';

const http = require('node:http');

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST',
  'Access-Control-Allow-Headers': 'origin, content-type, accept',
  'Access-Control-Max-Age': '86400',
};

module.exports = (logger) => (routing, port) => {
  http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      const statusCode = 204;
      res.writeHead(statusCode, corsHeaders);
      res.end();
      return;
    }

    const { url, socket } = req;
    const [name, method, id] = url.substring(1).split('/');
    logger.log(`${socket.remoteAddress} ${method} ${url}`);
    const entity = routing[name];
    if (!entity) return res.end('Not found');
    const handler = entity[method];
    if (!handler) return res.end('Not found');
    const src = handler.toString();
    const signature = src.substring(0, src.indexOf(')'));
    const args = [];
    if (signature.includes('(id')) args.push(id);
    if (signature.includes('{')) args.push(await receiveArgs(req));

    const result = await handler(...args);

    const statusCode = 200;
    const body = JSON.stringify(result.rows);
    res.writeHead(statusCode, {
      ...corsHeaders,
      'Content-Length': Buffer.byteLength(body),
    }).end(body);
  }).listen(port);

  logger.log(`API on port ${port}`);
};
