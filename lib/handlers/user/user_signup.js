"use strict";

const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const os = require('os');

const exceptions = require('../../exceptions');
const config = require('../../config');
const utils = require('../../utils');

const fomoro_dir = path.join(os.homedir(), '.fomoro');
const auth_path = path.join(fomoro_dir, 'auth');

module.exports = function() {
  console.log('Sign up for Fomoro');
  utils.read('Email: ').then(email => {
    return utils.read('Username: ').then(username => {
      return utils.read('Password: ', true).then(password => {
        return utils.postAnonJSON(config.host + config.user_signup_endpoint, {
          email: email,
          username: username,
          password: password
        }, (err, res, body) => {
          if (err) {
            console.error(exceptions.getUserMessage(err));
            process.exit(1);
          } else if (res.statusCode !== 200) {
            err = exceptions.fromResponse(res, body);
            console.error(exceptions.getUserMessage(err));
            process.exit(1);
          } else {
            console.log('Successfully signed up. You may now log in.');
          }
        });
      });
    });
  }).catch(err => {
    console.error(exceptions.getUserMessage(err));
    process.exit(1);
  });
};
