#define _GNU_SOURCE
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <netinet/in.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <stdarg.h>
#include <fcntl.h>
#include <errno.h>
#include "config.h"
#include "proto.h"

#define LIGHTSD_SOCKET "/home/pat/lightsd.sock"
#define MIN_DELAY_PER_FRAME 100

lightsd_config_t g_lights_state = {
    .delay = 1000,
    .mode = 0,
    .r = 92,
    .g = 93,
    .b = 94
};

void debug_printf(const char *fmt, ...) {
    va_list ap;
#if defined(DEBUG)
    va_start(ap, fmt);
    vprintf(fmt, ap);
    va_end(ap);
#endif
}

unsigned int create_server_socket() {
    unsigned int s;
    int ret;
    struct sockaddr_un sock;

    memset(&sock, 0, sizeof(sock));
    sock.sun_family = AF_UNIX;
    strcpy(sock.sun_path, LIGHTSD_SOCKET);
    unlink(sock.sun_path);

    s = socket(AF_UNIX, SOCK_STREAM|SOCK_NONBLOCK, 0);
    ret = bind(s, (struct sockaddr *)&sock,
            strlen(sock.sun_path) + sizeof(sock.sun_family));
    if (ret < 0) {
        perror("bind");
        return -1;
    }
    ret = listen(s, 0);
    if (ret < 0) {
        perror("listen");
        return -1;
    }
    return s;
}

int config_sock;

#define RECV_BUF_SIZE 16

int main() {
    struct sockaddr_un client;
    int serv_sock, cli_sock, len, recv_buf_used, ret, cmd;
    unsigned char recv_buf[RECV_BUF_SIZE];

    serv_sock = create_server_socket();
    if (serv_sock < 0) {
        return 1;
    }
    config_sock = -1;
    printf("Lightsd up and running\n");
    debug_printf("sizeof lightsd_request_t: %d\n", sizeof(lightsd_request_t));
    while (1) {
        // accept only a single connection
        if (config_sock < 0) {
            // open new socket
            len = sizeof(struct sockaddr_un);
            cli_sock = accept4(serv_sock, (struct sockaddr *)&client,
                               &len, SOCK_NONBLOCK);
            if (cli_sock >= 0) {
                config_sock = cli_sock;
                recv_buf_used = 0;
                debug_printf("Opened socket (fd: %d)\n", config_sock);
            }
        } else {
            // peek for new config data in an already opened connection
            len = read(config_sock, recv_buf+recv_buf_used,
                       RECV_BUF_SIZE-recv_buf_used);
            if (len < 0) {
                if (errno == -EWOULDBLOCK || errno == -EAGAIN) {
                    continue;
                }
                debug_printf("err received (%s), resetting\n", strerror(errno));
                close(config_sock);
                config_sock = -1;
                recv_buf_used = 0;
            } else if (len > 0) {
                recv_buf_used += len;
                ret = ld_process_request(recv_buf, recv_buf_used,
                                         &cmd, &g_lights_state);
                debug_printf("ld_process_request ret: %d\n", ret);
                switch(ret) {
                    case LD_CONFIG_SHORT:
                        break;
                    case LD_CONFIG_OK:
                        switch (cmd) {
                        case LD_CMD_SET_CONFIG:
                            debug_printf("new config (%hu, %hhu, %hhu, %hhu, %hhu)\n",
                                         g_lights_state.delay, g_lights_state.mode,
                                         g_lights_state.r, g_lights_state.g,
                                         g_lights_state.b);
                            break;
                        case LD_CMD_GET_CONFIG:
                            debug_printf("Sending lights status to client\n");
                            break;
                        }
                    case LD_CONFIG_ERR:
                        recv_buf_used = 0;
                        ret = ld_send_reply(config_sock, ret, &g_lights_state);
                        printf("ld_send_reply ret: %d\n", ret);
                        if (ret < 0) {
                            perror("ld_send_reply");
                            close(config_sock);
                            config_sock = -1;
                            recv_buf_used = 0;
                        }
                        while ((len = read(config_sock, recv_buf, 16)) > 0)
                            ;
                        memset(recv_buf, 0, RECV_BUF_SIZE);
                        close(config_sock);
                        config_sock = -1;
                        recv_buf_used = 0;
                        debug_printf("connection state reset\n");
                        break;
                    default:
                        return -1;
                }
            }
        }
        usleep(MIN_DELAY_PER_FRAME * 1000);
    }
    return 0;
}
