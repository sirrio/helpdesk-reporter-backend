const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = (request, response, next) => {
    User.findOne({
        username: request.body.username
    }).exec((error, user) => {
        if (error) {
            response.status(500).send({message: error});
            return;
        }
        if (user) {
            response.status(400).send({message: 'Failed! Username is already in use!'});
            return;
        }
        User.findOne({email: request.body.email}).exec((error, user) => {
            if (error) {
                response.status(500).send({message: error});
                return;
            }
            if (user) {
                response.status(400).send({message: 'Failed! Email is already in use!'});
                return;
            }
            next();
        });
    });
};

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({message: `Failed! Role ${req.body.roles[i]} does not exist!`});
                return;
            }
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;
