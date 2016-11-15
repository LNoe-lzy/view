/**
 * Created by lizongyuan on 2016/11/15.
 */
// 声明模式
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    password: String,
    email: String
});

// 创建模型
var User = mongoose.model('users', UserSchema);

// 导出User
module.exports = User;