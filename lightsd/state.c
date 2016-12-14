#include "lightsd.h"
#include "state.h"
#include "rpi_ws281x/ws2811.h"
#include <stdint.h>
#include <stdlib.h>

#define CFG_RGB(x) ((((uint32_t)x->r) << 16) + (((uint32_t)x->g) << 8) + ((uint32_t)x->b))

void update_lights(lightsd_state_t *state, const lightsd_config_t *conf) {
    int i;
    switch(conf->mode) {
        case LD_MODE_BLINK:
            for (i = 0; i < NUM_LEDS; ++i) {
                if (!state->frame_number) {
                    state->led.channel[0].leds[i] = CFG_RGB(conf);
                } else {
                    state->led.channel[0].leds[i] = 0;
                }
            }
            state->frame_number = (state->frame_number + 1) % 2;
            break;
        case LD_MODE_XMAS:
            for (i = 0; i < NUM_LEDS; ++i) {
                state->led.channel[0].leds[i] = ((rand() % 2) ? 0x00700000 : 0x00007000);
            }
            break;
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
