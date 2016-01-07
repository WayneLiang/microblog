var express = require('express');
var crypto = require('crypto');
var User = require('../models/user.js');
var router = express.Router();

/* GET users listing. */
router.get('/', checkNotLogin);
router.get('/', function(req, res, next) {
    res.render('reg', { title: '用户注册' });
});

router.post('/', checkNotLogin);
router.post('/',function(req,res){
    if(req.body['password-repeat'] != req.body['password']){
        req.flash('error', '两次输入的口令不一致');
        return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
        name: req.body.username,
        password: password,
    });

    //檢查用戶名是否已經存在
    User.get(newUser.name, function(err, user) {
        if (user)
            err = 'Username already exists.';
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }
        //如果不存在則新增用戶
        newUser.save(function(err) {
            if (err) {
                console.log(err);
                req.flash('error', err);
                return res.redirect('/reg');
            }
            console.log(newUser);
            req.session.user = newUser;
            req.flash('success', '註冊成功');
            res.redirect('/');
        });
    });

});

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登入，请先登出帐号再操作');
        return res.redirect('/');
    }
    next();
}

module.exports = router;