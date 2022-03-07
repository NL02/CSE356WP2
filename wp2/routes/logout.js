var express = require('express');
var session = require('cookie-session')

var router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tictactoeGM:4JozKPHtsYTvTY6j@tictactoe.zbjog.mongodb.net/tictactoe?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async (req, res) => {
  let responseBody = {}
  res.setHeader('X-CSE356', "61fabf02756da8341262e107")
  responseBody['status'] = 'OK'
  // can fix the case where multiple users are using the server, set the user and pass 
  //    might need to 
  // res.session = session 
  res.cookie("username", "")
  res.clearCookie("username")
  res.clearCookie("gameBoard")
  res.clearCookie("startDate")
  // console.log("req session ", req.session)
  // req.session = null
  // session.startDate = JSON.stringify(new Date()).replace(/\"/g, "")
  return res.json(responseBody)
});

module.exports = router;

