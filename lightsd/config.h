#ifndef LIGHTSD_CONFIG_H
#define LIGHTSD_CONFIG_H

#include <stdint.h>

#define LD_CONFIG_OK    0
#define LD_CONFIG_ERR   1  // bad configuration data
#define LD_CONFIG_SHORT 2  // not enough data

typedef struct {
    uint16_t delay;
    uint8_t mode;
    uint8_t r, g, b;
} lightsd_config_t;

#endif
