package com.realestatecrm.service;

import com.realestatecrm.entity.*;
import com.realestatecrm.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyService {
    private final ProjectRepository projectRepo;
    private final BuildingRepository buildingRepo;
    private final UnitRepository unitRepo;

    public PropertyService(ProjectRepository projectRepo, BuildingRepository buildingRepo, UnitRepository unitRepo) {
        this.projectRepo = projectRepo;
        this.buildingRepo = buildingRepo;
        this.unitRepo = unitRepo;
    }

    public List<Project> getAllProjects() {
        return projectRepo.findAll();
    }

    public List<Building> getBuildingsByProject(Long projectId) {
        return buildingRepo.findByProjectId(projectId);
    }

    public List<Unit> getUnitsByBuilding(Long buildingId) {
        return unitRepo.findByBuildingId(buildingId);
    }
}