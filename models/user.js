/**
 * Created by lizongyuan on 2017/2/6.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String
});

var User = mongoose.model('user', UserSchema);

module.exports = User;