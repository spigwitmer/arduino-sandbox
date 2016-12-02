#include <Arduino.h>
#include "FastLED.h"
 
#define BLINK_DELAY_MS 500
#define NUM_LEDS 50
#define DATA_PIN 9

CRGB leds[NUM_LEDS];
int i;

void setup()
{
    FastLED.addLeds<WS2811, DATA_PIN, RGB>(leds, NUM_LEDS);
    randomSeed(analogRead(0));
}
 
void loop()
{
    for (i = 0; i < NUM_LEDS; ++i)
        switch(random(0, 2)) {
            case 0:
                leds[i] = CRGB::Red;
                break;
            default:
                leds[i] = CRGB::Green;
                break;
        }
    FastLED.show();
    delay(BLINK_DELAY_MS);
}
