SOURCES = proto.c lightsd.c proto.h config.h
COBJS = $(patsubst %.c, %.o, $(filter %.c, $(SOURCES)))
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
