/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const { getForm, addOrUpdateForm} = require('./dynamo');
//insert post

const { postInsert } = require('./controllers/post/postInsert');

//delete post
const {postDelete} = require('./controllers/post/postDelete');


//get singe post

const {postSingleGet} = require('./controllers/post/postSingleGet');

//update post

const {postUpdate} = require('./controllers/post/postUpdate');

// declare a new express app
var app = express()
app.use(cors());

app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

const connection = MongoClient.connect('mongodb+srv://starmarketing:Crystalball007@cluster0.u64nt.mongodb.net',
 { useUnifiedTopology: true })


var i=1
app.post('/post/form',async(req, res) => {
    try {
        // console.log(req.body)
        const data = await addOrUpdateForm({...req.body,id:i+''})
        i++
        res.json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({err:"Something went wrong"})
    }
})

app.get('/post/form',async(req, res) => {
    try {
        const data = await getForm()
        res.json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({err:"Something went wrong"})
    }
})

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "*")
  res.header("Access-Control-Allow-Headers", "*")
  res.header("Access-Control-Allow-Credentials", true)
  next()
});


/**********************
 * Example get method *
 **********************/

 app.get('/post', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});
app.get('/', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!'});
});

// app.get('/post/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

app.get('/post/:id',postSingleGet(connection))

//getSinglePost
// app.get('/post/:id',function(req,rest){
//   var query = { '_id' : req.params.id };
//   console.log(query);
//   console.log('query');
// connection.then(client => {    
//   const post = client.db('news').collection('post').findOne(query).then(function(results){
   
//       // res.send(results.deletedCount? "Deleted" :"record not found");
//       if(!results)
//       throw new Error('No record found.');
//       console.log(results);//else case
    
   
//   })
//   .catch(error => console.error(error))
//   })
// })


/****************************
* Example post method *
****************************/

app.post('/post',postInsert(connection))

// app.post('/post', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });



/****************************
* Example put method *
****************************/

// app.put('/post', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

app.put('/post',postUpdate(connection))

app.put('/post/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/post' ,postDelete(connection))

app.delete('/post/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3001, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
