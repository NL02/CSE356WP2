var express = require('express');
var router = express.Router();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tictactoeGM:4JozKPHtsYTvTY6j@tictactoe.zbjog.mongodb.net/tictactoe?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

router.post('/', async(req, res) => {
    let email = req.body.email
    let key = req.body.key
    responseBody = {}
    res.status(200)
    res.setHeader('X-CSE356', "61fabf02756da8341262e107")
    if( key != 'abracadabra') {
        responseBody['status'] = 'ERROR'
        return res.json(responseBody)
    }
    await client.connect()
    db = client.db('tictactoe').collection('users')
    query = {"email": email}
    db.updateOne(query, 
                    { $set:
                        {
                            verified: true
                        }
                    }
                )
    responseBody = {}
    responseBody['status'] = 'OK'
    return res.json(responseBody)
});

module.exports = router;

