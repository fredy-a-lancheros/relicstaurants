'use strict'
try {
  require('newrelic');
} catch (e) {
  console.warn('newrelic not installed in restaurantService, continuing without New Relic');
}

var PORT = process.env.PORT || 3001;
var STATIC_DIR = __dirname + '/build';
// allow overriding path from Railway: DATA_FILE or fallback to local data file in the service
var DATA_FILE = process.env.DATA_FILE || __dirname + '/data/restaurants.json';

require('./index').start(PORT, STATIC_DIR, DATA_FILE);
