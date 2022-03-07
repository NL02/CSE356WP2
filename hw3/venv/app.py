from flask import Flask, request
import pika
# from pika import channel

app = Flask(__name__)

@app.route('/listen', methods=['POST'])

def listen():
    ret = ""
    print(request.json)
    print(request.json.keys)
    connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()
    result = channel.queue_declare(queue='', exclusive=True)
    queue_name = result.method.queue

    for key in request.json["keys"]:
        print("KEY: ", key)
        channel.queue_bind(exchange="hw3", routing_key=key, queue=queue_name)
    print(' [*] Waiting for logs. To exit press CTRL+C', queue_name)
    
    method_frame, header_frame, body = channel.basic_get('hw3')

    while not method_frame:
       method_frame, header_frame, body = channel.basic_get(queue_name)
       print(method_frame)

    print(body)
    channel.basic_ack(method_frame.delivery_tag)


    return {"msg": body.decode("utf-8")}


@app.route('/speak', methods=['POST'])
def speak():
    key = request.json["key"]
    msg = request.json["msg"]

    connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    channel.basic_publish(exchange='hw3', routing_key=key, body=msg)
    connection.close()
    return "WHEEEE"
