var session = require('cookie-session')
var express = require('express');


var router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tictactoeGM:4JozKPHtsYTvTY6j@tictactoe.zbjog.mongodb.net/tictactoe?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

router.get('/', function (req, res, next) {
    res.setHeader('X-CSE356', '61fabf02756da8341262e107')
     res.render('index', { title: 'Express' });
});

var winCondition = [ 
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

async function checkWinner(grid) {
    for (var i = 0; i < winCondition.length; i++) {
        let firstCon = winCondition[i][0];
        let secondCon = winCondition[i][1];
        let thirdCon = winCondition[i][2];
        
        if (grid[firstCon] === grid[secondCon] &&
            grid[secondCon] === grid[thirdCon] &&
            grid[thirdCon] === grid[firstCon]
            ) {
            return grid[firstCon]
        }
    }
    return " "
}

async function checkFill(grid) {
    let count = 0
    for (var i = 0; i < 9; i++) {
        if(grid[i] == 'O' || grid[i] == 'X') {
            count += 1;
        }
    }
    if (count == 9) {
        return true
    }
    return false
}

async function saveGame(username, board, winner, startDate) {
    try{
        await client.connect()
        usersdb = client.db('tictactoe').collection('users')
        gamesdb = client.db('tictactoe').collection('completedGames')
        // save the game based on the len of the games
        query = {"username": username}
        account = await usersdb.findOne(query)

        len = await gamesdb.count()
        gameID = 'g'.concat(len.toString())
        // update the games array within a user account
        try {
            await usersdb.updateOne(query,
            {
                $push: {
                    'games':{
                        'id': gameID,
                        'start_date': startDate
                    }
                }
            })
        } catch (err) {
            console.log(err.stack)
            return false
        }
        // upload the completed game 
        try {
            let completedGame = {
                "id": gameID,
                "grid": board,
                "winner": winner
            }
            var insert = await gamesdb.insertOne(completedGame)
        } catch (err) {
            console.log(err.stack)
            return false
        }
    } catch (err) {
        console.log(err.stack)
        return false
    } finally {
        await client.close()
        return true
    }
}

// client is X, bot is O 
router.post('/', async (req, res, next) => {
    console.log("req cookies ", req.cookies)
    console.log("session board", req.cookies.gameBoard)
    // console.log("move being processed", req)
    let responseBody = {}
    res.setHeader('X-CSE356', "61fabf02756da8341262e107")
    // might need to change this 
    if(req.cookies.username == undefined) {
        responseBody['status'] = 'ERROR'
        return res.json(responseBody)
    }
    // initialize the board if it's the person's first time 
    if(req.cookies.gameBoard == null || req.cookies.gameBoard == undefined) {
        req.cookies.gameBoard = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        req.cookies.startDate = JSON.stringify(new Date()).replace(/\"/g, "")
    }
    // process the move 
    // if move is null then return board
    if(req.body.move == null) {
        responseBody['status'] = 'OK'
        responseBody['grid'] = req.cookies.gameBoard
        responseBody['winner'] = ' '
        return res.json(responseBody)
    }
    // move is an index
    move = parseInt(req.body.move)

    // if the move is illegal then send an err, could possibly just be send a board
    if(req.cookies.gameBoard[move] == 'X' || req.cookies.gameBoard[move] == 'O'
    || move > 8 || move < 0) {
        // might need to fill the grid with emptys/restart the req.cookies grid
        responseBody['grid'] = []
        responseBody['winner'] = " "
        responseBody['status'] = 'ERROR'
        return res.json(responseBody)
    }

    // if move is legal process the move, X
    req.cookies.gameBoard[move] = 'X' 
    res.cookie("gameBoard", req.cookies.gameBoard)
    //check for winner, 
    let clientWin = await checkWinner(req.cookies.gameBoard)
    if (clientWin == 'X') {
        let saved = await saveGame(req.cookies.username, req.cookies.gameBoard, 'X', req.cookies.startDate)
        // case where db save goes wrong?? might not need this
        if(saved != true) {
            responseBody['grid'] = req.cookies.gameBoard
            responseBody['winner'] = ' '
            responseBody['status'] = 'ERROR'
            return res.json(responseBody)
        }
        responseBody['grid'] = req.cookies.gameBoard
        responseBody['winner'] = 'X'
        responseBody['status'] = 'OK'
        res.cookie("gameBoard", [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
        res.cookie("startDate", JSON.stringify(new Date()).replace(/\"/g, ""))

        //if winner, save the board into the db, reset the req.cookies board, possibly send an empty board back 
        return res.json(responseBody)
    }
    //check for filled board(tie)
    let clientFillCheck = await checkFill(req.cookies.gameBoard)
    if(clientFillCheck) {
        let saved = await saveGame(req.cookies.username, req.cookies.gameBoard, ' ', req.cookies.startDate)
        // case where db save goes wrong?? might not need this
        if(saved != true) {
            responseBody['grid'] = req.cookies.gameBoard
            responseBody['winner'] = ' '
            responseBody['status'] = 'ERROR'
            return res.json(responseBody)
        }
        responseBody['grid'] = req.cookies.gameBoard
        responseBody['winner'] = ' '
        responseBody['status'] = 'OK'
        res.cookie("gameBoard", [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
        res.cookie("startDate", JSON.stringify(new Date()).replace(/\"/g, ""))

        return res.json(responseBody)
    }

    // bot can make a move
    for(var i = 8; i > -1 ; i--) {
        if(req.cookies.gameBoard[i] == ' ') {
            req.cookies.gameBoard[i] = 'O'
            break
        }
    }
    res.cookie("gameBoard", req.cookies.gameBoard)
    let botWin = await checkWinner(req.cookies.gameBoard)
    if (botWin == 'O') {
        let saved = await saveGame(req.cookies.username, req.cookies.gameBoard, 'O', req.cookies.startDate)
        // casee where db save goes wrong?? might not need this
        if(saved != true) {
            responseBody['grid'] = req.cookies.gameBoard
            responseBody['winner'] = ' '
            responseBody['status'] = 'ERROR'
            return res.json(responseBody)
        }
        responseBody['grid'] = req.cookies.gameBoard
        responseBody['winner'] = 'O'
        responseBody['status'] = 'OK'
        res.cookie("gameBoard", [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
        res.cookie("startDate", JSON.stringify(new Date()).replace(/\"/g, ""))

        //if winner, save the board into the db, reset the req.cookies board, possibly send an empty board back 
        return res.json(responseBody)
    }
    //check for filled board(tie)
    let botFillCheck = await checkFill(req.cookies.gameBoard)
    if(botFillCheck) {
        responseBody['grid'] = req.cookies.gameBoard
        responseBody['winner'] = ' '
        responseBody['status'] = 'OK'
        res.cookie("gameBoard", [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
        res.cookie("startDate", JSON.stringify(new Date()).replace(/\"/g, ""))

        return res.json(responseBody)
    }

    // no one won and board is not filled so return the board 
    responseBody['grid'] = req.cookies.gameBoard
    responseBody['winner'] = ' '
    responseBody['status'] = 'OK'
    return res.json(responseBody)
})
module.exports = router;
