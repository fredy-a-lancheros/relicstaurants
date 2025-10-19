var express = require('express');
var fs = require('fs');
var logger = require('morgan');
var bodyParser = require('body-parser');

var RestaurantRecord = require('./model').Restaurant;
var MemoryStorage = require('./storage').Memory;

var API_URL_ORDER = '/api/checkout';

exports.start = function(PORT, STATIC_DIR, DATA_FILE) {
  var app = express();
  var storage = new MemoryStorage();

  // log requests
  app.use(logger('combined'));

  // serve static files for demo client
  app.use(express.static(STATIC_DIR));

  // parse body into req.body
  app.use(bodyParser.json());

  // set header to prevent cors errors
  app.use(function(_req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'),
    res.setHeader('Access-Control-Allow-Headers', 'newrelic, tracestate, traceparent, content-type'),
    next();
  });


  // API
  app.post(API_URL_ORDER, function(req, res, _next) {
    return res.status(201).send({ orderId: Date.now()});
  });


  // start the server
  // Allow inline DATA_JSON or fallback to DATA_FILE (env or local file)
  var dataFilePath = process.env.DATA_FILE || DATA_FILE || (__dirname + '/data/restaurants.json');

  if (process.env.DATA_JSON) {
    try {
      JSON.parse(process.env.DATA_JSON).forEach(function(restaurant) {
        storage.add(new RestaurantRecord(restaurant));
      });
    } catch (e) {
      console.error('Error parsing DATA_JSON:', e.message || e);
    }
    app.listen(PORT, function() {
      console.log('Started with DATA_JSON. Go to http://localhost:' + PORT + '/');
    });
  } else {
    fs.readFile(dataFilePath, 'utf8', function(err, data) {
      if (err) {
        console.warn('Warning: could not read DATA_FILE:', dataFilePath, err.message || err);
        app.listen(PORT, function() {
          console.log('Started with empty dataset. Go to http://localhost:' + PORT + '/');
        });
        return;
      }
      try {
        JSON.parse(data).forEach(function(restaurant) {
          storage.add(new RestaurantRecord(restaurant));
        });
      } catch (e) {
        console.error('Error parsing DATA_FILE JSON:', e.message || e);
      }
      app.listen(PORT, function() {
        console.log('Go to http://localhost:' + PORT + '/');
      });
    });
  }


  // Windows and Node.js before 0.8.9 would crash
  // https://github.com/joyent/node/issues/1553
//  try {
//    process.on('SIGINT', function() {
//      // save the storage back to the json file
//      fs.writeFile(DATA_FILE, JSON.stringify(storage.getAll()), function() {
//        process.exit(0);
//      });
//    });
//  } catch (e) {}

};
