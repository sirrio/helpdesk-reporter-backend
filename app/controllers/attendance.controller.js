const db = require('../models');
const Attendance = db.attendance;
const User = db.user;

exports.create = (request, response) => {
    // sanity checks here!
    // if (!request.body.degreeCourse) {
    //     response.status(400).send({message: 'Content can not be empty!'});
    //     return;
    // }
    User.findById(request.body.tutor, (error, user) => {
        if (error) {
            console.log(error.message);
            response.status(500).send({
                message: error.message || `error on attendance.create with userid=${request.body.tutor}`
            });
        } else {
            const body = request.body;
            const attendance = new Attendance({
                tutor: user._id,
                semester: body.semester,
                date: body.date,
                startTime: body.startTime,
                endTime: body.endTime,
                degreeCourse: body.degreeCourse,
                faculty: body.faculty,
                mathBasic: body.mathBasic,
                mathLow: body.mathLow,
                mathHigh: body.mathHigh,
                programming: body.programming,
                physics: body.physics,
                chemistry: body.chemistry,
                organizational: body.organizational
            });
            attendance.save().then(data => {
                if (!data) {
                    response.status(404).send({message: 'failure saving attendance'});
                } else {
                    response.send(data);
                }
            }).catch(error => {
                console.log(error);
                response.status(500).send({message: error.message || 'error on attendance.create'});
            });
        }
    });
};

exports.findAll = (request, response) => {
    Attendance.find().populate('tutor', 'username').sort({
        date: 'descending',
        startTime: 'ascending'
    }).then(data => {
        if (!data) {
            response.status(404).send({message: 'failure finding all attendance'});
        } else {
            response.send(data);
        }
    }).catch(error => {
        console.log(error);
        response.status(500).send({message: error.message || 'error on attendance.findAll'});
    });
};

exports.findAllBySemester = (request, response) => {
    const semester = request.params.semester;
    Attendance.find({semester: semester}).populate('tutor', 'username').sort({
        date: 'descending',
        startTime: 'ascending'
    }).then(data => {
        if (!data) {
            response.status(404).send({message: 'failure finding all attendance'});
        } else {
            response.send(data);
        }
    }).catch(error => {
        console.log(error);
        response.status(500).send({message: error.message || 'error on attendance.findAll'});
    });
};

exports.findAllByUser = (request, response) => {
    const id = request.params.user;
    Attendance.find({tutor: id}).populate('tutor', 'username').sort({
        date: 'descending',
        startTime: 'ascending'
    }).then(data => {
        if (!data) {
            response.status(404).send({message: 'failure finding all attendance'});
        } else {
            response.send(data);
        }
    }).catch(error => {
        console.log(error);
        response.status(500).send({message: error.message || 'error on attendance.findAll'});
    });
};

exports.findAllByUserAndSemester = (request, response) => {
    const id = request.params.user;
    const semester = request.params.semester;
    Attendance.find({tutor: id, semester: semester}).populate('tutor', 'username').sort({
        date: 'descending',
        startTime: 'ascending'
    }).then(data => {
        if (!data) {
            response.status(404).send({message: 'failure finding all attendance'});
        } else {
            response.send(data);
        }
    }).catch(error => {
        console.log(error);
        response.status(500).send({message: error.message || 'error on attendance.findAll'});
    });
};

exports.findOne = (request, response) => {
    const id = request.params.id;
    Attendance.findById(id).populate('tutor', 'username').then(data => {
        if (!data) {
            response.status(404).send({message: 'failure finding attendance'});
        } else {
            response.send(data);
        }
    }).catch(error => {
        console.log(error);
        response.status(500).send({message: error + `error on attendance.findOne with id=${id}`});
    });
};

exports.update = (request, response) => {
    const id = request.params.id;
    Attendance.findByIdAndUpdate(id, request.body, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                response.status(404).send({message: 'failure updating attendance'});
            } else {
                response.send({message: 'success updating attendance'});
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).send({message: error + `error on attendance.update with id=${id}`});
        });
};

exports.updateByUser = (request, response) => {
    const id = request.params.id;
    Attendance.findByIdAndUpdate(id, request.body, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                response.status(404).send({message: 'failure updating attendance'});
            } else {
                response.send({message: 'success updating attendance'});
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).send({message: error + `error on attendance.update with id=${id}`});
        });
};

exports.delete = (request, response) => {
    const id = request.params.id;

    Attendance.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                response.status(404).send({message: 'failure deleting attendance'});
            } else {
                response.send({message: 'success deleting attendance!'});
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).send({message: error + `error on attendance.delete with id=${id}`});
        });
};

exports.deleteByUser = (request, response) => {
    const id = request.params.id;
    Attendance.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                response.status(404).send({message: 'failure deleting attendance'});
            } else {
                response.send({message: 'success deleting attendance!'});
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).send({message: error + `error on attendance.delete with id=${id}`});
        });
};

