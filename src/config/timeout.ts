const { setDefaultTimeout } = require('@cucumber/cucumber');
var debug = require('debug')('timeout');

debug('setting timeout to 10 secs');
setDefaultTimeout(10 * 1000);