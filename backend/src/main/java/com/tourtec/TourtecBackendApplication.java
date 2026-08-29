package com.tourtec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TourtecBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TourtecBackendApplication.class, args);
        System.out.println("🚀 TOURTEC Spring Boot Backend (STS) running on port 5000 with PostgreSQL");
    }
}
