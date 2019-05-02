// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
// var appzip = require('appmetrics-zipkin')({
//     host: 'localhost',
//     port: 9411,
//     serviceName:'frontend'
// });

const appName = require('./../package').name;
const http = require('http');
const express = require('express');
const bodyParser = require("body-parser");
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');
const axios = require('axios');
const request = require('request');

// const SERVER = 'http://10.64.18.39:30258';
// const SERVER = 'http://119.81.79.228:30258'; // For Production.
const SERVER = 'http://159.122.237.221:30748'; // public-cloud
// const MFP_SERVER = SERVER;
// const MFP_SERVER = 'http://localhost:9080';
// const MFP_SERVER = 'http://10.64.18.39:32094'; // ICP
const MFP_SERVER = 'http://159.122.237.221:30748'; // public-cloud

const logger = log4js.getLogger(appName);
logger.level = process.env.LOG_LEVEL || 'info'
const app = express();
const server = http.createServer(app);


var publicPath = path.join(__dirname, "../build");
console.log(publicPath);

//CORS middleware
app.use('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(publicPath));
app.use(bodyParser.json());

const port = process.env.PORT || localConfig.port;

app.use(log4js.connectLogger(logger, { level: logger.level }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app, server);

// Add your code here
app.post('/test', function(req, res) {
    const headers = {
        'Content-Type': 'application/json'
    };

    res.send("Test");
});

// Reverse proxy, pipes the requests to/from MobileFirst Server
app.use('/mfp/*', function(req, res) {
    var url = MFP_SERVER + req.originalUrl;

    console.log('::: server.js ::: Passing request to URL: ' + url);
    try {
        req.pipe(request[req.method.toLowerCase()](url)).pipe(res);
    } catch (e) {
        console.log("Error during proxy call to mfp ", e);
    }
});

// app.post('/analytics-customdata', function (req, res) {
//   const headers = {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'x-mfp-analytics-api-key': 'TestIndex',
//     'Authorization': 'Basic YWRtaW46YWRtaW4='
//   };

//   // var params = '?params=["' + req.body.params.name + '","' + req.body.params.passwd + '"]';
//   var params = {
//     "customDataMap": { "Context": "ICICI-Demo - Test", "value": "Test" },
//     "serverIpAddress": "10.10.10.1",
//     "timestamp": "2019-04 - 19T21: 50: 32.371Z",
//     "timezone": "60",
//     "appVersion": "1.0.1",
//     "appName": "ICICI Demo",
//     "appVersionCode": 1,
//     "appID": "com.demo.icicibank",
//     "deviceOSversion": "",
//     "deviceModel": "",
//     "deviceBrand": "",
//     "deviceOS": "",
//     "deviceID": ""
//   }

//   console.log("analytics-service", `${MFP_SERVER}/analytics/rest/customdata`);

//   axios.post(`${MFP_SERVER}/analytics-service/rest/customdata`, params, { headers: headers }
//   ).then(function (response) {
//     res.send(response.data);
//   }).catch(function (error) {
//     res.send(error);
//   });
// });

app.post('/login', function(req, res) {
    // res.send({
    //   "userId": "sunil",
    //   "firstName": "firstName",
    //   "lastName": "lastName",
    //   "userEmailId": "userEmailId",
    //   "accessHeader": "adsasdadsdsadasdasdsad"
    // });

    const headers = {
        'Content-Type': 'application/json'
    };

    var params = '?params=["' + req.body.params.name + '","' + req.body.params.passwd + '"]';

    axios.get(`${SERVER}/mfp/api/adapters/ICICIAdapter/getAuthToken` + params, { headers: headers }).then(function(response) {
        res.send(response.data);
    }).catch(function(error) {
        res.send(error);
    });
});

app.post('/getAllAccountsOfUser', function(req, res) {
    // res.send({
    //   array: [
    //     {
    //       "_id": "07aa61b35664832bcfe7465672fdef3f",
    //       "_rev": "91-c5272096bb0dd36ba8bd4a3b3a27a8d2",
    //       "userId": "sunil",
    //       "type": "customerAccount",
    //       "accountNumber": "0386423456200",
    //       "subType": "relationship",
    //       "accountOwner": "Sunil Kapoor",
    //       "accountType": "Savings",
    //       "currentBalance": "133150",
    //       "accountLastModifyOn": "2019-02-09T10:32:30.640Z",
    //       "bank": "ICICI",
    //       "frequent": "false"
    //     },
    //     {
    //       "_id": "4e699f5bfeccad847a8348ae45154ca9",
    //       "_rev": "66-75f4888a06852cd8f2e80e3122b446a9",
    //       "userId": "sunil",
    //       "type": "customerAccount",
    //       "accountNumber": "0386423456201",
    //       "subType": "relationship",
    //       "accountOwner": "Sunil Kapoor",
    //       "accountType": "Credit",
    //       "currentBalance": "-125500",
    //       "accountLastModifyOn": "2019-02-09T10:32:30.640Z",
    //       "bank": "ICICI",
    //       "frequent": "true"
    //     }
    //   ]
    // })

    const headers = {
        'Content-Type': 'application/json'
    };

    var params = '?params=["' + req.body.params.name + '","' + req.body.params.header + '"]';

    axios.get(`${SERVER}/mfp/api/adapters/ICICIAdapter/getAllAccountsOfUser` + params, { headers: headers })
        .then(function(response) {
            res.send(response.data);
        }).catch(function(error) {
            res.send(error);
        });
});

app.post('/getBeneficiaryForUser', function(req, res) {
    // res.send({
    //   array:
    //     [
    //       {
    //         "_id": "1b3e775a097da82e0cdfa2e9d1e57094",
    //         "_rev": "22-d26459204fa0216a4c471e3dd8015bdb",
    //         "userId": "sunil",
    //         "type": "customerAccount",
    //         "beneficiariesaccounts": null,
    //         "accountNumber": "1486423458200",
    //         "subType": "beneficiary",
    //         "accountOwner": "Ajoy Kapoor",
    //         "accountType": "Savings",
    //         "currentBalance": "9200",
    //         "accountLastModifyOn": "2019-02-09T10:32:30.640Z",
    //         "bank": "HDFC",
    //         "frequent": "true"
    //       },
    //       {
    //         "_id": "36d5a0ab5e6931e48de100df6d3decbb",
    //         "_rev": "9-1e2e8179aef79d2443f1a01227b05dea",
    //         "userId": "sunil",
    //         "type": "customerAccount",
    //         "beneficiariesaccounts": null,
    //         "accountNumber": "2586423459200",
    //         "subType": "beneficiary",
    //         "accountOwner": "Ajit Kapoor",
    //         "accountType": "Savings",
    //         "currentBalance": "7000",
    //         "accountLastModifyOn": "2019-02-09T10:32:30.640Z",
    //         "bank": "ICICI",
    //         "frequent": "false"
    //       },
    //       {
    //         "_id": "36d5a0ab5e6931e48de100df6d3decbb",
    //         "_rev": "9-1e2e8179aef79d2443f1a01227b05dea",
    //         "userId": "sunil",
    //         "type": "customerAccount",
    //         "beneficiariesaccounts": null,
    //         "accountNumber": "25864234594545",
    //         "subType": "beneficiary",
    //         "accountOwner": "Himmmat Singh",
    //         "accountType": "Savings",
    //         "currentBalance": "70000",
    //         "accountLastModifyOn": "2019-02-09T10:32:30.640Z",
    //         "bank": "ICICI",
    //         "frequent": "true"
    //       },
    //       {
    //         "_id": "386bbd51f248c077fea03271bb2c1317",
    //         "_rev": "6-2636465547b1a54fa6727cb42124b915",
    //         "userId": "sunil",
    //         "type": "customerAccount",
    //         "beneficiariesaccounts": null,
    //         "accountNumber": "0386423456235",
    //         "subType": "beneficiary",
    //         "accountOwner": "Rakesh Sharmaa",
    //         "accountType": "Credit",
    //         "currentBalance": "1000",
    //         "accountLastModifyOn": "2019-02-08T19:58:33.086Z",
    //         "bank": "HSBC",
    //         "frequent": "true"
    //       },
    //       {
    //         "_id": "a301a67dada8f4b2fa3af67924871f9b",
    //         "_rev": "5-8e5b61940ddabffd735d6a4ce69e6327",
    //         "userId": "sunil",
    //         "type": "customerAccount",
    //         "beneficiariesaccounts": null,
    //         "accountNumber": "0386423457200",
    //         "subType": "beneficiary",
    //         "accountOwner": "Swapna Kapoor",
    //         "accountType": "Savings",
    //         "currentBalance": "10000",
    //         "accountLastModifyOn": "2019-02-09T10:32:30.640Z",
    //         "bank": "Bank Of Baroda",
    //         "frequent": "false"
    //       }
    //     ]
    // })

    const headers = {
        'Content-Type': 'application/json'
    };
    var params = '?params=["' + req.body.params.name + '","' + req.body.params.header + '"]';

    axios.get(`${SERVER}/mfp/api/adapters/ICICIAdapter/getBeneficiaryForUser` + params, { headers: headers })
        .then(function(response) {
            res.send(response.data);
        }).catch(function(error) {
            res.send(error);
        });
});

app.post('/saveTransaction', function(req, res) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const transaction = {
        "userId": req.body.userId,
        "fromAccount": req.body.fromAccount,
        "toAccount": req.body.toAccount,
        "toAccountType": req.body.toAccountType,
        "fromAccountType": req.body.fromAccountType,
        "beneficiaryName": req.body.beneficiaryName,
        "transferAmount": req.body.transferAmount,
        "remarks": req.body.remarks
    }

    var params = "?params=['" + JSON.stringify(transaction) + "','" + req.body.header + "']";
    var url = encodeURI(SERVER + "/mfp/api/adapters/ICICIAccountAdapter/saveTransaction" + params);
    console.log("----------------------", encodeURI(url));

    // axios.get(`${SERVER}/mfp/api/adapters/ICICIAccountAdapter/saveTransaction`, params, { headers: headers })
    // axios.get(`${SERVER}/mfp/api/adapters/ICICIAccountAdapter/saveTransaction${encodeURI(params)}`)

    axios.get(url, {}, { headers: headers })
        .then(function(response) {
            res.send(response.data);
        }).catch(function(error) {
            res.send(error);
        });
});


app.post('/fundTransfer', function(req, res) {
    const headers = {
        'Content-Type': 'application/json'
    };

    var params = '?params=["' + req.body.params.fromAcct + '","' + req.body.params.toAccnt + '","' + req.body.params.trfAmnt + '","' + req.body.params.header + '"]';

    axios.get(`${SERVER}/mfp/api/adapters/ICICIAccountAdapter/fundTransfer` + params, { headers: headers })
        .then(function(response) {
            res.send(response.data);
        }).catch(function(error) {
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

server.listen(port, function() {
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