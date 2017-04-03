/**
 * Created by lizongyuan on 2017/2/8.
 */
//文件上传模块
var fs = require('fs');
var Image = require('../models/image');
var User = require('../models/user');

exports.imgUpload = function (tmp, file_name, mime, user, info, tag, type, req, res) {
    //指定存储位置
    var target_path = 'public/images/' + type + '/' + file_name;
    var extName = '';
    switch (mime) {
        case 'image/pjpeg':
            extName = 'jpg';
            break;
        case 'image/jpeg':
            extName = 'jpg';
            break;
        case 'image/png':
            extName = 'png';
            break;
        case 'image/x-png':
            extName = 'png';
            break;
    }
    //判断文件是否为图像类型
    if (extName.length === 0) {
        req.flash('error', '只能上传图像!');
        return res.redirect('/');
    }
    //文件移动的目录
    var store_path = target_path + '.' + extName;
    //文件相对路径用于存储于数据库
    var imgpath = '/images/' + type + '/' + file_name + '.' + extName;
    //移动文件
    fs.rename(tmp, store_path, function (err) {
        if (err) {
            console.log(err);
        }
        //删除临时文件
        fs.unlink(tmp, function () {
            if (err) {
                console.log(err);
            }
        });
    });

    //获取当前的时间
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };

    //将图像信息存储到数据库
    if (type === 'upload') {
        var newImage = new Image({
            username: user,
            path: imgpath,
            desc: info,
            tag: tag,
            date: time.day
        });
        newImage.save(function (err) {
            if (err) {
                console.log(err);
            }
            req.flash('success', '发表成功!');
            res.redirect('/image');
        });
    }
};