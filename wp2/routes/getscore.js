var express = require('express');
var session = require('cookie-session')

var router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tictactoeGM:4JozKPHtsYTvTY6j@tictactoe.zbjog.mongodb.net/tictactoe?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

async function getScores(username) {
  try {
    await client.connect()
    usersdb = client.db('tictactoe').collection('users')
    gamesdb = client.db('tictactoe').collection('completedGames')
    query = {"username": username}
    account = await usersdb.findOne(query)
    games = account.games
    scores = {
      "human": 0,
      "wopr": 0,
      "tie": 0
    }
    for(var i = 0; i < games.length; i++) {
      id = games[i].id
      query = {"id": id}
      try{ 
        game = await gamesdb.findOne(query)
        winner = game.winner
        if (winner == 'O') {
          scores["wopr"] += 1
        } else if (winner == "X") {
          scores["human"] += 1
        } else {
          scores["tie"] += 1
        }
      } catch (err) {
        console.log(err.stack)
        return null
      }
    }
  } catch (err) {
    console.log(err.stack)
    return null
  } finally {
    await client.close()
    return scores
  }
}
router.post('/', async (req, res) => {
  responseBody = {}
  res.status(200)
  res.setHeader('X-CSE356', "61fabf02756da8341262e107")
  if(req.cookies.username == undefined || req.cookies.username == null) {
      responseBody['status'] = "ERROR"
      return res.json(responseBody)
  }
  scores = await getScores(req.cookies.username)
  responseBody["human"] = scores["human"]
  responseBody["wopr"] = scores["wopr"]
  responseBody["tie"] = scores["tie"]
  responseBody["status"] = "OK"
  return res.json(responseBody)
});

module.exports = router;

