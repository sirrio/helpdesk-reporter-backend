const {authJwt} = require('../middlewares');
const controller = require('../controllers/attendance.controller.js');

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    app.post('/api/attendance/', [authJwt.verifyToken, authJwt.isModerator], controller.create);
    app.get('/api/attendance/:id', [authJwt.verifyToken, authJwt.isModerator], controller.findOne);
    app.get('/api/attendance/s/:semester', [authJwt.verifyToken, authJwt.isModerator], controller.findAllBySemester);
    app.get('/api/attendance/u/:user', [authJwt.verifyToken, authJwt.isModerator], controller.findAllByUser);
    app.get('/api/attendance/u/:user/s/:semester', [authJwt.verifyToken, authJwt.isModerator], controller.findAllByUserAndSemester);
    app.put('/api/attendance/u/:user/:id', [authJwt.verifyToken, authJwt.isModerator], controller.updateByUser);
    app.delete('/api/attendance/u/:user/:id', [authJwt.verifyToken, authJwt.isModerator], controller.deleteByUser);

    app.get('/api/attendance', [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
    app.put('/api/attendance/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.update);
    app.delete('/api/attendance/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.delete);

};
