const {authJwt} = require('../middlewares');
const controller = require('../controllers/user.controller');

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    app.get('/api/user', [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);

    app.get('/api/user/:id', controller.findOne);
};
