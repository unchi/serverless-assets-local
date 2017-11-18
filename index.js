"use strict";

const Server = require('./server');

class ServerlessAssetsLocal {

  constructor(serverless, options) {

    this.serverless = serverless;
    this.service = serverless.service;
    this.options = options;
    this.provider = 'aws';
    this.client = null;

    this.commands = {
      assets: {
        start: {
          usage: 'Start Assets local server.',
          lifecycleEvents: ['startHandler'],
          options: {
            port: {
              shortcut: 'p',
              usage: 'The port number that Assets will use to communicate with your application. If you do not specify this option, the default port is 8080',
            },
            originPath: {
              shortcut: 'o',
              usage: ''
            },
            directory: {
              shortcut: 'd',
              usage: 'The directory where Assets directory.',
            },
            noStart: {
              shortcut: 'n',
              default: false,
              usage: 'Do not start Assets local (in case it is already running)',
            },
            cors: {
              shortcut: 'c',
              usage: 'Enable CORS',
            },
           // host: {},
           // key: {},
           // cert: {},
           // pfx: {},
          },
        },
      },
    };
    this.hooks = {
      'assets:start:startHandler': this.startHandler.bind(this),
      'before:offline:start:init': this.startHandler.bind(this),
      'before:offline:start': this.startHandler.bind(this),
      'before:offline:start:end': this.endHandler.bind(this),
    };
  }

  startHandler() {
    return new Promise((resolve, reject) => {
      const config = (this.serverless.service.custom && this.serverless.service.custom.assets) || {};
      const options = Object.assign({}, this.options, config);

      const hostname = options.host || "localhost";
      const port = options.port || "8080";
      const dirPath = options.directory || './assets';
      const originPath = options.originPath || '/';
      const cors = options.cors || false;

      if (options.noStart) {
        return resolve();
      }

      this.client = new Server({
        hostname: hostname,
        port: port,
        originPath: originPath,
        directory: dirPath,
        cors: cors,
        key: options.key,
        cert: options.cert,
        pfx: options.pfx,
      }).serve((err, assetsHost, assetsPort) => {
        if (err) {
          console.error('Error occurred while starting Assets local.');
          return reject(err);
        }
        console.log(`Assets local started ( port:${assetsPort} )`);
        resolve();
      });

    });
  }

  endHandler() {
    if (this.options.noStart) return;

    this.client.close();
    console.log('Assets local closed');
  }

};

module.exports = ServerlessAssetsLocal;
