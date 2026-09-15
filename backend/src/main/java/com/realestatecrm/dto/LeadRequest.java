package com.realestatecrm.dto;

import com.realestatecrm.enums.LeadStage;
import lombok.Data;
import java.time.LocalDate;

@Data
public class LeadRequest {
    private String name;
    private String phone;
    private String email;
    private Double budget;
    private LeadStage stage;
    private Long assignedToId;
    private Long projectId;
    private LocalDate followUpDate;
}