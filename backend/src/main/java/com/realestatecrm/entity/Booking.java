package com.realestatecrm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lead_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Lead lead;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "unit_id", unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Unit unit;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booked_by")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User bookedBy;

    private LocalDateTime bookingDate;
    private String status;

    @PrePersist
    protected void onCreate() {
        this.bookingDate = LocalDateTime.now();
        this.status = "CONFIRMED";
    }
}