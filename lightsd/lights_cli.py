#!/usr/bin/env python2


import socket
import struct
import warnings

SOCK_PATH = '/home/pat/lightsd.sock'

LD_CMD_SET_CONFIG = 0x0
LD_CMD_GET_CONFIG = 0x1

LGHT_HEADER, = struct.unpack('<I', b'LGHT')

def send_get_config_request(sock):
    buf = bytearray(b'LGHT')
    buf.append(LD_CMD_GET_CONFIG)
    sock.sendall(buf)

def send_set_config_request(sock, delay, mode, r, g, b):
    buf = bytearray(b'LGHT')
    buf.append(LD_CMD_SET_CONFIG)
    buf += struct.pack('HBBBB', delay, mode, r, g, b)
    sock.sendall(buf)


class Response(object):
    def __init__(self):
        self.delay = 0
        self.mode = 0
        self.r = 0
        self.g = 0
        self.b = 0

    def recv(self, sock):
        # 4 + 1 + 2 + 1 + 1 + 1 + 1
        reply = sock.recv(11)
        print repr(reply)
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

if __name__ == '__main__':
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    sock.connect(SOCK_PATH)
    send_get_config_request(sock)
    #send_set_config_request(sock, 30000, 3, 50, 51, 52)
    response = Response()
    response.recv(sock)
    sock.close()
    print 'delay: %d' % response.delay
    print 'mode: %d' % response.mode
    print 'r: %d' % response.r
    print 'g: %d' % response.g
    print 'b: %d' % response.b
