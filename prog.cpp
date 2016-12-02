#include <Arduino.h>
#include "FastLED.h"
 
#define BLINK_DELAY_MS 200
#define NUM_LEDS 50
#define DATA_PIN 6

CRGB leds[NUM_LEDS];

void setup()
{
    FastLED.addLeds<WS2811, DATA_PIN>(leds, NUM_LEDS);
}
 
void loop()
{
    while(1)
    {
        delay(500);
    }
}
