'use strict'
try {
  require('newrelic');
} catch (e) {
  console.warn('newrelic not installed in checkoutService, continuing without New Relic');
}

var PORT = process.env.PORT || 3002;
var STATIC_DIR = __dirname + '/build';

require('./index').start(PORT, STATIC_DIR);
