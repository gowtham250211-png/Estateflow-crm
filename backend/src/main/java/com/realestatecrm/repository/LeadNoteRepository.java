package com.realestatecrm.repository;

import com.realestatecrm.entity.LeadNote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeadNoteRepository extends JpaRepository<LeadNote, Long> {
    List<LeadNote> findByLeadIdOrderByCreatedAtDesc(Long leadId);
}