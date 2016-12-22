var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User = require.main.require('./models/user'); // get our mongoose model
var Counter = require.main.require('./models/counter'); // get our mongoose model
var config = require.main.require('./config');
var path = require('path');

var multer = require('multer');
var Cloudinary = require('cloudinary');
var cloudinaryStorage = require('multer-storage-cloudinary');
Cloudinary.config(config.cloudinaryConfig);

var storage = cloudinaryStorage({
    cloudinary: Cloudinary,
    folder: function (req, file, cb) {
        cb(undefined, req.folder);
    },
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
        cb(undefined, req.nameOfFile);
    }
});
var upload = multer({
    storage: storage,
    limits: {
        fileSize: config.upload.fileSizeLimit,
        files: config.upload.numberOfFilesLimit
    },
    fileFilter: function(req, file, cb) {
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) return cb(null, true);
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    },
});

// var storage = multer.diskStorage({
//     destination: function(req, file, callback) { callback(null, './uploads'); },
//     filename: function(req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname).toLowerCase()); }
// });
// var upload = multer({
//     storage: storage,
// });

module.exports = {
    getApiDocs:          getApiDocs,
    getToken:            getToken,
    refreshToken:        refreshToken,
    deleteToken:         deleteToken,
    deleteAllTokens:     deleteAllTokens,
    getUser:             getUser,
    getUsers:            getUsers,
    uploadAvatar:        uploadAvatar,
    newUser:             newUser,
    editUser:            editUser,
    deleteUser:          deleteUser,
    getCounters:         getCounters,
    newCounter:          newCounter,
    uploadImgCounter:    uploadImgCounter,
    getCounter:          getCounter,
    editCounter:         editCounter,
    deleteCounter:       deleteCounter,
    giveCounterStar:     giveCounterStar,
    removeCounterStar:   removeCounterStar
};

