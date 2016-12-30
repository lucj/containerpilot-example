const express        = require('express'),
      bodyParser     = require('body-parser'),
      MongoClient    = require('mongodb').MongoClient,
      Piloted        = require('piloted'),
      ContainerPilot = require('./containerpilot.json'),
      app            = express(),
      url            = process.env.MONGODB_URL  || 'mongodb://db/todos';

// Configure app to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to database
function connection(url, callback){
    MongoClient.connect(url, function(err, conn) {
        if(err){
            return callback(err);
        } else {
            return callback(null, conn);
        }
    });
}

// Connection to db on startup
let db = null;
Piloted.config(ContainerPilot, (err) => {
  connection(url, function(err, conn){
    db = conn;
  });
  // Reconnect when ContainerPilot reloads its configuration
  Piloted.on('refresh', () => {
    connection(url, function(err, conn){
      db = conn;
    });
  });
});

// Define routes

// List all elements in the list
app.get('/todos', (req, res) => {
  db.collection('todo').find().toArray((err, result) => {
    if(err){
      return res.status(500).json({error: err.message});
    } else {
      return res.json({todos: result});
    }
  });
});

// Create a new element in the list
app.post('/todos', (req, res) => {
  db.collection('todo').insert({text: req.body.text}, (err, result) => {
    if(err){
      return res.status(500).json({error: err.message});
    } else {
      return res.sendStatus(201);
    }
  });
});

app.listen(1337);
