#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>
#include <inttypes.h>

#define LD_CONFIG_OK    0x00
#define LD_CONFIG_ERR   0x01

#define LD_PROTO_HEADER 0x5448474c // "LGHT"

namespace Lightsdude
{
    class Config
    {
        public:
            Config(uint16_t delay, uint8_t mode, uint8_t r, uint8_t g, uint8_t b);
            int Read(Stream *stream);
            void Write(Stream *stream);

            uint16_t m_delay;
            uint8_t m_mode;
            uint8_t m_r, m_g, m_b;
    };
}
#endif /* CONFIG_H */