// HTTP: GET / => return the api docs. PUBLIC.
function getApiDocs(req, res) {
    res.json({
        message: 'Will receive the api docs. Coming soon...'
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
    if (!req.jwtInfo) res.status(200).end();

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
    if (!req.jwtInfo) res.status(200).end();

    User.update({ userSlug: req.jwtInfo.userSlug }, { $pull: { tokenDate: req.jwtInfo.tokenDate } })
    .then(function(status) {
        res.json(status);
    })
    .catch(function(err){
        res.json(err);
    });
}

function deleteAllTokens() {
    if (!req.jwtInfo) res.status(200).end();

    User.update({ userSlug: req.jwtInfo.userSlug }, { tokenDate: [] })
    .then(function(status) {
        res.json(status);
    })
    .catch(function(err){
        res.json(err);
    });
}

// HTTP:GET users/ => get user according to query. PUBLIC.
function getUsers(req, res) {
    var query = ( req.query.name ? { name: req.query.name } : {} );
    //var columns = 'userSlug -_id';
    var columns = req.query.columns || 'name img description userSlug';
    columns = columns.replace(/password/g, "").replace(/email/g, "");
    var sort = req.query.sort   || 'name';
    var limit = +req.query.limit || 10;
    var skip = req.query.page * limit || 0;

    User.find(query).select(columns).sort(sort).skip(skip).limit(limit)
    .then(function(users) {
        res.json(users);
    });
}

function uploadAvatar(req, res) {
    if (!req.jwtInfo) return res.status(401).end();

    req.folder = 'users';
    req.nameOfFile = req.jwtInfo.userSlug + "_avatar";

    upload.single('file')(req, res, function(err) {
        if (err) return res.status(412).json(err);

        User.update({ userSlug: req.jwtInfo.userSlug }, { img: req.file.secure_url })
        .then(function(status) {
            res.end(req.file.secure_url);
        })
        .catch(function(err){
            res.json(err);
        });
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

// HTTP: POST users/ => add new user to database (aka: signup). PUBLIC.
function newUser(req, res){
    //TODO: New user (signup): adicionar middleware para validação.
    if (!req.body.newUser) res.status(403).end();


    var newUser = new User({
        name:     req.body.newUser.name,
        email:    req.body.newUser.email,
        password: req.body.newUser.password,
        userSlug: req.body.newUser.userSlug,
    });
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

// HTTP: PUT users/ => Edit the logged user. PRIVATE.
function editUser(req, res) {
    if (!req.jwtInfo) return res.status(401).end();

    User.update({
        userSlug: req.jwtInfo.userSlug
    },{
        name: req.body.name,
        description: req.body.description
    })
        .then(function(status) {
            res.json(status);
        })
        .catch(function(err){
            res.json(err);
        })
    ;
}

// HTTP: DELETE users/ => Delete a user according to param passed. PRIVATE.
function deleteUser(req, res) {
    if (!req.jwtInfo) res.status(401).end();

    User.remove({ userSlug: req.jwtInfo.userSlug }, function(err, status) {
        if (err) console.error(err);
        else res.json(status);
    });
}

// HTTP: GET users/:userSlug/counters => Get all counters belonging to an user (or "all" to all). PUBLIC.
function getCounters(req, res) {
    var query = {};
    if (req.params.userSlug !== "all") query.userSlug = req.params.userSlug;
    if (req.query.title) query.title = req.query.title;

    var columnsDefault = 'userSlug title description startTime counterSlug img stars views isPromoted' ;
    var columns = req.query.columns || columnsDefault;
    var sort = req.query.sort   || 'title';
    var limit = +req.query.limit || 10;
    var skip = req.query.page * limit || 0;

    Counter.find(query).select(columns).sort(sort).skip(skip).limit(limit)
    .then(function(counters) {
        res.json(counters);
    })
    .catch(function(err){
        res.json(err);
    });
}

// HTTP: POST users/:userSlug/counters => Create a counter associating to that user. PRIVATE.
function newCounter(req, res) {
    if (!req.jwtInfo) return res.status(401).end();
    if (req.jwtInfo.userSlug !== req.params.userSlug) return res.status(403).end();
    if (!req.body.title || !req.body.description || !req.body.counterSlug) return res.status(422).end();

    var newCounter = new Counter({
        // img: req.file.secure_url,
        startTime:   new Date(),
        userSlug:    req.jwtInfo.userSlug,
        counterSlug: req.body.counterSlug,
        title:       req.body.title,
        description: req.body.description
    });
    newCounter.save(function(err, counter) {
        if (err && err.code === 11000) {
            return res.status(409).json(err);
        }
        res.json(counter);
    });
}

function uploadImgCounter(req, res) {
    if (!req.jwtInfo) return res.status(401).end();
    if (req.jwtInfo.userSlug !== req.params.userSlug) return res.status(403).end();

    req.folder = 'counters';
    req.nameOfFile = req.jwtInfo.userSlug + "_" + req.params.counterSlug;

    upload.single('file')(req, res, function(err) {
        if (err) return res.status(412).json(err);

        Counter.update({
            userSlug: req.jwtInfo.userSlug,
            counterSlug: req.params.counterSlug
        },{
            img: req.file.secure_url
        })
        .then(function(status) {
            res.end(status);
        })
        .catch(function(err){
            console.log(err);
            res.json(err);
        });
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
    if (!req.jwtInfo) res.status(401).end();
    if (req.jwtInfo.userSlug !== req.params.userSlug) res.status(403).end();

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
    if (!req.jwtInfo) res.status(401).end();
    if (req.jwtInfo.userSlug !== req.params.userSlug) res.status(403).end();

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
    if (!req.jwtInfo) res.status(401).end();

    var query = {};
    query.counterSlug = req.params.counterSlug;
    query.stars = { $ne: req.jwtInfo.userSlug };

    Counter.update(query, { $push: { stars: req.jwtInfo.userSlug } })
    .then(function(status) {
        res.json(status);
    })
    .catch(function(err){
        res.json(err);
    });
}

function removeCounterStar(req, res) {
    if (!req.jwtInfo) res.status(401).end();

    var query = {};
    query.counterSlug = req.params.counterSlug;
    query.stars = req.jwtInfo.userSlug;

    Counter.update(query, { $pull: { stars: req.jwtInfo.userSlug } })
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
