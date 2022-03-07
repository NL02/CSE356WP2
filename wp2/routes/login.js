var session = require('cookie-session')
var express = require('express');

var router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tictactoeGM:4JozKPHtsYTvTY6j@tictactoe.zbjog.mongodb.net/tictactoe?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

async function sessionLogin(username, password) {
  try {
    await client.connect()
    db = client.db('tictactoe').collection('users')
    let user = null
    query = {"username": username, 'password': password}
    account = await db.findOne(query)
    } catch (err) {
      return null
    } finally {
      await client.close()
      return account
  }}
  
router.post('/', async (req, res, next) => {
  let username = req.body.username
  let password = req.body.password
  let accountInfo = await sessionLogin(username, password)
  let responseBody = {}
  res.setHeader('X-CSE356', "61fabf02756da8341262e107")
  if (accountInfo != null && accountInfo.verified == true) {
      responseBody['status'] = 'OK'
      res.cookie("username", username)

  } else {

      responseBody['status'] = 'ERROR'
  }
  if (req.cookies.gameBoard == undefined) {
    res.cookie("gameBoard", [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
    res.cookie("startDate", JSON.stringify(new Date()).replace(/\"/g, ""))
  }
  return res.json(responseBody)
});

module.exports = router;

