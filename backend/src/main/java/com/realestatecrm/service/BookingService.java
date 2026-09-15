package com.realestatecrm.service;

import com.realestatecrm.dto.BookingRequest;
import com.realestatecrm.entity.*;
import com.realestatecrm.enums.*;
import com.realestatecrm.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepo;
    private final UnitRepository unitRepo;
    private final LeadRepository leadRepo;
    private final UserRepository userRepo;

    public BookingService(BookingRepository bookingRepo, UnitRepository unitRepo, LeadRepository leadRepo, UserRepository userRepo) {
        this.bookingRepo = bookingRepo;
        this.unitRepo = unitRepo;
        this.leadRepo = leadRepo;
        this.userRepo = userRepo;
    }

    public List<Booking> getAllBookings() {
        return bookingRepo.findAllWithDetails();
    }

    @Transactional
    public Booking createBooking(BookingRequest req) {
        Unit unit = unitRepo.findByIdForUpdate(req.getUnitId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unit not found"));

        if (unit.getStatus() == UnitStatus.BOOKED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This unit has already been booked.");
        }

        Lead lead = leadRepo.findById(req.getLeadId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lead not found"));

        User user = userRepo.findById(req.getBookedById())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        unit.setStatus(UnitStatus.BOOKED);
        lead.setStage(LeadStage.BOOKED);

        Booking booking = Booking.builder()
                .lead(lead)
                .unit(unit)
                .bookedBy(user)
                .build();

        return bookingRepo.save(booking);
    }
}