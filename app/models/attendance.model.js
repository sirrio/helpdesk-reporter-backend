const mongoose = require('mongoose');

const schema = mongoose.Schema(
    {
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        semester: String,
        date: String,
        startTime: String,
        endTime: String,
        degreeCourse: String,
        faculty: String,
        mathBasic: Boolean,
        mathLow: Boolean,
        mathHigh: Boolean,
        programming: Boolean,
        physics: Boolean,
        chemistry: Boolean,
        organizational: Boolean
    },
    {timestamps: true}
);

const Attendance = mongoose.model(
    'Attendance', schema
);

schema.set('toJSON', {
    virtuals: true
});

module.exports = Attendance;
