==RPi to Arduino configuration protocol==

1. RPi sends a command packet:
```
header: 4 bytes - "LGHT" (0x4c 0x47 0x48 0x54)
command: 1 byte - (0x00 = update, 0x01 = status)
```

if command is 0x00 (update):
```
delay (in ms, little endian): 2 bytes
mode: 1 byte
red color value (0-255): 1 byte
green color value (0-255): 1 byte
blue color value (0-255): 1 byte
```

2. Arduino responds with a status packet:
```
header: 4 bytes - "LGHT" (0x4c 0x47 0x48 0x54)
status: 1 byte - (0x00 = ok, 0x01 = error)
delay (in ms, little endian): 2 bytes
mode: 1 byte
red color value (0-255): 1 byte
green color value (0-255): 1 byte
blue color value (0-255): 1 byte
```
