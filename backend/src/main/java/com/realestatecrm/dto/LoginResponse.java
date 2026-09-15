package com.realestatecrm.dto;

import com.realestatecrm.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data @AllArgsConstructor @Builder
public class LoginResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private Role role;
}