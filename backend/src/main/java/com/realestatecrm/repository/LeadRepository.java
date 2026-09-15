package com.realestatecrm.repository;

import com.realestatecrm.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    @Query("SELECT l FROM Lead l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(l.phone) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Lead> searchLeads(@Param("query") String query);
}