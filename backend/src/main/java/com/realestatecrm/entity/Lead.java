package com.realestatecrm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.realestatecrm.enums.LeadStage;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String email;
    private Double budget;

    @Enumerated(EnumType.STRING)
    private LeadStage stage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    private LocalDate followUpDate;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Lead() {
    }

    public Lead(Long id, String name, String phone, String email, Double budget, LeadStage stage,
                User assignedTo, Project project, LocalDate followUpDate, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.budget = budget;
        this.stage = stage;
        this.assignedTo = assignedTo;
        this.project = project;
        this.followUpDate = followUpDate;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public LeadStage getStage() {
        return stage;
    }

    public void setStage(LeadStage stage) {
        this.stage = stage;
    }

    public User getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public LocalDate getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(LocalDate followUpDate) {
        this.followUpDate = followUpDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static LeadBuilder builder() {
        return new LeadBuilder();
    }

    public static class LeadBuilder {
        private Long id;
        private String name;
        private String phone;
        private String email;
        private Double budget;
        private LeadStage stage;
        private User assignedTo;
        private Project project;
        private LocalDate followUpDate;
        private LocalDateTime createdAt;

        LeadBuilder() {
        }

        public LeadBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public LeadBuilder name(String name) {
            this.name = name;
            return this;
        }

        public LeadBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public LeadBuilder email(String email) {
            this.email = email;
            return this;
        }

        public LeadBuilder budget(Double budget) {
            this.budget = budget;
            return this;
        }

        public LeadBuilder stage(LeadStage stage) {
            this.stage = stage;
            return this;
        }

        public LeadBuilder assignedTo(User assignedTo) {
            this.assignedTo = assignedTo;
            return this;
        }

        public LeadBuilder project(Project project) {
            this.project = project;
            return this;
        }

        public LeadBuilder followUpDate(LocalDate followUpDate) {
            this.followUpDate = followUpDate;
            return this;
        }

        public LeadBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Lead build() {
            return new Lead(id, name, phone, email, budget, stage, assignedTo, project, followUpDate, createdAt);
        }
    }
}
