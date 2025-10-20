var express = require('express');
var fs = require('fs');
var logger = require('morgan');
var bodyParser = require('body-parser');

var RestaurantRecord = require('./model').Restaurant;
var MemoryStorage = require('./storage').Memory;

var API_URL = '/api/menu/:id';

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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'newrelic, tracestate, traceparent'),
    next();
  });


  // API
  app.get(API_URL, function(req, res, _next) {
    var restaurant = storage.getById(req.params.id);

    if (restaurant) {
      return res.status(200).send(restaurant);
    }

    return res.status(400).send({error: 'No restaurant with id "' + req.params.id + '"!'});
  });


  app.put(API_URL, function(req, res, _next) {
    var restaurant = storage.getById(req.params.id);
    var errors = [];

    if (restaurant) {
      restaurant.update(req.body);
      return res.status(200).send(restaurant);
    }

    restaurant = new RestaurantRecord(req.body);
    if (restaurant.validate(errors)) {
      storage.add(restaurant);
      return res.status(201).send(restaurant);
    }

    return res.status(400).send({error: errors});
  });


  app.delete(API_URL, function(req, res, _next) {
    if (storage.deleteById(req.params.id)) {
      return res.status(204).send(null);
    }

    return res.status(400).send({error: 'No restaurant with id "' + req.params.id + '"!'});
  });

  // start the server
  // Allow inline JSON via env DATA_JSON or fallback to DATA_FILE (env or local file)
  // Use local restaurants.json (each service has its own copy for Railway deployment)
  var dataFilePath = process.env.DATA_FILE || DATA_FILE || (__dirname + '/data/restaurants.json');

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
      app.listen(PORT, function() {
        console.log('Started with empty dataset (DATA_JSON parse failed). Go to http://localhost:' + PORT + '/');
      });
    }
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
        var parsed = JSON.parse(data);
        parsed.forEach(function(restaurant) {
          storage.add(new RestaurantRecord(restaurant));
        });
        console.log('Loaded ' + parsed.length + ' restaurants with menus from: ' + dataFilePath);
      } catch (e) {
        console.error('Error parsing DATA_FILE JSON:', e.message || e);
      }

      app.listen(PORT, function() {
        console.log('Go to http://localhost:' + PORT + '/');
      });
    });
  }
};
