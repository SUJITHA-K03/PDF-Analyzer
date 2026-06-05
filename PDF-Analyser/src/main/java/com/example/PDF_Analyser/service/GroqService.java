package com.example.PDF_Analyser.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.util.*;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    public Map<String, String> analysePdf(String pdfUrl) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Step 1: Download PDF
            byte[] pdfBytes = restTemplate.getForObject(pdfUrl, byte[].class);

            // Step 2: Extract text
            String extractedText = extractTextFromPdf(pdfBytes);

            if (extractedText == null || extractedText.trim().isEmpty()) {
                return Map.of("error", "PDF text extraction failed or PDF is empty/scanned.");
            }

            // Step 3: Send to Groq
            return analyseWithGroq(extractedText, restTemplate);

        } catch (Exception e) {
            return Map.of("error", "Analysis failed: " + e.getMessage());
        }
    }

    private String extractTextFromPdf(byte[] pdfBytes) {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (Exception e) {
            return null;
        }
    }

    private Map<String, String> analyseWithGroq(String pdfText, RestTemplate restTemplate) {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        // Trim to avoid token limit
        String trimmedText = pdfText.length() > 2000
                ? pdfText.substring(0, 2000) + "...[truncated]"
                : pdfText;

        String prompt = "Analyse the following PDF document text and return ONLY in this exact format:\n" +
                "Document Type: <type>\n" +
                "Title: <title>\n" +
                "Authors: <authors>\n" +
                "Summary: <2-3 sentence summary>\n" +
                "Key Takeaway: <single most important point>\n\n" +
                "PDF Content:\n" + trimmedText;

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama-3.1-8b-instant");
        body.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
        ));
        body.put("temperature", 0.3);
        body.put("max_tokens", 512);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            String text = extractGroqText(response.getBody());
            return parseResponse(text);
        } catch (Exception e) {
            return Map.of("error", "Groq call failed: " + e.getMessage());
        }
    }

    private String extractGroqText(Map body) {
        try {
            List choices = (List) body.get("choices");
            Map choice = (Map) choices.get(0);
            Map message = (Map) choice.get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            return "Could not extract text";
        }
    }

    private Map<String, String> parseResponse(String text) {
        Map<String, String> result = new LinkedHashMap<>();
        String[] lines = text.split("\n");
        for (String line : lines) {
            if (line.startsWith("Document Type:")) result.put("documentType", line.substring(14).trim());
            else if (line.startsWith("Title:")) result.put("title", line.substring(6).trim());
            else if (line.startsWith("Authors:")) result.put("authors", line.substring(8).trim());
            else if (line.startsWith("Summary:")) result.put("summary", line.substring(8).trim());
            else if (line.startsWith("Key Takeaway:")) result.put("keyTakeaway", line.substring(13).trim());
        }
        return result;
    }
}