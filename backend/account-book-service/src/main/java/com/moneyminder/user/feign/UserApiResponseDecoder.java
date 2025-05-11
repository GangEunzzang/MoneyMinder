package com.moneyminder.user.feign;

import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Response;
import feign.codec.Decoder;
import java.io.IOException;
import java.lang.reflect.Type;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class UserApiResponseDecoder implements Decoder {

    private final ObjectMapper objectMapper;

    @Override
    public Object decode(Response response, Type type) throws IOException {
        return objectMapper.readValue(response.body().asInputStream(),
                objectMapper.getTypeFactory().constructType(type));
    }
}