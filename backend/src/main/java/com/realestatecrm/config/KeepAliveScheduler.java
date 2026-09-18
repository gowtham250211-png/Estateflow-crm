package com.realestatecrm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class KeepAliveScheduler {

    private final JdbcTemplate jdbcTemplate;

    public KeepAliveScheduler(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Pings Neon every 4 minutes (240,000 ms) before the 5-minute shutdown triggers
    @Scheduled(fixedRate = 240000)
    public void keepDatabaseAwake() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        } catch (Exception ignored) {
            // Fails silently if network blips
        }
    }
}