var express = require('express');
var amqp = require('amqplib/callback_api');
var router = express.Router();

router.post('/', function (req, res) {
    console.log("INCOMING IS ", JSON.stringify(req.body.keys.toString().split(",")));
    var keys = req.body.keys

    amqp.connect('amqp://localhost', function (err, conn) {
        if (err) {
            throw err
        }
        conn.createChannel(function (err, ch) {
            if (err) {
                console.log("Erroring when creating channel")
                throw err;
            }

            var queue = "hw3";

            ch.assertExchange(queue, 'direct', { durable: true });


            ch.assertQueue('', { exclusive: true }, function (err, q) {
                //console.log(' [*] Waiting for logs. To exit press CTRL+C');


                ch.consume(q.queue, function (msg) {
                    console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                    //console.log(msg);
                    //res.send({msg: msg})
                    //console.log(JSON.parse(msg.content.toString()));
                    res.json({ msg: msg.content.toString() });
                    ch.close(function () { conn.close() })
                }, { noAck: false });
            });

            // ch.assertQueue(queue, { durable: true });

            // ch.consume(queue, function (msg) {
            //     console.log(" [x] received %s", msg.content.toString());
            //     res.json({ msg: msg.content.toString() });
            //     ch.close(function () {
            //         conn.close()
            //     })
            // }, { noAck: true })

        })
    });
})


module.exports = router;