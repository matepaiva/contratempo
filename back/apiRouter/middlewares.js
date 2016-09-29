var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User = require.main.require('./models/user'); // get our mongoose model
var Counter = require.main.require('./models/counter'); // get our mongoose model
var config = require.main.require('./config');

module.exports = {
    authenticateUser: authenticateUser
};

// check if token exists and is valid.
function authenticateUser(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.token;

    if (token) {
        jwt.verify(token, config.jwtSecret, function(err, decoded) {
            if (err) console.error(err);
            else {
                User.findOne({
                    slug: decoded.slug,
                    tokenDate: decoded.tokenDate
                })
                .then(function(user) {
                    if (user) {
                        res.jwtInfo = decoded;
                    }
                    next();
                });
            }
        });
    } else {
        next();
    }
}
