const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = (request, response) => {
    const user = new User({
        username: request.body.username,
        email: request.body.email,
        password: bcrypt.hashSync(request.body.password, 8)
    });
    Role.findOne({name: 'user'}, (error, role) => {
        if (error) {
            response.status(500).send({message: error});
        } else {
            user.roles = [role._id];
            user.save().then(() => response.send({message: 'success on creating user'})).catch(error => {
                response.status(500).send({message: error});
            });
        }
    });
};

exports.signin = (request, response) => {
    User.findOne({username: request.body.username})
        .populate('roles', '-__v')
        .exec((error, user) => {
            if (error) {
                response.status(500).send({message: error});
            } else {
                if (!user) {
                    return response.status(404).send({message: 'User Not found.'});
                }
                const passwordIsValid = bcrypt.compareSync(request.body.password, user.password);
                if (!passwordIsValid) {
                    return response.status(401).send({
                        accessToken: null,
                        message: 'Invalid Password!'
                    });
                }
                const token = jwt.sign({id: user.id}, config.secret, {expiresIn: 86400});
                const authorities = [];
                for (let i = 0; i < user.roles.length; i++) {
                    authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
                }
                response.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                });
            }
        });
};
