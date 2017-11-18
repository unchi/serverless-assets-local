serverless-assets-local
===========================

serverless-assets-local は、assets ファイルなどを別サーバーで起動するような構成をシュミレーションすることが出来ます。
serverless-offline. と共に利用してください。

view から参照する場合は、express-simple-cdn などでhostを置き換えられるようにするのがおすすめです。

Installation
===============

    npm install serverless-assets-local --save-dev

Example
===============
serverless.yaml  

    service: serverless-assets-local-example
    provider:
      name: aws
      runtime: nodejs6.10
    plugins:
      - serverless-assets-local
      - serverless-offline
    custom:
      assets:
        host: 127.0.0.1
        port: 8003
        directory: ./assets/
        originPath: /data
        cors: false
        # Uncomment only if you already have a S3 server running locally
        # noStart: true
    functions:
      webhook:
        handler: handler.webhook
        events:
          - http:
              method: GET


See also
===============
* [serverless-offline](https://github.com/dherault/serverless-offline)
* [express-simple-cdn](https://github.com/jamiesteven/express-simple-cdn)
