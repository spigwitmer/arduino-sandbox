FASTLED_CXXSOURCES = fastled/lib8tion.cpp \
fastled/colorutils.cpp \
fastled/hsv2rgb.cpp \
fastled/wiring.cpp \
fastled/FastLED.cpp \
fastled/bitswap.cpp \
fastled/colorpalettes.cpp \
fastled/power_mgt.cpp \
fastled/noise.cpp \
CXXSOURCES = prog.cpp $(FASTLED_SOURCES)

CXXOBJS = $(CXXSOURCES:.cpp=.o)

CXX = avr-g++
OBJCOPY = avr-objcopy
CXXFLAGS = -I./fastled/ -Os -D__AVR_ATmega328P__ -DF_CPU=16000000UL -mmcu=atmega328p

all: prog.hex prog.bin

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $<

prog: $(CXXOBJS)
	$(CXX) -mmcu=atmega328p $^ -o $@

prog.bin: prog
	$(OBJCOPY) -O binary -R .eeprom $< $@

prog.hex: prog
	$(OBJCOPY) -O ihex -R .eeprom $< $@
