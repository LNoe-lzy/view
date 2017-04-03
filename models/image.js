/**
 * Created by lizongyuan on 2017/2/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    username: String,
    path: String,
    desc: String,
    tag: String,
    date: String
});

var Image = mongoose.model('image', ImageSchema);

module.exports = Image;