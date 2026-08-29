package com.tourtec.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${spring.datasource.username:postgres}")
    private String defaultUser;

    @Value("${spring.datasource.password:root}")
    private String defaultPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        // 1. Check if Cloud DATABASE_URL is provided (e.g., from Render, Supabase, Neon)
        if (databaseUrl != null && !databaseUrl.trim().isEmpty()) {
            try {
                String jdbcUrl;
                String username = defaultUser;
                String password = defaultPassword;

                if (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) {
                    URI dbUri = new URI(databaseUrl);
                    String userInfo = dbUri.getUserInfo();
                    if (userInfo != null && userInfo.contains(":")) {
                        username = userInfo.split(":")[0];
                        password = userInfo.split(":")[1];
                    }
                    int port = dbUri.getPort() != -1 ? dbUri.getPort() : 5432;
                    jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + ":" + port + dbUri.getPath() + "?sslmode=require";
                } else {
                    jdbcUrl = databaseUrl;
                }

                System.out.println("🔗 Attempting PostgreSQL Connection to: " + jdbcUrl);
                return DataSourceBuilder.create()
                        .url(jdbcUrl)
                        .username(username)
                        .password(password)
                        .driverClassName("org.postgresql.Driver")
                        .build();
            } catch (Exception e) {
                System.err.println("⚠️ Could not parse DATABASE_URL: " + e.getMessage());
            }
        }

        // 2. Try Local PostgreSQL on port 5433
        String localPostgresUrl = "jdbc:postgresql://localhost:5433/tourtec_db";
        try (Connection conn = DriverManager.getConnection(localPostgresUrl, defaultUser, defaultPassword)) {
            System.out.println("✅ Connected to Local PostgreSQL on port 5433 (tourtec_db)");
            return DataSourceBuilder.create()
                    .url(localPostgresUrl)
                    .username(defaultUser)
                    .password(defaultPassword)
                    .driverClassName("org.postgresql.Driver")
                    .build();
        } catch (Exception e) {
            System.out.println("ℹ️ PostgreSQL not reachable (" + e.getMessage() + "). Initializing resilient In-Memory Database for cloud deployment.");
        }

        // 3. Resilient In-Memory Fallback for Cloud Containers
        return DataSourceBuilder.create()
                .url("jdbc:h2:mem:tourtec_db;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE")
                .username("sa")
                .password("")
                .driverClassName("org.h2.Driver")
                .build();
    }
}
