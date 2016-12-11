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

    def construct_config_packet(self):
        return bytes(struct.pack('<HBBBB', self.delay, self.mode, self.red,
                           self.green, self.blue))


class CommandWrapper(object):
    def __init__(self, cfg=None):
        self.cfg = cfg

    def send_request(self, request_type, fp):
        if request_type == LD_CMD_CONFIG and not self.cfg:
            raise Exception('Requested config update without config')

        # header + request code
        packet = bytes('LGHT') + bytes(chr(request_type))

        if request_type == LD_CMD_CONFIG:
            packet += self.cfg.construct_config_packet()
        print 'sending request packet: %s' % repr(packet)
        fp.write(packet)
        fp.flush()

        return self.recv_reply(fp)

    def expect_header(self, fp):
        actual_header = fp.read(4)
        if actual_header != 'LGHT':
            raise Exception('Header was %s' % repr(actual_header))
        print 'got correct header'

    def recv_reply(self, fp):
        self.expect_header(fp)
        status, = struct.unpack('B', fp.read(1))
        self.cfg.delay, = struct.unpack('<H', fp.read(2))
        self.cfg.mode, = struct.unpack('B', fp.read(1))
        self.cfg.red, = struct.unpack('B', fp.read(1))
        self.cfg.green, = struct.unpack('B', fp.read(1))
        self.cfg.blue, = struct.unpack('B', fp.read(1))
        return (status, self.cfg)


if __name__ == '__main__':
    c = Config(2500, 5, 70, 90, 70)

    cmd = CommandWrapper(c)
    print 'opening device'
    with serial.Serial(CDC_DEVICE, CDC_BAUD, timeout=6) as device:
        time.sleep(1)
        print 'flushing input'
        device.readall()
        print 'flushed input'
        cmd_code = LD_CMD_CONFIG
        if len(sys.argv) > 1 and sys.argv[1] == '--status':
            cmd_code = LD_CMD_STATUS
        status, current_cfg = cmd.send_request(cmd_code, device)

        if cmd_code == LD_CMD_CONFIG:
            print 'new config uploaded'
        elif cmd_code == LD_CMD_STATUS:
            print 'status: %d' % status
            print 'delay: %d' % c.delay
            print 'mode: %d' % c.mode
            print 'red: %d' % c.red
            print 'green: %d' % c.green
            print 'blue: %d' % c.blue
