/**
 * Created by wayne on 16-1-7.
 */
var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');

/* GET users listing. */
router.post('/', checkLogin);
router.post('/', function(req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function(err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发表成功');
        res.redirect('/users/' + currentUser.name);
    });
});
function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}
module.exports = router;
