package com.realestatecrm.controller;

import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.entity.Lead;
import com.realestatecrm.entity.LeadNote;
import com.realestatecrm.service.LeadService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
public class LeadController {
    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    public List<Lead> getLeads(@RequestParam(required = false) String search) {
        return leadService.getLeads(search);
    }

    @GetMapping("/{id}")
    public Lead getLead(@PathVariable Long id) {
        return leadService.getLead(id);
    }

    @PostMapping
    public Lead createLead(@RequestBody LeadRequest req) {
        return leadService.createLead(req);
    }

    @PutMapping("/{id}")
    public Lead updateLead(@PathVariable Long id, @RequestBody LeadRequest req) {
        return leadService.updateLead(id, req);
    }

    @GetMapping("/{id}/notes")
    public List<LeadNote> getNotes(@PathVariable Long id) {
        return leadService.getNotes(id);
    }

    @PostMapping("/{id}/notes")
    public LeadNote addNote(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String note = body.get("note").toString();
        return leadService.addNote(id, userId, note);
    }
}