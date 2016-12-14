#ifndef LD_STATE_H
#define LD_STATE_H
#include "config.h"
#include "rpi_ws281x/ws2811.h"

typedef struct {
    unsigned int frame_number;
    ws2811_t led;
} lightsd_state_t;

void update_lights(lightsd_state_t *state, const lightsd_config_t *conf);

#endif
