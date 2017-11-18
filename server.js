'use strict';

module.exports = function (options) {
  // cors
  // originPath
  // directory
  // key
  // cert
  // pfx
  // port
  // hostname

  const express = require('express');
  const https = require('https');
  const app = express();

  app.use(function (req, res, next) {

    if (options.cors) {
      if (req.method === 'OPTIONS') {
        if (req.headers['access-control-request-headers'])
          res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        if (req.headers['access-control-request-method'])
          res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
      }
      if (req.headers.origin)
        res.header('Access-Control-Allow-Origin', '*');
    }

    next();
  });

  app.use(options.originPath, express.static(options.directory));

  app.disable('x-powered-by');

  app.serve = function (done) {
    const server = ((options.key && options.cert) || options.pfx) ? https.createServer(options, app) : app;
    return server.listen(options.port, options.hostname, (err) => {
        return done(err, options.hostname, options.port, options.directory);
      }).on('error', (err) => {
        return done(err);
      });
  };

  return app;
};

