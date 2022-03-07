var express = require('express');
var amqp = require('amqplib/callback_api');
var router = express.Router();

router.post('/', function (req, res) {
    var key = JSON.stringify(req.body.key.toString())
    var msg = JSON.stringify(req.body.msg.toString())
    console.log("send call is ", key, msg)
    amqp.connect('amqp://localhost', function (err, conn) {
        if (err) {
            throw err;
        }
        conn.createChannel(function (err, channel) {
            if (err) {
                throw err;
            }
            var queue = "hw3";
            channel.assertExchange(queue, 'direct', { durable: true })
            channel.assertQueue(queue, { durable: true })
            // channel.sendToQueue(queue, Buffer.from(msg))

            channel.publish(queue, key, new Buffer(msg));
            res.setHeader('X-CSE356', '61f4987cee02ae7247241658')
            res.status(200);
            return res
        })
    })
    // res.setHeader('X-CSE356', '61f4987cee02ae7247241658')
    // res.status(200);
    // return res
})

module.exports = router;