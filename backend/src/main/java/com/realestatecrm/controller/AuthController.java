package com.realestatecrm.controller;

import com.realestatecrm.dto.LoginRequest;
import com.realestatecrm.dto.LoginResponse;
import com.realestatecrm.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        return authService.login(req);
    }
}