#include "SerialUtils.h"

namespace Lightsdude::SerialUtils
{
    int ReadCommand(Stream *stream)
    {
        uint32_t header;
        int read_in = stream->readBytes((char*)&header, 4);
        if (read_in != 4)
            return -1;
        if (header != LD_PROTO_HEADER)
            return -1;

        // return command
        return stream->read();
    }

    void WriteResponse(int status, Config *cfg, Stream *stream)
    {
        stream->write("LGHT", 4);
        stream->write(status);
        cfg->Write(stream);
        stream->flush();
    }

    int ReadUint16LE(Stream *stream)
    {
        int read_in;
        short total = 0;
        read_in = stream->read();
        if (read_in == -1)
            return -1;
        total = read_in & 0xFF;
        read_in = stream->read();
        if (read_in == -1)
            return -1;
        total += ((read_in << 8) & 0xFF00);
        return total;
    }

    void WriteUint16LE(uint16_t val, Stream *stream)
    {
        stream->write((uint8_t)(val & 0xFF));
        stream->write((uint8_t)(val >> 8));
    }
}
