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
Config cfg(1000, 0x1, 128, 128, 128);
int header, read_in, i;
uint16_t ms_count;

void setup()
{
    FastLED.addLeds<WS2811, DATA_PIN, RGB>(leds, NUM_LEDS);
#if DEBUG_PIN > 0
    pinMode(DEBUG_PIN, OUTPUT);
    digitalWrite(DEBUG_PIN, LOW);
#endif
    randomSeed(analogRead(0));
    Serial.begin(9600);

    ms_count = 0;
}

void loop()
{
    if (Serial.available() > 0)
    {
        delay(250);
#if DEBUG_PIN > 0
        for (i = 0; i < 5; ++i)
        {
            digitalWrite(DEBUG_PIN, HIGH);
            delay(50);
            digitalWrite(DEBUG_PIN, LOW);
            delay(50);
        }
#endif
        int cmd = ReadCommand(&Serial);
        if (cmd == LD_CMD_CONFIG)
        {
            read_in = cfg.Read(&Serial);
            WriteResponse(read_in, &cfg, &Serial);
        }
        else if (cmd == LD_CMD_STATUS)
        {
            WriteResponse(LD_CONFIG_OK, &cfg, &Serial);
        }
        else if (cmd == -1)
        {
            WriteResponse(LD_CONFIG_OK, &cfg, &Serial);
        }
        else
        {
            while (Serial.available() > 0)
            {
                Serial.read();
            }
            WriteResponse(LD_CONFIG_ERR, &cfg, &Serial);
        }
    }

#if DEBUG_PIN > 0
    else
    {
        // blink an LED or something cfg.m_mode+1 number of times
        for (read_in = 0; read_in < cfg.m_mode+1; ++read_in)
        {
            digitalWrite(DEBUG_PIN, HIGH);
            delay(100);
            digitalWrite(DEBUG_PIN, LOW);
            delay(100);
        }
        delay(cfg.m_delay);
    }
#endif

    FastLED.show();
}
