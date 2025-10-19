var express = require('express');
var fs = require('fs');
var logger = require('morgan');
var bodyParser = require('body-parser');

var RestaurantRecord = require('./model').Restaurant;
var MemoryStorage = require('./storage').Memory;

var API_URL = '/api/restaurants';

var removeMenuItems = function(restaurant) {
  var clone = {};

  Object.getOwnPropertyNames(restaurant).forEach(function(key) {
    if (key !== 'menuItems') {
      clone[key] = restaurant[key];
    }
  });

  return clone;
};


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
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'newrelic, tracestate, traceparent'),
    next();
  });


  // API
  app.get(API_URL, function(_req, res, _next) {
    const response = res.status(200).send(storage.getAll().map(removeMenuItems));
    return response;
  });


  app.post(API_URL, function(req, res, _next) {
    var restaurant = new RestaurantRecord(req.body);
    var errors = [];

    if (restaurant.validate(errors)) {
      storage.add(restaurant);
      return res.status(201).send(restaurant);
    }

    return res.status(400).send({error: errors});
  });

  // start the server
  // read the data from json and start the server
  // Allow inline JSON via env DATA_JSON (preferred for Railway small datasets)
  if (process.env.DATA_JSON) {
    try {
      var parsedInline = JSON.parse(process.env.DATA_JSON);
      parsedInline.forEach(function(restaurant) {
        storage.add(new RestaurantRecord(restaurant));
      });
      app.listen(PORT, function() {
        console.log('Started with DATA_JSON env. Go to http://localhost:' + PORT + '/');
      });
    } catch (e) {
      console.error('Error parsing DATA_JSON env:', e.message || e);
      // still start server with empty storage
      app.listen(PORT, function() {
        console.log('Started with empty dataset (DATA_JSON parse failed). Go to http://localhost:' + PORT + '/');
      });
    }
  } else {
    fs.readFile(DATA_FILE, 'utf8', function(err, data) {
      if (err) {
        console.warn('Warning: could not read DATA_FILE:', DATA_FILE, err.message || err);
        app.listen(PORT, function() {
          console.log('Started with empty dataset. Go to http://localhost:' + PORT + '/');
        });
        return;
      }

      try {
        var parsed = JSON.parse(data);
        parsed.forEach(function(restaurant) {
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
