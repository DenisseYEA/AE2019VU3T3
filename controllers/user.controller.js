const http = require('http');
const path = require('path');
const status = require('http-status');
const jwt = require('jsonwebtoken');
const _config = require('../_config');
const csv = require('csvtojson')
const sendmail = require("../utils/sendmail");


let _user;
const coolPath = path.join(__dirname, '../usuarios.csv');
const csvFilePath = coolPath;

const createUser = (req, res) => {
    const user = req.body;

    _user.create(user)
        .then((data) => {
            const env = {
                to: user.email,
                subject: "TAREA 07 - AE2019V",
                text: `Este es un mensaje que se "envio" a ${data.name}`,
                html: `<head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Document</title>
            
                <style>
                    .button {
                        background-color: #4CAF50;
                        /* Green */
                        border: none;
                        color: white;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                    }
                </style>
            </head>
            
            <body>
                <div>
                    <div align="center">
                        <h1 style="font-size:50px; color: blue">Correo de confirmacion</h1>
                        <p>Let's confirm your email address.</p>
                    </div>
                    <div align="center">
                    <a href="http://localhost:3000/api/v1/usuarios/activate/${data._id}" class="button">Confirm Email Address</a>
                    </div>
                </div>
            </body>`
            };
            sendmail.send(env);
            res.status(200);
            res.json({ msg: "Usuario creado correctamente", data: data });
        })
        .catch((err) => {
            res.status(400);
            res.json({ msg: "Error!!!!", data: err });
        })
}

const findAll = (req, res) => {

    _user.find()
        .then((data) => {
            if (data.lentgh == 0) {
                res.status(status.NO_CONTENT);
                res.json({ msg: 'No se encontraron usuarios' })
            } else {
                res.status(status.OK);
                res.json({ msg: `Exito!!`, data: data });
            }
        })
        .catch((err) => {
            res.status(status.BAD_REQUEST);
            res.json({ msg: 'Error!' });
        });
}

const findById = (req, res) => {
    const { id } = req.params;
    const params = {
        _id: id
    }

    _user.find(params)
        .then((data) => {
            if (data.lentgh == 0) {
                res.status(status.NO_CONTENT);
                res.json({ msg: 'No se encontro el usuario' })
            }
            res.status(status.OK);
            res.json({ msg: `Exito!!`, data: data });
        })
        .catch((err) => {
            res.status(status.BAD_REQUEST);
            res.json({ msg: 'Error!' });
        })
}

const deleteById = (req, res) => {
    const { id } = req.params;
    //esto es lo mismo const id = req.params.id;

    const params = {
        _id: id
    }

    _user.findByIdAndRemove(params)
        .then((data) => {
            res.status(status.OK);
            res.json({ msg: 'Exito!!', data: data });
        })
        .catch((err) => {
            res.status(status.NOT_FOUND);
            res.json({ msg: 'Error! No se encontro!', err: err })
        })
}

const updateBy = (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    const query = { _id: id };

    _user.update(query, { $set: newData },
    ).then((data) => {
        res.status(status.OK);
        res.json({ msg: 'Exito!!', data: data });
    })
        .catch((err) => {
            res.status(status.NOT_FOUND);
            res.json({ msg: 'Error! No se encontro!', err: err })
        })
}

const login = (req, res) => {
    const { email, password } = req.params;
    let query = { email: email, password: password };
    _user.findOne(query, "-password")
        .then((user) => {
            if (user) {
                const token = jwt.sign({ email: email }, _config.SECRETJWT);
                res.status(status.OK);
                res.json({
                    msg: "Acceso exitoso",
                    data: {
                        user: user,
                        token: token
                    }
                });
            } else {
                res.status(status.NOT_FOUND);
                res.json({ msg: "Error!!! No se encontró" });
            }
        })
        .catch((err) => {
            res.status(status.NOT_FOUND);
            res.json({ msg: "Error!!! No se encontró", err: err });
        });
};

const saveFromCSV = async (req, res) => {

    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            _user.create(jsonObj)
                .then((jsonObj) => {
                    res.status(200);
                    res.json({ msg: "Usuarios creados correctamente", jsonObj: jsonObj });
                })
                .catch((err) => {
                    res.status(400);
                    res.json({ msg: "Error!!!!", data: err });
                })
        })
    const jsonArray = await csv().fromFile(csvFilePath);
}

const activateUser = (req, res) => {
    const id = req.params.id;
    const newData = {active:true};

    const query = { _id: id };

    _user.update(query, { $set: newData },
    ).then((data) => {
        res.status(status.OK);
        res.json({ msg: 'Active User!!'});
    })
        .catch((err) => {
            res.status(status.NOT_FOUND);
            res.json({ msg: 'Error! No se encontro!', err: err })
        })
}

module.exports = (User) => {
    _user = User;
    return ({
        createUser,
        findAll,
        deleteById,
        updateBy,
        findById,
        login,
        saveFromCSV,
        activateUser
    })
}

//actualizar user solo debe actualizar lo que se le envie; ejemplo nombre