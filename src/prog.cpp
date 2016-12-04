#include <Arduino.h>
#include <HardwareSerial.h>
#include "FastLED.h"
#include "Config.h"
#include "SerialUtils.h"

using namespace Lightsdude::SerialUtils;
using Lightsdude::Config;
 
#define NUM_LEDS 50
#define DATA_PIN 9
#define DEBUG_PIN 6

#define MIN_MS_PER_TICK 20

CRGB leds[NUM_LEDS];
Config cfg(1000, 0x0, 128, 128, 128);
int header, read_in;
uint16_t ms_count;

void setup()
{
    Serial.begin(9600);
    Serial.setTimeout(100);
    FastLED.addLeds<WS2811, DATA_PIN, RGB>(leds, NUM_LEDS);
#if DEBUG_PIN > 0
    pinMode(DEBUG_PIN, OUTPUT);
#endif
    randomSeed(analogRead(0));

    ms_count = 0;
}

void loop()
{
    if (Serial.available() > 0)
    {
        int cmd = ReadCommand(&Serial);
        switch (cmd) {
            case LD_CMD_CONFIG:
                read_in = cfg.Read(&Serial);
                WriteResponse(read_in, &cfg, &Serial);
                break;
            case LD_CMD_STATUS:
                WriteResponse(LD_CONFIG_OK, &cfg, &Serial);
                break;
            case -1:
            default:
                WriteResponse(LD_CONFIG_ERR, &cfg, &Serial);
                break;
        }
    }

#if DEBUG_PIN > 0
    // blink an LED or something cfg.m_mode+1 number of times
    for (read_in = 0; read_in < cfg.m_mode+1; ++read_in)
    {
        digitalWrite(DEBUG_PIN, HIGH);
        delay(200);
        digitalWrite(DEBUG_PIN, LOW);
        delay(200);
    }
    delay(2000);
#endif

    FastLED.show();
}
