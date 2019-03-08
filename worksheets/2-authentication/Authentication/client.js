const http = require('http');
const express = require('express');
const app = express();
let secretKey = "987643";

const conn = massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'CatherineKane',
    user: 'CatherineKane',
    password: 'postgres'
});


function createHMAC(sk, url) {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', sk); //second parameter is a secret key
    const v = hmac.update(url.query).digest('hex');
    console.log("Signature is: " + hmac.digest('hex'));
    return v
}

/*
QUESTION 3 and 4: HMAC
 */
conn.then(db => {

    app.get('/api', (req, res) => {
        res.send({greeting: 'Welcome to HMAC authentication'});
    });

    //alter user_table to include secretKey and accessKey
    app.get('/api/alter_table', (req, res) =>
        db.query("ALTER TABLE user_table " +
            "ADD secret_key varchar(100), " +
            "ADD access_key varchar(255);")
            .then(resp => {
                res.send(resp);
            }));


    //inserted a user without a hashed or salted password
    app.get('/api/create_user', (req, res) =>
        db.query("INSERT INTO user_table(username, email, password) " +
            "VALUES (lower('HMACTest123'), lower('TESTING@gmail.com'), " +
            "'password123') RETURNING id, username, email, password;")
            .then(resp => {
                res.send(resp);
            }));


    app.post('/api/task/', (req, res) => {
        let hmac = createHMAC(secretKey, req.url);
        const userID = req.params.id;
        db.user_table.find({id: userID}, {}).then(
            user => {
                res.send(user);
            });
    });

});

