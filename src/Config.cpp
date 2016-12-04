#include <Arduino.h>
#include <inttypes.h>
#include "Config.h"
#include "SerialUtils.h"

using namespace Lightsdude::SerialUtils;

namespace Lightsdude
{
    Config::Config(uint16_t delay, uint8_t mode, uint8_t r, uint8_t g, uint8_t b)
    {
        m_delay = delay;
        m_mode = mode;
        m_r = r;
        m_g = g;
        m_b = b;
    }

    int Config::Read(Stream *h)
    {
        uint16_t new_delay;
        int read_in;
        uint8_t new_mode, new_r, new_g, new_b;

        // ms delay
        read_in = ReadUint16LE(h);
        if (read_in == -1)
            return LD_CONFIG_ERR;
        new_delay = (uint16_t)read_in;

        // lights display mode
        read_in = h->read();
        if (read_in == -1)
            return LD_CONFIG_ERR;
        new_delay = (uint8_t)read_in;

        // rgb values
        read_in = h->read();
        if (read_in == -1)
            return LD_CONFIG_ERR;
        new_r = (uint8_t)read_in;
        read_in = h->read();
        if (read_in == -1)
            return LD_CONFIG_ERR;
        new_g = (uint8_t)read_in;
        read_in = h->read();
        if (read_in == -1)
            return LD_CONFIG_ERR;
        new_b = (uint8_t)read_in;

        m_delay = new_delay;
        m_mode = new_mode;
        m_r = new_r;
        m_g = new_g;
        m_b = new_b;

        return LD_CONFIG_OK;
    }

    void Config::Write(Stream *h)
    {
        WriteUint16LE(m_delay, h);
        h->write(m_mode);
        h->write(m_r);
        h->write(m_g);
        h->write(m_b);
    }
}
