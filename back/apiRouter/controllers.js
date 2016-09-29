var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User = require.main.require('./models/user'); // get our mongoose model
var Counter = require.main.require('./models/counter'); // get our mongoose model
var config = require.main.require('./config');

module.exports = {
    getApiDocs: getApiDocs,
    getUsers: getUsers,
    newUser: newUser,
    getToken: getToken,
    refreshToken: refreshToken,
    deleteToken: deleteToken,
    deleteAllTokens: deleteAllTokens,
    getUser: getUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getCounters: getCounters,
    newCounter: newCounter,
    getCounter: getCounter,
    editCounter: editCounter,
    deleteCounter: deleteCounter,
    giveCounterStar: giveCounterStar,
    removeCounterStar: removeCounterStar
};

// HTTP: GET / => return the api docs. PUBLIC.
function getApiDocs(req, res) {
    res.json({
        message: 'Will receive the api docs. Coming soon...'
    });
}

// HTTP:GET users/ => get user according to query. PUBLIC.
function getUsers(req, res) {
    var query = ( req.query.name ? { name: req.query.name } : {} );
    //var columns = 'userSlug -_id';
    var columns = req.query.columns || 'name img description userSlug';
    columns = columns.replace(/password/g, "").replace(/email/g, "");
    var sort = req.query.sort   || 'name';
    var limit = req.query.limit || 10;
    var skip = req.query.page * limit || 0;

    User.find(query).select(columns).sort(sort).skip(skip).limit(limit)
    .then(function(users) {
        res.json(users);
    });
}

// HTTP: POST users/ => add new user to database (aka: signup). PUBLIC.
function newUser(req, res){
    //TODO: New user (signup): adicionar middleware para validação.
    if (!req.body.newUser) res.status(403).end();

    var newUser = new User(req.body.newUser);
    newUser.save()
        .then(function() {
            _gerenateToken(user, function(token) {
                res.json({
                  success: true,
                  message: 'Enjoy your token!',
                  token: token,
                  tokenDate: user.tokenDate
                });
            });
        })
        .catch(function(err) {
            if (err.code === 11000) res.status(409).json({
                errmsg: err.errmsg,
                errcode: err.code
            });
            else res.json(err.errmsg);
        });
}


// HTTP: PUT users/ => return a token after authenticate an existing user (aka login). PUBLIC.
function getToken(req, res) {
    User.findOne({ email: req.body.email, password: req.body.password }, function(err, user) {
        if (err) console.error(err);
        if (!user) return res.status(403).json({ success: false, message: 'Token failed. Email or password incorrect.' });

        _gerenateToken(user, function(token, error) {
            if (!token) return res.status(403).end();

            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token,
              tokenDate: user.tokenDate
            });
        });
    });
}

function refreshToken(req, res) {
    if (!res.jwtInfo) res.status(200).end();

    _gerenateToken(user, function(token) {
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          tokenDate: user.tokenDate
        });
    });
}

// HTTP:DELETE users/ => Invalidate the TokenToken (aka: logout all devices). PRIVATE.
function deleteToken(req, res) {
    if (!res.jwtInfo) res.status(200).end();

    User.update({ userSlug: res.jwtInfo.userSlug }, { $pull: { tokenDate: res.jwtInfo.tokenDate } })
    .then(function(status) {
        res.json(status);
    })
    .catch(function(err){
        res.json(err);
    });
}

function deleteAllTokens() {
    if (!res.jwtInfo) res.status(200).end();

    User.update({ userSlug: res.jwtInfo.userSlug }, { tokenDate: [] })
    .then(function(status) {
        res.json(status);
    })
    .catch(function(err){
        res.json(err);
    });
}

// HTTP: GET users/:userSlug/ => Get a user according to param passed. PUBLIC.
function getUser(req, res) {
    User.findOne({ userSlug: req.params.userSlug }, { password: 0, tokenDate: 0, email: 0, _id: 0 })
    .then(function(user) {
        if (!user) res.status(404).end();

        res.json(user);
    })
    .catch(function(err){
        res.json(err);
    });
}

// HTTP: PUT users/ => Edit the logged user. PRIVATE.
function editUser(req, res) {
    if (!res.jwtInfo) res.status(401).end();

    User.update({ userSlug: req.params.userSlug }, req.body.editedUser)
    .then(function(status) {
        res.json(status);
    })
    .catch(function(err){
        res.json(err);
    });
}

