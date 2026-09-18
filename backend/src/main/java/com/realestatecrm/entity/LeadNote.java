package com.realestatecrm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lead_notes")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LeadNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author;

    @Column(columnDefinition = "TEXT")
    private String note;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public LeadNote() {
    }

    public LeadNote(Long id, Lead lead, User author, String note, LocalDateTime createdAt) {
        this.id = id;
        this.lead = lead;
        this.author = author;
        this.note = note;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Lead getLead() {
        return lead;
    }

    public void setLead(Lead lead) {
        this.lead = lead;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static LeadNoteBuilder builder() {
        return new LeadNoteBuilder();
    }

    public static class LeadNoteBuilder {
        private Long id;
        private Lead lead;
        private User author;
        private String note;
        private LocalDateTime createdAt;

        LeadNoteBuilder() {
        }

        public LeadNoteBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public LeadNoteBuilder lead(Lead lead) {
            this.lead = lead;
            return this;
        }

        public LeadNoteBuilder author(User author) {
            this.author = author;
            return this;
        }

        public LeadNoteBuilder note(String note) {
            this.note = note;
            return this;
        }

        public LeadNoteBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public LeadNote build() {
            return new LeadNote(id, lead, author, note, createdAt);
        }
    }
}
