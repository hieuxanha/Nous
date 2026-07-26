package com.example.be.controller;

import com.example.be.dto.StatsResponse;
import com.example.be.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
@CrossOrigin("*")
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    public ResponseEntity<StatsResponse> getStats(@RequestParam(defaultValue = "Tháng này") String filter) {
        return ResponseEntity.ok(statsService.getStats(filter));
    }
}