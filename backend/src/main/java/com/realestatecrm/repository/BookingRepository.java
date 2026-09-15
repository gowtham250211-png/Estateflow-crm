package com.realestatecrm.repository;

import com.realestatecrm.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b JOIN FETCH b.lead JOIN FETCH b.unit u JOIN FETCH u.building bg JOIN FETCH bg.project ORDER BY b.bookingDate DESC")
    List<Booking> findAllWithDetails();
}