#!/bin/bash

SOCKET_FILE=/run/lightsd/lightsd.sock

sleep 1
chown root:lights $SOCKET_FILE
chmod g+rw $SOCKET_FILE
