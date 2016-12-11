#include <stddef.h>
#include <stdint.h>
#include <unistd.h>
#include "proto.h"
#include "config.h"

#define LD_CONFIG_MAX_MODES 3
#define LD_CONFIG_DELAY_MIN 100
#define LD_CONFIG_DELAY_MAX 60000

uint8_t ld_process_request(uint8_t *buf, int len, int *cmd, lightsd_config_t *c) {
    lightsd_config_t *new_config;
    lightsd_request_t *pkt;

    if (len < sizeof(lightsd_request_t)) {
        // not enough has been read to parse
        return LD_CONFIG_SHORT;
    }

    pkt = (lightsd_request_t *)buf;
    if (pkt->header != LD_PROTO_HEADER) {
        return LD_CONFIG_ERR;
    }

    switch (pkt->cmd) {
        case LD_CMD_GET_CONFIG:
            *cmd = LD_CMD_GET_CONFIG;
            return LD_CONFIG_OK;
        case LD_CMD_SET_CONFIG:
            if (len - sizeof(lightsd_request_t) < sizeof(lightsd_config_t)) {
                return LD_CONFIG_SHORT;
            }
            new_config = (lightsd_config_t *)(buf+sizeof(lightsd_request_t));
            if (    (new_config->mode > LD_CONFIG_MAX_MODES)
                 || (new_config->delay < LD_CONFIG_DELAY_MIN)
                 || (new_config->delay > LD_CONFIG_DELAY_MAX) ) {
                return LD_CONFIG_ERR;
            }
            c->delay = new_config->delay;
            c->mode = new_config->mode;
            c->r = new_config->r;
            c->g = new_config->g;
            c->b = new_config->b;
            *cmd = LD_CMD_SET_CONFIG;
            return LD_CONFIG_OK;
        default:
            return LD_CONFIG_ERR;
    }
}

int ld_send_reply(int sock, uint8_t response_code, lightsd_config_t *c) {
    lightsd_response_t pkt;
    pkt.header = LD_PROTO_HEADER;
    pkt.status = response_code;
    pkt.config = *c;

    return write(sock, &pkt, sizeof(pkt));
}
