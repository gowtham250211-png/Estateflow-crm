package com.realestatecrm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.realestatecrm.enums.UnitStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "units")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Unit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "building_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Building building;

    private String unitNumber;
    private String type;
    private Double price;

    @Enumerated(EnumType.STRING)
    private UnitStatus status;
}