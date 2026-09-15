package com.realestatecrm.service;

import com.realestatecrm.dto.DashboardResponse;
import com.realestatecrm.dto.DashboardResponse.FollowUpSummary;
import com.realestatecrm.dto.DashboardResponse.RecentBookingSummary;
import com.realestatecrm.entity.Booking;
import com.realestatecrm.entity.Lead;
import com.realestatecrm.enums.LeadStage;
import com.realestatecrm.enums.UnitStatus;
import com.realestatecrm.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    private final LeadRepository leadRepo;
    private final UnitRepository unitRepo;
    private final BookingRepository bookingRepo;

    public DashboardService(LeadRepository leadRepo, UnitRepository unitRepo, BookingRepository bookingRepo) {
        this.leadRepo = leadRepo;
        this.unitRepo = unitRepo;
        this.bookingRepo = bookingRepo;
    }

    public DashboardResponse getDashboardData() {
        List<Lead> leads = leadRepo.findAll();
        long availableUnits = unitRepo.findAll().stream().filter(u -> u.getStatus() == UnitStatus.AVAILABLE).count();
        List<Booking> bookings = bookingRepo.findAllWithDetails();

        long followUpsToday = leads.stream()
                .filter(l -> LocalDate.now().equals(l.getFollowUpDate()))
                .count();

        Map<String, Long> pipeline = new HashMap<>();
        for (LeadStage stage : LeadStage.values()) {
            pipeline.put(stage.name(), leads.stream().filter(l -> l.getStage() == stage).count());
        }

        List<FollowUpSummary> followUpSummaries = leads.stream()
                .filter(l -> LocalDate.now().equals(l.getFollowUpDate()))
                .limit(4)
                .map(l -> FollowUpSummary.builder()
                        .leadName(l.getName())
                        .time("Scheduled Today")
                        .build())
                .toList();

        List<RecentBookingSummary> recent = bookings.stream()
                .limit(5)
                .map(b -> RecentBookingSummary.builder()
                        .customer(b.getLead().getName())
                        .project(b.getUnit().getBuilding().getProject().getName())
                        .building(b.getUnit().getBuilding().getName())
                        .unitNumber(b.getUnit().getUnitNumber())
                        .price(b.getUnit().getPrice())
                        .build())
                .toList();

        return DashboardResponse.builder()
                .totalLeads(leads.size())
                .followUpsToday(followUpsToday)
                .siteVisits(pipeline.getOrDefault("SITE_VISIT", 0L))
                .bookings(bookings.size())
                .availableUnits(availableUnits)
                .leadPipeline(pipeline)
                .upcomingFollowUps(followUpSummaries)
                .recentBookings(recent)
                .build();
    }
}