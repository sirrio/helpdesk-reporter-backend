const db = require('../models');
const User = db.user;

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
