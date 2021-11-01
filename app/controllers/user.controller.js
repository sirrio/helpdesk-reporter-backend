const db = require('../models');
const bcrypt = require('bcryptjs');
const User = db.user;
const Roles = db.role;

exports.findAll = (request, response) => {
    User.find().populate('roles', 'name').then(data => response.send(data)).catch(error => {
        console.log(error);
        response.status(500).send({
            message: error.message || 'error on user.findAll'
        });
    });
};

exports.findOne = (request, response) => {
    const id = request.params.id;
    User.findById(id).populate('roles', 'name').then(data => {
        if (data) response.send(data);
    }).catch(error => {
        response.status(500).send({message: error + `error on user.findOne with id=${id}`});
    });
};

exports.updateRole = (request, response) => {
    Roles.find({name: request.body.role}).then(role => {
        console.log(request.body.rm);
        if (!request.body.rm) {
            User.findByIdAndUpdate(request.body.id, {$pullAll: {'roles': role}}).then(() => {
                User.findByIdAndUpdate(request.body.id, {$push: {'roles': role}}).then(data => {
                    response.send(data);
                }).catch(error => {
                    response.status(500).send({message: error + 'error on updateRole'});
                });
            }).catch(error => {
                response.status(500).send({message: error + 'error on updateRole'});
            });
        } else {
            User.findByIdAndUpdate(request.body.id, {$pullAll: {'roles': role}}).then(data => {
                response.send(data);
            }).catch(error => {
                response.status(500).send({message: error + 'error on updateRole'});
            });
        }
    });
};

exports.updatePassword = (request, response) => {
    console.log(request.body);
    User.findByIdAndUpdate(request.body.id, {password: bcrypt.hashSync(request.body.password, 8)}).then(data => {
        response.send(data);
    }).catch(error => {
        response.status(500).send({message: error + 'error on update password'});
    });
};