/**
 * Created by lizongyuan on 2017/3/25.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
    tagname: String,
    path: String
});

var Tag = mongoose.model('tag', TagSchema);

module.exports = Tag;