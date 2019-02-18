const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const massive = require('massive');

const conn = massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'pgguide',
    user: 'postgres',
    password: ''
})

conn.then(db => {

   /* GET /users
    List all users email and sex in order of most recently created. Do not include password hash in your output
     */
    app.get('/users', (req, res) => db.query("SELECT email, details FROM users ORDER BY created_at DESC").then( resp =>
    {
        res.send(resp);
    }))

    /*
    GET /users/:id
    Show above details of the specified user
    */
    app.get('/users/:id', (req, res) => {
        //retrieve id
        let user_id = req.params.id;

        db.users.find({id: user_id}, {}).then(
            user => {

            res.send(user);
        })
    });

    /*GET /products
    List all products in ascending order of price*/
    // app.get('/products', (req, res) => db.query("SELECT * FROM products ORDER BY price ASC").then( resp =>
    // {
    //     res.send(resp);
    // }))
    //
    // /*
    // GET /products/:id
    // Show above details of the specified products
    // */
    // app.get('/products/:id', (req, res) => {
    //     let pid = req.params.id;
    //
    //     db.products.find({id: pid}, {}).then(
    //         prod => {
    //
    //             res.send(prod);
    //         })
    // });

    /*
    GET /purchases
    List purchase items to include the receiver’s name and,
    address, the purchaser’s email address and the price,
    quantity and delivery status of the purchased item. Order by price in descending order
     */
    app.get('/purchases', (req, res) => db.query(" SELECT " +
        "        p.name\n" +
        "       ,p.address\n" +
        "        , u.email\n" +
        "        , pi.price\n" +
        "        , pi.quantity\n" +
        "        , pi.state\n" +
        "    FROM purchase_items pi\n" +
        "    INNER JOIN purchases p\n" +
        "    on pi.purchase_id = p.id\n" +
        "    INNER JOIN users u\n" +
        "    on p.user_id = u.id").then( resp =>
    {
        console.log(resp);
    }))


    /*
    GET /products[?name=string]
    extend the product indexing endpoint to allow the filtering of products by name as follows
     */
    app.get('/products', (req, res) => {

        // Retrieve the tag from our URL path
        let query_string = req.query.name;
        //check if query string
        //[?name=string]
        if(query_string === undefined)
        {
            db.products.find({}, {}).then(
                product => {
                    res.send(product);
                })
        }
        else{
            db.products.find({title: query_string}, {}).then(
                product => {
                    res.send(product);
                })
        }

    })

    //example of SQL injection
    app.get('/products/inject', (req, res) =>
    {

        let query_string = req.query.name;

        db.query("SELECT * FROM products WHERE title= '" + query_string + "' ").then( resp => {
        res.send(resp);
        })

    })


    //using a parametrised query
    app.get('/products/sql-protect', (req, res) =>
    {

        let query_string = req.query.name;

        db.query("SELECT * FROM products WHERE title=$1", query_string ).then(resp => {
            res.send(resp);
        })

    })

    //using a stored procedure
    app.get('/users/sql-protect-it', (req, res) =>
    {

        let _email = req.query.email;
        let stmt = "CREATE OR REPLACE FUNCTION authenticate(_email TEXT)" +
            " RETURNS details AS $$" +
            " SELECT * FROM users WHERE email=_email";

        db.query(stmt, _email ).then(resp => {
            res.send(resp);
        })
    })

});




