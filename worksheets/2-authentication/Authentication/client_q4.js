const http = require('http');
const secretKey = "987643";
const crypto = require('crypto');


let user_public_key;

function createHMAC(sk, url) {
    const hmac = crypto.createHmac('sha256', sk); //second parameter is a secret key
    const v = hmac.update(url.query).digest('hex');
    console.log("Signature is: " + hmac.digest('hex'));
    return v
}



http.get({
    hostname: "localhost",
    port: 5000,
    path: "/api/test-user"
}).then(resp => {
    user_public_key = resp;
    let in_data = {'msg': "I am a POST"};
    http.post({
        hostname: "localhost",
        port: 5000,
        path: "/api/task",
        method: "POST",
        headers: {
            'x-signature': createHMAC(secretKey, "/api/task"),
            "authorization": "Token: " + user_public_key  // Setup to return the "access_key" on purpose
        },
        data: in_data
    })
})



