WS281X_SOURCES = rpi_ws281x/mailbox.c \
				 rpi_ws281x/ws2811.c \
				 rpi_ws281x/pwm.c \
				 rpi_ws281x/dma.c \
				 rpi_ws281x/rpihw.c
SOURCES = proto.c lightsd.c state.c proto.h config.h state.h
COBJS = $(patsubst %.c, %.o, $(filter %.c, $(SOURCES))) \
		$(patsubst %.c, %.o, $(filter %.c, $(WS281X_SOURCES)))
#CFLAGS = -O2
CFLAGS = -O0 -g3
EXTRA_CFLAGS = -DDEBUG

CC = gcc

.c.o:
	$(CC) $(CFLAGS) $(EXTRA_CFLAGS) -c -o $@ $<

lightsd: $(COBJS)
	$(CC) $^ -o $@

clean:
	rm -f lightsd $(COBJS)
