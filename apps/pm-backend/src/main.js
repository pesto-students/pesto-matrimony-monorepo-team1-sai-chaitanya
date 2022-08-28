/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

 // import * as express from 'express';

 const express = require("express");
 const cors = require('cors');
 const okta = require('@okta/okta-sdk-nodejs');
 
 const app = express();
 
 app.use(express.json());
 
 app.use(cors());
 
 const client = new okta.Client({
   orgUrl: 'https://dev-42684472.okta.com/',
   token: '00TW3soK2Eq883PaRVu5rjqRniqE6iaueZOivSe91P'    
 });
 
 app.get('/', (req, res) => {
   res.send({ message: 'Welcome to pm-backend!' });
 });
 
 app.post('/api/v1/newuser', async (req, res) => {
 
   const body = req.body;
 
   try{
     createUserInOkta();
     async function createUserInOkta(){
       const response = await client.createUser(body);
       res.send({
         res: response
       });
     }
   }catch(err){
     res.send(err);
   }
 
 });
 
 const port = process.env.port || 3333;
 const server = app.listen(port, () => {
   console.log(`Listening at http://localhost:${port}/api`);
 });
 server.on('error', console.error);
 