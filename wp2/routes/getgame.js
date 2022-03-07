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
  responseBody['status'] = 'ERROR'
  try {
    await client.connect()
    gamesdb = client.db('tictactoe').collection('completedGames')
    query = {"id": req.body.id}
    game = await gamesdb.findOne(query)
    console.log("fetched game", game)
    responseBody['grid'] = game.grid
    responseBody['winner'] = game.winner
  } catch (err) {
    console.log(err.stack)
    responseBody['grid'] = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
    responseBody['winner'] = " "
    return res.json(responseBody)
  }
  responseBody['status'] = 'OK'
  return res.json(responseBody)
});

module.exports = router;

