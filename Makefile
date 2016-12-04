ARDUINO_DIR = arduino
ARDUINO_SRC_DIR = $(ARDUINO_DIR)/hardware/arduino/avr/cores/arduino
ARDUINO_VARIANTS_DIR = $(ARDUINO_DIR)/hardware/arduino/avr/variants/standard

ARDUINO_SOURCES = $(ARDUINO_SRC_DIR)/wiring_pulse.S \
	$(ARDUINO_SRC_DIR)/hooks.c \
	$(ARDUINO_SRC_DIR)/wiring.c \
	$(ARDUINO_SRC_DIR)/wiring_analog.c \
	$(ARDUINO_SRC_DIR)/wiring_digital.c \
	$(ARDUINO_SRC_DIR)/wiring_pulse.c \
	$(ARDUINO_SRC_DIR)/wiring_shift.c \
	$(ARDUINO_SRC_DIR)/abi.cpp \
	$(ARDUINO_SRC_DIR)/CDC.cpp \
	$(ARDUINO_SRC_DIR)/HardwareSerial.cpp \
	$(ARDUINO_SRC_DIR)/HardwareSerial0.cpp \
	$(ARDUINO_SRC_DIR)/IPAddress.cpp \
	$(ARDUINO_SRC_DIR)/main.cpp \
	$(ARDUINO_SRC_DIR)/new.cpp \
	$(ARDUINO_SRC_DIR)/Print.cpp \
	$(ARDUINO_SRC_DIR)/Stream.cpp \
	$(ARDUINO_SRC_DIR)/Tone.cpp \
	$(ARDUINO_SRC_DIR)/USBCore.cpp \
	$(ARDUINO_SRC_DIR)/WMath.cpp \
	$(ARDUINO_SRC_DIR)/WString.cpp \
	$(ARDUINO_SRC_DIR)/WInterrupts.cpp

FASTLED_DIR = fastled
FASTLED_SOURCES = $(FASTLED_DIR)/lib8tion.cpp \
	$(FASTLED_DIR)/hsv2rgb.cpp \
	$(FASTLED_DIR)/wiring.cpp \
	$(FASTLED_DIR)/FastLED.cpp \
	$(FASTLED_DIR)/bitswap.cpp \
	$(FASTLED_DIR)/colorpalettes.cpp \
	$(FASTLED_DIR)/power_mgt.cpp \
	$(FASTLED_DIR)/noise.cpp

SOURCES = $(ARDUINO_SOURCES) $(FASTLED_SOURCES) \
	src/prog.cpp src/Config.cpp src/SerialUtils.cpp

CXXOBJS = $(patsubst %.cpp, %.o, $(filter %.cpp, $(SOURCES)))
COBJS = $(patsubst %.c, %.o, $(filter %.c, $(SOURCES)))
ASMOBJS = $(patsubst %.S, %.ao, $(filter %.S, $(SOURCES)))

CC = avr-gcc
CXX = avr-g++
OBJCOPY = avr-objcopy
CFLAGS = -DARDUINO=160 \
	-I$(ARDUINO_SRC_DIR) \
	-I$(ARDUINO_VARIANTS_DIR) \
	-I./fastled/ -Os -D__AVR_ATmega328P__ \
	-DF_CPU=16000000UL -mmcu=atmega328p \
	-Wall -ffunction-sections -fdata-sections \
	-fno-exceptions -flto
CXXFLAGS = $(CFLAGS) -std=gnu++11 -fpermissive -fno-threadsafe-statics

all: prog.hex prog.bin

.cpp.o:
	$(CXX) $(CXXFLAGS) -c -o $@ $<
.c.o:
	$(CC) $(CFLAGS) -c -o $@ $<
.S.ao:
	$(CC) $(CFLAGS) -c -o $@ $<

src/prog: $(CXXOBJS) $(COBJS)
	$(CXX) -mmcu=atmega328p $^ -o $@

prog.bin: src/prog
	$(OBJCOPY) -O binary -R .eeprom $< $@

prog.hex: src/prog
	$(OBJCOPY) -O ihex -R .eeprom $< $@

clean:
	rm -f $(CXXOBJS) $(COBJS) $(ASMOBJS) src/prog prog.bin prog.hex

.PHONY: clean
