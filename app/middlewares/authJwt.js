const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');
const User = db.user;
const Role = db.role;

const verifyToken = (request, response, next) => {
    let token = request.headers['x-access-token'];
    if (!token) return response.status(403).send({message: 'No token provided!'});
    jwt.verify(token, config.secret, (error, decoded) => {
        if (error) return response.status(401).send({message: 'Unauthorized!'});
        request.userId = decoded.id;
        next();
    });
};

const isAdmin = (request, response, next) => {
    User.findById(request.userId).exec((err, user) => {
        if (err) {
            response.status(500).send({message: err});
        } else {
            Role.find({_id: {$in: user.roles}},
                (error, roles) => {
                    if (error) {
                        response.status(500).send({message: error});
                    } else {
                        for (let i = 0; i < roles.length; i++) {
                            if (roles[i].name === 'admin') {
                                next();
                                return;
                            }
                        }
                        response.status(403).send({message: 'Require Admin Role!'});
                    }
                }
            );
        }
    });
};

const isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
        } else {
            Role.find({_id: {$in: user.roles}},
                (err, roles) => {
                    if (err) {
                        res.status(500).send({message: err});
                    } else {
                        for (let i = 0; i < roles.length; i++) {
                            if (roles[i].name === 'moderator') {
                                next();
                                return;
                            }
                        }
                        res.status(403).send({message: 'Require Moderator Role!'});
                    }
                }
            );
        }
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};
module.exports = authJwt;
