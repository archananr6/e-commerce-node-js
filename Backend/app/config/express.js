var express = require('express'),
bodyParser = require('body-parser');
cors = require('cors');
path = require('path');
consign = require('consign');
/* Configure express */
var app = express();

/* Configure body-parser */
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json());

/* Configure cors */
app.set('secret', 'api-nodejs');

consign()

    .include('app/config/database.js')
    .then('app/routes')
    .then('app/controllers')
    .into(app);
module.exports = app;