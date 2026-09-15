package com.realestatecrm.service;

import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.entity.*;
import com.realestatecrm.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class LeadService {
    private final LeadRepository leadRepo;
    private final LeadNoteRepository noteRepo;
    private final UserRepository userRepo;
    private final ProjectRepository projectRepo;

    public LeadService(LeadRepository leadRepo, LeadNoteRepository noteRepo, UserRepository userRepo, ProjectRepository projectRepo) {
        this.leadRepo = leadRepo;
        this.noteRepo = noteRepo;
        this.userRepo = userRepo;
        this.projectRepo = projectRepo;
    }

    public List<Lead> getLeads(String search) {
        if (search != null && !search.trim().isEmpty()) {
            return leadRepo.searchLeads(search.trim());
        }
        return leadRepo.findAll();
    }

    public Lead getLead(Long id) {
        return leadRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lead not found"));
    }

    public Lead createLead(LeadRequest req) {
        User assigned = req.getAssignedToId() != null ? userRepo.findById(req.getAssignedToId()).orElse(null) : null;
        Project project = req.getProjectId() != null ? projectRepo.findById(req.getProjectId()).orElse(null) : null;

        Lead lead = Lead.builder()
                .name(req.getName())
                .phone(req.getPhone())
                .email(req.getEmail())
                .budget(req.getBudget())
                .stage(req.getStage())
                .assignedTo(assigned)
                .project(project)
                .followUpDate(req.getFollowUpDate())
                .build();

        return leadRepo.save(lead);
    }

    public Lead updateLead(Long id, LeadRequest req) {
        Lead lead = getLead(id);
        lead.setName(req.getName());
        lead.setPhone(req.getPhone());
        lead.setEmail(req.getEmail());
        lead.setBudget(req.getBudget());
        lead.setStage(req.getStage());
        lead.setFollowUpDate(req.getFollowUpDate());

        if (req.getAssignedToId() != null) {
            lead.setAssignedTo(userRepo.findById(req.getAssignedToId()).orElse(null));
        }
        if (req.getProjectId() != null) {
            lead.setProject(projectRepo.findById(req.getProjectId()).orElse(null));
        }

        return leadRepo.save(lead);
    }

    public List<LeadNote> getNotes(Long leadId) {
        return noteRepo.findByLeadIdOrderByCreatedAtDesc(leadId);
    }

    public LeadNote addNote(Long leadId, Long userId, String noteContent) {
        Lead lead = getLead(leadId);
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        LeadNote note = LeadNote.builder()
                .lead(lead)
                .author(user)
                .note(noteContent)
                .build();

        return noteRepo.save(note);
    }
}