// HTTP: DELETE users/ => Delete a user according to param passed. PRIVATE.
function deleteUser(req, res) {
    if (!res.jwtInfo) res.status(401).end();

    User.remove({ userSlug: res.jwtInfo.userSlug }, function(err, status) {
        if (err) {
            console.error(err);
        } else {
            res.json(status);
        }
    });
}

// HTTP: GET users/:userSlug/counters => Get all counters belonging to an user (or "all" to all). PUBLIC.
function getCounters(req, res) {
    var query = {};
    if (req.params.userSlug !== "all") query.userSlug = req.params.userSlug;
    if (req.query.title) query.title = req.query.title;

    var columnsDefault = 'userSlug title description startTime counterSlug img stars views isPromoted' ;
    var columns = req.query.columns || columnsDefault;
    var excludedColumns = ' -password -_id';
    var sort = req.query.sort   || 'title';
    var limit = req.query.limit || 10;
    var skip = req.query.page * limit || 0;

    Counter.find(query).select(columns + excludedColumns).sort(sort).skip(skip).limit(limit)
    .then(function(counters) {
        res.json(counters);
    })
    .catch(function(err){
        res.json(err);
    });
}

// HTTP: POST users/:userSlug/counters => Create a counter associating to that user. PRIVATE.
function newCounter(req, res) {
    if (!res.jwtInfo) res.status(401).end();
    if (res.jwtInfo.userSlug !== req.params.userSlug) res.status(403).end();

    var newCounter = new Counter(req.body.newCounter);
    newCounter.save(function(err, counter) {
        if (err) res.status(500).end();
        else res.json(counter);
    });
}

// HTTP: GET users/:userSlug/counters/:counter => Get a especific counter, according to params passed. PUBLIC.
function getCounter(req, res) {
    var query = {};
    query.userSlug = req.params.userSlug;
    query.counterSlug = req.params.counterSlug;

    var columns = 'userSlug title description startTime counterSlug img stars views isPromoted -_id';

    Counter.findOne(query).select(columns)
    .then(function(counter) {
        res.json(counter);
    })
    .catch(function(err){
        res.json(err);
    });
}

// HTTP: PUT users/:userSlug/counters/:counter => Edit a especific counter according to param passed. PRIVATE.
function editCounter(req, res) {
    if (!res.jwtInfo) res.status(401).end();
    if (res.jwtInfo.userSlug !== req.params.userSlug) res.status(403).end();

    var query = {};
    query.userSlug = req.params.userSlug;
    query.counterSlug = req.params.counterSlug;

    Counter.update(query, req.body.editedCounter)
    .then(function(status) {
        res.json(status);
    })
    .catch(function(err){
        res.json(err);
    });
}

// HTTP: DELETE users/:userSlug/counters/:counter => Delete a especific counter according to param passed. PRIVATE.
function deleteCounter(req, res) {
    if (!res.jwtInfo) res.status(401).end();
    if (res.jwtInfo.userSlug !== req.params.userSlug) res.status(403).end();

    var query = {};
    query.userSlug = req.params.userSlug;
    query.counterSlug = req.params.counterSlug;

    Counter.remove(query)
    .then(function(status) {
        res.json(status);
    })
    .catch(function(err){
        res.json(err);
    });
}

function giveCounterStar(req, res) {
    if (!res.jwtInfo) res.status(401).end();

    var query = {};
    query.counterSlug = req.params.counterSlug;
    query.stars = { $ne: res.jwtInfo.userSlug };

    Counter.update(query, { $push: { stars: res.jwtInfo.userSlug } })
    .then(function(status) {
        res.json(status);
    })
    .catch(function(err){
        res.json(err);
    });
}

function removeCounterStar(req, res) {
    if (!res.jwtInfo) res.status(401).end();

    var query = {};
    query.counterSlug = req.params.counterSlug;
    query.stars = res.jwtInfo.userSlug;

    Counter.update(query, { $pull: { stars: res.jwtInfo.userSlug } })
    .then(function(status) {
        res.json(status);
    })
    .catch(function(err){
        res.json(err);
    });
}

/**
 * PRIVATE FUNCTIONS (NOT EXPORTED)
 **/

// Generates Token from an user and date - and run callback.
function _gerenateToken(user, callback) {
    var tokenDate = Date.now();
    if (user === null) return callback();

    user.tokenDate.push(tokenDate);
    user.save(function(err, obj){
        if (err) {
            console.error(err);
        } else {
            var token = jwt.sign({
                userSlug: user.userSlug,
                name: user.name,
                tokenDate: tokenDate,
            }, config.jwtSecret, {
                expiresIn: "365 days",
            });

            callback(token);
        }
    });
}
