package com.realestatecrm.repository;

import com.realestatecrm.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BuildingRepository extends JpaRepository<Building, Long> {
    List<Building> findByProjectId(Long projectId);
}