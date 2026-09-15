package com.realestatecrm.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long leadId;
    private Long unitId;
    private Long bookedById;
}