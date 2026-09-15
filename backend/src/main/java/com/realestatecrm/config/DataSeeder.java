package com.realestatecrm.config;

import com.realestatecrm.entity.*;
import com.realestatecrm.enums.*;
import com.realestatecrm.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedDatabase(
            UserRepository userRepo, ProjectRepository projectRepo,
            BuildingRepository buildingRepo, UnitRepository unitRepo,
            LeadRepository leadRepo, LeadNoteRepository noteRepo,
            BookingRepository bookingRepo) {
        return args -> {
            User admin = userRepo.findByEmail("gowtham@crm.com").orElseGet(() ->
                    userRepo.save(User.builder().name("Gowtham").email("gowtham@crm.com").password("pass123").role(Role.ADMIN).build())
            );
            User sales = userRepo.findByEmail("arun@crm.com").orElseGet(() ->
                    userRepo.save(User.builder().name("Arun").email("arun@crm.com").password("pass123").role(Role.SALES_EMPLOYEE).build())
            );

            if (projectRepo.count() == 0) {
                Project p1 = projectRepo.save(Project.builder().name("Green Valley Residency").location("Chennai").description("Luxury Eco Homes").build());
                Project p2 = projectRepo.save(Project.builder().name("Skyline Residency").location("Bangalore").description("High-rise urban living").build());
                Project p3 = projectRepo.save(Project.builder().name("Urban Heights").location("Hyderabad").description("Smart City Apartments").build());

                Building b1 = buildingRepo.save(Building.builder().name("Tower A").project(p1).build());
                Building b2 = buildingRepo.save(Building.builder().name("Tower B").project(p1).build());
                Building b3 = buildingRepo.save(Building.builder().name("Tower 1").project(p2).build());
                Building b4 = buildingRepo.save(Building.builder().name("Tower 2").project(p3).build());

                Unit u101 = unitRepo.save(Unit.builder().building(b1).unitNumber("A-101").type("2 BHK").price(4500000.0).status(UnitStatus.AVAILABLE).build());
                Unit u102 = unitRepo.save(Unit.builder().building(b1).unitNumber("A-102").type("2 BHK").price(4800000.0).status(UnitStatus.AVAILABLE).build());
                Unit u103 = unitRepo.save(Unit.builder().building(b1).unitNumber("A-103").type("3 BHK").price(6200000.0).status(UnitStatus.AVAILABLE).build());
                Unit u104 = unitRepo.save(Unit.builder().building(b1).unitNumber("A-104").type("3 BHK").price(6500000.0).status(UnitStatus.AVAILABLE).build());
                Unit u201 = unitRepo.save(Unit.builder().building(b1).unitNumber("A-201").type("2 BHK").price(5200000.0).status(UnitStatus.BOOKED).build());
                Unit u202 = unitRepo.save(Unit.builder().building(b2).unitNumber("B-301").type("3 BHK").price(6800000.0).status(UnitStatus.BOOKED).build());

                unitRepo.save(Unit.builder().building(b3).unitNumber("S-501").type("1 BHK").price(3500000.0).status(UnitStatus.AVAILABLE).build());
                unitRepo.save(Unit.builder().building(b3).unitNumber("S-502").type("2 BHK").price(5100000.0).status(UnitStatus.AVAILABLE).build());
                unitRepo.save(Unit.builder().building(b4).unitNumber("U-901").type("3 BHK").price(7800000.0).status(UnitStatus.AVAILABLE).build());

                Lead l1 = leadRepo.save(Lead.builder().name("Arun Kumar").phone("9876543210").email("arun@gmail.com")
                        .budget(5500000.0).stage(LeadStage.BOOKED).project(p1).assignedTo(admin).followUpDate(LocalDate.now()).build());

                Lead l2 = leadRepo.save(Lead.builder().name("Priya Sharma").phone("9845123456").email("priya@yahoo.com")
                        .budget(7000000.0).stage(LeadStage.BOOKED).project(p1).assignedTo(sales).followUpDate(LocalDate.now()).build());

                Lead l3 = leadRepo.save(Lead.builder().name("Karthik Raja").phone("9789012345").email("karthik@outlook.com")
                        .budget(4500000.0).stage(LeadStage.NEGOTIATION).project(p2).assignedTo(sales).followUpDate(LocalDate.now().plusDays(2)).build());

                noteRepo.save(LeadNote.builder().lead(l1).author(admin).note("Initial enquiry received. Looking for East-facing balcony.").build());
                noteRepo.save(LeadNote.builder().lead(l1).author(admin).note("Site visit completed. Customer confirmed unit A-201.").build());

                bookingRepo.save(Booking.builder().lead(l1).unit(u201).bookedBy(admin).build());
                bookingRepo.save(Booking.builder().lead(l2).unit(u202).bookedBy(sales).build());
            }
        };
    }
}