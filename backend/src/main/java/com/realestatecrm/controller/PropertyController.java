package com.realestatecrm.controller;

import com.realestatecrm.entity.Building;
import com.realestatecrm.entity.Project;
import com.realestatecrm.entity.Unit;
import com.realestatecrm.service.PropertyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {
    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping("/projects")
    public List<Project> getProjects() {
        return propertyService.getAllProjects();
    }

    @GetMapping("/projects/{projectId}/buildings")
    public List<Building> getBuildings(@PathVariable Long projectId) {
        return propertyService.getBuildingsByProject(projectId);
    }

    @GetMapping("/buildings/{buildingId}/units")
    public List<Unit> getUnits(@PathVariable Long buildingId) {
        return propertyService.getUnitsByBuilding(buildingId);
    }
}