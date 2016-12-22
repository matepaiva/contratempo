var middlewares = require.main.require('./apiRouter/middlewares');
var controllers = require.main.require('./apiRouter/controllers');
var express = require('express');
var apiRouter = express.Router();

/**
 * MIDDLEWARES
**/
apiRouter.use(middlewares.authenticateUser); // check if token exists and is valid.
/**
 * END OF MIDDLEWARES
**/


/**
 * ROUTES
**/
apiRouter.get('/', controllers.getApiDocs); // route to show the API docs.

apiRouter.post('/token', controllers.getToken);
apiRouter.put('/token', controllers.refreshToken);
apiRouter.delete('/token', controllers.deleteToken);
apiRouter.delete('/tokens', controllers.deleteAllTokens);

apiRouter.get('/users', controllers.getUsers);
apiRouter.post('/users', controllers.newUser);
apiRouter.put('/users', controllers.editUser);
apiRouter.delete('/users', controllers.deleteUser);

apiRouter.post('/users/avatar', controllers.uploadAvatar);

apiRouter.get('/users/:userSlug', controllers.getUser);

apiRouter.get('/users/:userSlug/counters', controllers.getCounters);
apiRouter.post('/users/:userSlug/counters', controllers.newCounter);


apiRouter.get('/users/:userSlug/counters/:counterSlug', controllers.getCounter);
apiRouter.put('/users/:userSlug/counters/:counterSlug', controllers.editCounter);
apiRouter.delete('/users/:userSlug/counters/:counterSlug', controllers.deleteCounter);

apiRouter.post('/users/:userSlug/counters/:counterSlug/img', controllers.uploadImgCounter);

apiRouter.put('/users/:userSlug/counters/:counterSlug/star', controllers.giveCounterStar);
apiRouter.delete('/users/:userSlug/counters/:counterSlug/star', controllers.removeCounterStar);

/**
 * END OF ROUTES
**/

// apply the routes to our application with the prefix /api
module.exports = apiRouter;
