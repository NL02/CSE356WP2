var express = require('express');
var session = require('cookie-session')

var router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tictactoeGM:4JozKPHtsYTvTY6j@tictactoe.zbjog.mongodb.net/tictactoe?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

async function getUserGames(username) {
    try {
        await client.connect()
        db = client.db('tictactoe').collection('users')
        query = {"username": username}
        account = await db.findOne(query)
        console.log("list games", account)
        } catch (err) {
            return null
        } finally {
            await client.close()
            return account.games
        }
}
router.post('/', async (req, res) => {
    let userToCheck = req.cookies.username
    responseBody = {}
    res.status(200)
    res.setHeader('X-CSE356', "61fabf02756da8341262e107")
    if(req.cookies.username == undefined || req.cookies.username == null) {
        responseBody['status'] = "ERROR"
        return res.json(responseBody)
    }
    let games = await getUserGames(userToCheck)
    if (games != null) {
        responseBody['games'] = games
        responseBody['status'] = 'OK'
    } else {
        responseBody['status'] = "ERROR"
    }
    return res.json(responseBody)
});

module.exports = router;

