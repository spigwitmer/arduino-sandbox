#!/usr/bin/env python

from flask import Flask, abort, request
import socket
import json

app = Flask(__name__)

LIGHTSD_SOCKET = '/var/run/lightsd.sock'
DEBUG = True

app.config['PROPAGATE_EXCEPTIONS'] = DEBUG

MODE_POWEROFF = 0
MODE_STATIC = 1
MODE_BLINK = 2
MODE_XMAS = 3

VALID_MODES = [
    MODE_POWEROFF,
    MODE_STATIC,
    MODE_BLINK,
    MODE_XMAS
    ]

class LightStateManager(object):
    def __init__(self, r=155, g=155, b=155,
                 delay=1000, mode=0):
        self.delay = delay
        self.mode = mode
        self.r = r
        self.g = g
        self.b = b
        self.socket = socket.socket(socket.AF_UNIX,
                                    socket.SOCK_STREAM)

    def retrieve_state(self):
        if DEBUG:
            return
        self.socket.connect(LIGHTSD_SOCKET)
        # TODO: unix socket schtuff

    def set_state(self, mode, delay, r, g, b):
        if not DEBUG:
            pass # TODO: unix socket schtuff
        self.delay = delay
        self.mode = mode
        self.r = r
        self.g = g
        self.b = b

LIGHTS_STATE = LightStateManager()
LIGHTS_STATE.retrieve_state()

@app.route('/lights', methods=['GET'])
def get_current_state():
    LIGHTS_STATE.retrieve_state()
    return json.dumps({
        'mode': LIGHTS_STATE.mode,
        'delay': LIGHTS_STATE.delay,
        'r': LIGHTS_STATE.r,
        'g': LIGHTS_STATE.g,
        'b': LIGHTS_STATE.b
    })

@app.route('/lights', methods=['POST'])
def set_state():
    post_info = request.get_json()

    mode = int(post_info['mode'])
    delay = int(post_info['delay'])
    r, g, b = int(post_info['r']), \
              int(post_info['g']), \
              int(post_info['b'])

    if post_info['mode'] not in VALID_MODES:
        abort(400)
    if r < 0 or r > 255:
        abort(400)
    if g < 0 or g > 255:
        abort(400)
    if b < 0 or b > 255:
        abort(400)
    if delay < 100 or delay > 60000:
        abort(400)

    LIGHTS_STATE.set_state(mode, delay, r, g, b)

    return "", 202
