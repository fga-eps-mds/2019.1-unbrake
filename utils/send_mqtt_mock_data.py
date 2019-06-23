#!/usr/bin/python3
"""
For sending fake data to all unbrake/galpao subchannels,
for debugging
"""

from emitter import Client
from os import environ
from multiprocessing import Process
from random import randint
from time import sleep

PREFIX_CHANNEL = "unbrake/galpao"
FREQUENCY = 1

client = Client()

client.connect(
    host=environ.get("MQTT_HOST", default="unbrake.ml"),
    port=environ.get("MQTT_PORT", default=8080),
    secure=False
)
client.on_message = lambda m: print(str(m.channel) + m.as_string())
client.on_error = lambda m: print(e)

def publish_data(physical_quantity, subchannel, lower, upper):
    print("Sending", physical_quantity, "to", PREFIX_CHANNEL + '/' + subchannel + "...")

    while True:
        client.publish(
            environ.get("MQTT_KEY"),
            PREFIX_CHANNEL + '/' + subchannel,
            str(randint(lower, upper))
        )
        sleep(1/FREQUENCY)

params = (
    ('frequency', 'frequency', 400, 500),
    ('temperate1', 'temperature/sensor1', 400, 500),
    ('temperate2', 'temperature/sensor2', 400, 500),       
    ('brakingForce1', 'brakingForce/sensor1', 300, 400),
    ('brakingForce2', 'brakingForce/sensor2', 300, 400),       
    ('vibration', 'vibration', 300, 400),
    ('speed', 'speed', 200, 300),
    ('pressure', 'pressure', 200, 300),
    ('isAvailable', 'isAvailable', 500, 500)
)

for param in params:
    Process(target=publish_data, args=param).start()
