#ifndef LIGHTSD_PROTO_H
#define LIGHTSD_PROTO_H

#include <stdint.h>
#include "config.h"

#define LD_CMD_SET_CONFIG 0x0
#define LD_CMD_GET_CONFIG 0x1

#define LD_PROTO_HEADER 0x5448474c // "LGHT"

typedef struct __attribute__((__packed__)) {
    uint32_t header;
    uint8_t cmd;
} lightsd_request_t;

typedef struct __attribute__((__packed__)) {
    uint32_t header;
    uint8_t status;
    lightsd_config_t config;
} lightsd_response_t;

uint8_t ld_process_request(uint8_t *buf, int len, int *cmd, lightsd_config_t *c);
int ld_send_reply(int sock, uint8_t status, lightsd_config_t *c);

#endif
