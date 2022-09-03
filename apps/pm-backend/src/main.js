/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import * as express from 'express';

const express = require('express');
const cors = require('cors');
const okta = require('@okta/okta-sdk-nodejs');
const axios = require('axios');

const app = express();

app.use(express.json());

app.use(cors());

const client = new okta.Client({
  orgUrl: 'https://dev-42684472.okta.com/',
  token: '00TW3soK2Eq883PaRVu5rjqRniqE6iaueZOivSe91P',
});

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to pm-backend!' });
});

//for signing up the user
app.post('/api/v1/newuser', async (req, res, next) => {
  const body = req.body;

  try {
    createUserInOkta();
    async function createUserInOkta() {
      const response = await client.createUser(body);
      
      res.send({
        res: response,
      });
    }
  } catch (err) {
    res.send({
      err: err,
    });
  }
});

//for foreget password
app.get('/api/v1/forgotpassword', (req, res) => {
  // const id = req.body;

  const api_token = '00TW3soK2Eq883PaRVu5rjqRniqE6iaueZOivSe91P';

  const url =
    'https://dev-42684472.okta.com/api/v1/users/00u6ch8hf8la2KWR55d7/credentials/forgot_password?sendEmail=true';

  forgotPassword();
  async function forgotPassword() {
    try {
      const res = await axios({
        method: 'post',
        url: url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `SSWS ${api_token}`,
        },
      });

      // console.log(res);

      res.send({
        data: res,
      });
    } catch (err) {
      res.send({
        Error: err,
      });
    }
  }
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
