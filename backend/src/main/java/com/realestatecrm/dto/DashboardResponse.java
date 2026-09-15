package com.realestatecrm.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data @Builder
public class DashboardResponse {
    private long totalLeads;
    private long followUpsToday;
    private long siteVisits;
    private long bookings;
    private long availableUnits;
    private Map<String, Long> leadPipeline;
    private List<FollowUpSummary> upcomingFollowUps;
    private List<RecentBookingSummary> recentBookings;

    @Data @Builder
    public static class FollowUpSummary {
        private String leadName;
        private String time;
    }

    @Data @Builder
    public static class RecentBookingSummary {
        private String customer;
        private String project;
        private String building;
        private String unitNumber;
        private Double price;
    }
}