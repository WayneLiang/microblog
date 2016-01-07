/**
 * Created by wayne on 16-1-6.
 */
var express = require('express');
var crypto = require('crypto');
var User = require('../models/user.js');
var router = express.Router();

/* GET users listing. */
router.get('/', checkNotLogin);
router.get('/', function(req, res) {
    res.render('login', { title: '用户登入' });
});
router.post('/', checkNotLogin);
router.post('/',function(req,res){
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    //檢查用戶名是否已經存在
    User.get(req.body.username, function(err, user) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/login');
        }
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/login');
        }
        if (user.password != password) {
            req.flash('error', '用户口令错误');
            return res.redirect('/login');
        }
        req.session.user = user;
        req.flash('success', '登入成功');
        res.redirect('/');
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