const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const port = process.env.PORT
const jwt_key = process.env.JWT_KEY

app.use(cors())

app.get('/', (req, res) => {
    //Route for health check
    res.status(200)
       .send({code: 0, 
              message: 'OK'})
})

app.get('/token', (req, res) => {
    //Route for getting a token
    let id = Math.random().toString(36).substring(2,8)
    let duration = 30
    let expires = Math.floor(Date.now() / 1000) + duration
    let payload = {
        _id: id,
        exp: expires,
    }

    let token = jwt.sign(payload, jwt_key);
    res.status(201)
       .send({code: 0, 
              message: 'OK',
              data: token})
})

app.get('/test', (req, res) => {
    //Route for validating a token
    const header = req.header('Authorization')
    const [type, token] = header.split(' ')
    if(type === 'Bearer' && typeof token !== 'undefined'){
        try{
            let payload = jwt.verify(token, jwt_key);
            let current = Math.floor(Date.now() / 1000)
      let diff = current - payload.exp;
            res.status(200)
               .send({code: 0, 
                      message: 'With verified token',
                      data: `${diff} seconds remaining`})
        }
        catch (err){
            res.status(401)
               .send({code: 401, message: 'Invalid or Expired Token'})
        }
    }
    else{
        res.status(402)
        .send({code: 402, message: 'Missing Token'})
    }

})

app.listen(port, err => {
    if(err){
        console.log('Error occured');
        return
    }
    console.log('Listening on port', port);
})