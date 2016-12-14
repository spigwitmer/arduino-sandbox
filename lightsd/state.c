#include "lightsd.h"
#include "state.h"
#include "rpi_ws281x/ws2811.h"
#include <stdint.h>

#define CFG_RGB(x) ((((uint32_t)x->r) << 16) + (((uint32_t)x->g) << 8) + ((uint32_t)x->b))

void update_lights(lightsd_state_t *state, const lightsd_config_t *conf) {
    int i;
    switch(conf->mode) {
        case LD_MODE_BLINK: // todo
        case LD_MODE_XMAS: // todo
        case LD_MODE_POWEROFF:
            for (i = 0; i < NUM_LEDS; ++i) { 
                state->led.channel[0].leds[i] = 0;
            }
            break;
        case LD_MODE_STATIC:
            for (i = 0; i < NUM_LEDS; ++i) {
                state->led.channel[0].leds[i] = CFG_RGB(conf);
            }
            break;
    }

}
