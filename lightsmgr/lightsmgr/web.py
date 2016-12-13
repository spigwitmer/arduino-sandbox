#!/usr/bin/env python

from flask import Flask, abort, request, Response
import socket
import json
import struct

app = Flask(__name__)

LIGHTSD_SOCKET = '/home/pat/lightsd.sock'
DEBUG = False
LGHT_HEADER, = struct.unpack('<I', b'LGHT')

app.config['PROPAGATE_EXCEPTIONS'] = True

MODE_POWEROFF = 0
MODE_STATIC = 1
MODE_BLINK = 2
MODE_XMAS = 3

LD_CMD_SET_CONFIG = 0x0
LD_CMD_GET_CONFIG = 0x1

VALID_MODES = [
    MODE_POWEROFF,
    MODE_STATIC,
    MODE_BLINK,
    MODE_XMAS
    ]

def send_get_config_request(sock):
    buf = bytearray(b'LGHT')
    buf.append(LD_CMD_GET_CONFIG)
    sock.sendall(buf)

def send_set_config_request(sock, delay, mode, r, g, b):
    buf = bytearray(b'LGHT')
    buf.append(LD_CMD_SET_CONFIG)
    buf += struct.pack('HBBBB', delay, mode, r, g, b)
    sock.sendall(buf)

class LightsResponse(object):
    def __init__(self):
        self.delay = 0
        self.mode = 0
        self.r = 0
        self.g = 0
        self.b = 0

    def recv(self, sock):
        reply = sock.recv(11)
        header, status, delay, mode, r, g, b = struct.unpack('<IBHBBBB',
                                                             reply)
        if header != LGHT_HEADER:
            raise Exception('header was %s' % header)
        if status != 0:
            warnings.warn('Server reported error %d' % status)
        self.delay = delay
        self.mode = mode
        self.r = r
        self.g = g
        self.b = b

class LightStateManager(object):
    def __init__(self, r=75, g=75, b=75,
                 delay=1000, mode=0):
        self.delay = delay
        self.mode = mode
        self.r = r
        self.g = g
        self.b = b
        self._refresh_socket()

    def _refresh_socket(self):
        self.socket = socket.socket(socket.AF_UNIX,
                                    socket.SOCK_STREAM)
        self.socket.settimeout(2.0)

    def retrieve_state(self):
        if DEBUG:
            return
        try:
            self.socket.connect(LIGHTSD_SOCKET)
            send_get_config_request(self.socket)
            self._handle_response()
        finally:
            self.socket.close()
            self._refresh_socket()

    def _handle_response(self):
        r = LightsResponse()
        r.recv(self.socket)
        self.delay = r.delay
        self.mode = r.mode
        self.r = r.r
        self.g = r.g
        self.b = r.b

    def set_state(self, delay, mode, r, g, b):
        if not DEBUG:
            try:
                self.socket.connect(LIGHTSD_SOCKET)
                send_set_config_request(self.socket,
                        delay, mode, r, g, b)
                self._handle_response()
            finally:
                self.socket.close()
                self._refresh_socket()
        else:
            self.delay = delay
            self.mode = mode
            self.r = r
            self.g = g
            self.b = b

LIGHTS_STATE = LightStateManager()
LIGHTS_STATE.retrieve_state()

@app.route('/lights', methods=['GET', 'OPTIONS'])
def get_current_state():
    if request.method == 'GET':
        LIGHTS_STATE.retrieve_state()
        resp = Response(json.dumps({
            'mode': LIGHTS_STATE.mode,
            'delay': LIGHTS_STATE.delay,
            'r': LIGHTS_STATE.r,
            'g': LIGHTS_STATE.g,
            'b': LIGHTS_STATE.b
        }))
        resp.headers['Content-Type'] = 'application/json'
    else:
        resp = Response("")
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return resp

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

    LIGHTS_STATE.set_state(delay, mode, r, g, b)

    resp = Response("")
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.status_code = 202

    return resp
