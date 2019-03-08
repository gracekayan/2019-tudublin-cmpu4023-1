/*
JWT
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const massive = require('massive');
const app = express();
const port = process.env.PORT || 5000;

const pwhash = "abc123";

const conn = massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'CatherineKane',
    user: 'CatherineKane',
    password: 'postgres'
})


/*
QUESTION 1 and 2
*/
conn.then(db => {

    app.get('/api', (req, res) => {
        res.send({greeting: 'Testing the API'});
    });

    /*
        Implement a users table having a username and hashed password fields.
        Use the postgresql crypt() and gen_salt() functions to implement the password hashing
    */
    app.get('/api/create_user', (req, res) =>
        db.query("INSERT INTO user_table(username, email, password) " +
            "VALUES (lower('Test4'), lower('TESTING4@gmail.com'), " +
            "crypt('testingz123', gen_salt('bf', 8))) RETURNING id, username, email, password;")
            .then(resp => {
                res.send(resp);
            }));

    /*
    QUESTION 2:
    A (pre-authentication) login API call which accepts a username and password and returns
    (if successful) a JWT with a set of claims.
    The claims should include, minimally, the user id and an expiry timestamp; the token should be set to expire no later than 24 hours        */

    app.post('/api/login/:id', (req, res) => {

        const userID = req.params.id;
        const username = req.params.username;
        // const password = crypt(req.params.password, gen_salt('bf', 8));

        db.user_table.find({id: userID}, {}).then(
            user => {
                console.log(user);

                jwt.sign({user}, 'secretkey', {expiresIn: '1 day'}, (err, token) => {
                    res.json({
                        token,
                        user
                    });
                });
            });
    });

    app.post('/api/login-user', (req, res) => {
        const username = req.query.username;
        const password = req.query.password;

        db.query("SELECT password =crypt('" + password + "', password) from user_table WHERE username = '" + username + "'").then(resp => {

            res.send(resp);

            const myObject = Object.values(resp[0]).toString();
            if (myObject === 'true') {
                console.log('got here as true');
                app.get('db').query("UPDATE products_table SET name='TESTINGTHIS' where id=2").then(resp => {

                    jwt.sign({resp}, 'secretkey', {expiresIn: '1 day'}, (err, token) =>
                    {
                        res.json({
                            token,
                            resp
                        })
                    })
                        console.log(resp);
                })
            }
            else {
                res.send("Not authenticated, please try again.");
            }
        }).catch(err => res.send(err) )
    });

    app.post('/api/posts', verifyUserToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, userData) => {
            if (err) {
                res.sendStatus(401);
            } else {
                res.json({
                    message: 'Post created...',
                    userData
                });
            }
        });

    });

    //Format of token
    //Authorization: Bearer <access_token>
    //verify token
    function verifyUserToken(req, res, next) {
        // Get the auth header value
        const bearerHeader = req.headers['authorization'];
        //Check if bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            //Split at the space
            const bearer = bearerHeader.split(' ');
            //Get token from array
            const bearerToken = bearer[1];
            //Set the token
            req.token = bearerToken;
            //Next middleware
            next();
        } else {
            //Forbidden
            res.sendStatus(401);
        }
    }
});

app.listen(5000, () => console.log(`Server started on port ${port}`));












