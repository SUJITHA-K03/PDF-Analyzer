package com.example.PDF_Analyser.controller;

import com.example.PDF_Analyser.service.GroqService; // ← Change this import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AnalyseController{

    @Autowired
    private GroqService groqService; // ← GeminiService → GroqService

    @PostMapping("/analyse")
    public Map<String, String> analyse(@RequestBody Map<String, String> request) {
        return groqService.analysePdf(request.get("pdfUrl")); // ← groqService
    }
}