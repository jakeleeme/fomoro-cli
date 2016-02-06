var path = require('path');
var read = require('read');
var fs = require('fs');

var exceptions = require('../exceptions');
var config = require('../config');
var utils = require('../utils');

module.exports = function() {
  var model = JSON.parse(fs.readFileSync('config.json'));
  var key = utils.getKey(model.name, model.version);

  console.log(`This will remove the summary logs for "${key}" from Fomoro.`);
  read({ prompt: 'Is this okay? (y/n)' }, (err, yn) => {
    if (err) {
      console.error(exceptions.getUserMessage(err));
      process.exit(1);
      return;
    }

    if (yn.toLowerCase() === 'y') {
      console.log(`Removing summary logs for "${key}"...`);
      utils.postJSON(config.host + config.summary_rm_endpoint, { key: key }, function(err, res, body) {
        if (err) {
          console.error(exceptions.getUserMessage(err));
          process.exit(1);
        } else if (res.statusCode !== 200) {
          err = exceptions.fromResponse(res, body);
          console.error(exceptions.getUserMessage(err));
          process.exit(1);
        } else {
          console.log(`Successfully removed summary logs for "${key}".`);
        }
      });
    } else {
      console.log(`Okay, did NOT remove summary logs for "${key}".`);
    }
  });
};