const axios = require('axios');
const cookieparser = require('cookieparser');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const baseURL = 'https://fabman.io/api/v1/';

// TODO: a hell more of exception handling and general hardening
exports.handler = function(event, context, callback) {
  console.log('a');
  let token = null;
  if (event.headers.cookie) {
    const parsed = cookieparser.parse(event.headers.cookie)
    try {
      token = parsed.jwt
    } catch (err) {
      //console.log(err);
      return callback(null, {
        statusCode: 401,
        body: 'Unauthorized'
      });
    }
  }

  if (!token) {
    return callback(null, {
      statusCode: 401,
      body: 'Unauthorized'
    });
  }

  var client = jwksClient({
    jwksUri: 'https://grandgarage.eu.auth0.com/.well-known/jwks.json'
  });
  function getKey(header, callback) {
    client.getSigningKey(header.kid, function(err, key) {
      let signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  }

  console.log('b');

  jwt.verify(token, getKey, function(err, decoded) {
    if (!err) {
      console.log('verified');
      let fabmanId = decoded['https://grandgarage.eu/fabmanId'];

      console.log('token', process.env.FABMAN_TOKEN);

      const instance = axios.create({
        baseURL,
        headers: {'Authorization': `Bearer ${process.env.FABMAN_TOKEN}`}
      });

      instance.get(`members/${fabmanId}`).then((r) => {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(r.data)
        });
      }).catch((e) => {
        //console.log(e);
        callback(null, {
          statusCode: 500,
          body: 'ERROR'
        });
      });
    } else {
      //console.log(err);
      callback(null, {
        statusCode: 500,
        body: 'ERROR'
      });
    }
  });
};
