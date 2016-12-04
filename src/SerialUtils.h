#ifndef SERIALUTILS_H
#define SERIALUTILS_H

#include "Config.h"

using Lightsdude::Config;

#define LD_CMD_CONFIG 0x00
#define LD_CMD_STATUS 0x01

namespace Lightsdude::SerialUtils
{
    int ReadCommand(Stream *stream);
    void WriteResponse(int status, Config *cfg, Stream *stream);
    int ReadUint16LE(Stream *stream);
    void WriteUint16LE(uint16_t val, Stream *stream);
}

#endif /* SERIALUTILS_H */
