#!/usr/bin/python3
"""
For getting data from all unbrake/galpao subchannels,
for debugging
"""

from emitter import Client
from os import environ
from time import sleep

FREQUENCY = 1

client = Client()

client.connect(
    host=environ.get("MQTT_HOST", default="unbrake.ml"),
    port=environ.get("MQTT_PORT", default=8080),
    secure=False
)
client.on_message = lambda m: print(str(m.channel) + m.as_string())
client.on_error = lambda m: print(e)
client.subscribe(environ.get("MQTT_KEY") , "unbrake/galpao/+/")

while True:
    client.loop_start()
    sleep(1/FREQUENCY)
