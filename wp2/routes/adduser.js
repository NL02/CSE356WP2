var express = require('express');
var router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tictactoeGM:4JozKPHtsYTvTY6j@tictactoe.zbjog.mongodb.net/tictactoe?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function addUser(username, password, email) {
  
  try {
    await client.connect()
    db = client.db('tictactoe')
    const test = db.collection("users")
    let userObject = {
      "username": username,
      "password": password,
      "email": email,
      "verified": false,
      "games": []
    }
    const insert = await test.insertOne(userObject)
  } catch (err) {
    console.log(err.stack)
    return false
  }
  finally {
    await client.close();
    return true
  }
  
};

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let email = req.body.email
  let addingUser = await addUser(username, password, email)
  let responseBody = {}
  if (addingUser) {
    responseBody['status'] = 'OK'
    
    res.setHeader('X-CSE356', "61fabf02756da8341262e107")
  } else {
    res.status("ERROR ADDING USER")
    responseBody['status'] = 'ERROR'
  }
  res.status(200)
  return res.json(responseBody)
});

module.exports = router;

