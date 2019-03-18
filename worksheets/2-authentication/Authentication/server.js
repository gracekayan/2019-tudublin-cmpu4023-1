const http = require('http');
const fs = require('fs'); //file system module
const secretKey = "987643";
const crypto = require('crypto');

const express = require('express');
const app = express();


const massive = require('massive');

const conn = massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'CatherineKane',
    user: 'CatherineKane',
    password: 'postgres'
});

//404 response
function send404Res(res) {
    res.writeHead(404, {'Context-Type': 'text/plain'});
    res.write('Error 404, page not found');
    res.end();
}

function send200Res(res) {
    res.writeHead(200, {'Context-Type': 'text/plain'});
    res.write('Success');
    res.end();
}

function createHMAC(sk, url) {
    console.log(url);
    const hmac = crypto.createHmac('sha256', sk); //second parameter is a secret key
    const v = hmac.update(url).digest('hex');
    console.log("Signature is: " + hmac.digest('hex'));
    return v
}

// const server = http.createServer((req, res) => {
//     let inSignature = req.headers["x-signature"];
//
// if (req.url === '/api/task/') {
//     let query_url = url.parse(req.url);
//     let sig = runThisHMAC(secretKey, query_url);
//     if (sig === inSignature) {
//         // Success
//         send200Res(res);
//     } else {
//         //Fail
//         send404Res(res);
//     }
//
// }
// });
conn.then(db => {
    app.get('/api/test-user', (req, res) => {
        db.user_table.find({id: 4}, {}).then(
            user => {
                res.send(user[0].access_key);
            });
    })

    app.post('/api/task', (req, resp) => {
        let query = req.originalUrl;
        let token = req.headers["authorization"];
        let client_sig = req.headers['x-signature'];
        let user_auth = token.split(": ");
        if (user_auth[0] !== "Token") {
            return send404Res(resp);
        }
        // let query_url = url.parse(req.url);
        db.user_table.find({access_key: user_auth[1]}).then(u => {

            if (user_auth.length === 0) {
                console.log("User ERROR", u);
                return send404Res(resp);
            }

            let server_sig = createHMAC(secretKey, query);
            if (server_sig === client_sig) {
                // Success
                console.log("SUCCESS");
                console.log(server_sig, client_sig);
                send200Res(resp);
            } else {
                //Fail
                console.log("FAIL");
                console.log(server_sig, client_sig);
                send404Res(resp);
            }
        }).catch(e => {
            send404Res(e);
        })

    })
})

app.listen(5000);

//server.listen(5000);
console.log('connected to server...');