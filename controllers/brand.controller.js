const http = require('http');
const path = require('path');
const status = require('http-status');

let _brand;

const createBrand = (req, res) => {
    const brand = req.body;
    _brand.create(brand)
        .then((data) => {
            res.status(200);
            res.json({ msg: "Marca creado correcteamente", data: data });
        }).catch((err) => {
            res.status(400);
            res.json({ msg: "Error!", data: err });
        })
}

const findAll = (req, res) => {

    _brand.find()
        .then((data) => {
            if (data.lentgh == 0) {
                res.status(status.NO_CONTENT);
                res.json({ msg: 'No se encontraron marcas' })
            }
            res.status(status.OK);
            res.json({ msg: `Exito!!`, data: data });
        })
        .catch((err) => {
            res.status(status.BAD_REQUEST);
            res.json({ msg: 'Error!' });
        })
}

const findById = (req, res) => {
    const { id } = req.params;
    const params = {
        _id: id
    }

    _brand.find(params)
        .then((data) => {
            if (data.lentgh == 0) {
                res.status(status.NO_CONTENT);
                res.json({ msg: 'No se encontraron marcas' })
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

    _brand.findByIdAndRemove(params)
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

    _brand.update(query, { $set: newData },
    ).then((data) => {
        res.status(status.OK);
        res.json({ msg: 'Exito!!', data: data });
    })
        .catch((err) => {
            res.status(status.NOT_FOUND);
            res.json({ msg: 'Error! No se encontro!', err: err })
        })
}

module.exports = (Brand) => {
    _brand = Brand;
    return ({
        createBrand,
        findAll,
        deleteById,
        updateBy,
        findById
    })
}