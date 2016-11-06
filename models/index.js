var UserMeta = require('../meta/User'),
    sequelize = require('../sequelize'),
    passportLocalSequelize = require('passport-local-sequelize');

var User = sequelize.define('users', UserMeta.attributes, UserMeta.options);
User.sync();

module.exports.User = User;
