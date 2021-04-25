/*global process*/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConfig = require('./app/config/db.config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const corsOptions = {origin: 'http://localhost:8081'};
app.use(cors(corsOptions));

const db = require('./app/models');
const Role = db.role;
const User = db.user;

db.mongoose.connect(
    `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfully connect to MongoDB.');
        initial();
    })
    .catch(err => {
        console.error('Connection error', err);
        process.exit();
    });

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/attendance.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

app.get('/', (req, res) => res.json({message: 'invalid'}));

const bcrypt = require('bcryptjs');

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        let userroleid;
        let modroleid;
        let adminroleid;
        if (!err && count === 0) {
            new Role({name: 'user'}).save((error, userrole) => {
                if (error)
                    console.log('error', error);
                else {
                    userroleid = userrole._id;
                    new Role({name: 'moderator'}).save((error, modrole) => {
                        if (error)
                            console.log('error', error);
                        else {
                            modroleid = modrole._id;
                            new Role({name: 'admin'}).save((error, adminrole) => {
                                if (error)
                                    console.log('error', error);
                                else {
                                    adminroleid = adminrole._id;
                                    const passwd = '123456';
                                    const user = new User({
                                        username: 'admin',
                                        email: '',
                                        password: bcrypt.hashSync(passwd, 8),
                                        roles: [adminroleid, userroleid, modroleid]
                                    });
                                    user.save(error => {
                                        if (error)
                                            console.log('error', error);
                                        else
                                            console.log(`INITIALIZE: admin with password=${passwd}`);
                                    });
                                    console.log('INITIALIZE: added role "ADMIN"');
                                    const passwddavid = '654321';
                                    const david = new User({
                                        username: 'david',
                                        email: 'home@sirrio.de',
                                        password: bcrypt.hashSync(passwddavid, 8),
                                        roles: [userroleid, modroleid]
                                    });
                                    david.save(error => {
                                        if (error)
                                            console.log('error', error);
                                        else
                                            console.log(`INITIALIZE: david with password=${passwddavid}`);
                                    });
                                    console.log('INITIALIZE: added role "ADMIN"');
                                }
                            });
                            console.log('INITIALIZE: added role "MODERATOR"');
                        }
                    });
                    console.log('INITIALIZE: added role "USER"');
                }
            });
        }
    });
}
