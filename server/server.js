// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
// var appzip = require('appmetrics-zipkin')({
//     host: 'localhost',
//     port: 9411,
//     serviceName:'frontend'
// });

const appName = require('./../package').name;
const http = require('http');
const express = require('express');
var bodyParser = require("body-parser");
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');
const axios = require('axios');

const logger = log4js.getLogger(appName);
logger.level = process.env.LOG_LEVEL || 'info'
const app = express();
const server = http.createServer(app);

var publicPath = path.join(__dirname, "../build");
console.log(publicPath);

app.use(express.static(publicPath));
app.use(bodyParser.json());

app.use(log4js.connectLogger(logger, { level: logger.level }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app, server);

// Add your code here
app.post('/test', function (req, res) {
  const headers = {
    'Content-Type': 'application/json'
  };

  res.send("Test");
});

app.post('/login', function (req, res) {
  const headers = {
    'Content-Type': 'application/json'
  };

  var params = '?params=["' + req.body.params.name + '","' + req.body.params.passwd + '"]';

  // axios.get('http://119.81.79.228:30258/mfp/api/adapters/ICICIAdapter/getAuthToken' + params, { headers: headers }
  axios.get('http://10.64.18.39:30258/mfp/api/adapters/ICICIAdapter/getAuthToken' + params, { headers: headers }
  ).then(function (response) {
    res.send(response.data);
  }).catch(function (error) {
    res.send(error);
  });
});

app.post('/getAllAccountsOfUser', function (req, res) {
  const headers = {
    'Content-Type': 'application/json'
  };

  var params = '?params=["' + req.body.params.name + '","' + req.body.params.header + '"]';

  axios.get('http://10.64.18.39:30258/mfp/api/adapters/ICICIAdapter/getAllAccountsOfUser' + params, { headers: headers })
    .then(function (response) {
      res.send(response.data);
    }).catch(function (error) {
      res.send(error);
    });
});

app.post('/getBeneficiaryForUser', function (req, res) {
  const headers = {
    'Content-Type': 'application/json'
  };
  var params = '?params=["' + req.body.params.name + '","' + req.body.params.header + '"]';

  axios.get('http://10.64.18.39:30258/mfp/api/adapters/ICICIAdapter/getBeneficiaryForUser' + params, { headers: headers })
    .then(function (response) {
      res.send(response.data);
    }).catch(function (error) {
      res.send(error);
    });
});

app.post('/fundTransfer', function (req, res) {
  const headers = {
    'Content-Type': 'application/json'
  };

  var params = '?params=["' + req.body.params.fromAcct + '","' + req.body.params.toAccnt + '","' + req.body.params.trfAmnt + '","' + req.body.params.header + '"]';

  axios.get('http://10.64.18.39:30258/mfp/api/adapters/ICICIAccountAdapter/fundTransfer' + params, { headers: headers })
    .then(function (response) {
      res.send(response.data);
    }).catch(function (error) {
      res.send(error);
    });
});

app.get("/*", (req, res) => {
  res.sendFile(publicPath + "/index.html", (err) => {
    if (err) {
      res.status(500).send(err);
    }

  });
})
// Add your code here

const port = process.env.PORT || localConfig.port;
server.listen(port, function () {
  logger.info(`icicidemo listening on http://localhost:${port}/appmetrics-dash`);
  logger.info(`icicidemo listening on http://localhost:${port}`);
});

// app.use(function (req, res, next) {
//   res.sendFile(path.join(__dirname, '../public', '404.html'));
// });

// app.use(function (err, req, res, next) {
//   res.sendFile(path.join(__dirname, '../public', '500.html'));
// });

module.exports = server;