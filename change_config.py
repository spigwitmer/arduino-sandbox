#!/usr/bin/env python

import serial
import sys
import struct
import time

CDC_DEVICE = '/dev/ttyACM0'
CDC_BAUD = 9600

LD_CMD_CONFIG = 0x00
LD_CMD_STATUS = 0x01


class Config(object):
    def __init__(self, delay, mode, red, green, blue):
        self.delay = delay
        self.mode = mode
        self.red = red
        self.green = green
        self.blue = blue

    def send(self, fp):
        fp.write(struct.pack('<H', self.delay))
        fp.write(struct.pack('B', self.mode))
        fp.write(struct.pack('B', self.red))
        fp.write(struct.pack('B', self.green))
        fp.write(struct.pack('B', self.blue))


class PacketUtils(object):
    def send_request(self, request_type, fp):
        self.send_header(fp)
        self.send_request_code(fp, request_type)

    def send_header(self, fp):
        fp.write(bytes('LGHT'))

    def send_request_code(self, fp, code):
        fp.write(bytes(''.join(map(chr, [code]))))

    def send_config(self, config, fp):
        config.send(fp)

    def expect_header(self, fp):
        actual_header = fp.read(4)
        if actual_header != 'LGHT':
            raise Exception('Header was %s' % actual_header)

    def recv_reply(self, fp):
        self.expect_header(fp)
        status, = struct.unpack('B', fp.read(1))
        delay, = struct.unpack('<H', fp.read(2))
        mode, = struct.unpack('B', fp.read(1))
        red, = struct.unpack('B', fp.read(1))
        green, = struct.unpack('B', fp.read(1))
        blue, = struct.unpack('B', fp.read(1))
        return (status, Config(delay, mode, red, green, blue))


if __name__ == '__main__':
    c = Config(500, 4, 90, 90, 90)

    pu = PacketUtils()
    with serial.Serial(CDC_DEVICE, CDC_BAUD, timeout=3) as device:
        time.sleep(1)
        device.readall()
        pu.send_request(LD_CMD_CONFIG, device)
        c.send(device)
        device.flush()

        status, current_cfg = pu.recv_reply(device)
        print 'status: %d' % status
        print 'delay: %d' % current_cfg.delay
        print 'mode: %d' % current_cfg.mode
        print 'red: %d' % current_cfg.red
        print 'green: %d' % current_cfg.green
        print 'blue: %d' % current_cfg.blue
