package com.realestatecrm.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.hibernate.Hibernate;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

/**
 * The controllers in this app return JPA entities directly (instead of DTOs), so any
 * lazy (or even eager-but-proxied) association Hibernate hands back can be a
 * HibernateProxy subclass rather than the real entity. Jackson doesn't know how to
 * serialize that proxy's internal bookkeeping fields (hibernateLazyInitializer/handler)
 * and blows up with "No serializer found for class
 * org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor" on any endpoint that returns
 * an entity with a populated relationship (leads with an assigned user, units with a
 * building, etc).
 *
 * This module teaches Jackson to unwrap any HibernateProxy to its real, initialized
 * entity before serializing it, so every endpoint works regardless of how deeply
 * associations are nested.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer hibernateProxySerializationCustomizer() {
        return builder -> builder.postConfigurer(objectMapper -> {
            SimpleModule module = new SimpleModule("HibernateProxyModule");
            module.addSerializer(HibernateProxy.class, new JsonSerializer<HibernateProxy>() {
                @Override
                public void serialize(HibernateProxy value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
                    serializers.defaultSerializeValue(Hibernate.unproxy(value), gen);
                }
            });
            objectMapper.registerModule(module);
        });
    }
}
