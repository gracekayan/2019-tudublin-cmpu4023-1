var express = require('express');
var router = express.Router();
var models = require('../models/index');


router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
/*
  USERS SECTION
 */

/*
  PRODUCTS SECTION
 */

// list all products
router.get('/products', function (req, res) {
    models.products.findAll({}).then(function (products) {
        res.json(products);
    });
});

// list a single product
router.get('/products/:id', function (req, res) {
    models.products.find({
        where: {
            id: req.params.id
        }
    }).then(function (products) {
        res.json(products);
    });
});

//add new product
router.post('/products', function (req, res) {
    models.products.create({
        title: req.body.title,
        price: req.body.price
    }).then(function (products) {
        res.json(products);
    });
});

// update single product
router.put('/products/:id', function (req, res) {
    models.products.find({
        where: {
            id: req.params.id
        }
    }).then(function (products) {
        if (products) {
            products.updateAttributes({
                title: req.body.title,
                complete: req.body.complete,
                price: req.body.price
            }).then(function (products) {
                res.send(products);
            });
        }
    });
});

// delete a single product
router.delete('/products/:id', function (req, res) {
    models.products.destroy({
        where: {
            id: req.params.id
        }
    }).then(function (products) {
        res.json(products);
    });
});

/*
    PURCHASE ITEMS
 */
// get all purchase items
router.get('/purchase-items', function (req, res) {
    models.purchase_items.findAll({}).then(function (purchase_items) {
        res.json(purchase_items);
    });
});

/*
    PURCHASE ITEMS
 */
// get all purchase items
router.get('/purchases', function (req, res) {
    models.purchases.findAll({}).then(function (purchase) {
        res.json(purchase);
    });
});

//post new purchase item
router.post('/purchases', function (req, res) {
    models.purchases.create({
        title: req.body.title,
        name: req.body.name,
        address: req.body.address,
        state: req.body.state,
        zipcode: req.body.zipcode,
    }).then(function (purchases) {
        res.json(purchases);
    });
});

/*
    USERS
 */
// get all users
router.get('/users', function (req, res) {
    models.users.findAll({}).then(function (users) {
        res.json(users);
    });
});

//post new user
router.post('/users', function (req, res) {
    models.users.create({
        email: req.body.email,
        password: req.body.password,
        details: req.body.details
    }).then(function (users) {
        res.json(users);
    });
});

module.exports = router;
