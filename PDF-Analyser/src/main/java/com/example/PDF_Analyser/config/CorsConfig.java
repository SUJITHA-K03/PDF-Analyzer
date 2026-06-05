package com.example.PDF_Analyser.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:5173",
                    "https://pdf-analyser-frontend.onrender.com"
                )
                .allowedMethods("POST", "GET", "OPTIONS")
                .allowedHeaders("*");
    }
}