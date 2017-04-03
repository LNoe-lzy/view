var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var multer = require('multer');
var upload = multer({dest: 'public/images/tmp/'});
var fs = require('fs');

var User = require('../models/user');
var Image = require('../models/image');
var imgUpload = require('../modules/upload');

var request = require('request');

var youtusdk = require('tencentyoutuyun');
var youtuconf = youtusdk.conf;
var youtuauth = youtusdk.auth;
var youtu = youtusdk.youtu;

var t = new Date().getTime();
var e = new Date('July 21, 2017 01:15:00').getTime();
// var orignal = 'u=1076306553&a=10079311&k=AKIDBIEXnsfTz7C6yfnZm4EUffU8aCj5Jhja&e=' + e + '&t='+ t +'&r=270494647&f=';
var userID = youtuauth.appSign(e, '1076306553');
youtuconf.setAppInfo('10079311', 'AKIDBIEXnsfTz7C6yfnZm4EUffU8aCj5Jhja', 'pTvCHBuWxGSWO4Zt9JI5i9PTLDxeBaqv', '1076306553', 0);

console.log(userID);

/* GET home page. */
router.get('/', function (req, res) {

    res.render('home', {
        title: 'VIEW',
        user: req.session.user
    });
});

// signup & signin
router.post('/signup', function (req, res) {
    var userData = {
        username: req.body.username,
        password: crypto.createHash('md5').update(req.body.password).digest('hex')
    };
    User.findOne({
        username: userData.username
    }, function (err, u) {
        if (err) {
            return err;
        }
        if (u) {
            req.flash('error', '用户已存在');
            res.redirect('/');
        }
        var newUser = new User({
            username: userData.username,
            password: userData.password
        });
        newUser.save(function (err) {
            if (err) {
                return err;
            }
            req.session.user = userData;
            return res.redirect('/');
        });
    })
});
router.post('/signin', function (req, res) {
    var userData = {
        username: req.body.username,
        password: crypto.createHash('md5').update(req.body.password).digest('hex')
    };
    User.findOne({
        username: userData.username
    }, function (err, u) {
        if (err) {
            return err;
        }
        if (!u || (u.password !== userData.password)) {
            req.flash('error', '用户名或密码错误!');
            res.redirect('/');
        }
        req.session.user = u;
        return res.redirect('/');
    });
});

// logout
router.get('/logout', function (req, res) {
    req.session.user = null;
    res.redirect('/');
});

// image
router.get('/image', function (req, res) {
    Image.find(null).sort({_id: -1}).exec(function (err, img) {
        if (err) {
            console.log(err);
        }
        res.render('image', {
            title: 'View',
            user: req.session.user,
            imgs: img
        });
    });
});

// tag page
router.get('/tag', function (req, res) {
    res.render('tag', {
        title: 'View',
        user: req.session.user
    });
});

// 图像文件上传
router.post('/send', upload.single('image'), function (req, res) {
    var currentUser = req.session.user,
        info = req.body.info,
        tag = req.body.tag,
        username = currentUser.username,
        tmp_path = req.file.path,
        file_name = req.file.filename,
        mimeType = req.file.mimetype;
    imgUpload.imgUpload(tmp_path, file_name, mimeType, username, info, tag, 'upload', req, res);
});

router.post('/search', upload.single('image'), function (req, res) {
    var tmp_path, file_name, mimeType, target_path, extName, store_path, tags, face, queryTxt;
    if (req.file === undefined) {
        res.redirect('/search/' + req.body.queryText);
    } else if (req.body.queryText === 'face' && req.file !== 'undefined') {
        tmp_path = req.file.path;
        file_name = req.file.filename;
        mimeType = req.file.mimetype;
        //指定存储位置
        target_path = 'public/images/search' + '/' + file_name;
        extName = '';
        switch (mimeType) {
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
        store_path = target_path + '.' + extName;
        var page_path = '/images/search' + '/' + file_name + '.' + extName;
        fs.rename(tmp_path, store_path, function (err) {
            if (err) {
                console.log(err);
            }
            //删除临时文件
            fs.unlink(tmp_path, function () {
                if (err) {
                    console.log(err);
                }
            });
        });

        youtu.detectface(store_path, 0, function (data) {
            face = data.data;
            req.session.face = face;
            req.session.faceurl = page_path;
            res.redirect('/face');
        });
    } else if (req.file.path !== 'undefined') {
        queryTxt = req.body.queryText || ' ';
        console.log(queryTxt);
        tmp_path = req.file.path;
        file_name = req.file.filename;
        mimeType = req.file.mimetype;
        //指定存储位置
        target_path = 'public/images/search' + '/' + file_name;
        extName = '';
        switch (mimeType) {
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
        store_path = target_path + '.' + extName;
        fs.rename(tmp_path, store_path, function (err) {
            if (err) {
                console.log(err);
            }
            //删除临时文件
            fs.unlink(tmp_path, function () {
                if (err) {
                    console.log(err);
                }
            });
        });

        var img_path = '/images/search' + '/' + file_name + '.' + extName;
        youtu.imagetag(store_path, function (data) {
            tags = data.data.tags;
            req.session.tags = tags;
            req.session.queryTxt = queryTxt;
            req.session.imgurl = img_path;
            res.redirect('/analyse');
        });
    }
});

router.get('/analyse', function (req, res) {
    res.render('analyse', {
        title: 'analyse',
        user: req.session.user,
        tags: req.session.tags,
        imgurl: req.session.imgurl,
        queryTxt: req.session.queryTxt
    });
});

router.get('/face', function (req, res) {
    res.render('face', {
        title: 'face',
        user: req.session.user,
        face: req.session.face,
        faceurl: req.session.faceurl
    });
});

// 返回搜索结果
router.get('/search/:query', function (req, res) {
    var params = {
        // Request parameters
        "q": encodeURI(req.params.query),
        "count": "20",
        "offset": "0",
        "mkt": "en-us",
        "safeSearch": "Moderate"
    };

    request({
        url: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?' + 'q=' + params.q + '&count=' + params.count + '&offset=0&mkt=en-us&safeSearch=Moderate',
        method: "GET",
        json: true,
        headers: {
            "Ocp-Apim-Subscription-Key": "b269334d107e442db4c02a38984eebee"
        },
        body: "{body}"
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body.value);
            res.render('search', {
                title: 'search',
                user: req.session.user,
                imgs: body.value
            });
        }
    });
});

router.get('/food', function (req, res) {
    res.render('food', {
        title: 'food',
        user: req.session.user
    });
});

module.exports = router;
