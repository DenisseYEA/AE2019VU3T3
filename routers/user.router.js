const router = require('express').Router();

module.exports = (wagner) => {
    const userCtrl = wagner.invoke((User) =>
        require('../controllers/user.controller')(User))

    router.post('/', (req, res) => {
        userCtrl.createUser(req, res);
    });

    router.get('/insertUsers', (req, res) => {
        userCtrl.saveFromCSV(req, res);
    });

    router.get('/activate/:id', (req, res) => {
        userCtrl.activateUser(req, res);
    });

    router.get('/', (req, res) => {
        userCtrl.findAll(req, res);
    });

    router.get('/:id', (req, res) => {
        userCtrl.findById(req, res);
    });

    router.get('/login/:email/:password', (req, res) => {
        userCtrl.login(req, res)
    });

    router.delete('/:id', (req, res) => {
        userCtrl.deleteById(req, res);
    });

    router.put('/:id', (req, res) => {
        userCtrl.updateBy(req, res);
    });

    return router;
}
//invoke, lo que tengo disponible enviarselo al controlador