package com.ensm.main.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * 설명서 파일 제공 컨트롤러
 * descriptions 폴더의 마크다운 파일을 제공합니다.
 */
@RestController
@RequestMapping("/main/descriptions")
public class DescriptionController {

    @GetMapping("/{filename}")
    public ResponseEntity<?> getDescription(@PathVariable String filename) {
        try {
            // 파일명에 .md 확장자가 없으면 추가
            if (!filename.endsWith(".md")) {
                filename = filename + ".md";
            }
            
            // URL 디코딩 (한글 파일명 처리)
            try {
                filename = java.net.URLDecoder.decode(filename, StandardCharsets.UTF_8.toString());
            } catch (Exception e) {
                // 디코딩 실패 시 원본 사용
            }
            
            System.out.println("설명서 파일 요청: " + filename);
            
            Resource resource = new ClassPathResource("static/main/descriptions/" + filename);
            
            if (!resource.exists()) {
                System.out.println("경로 1 실패, 대체 경로 시도: static/descriptions/" + filename);
                // 대체 경로 시도
                resource = new ClassPathResource("static/descriptions/" + filename);
            }
            
            if (!resource.exists()) {
                System.err.println("설명서 파일을 찾을 수 없습니다: " + filename);
                System.err.println("시도한 경로: static/main/descriptions/" + filename);
                System.err.println("시도한 경로: static/descriptions/" + filename);
                return ResponseEntity.notFound().build();
            }
            
            System.out.println("설명서 파일 찾음: " + resource.getURI());
            
            // JAR 파일 내부에서도 작동하도록 InputStream 사용
            try (InputStream inputStream = resource.getInputStream()) {
                String content = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE + "; charset=utf-8")
                        .body(content);
            }
        } catch (IOException e) {
            System.err.println("설명서 파일 로드 실패: " + filename + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}

