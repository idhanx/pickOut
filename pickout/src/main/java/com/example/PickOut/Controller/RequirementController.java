package com.example.PickOut.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import com.example.PickOut.Model.*;
import com.example.PickOut.Service.*;

@RestController
@RequestMapping("/api/requirements")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RequirementController {

    private final RequirementService requirementService;

    @PostMapping("/{studentId}")
    public ResponseEntity<Requirement> create(@RequestBody Requirement requirement,
                                              @PathVariable Long studentId) {
        return ResponseEntity.ok(requirementService.createRequirement(requirement, studentId));
    }

    @GetMapping
    public ResponseEntity<List<Requirement>> getAll() {
        return ResponseEntity.ok(requirementService.getAllRequirements());
    }

    @GetMapping("/open")
    public ResponseEntity<List<Requirement>> getOpen() {
        return ResponseEntity.ok(requirementService.getOpenRequirements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Requirement> getById(@PathVariable Long id) {
        return ResponseEntity.ok(requirementService.getRequirementById(id));
    }

    @GetMapping("/check/{studentId}/{requirementId}")
    public ResponseEntity<Map<String, Object>> checkEligibility(@PathVariable Long studentId,
                                                                @PathVariable Long requirementId) {
        boolean eligible = requirementService.checkEligibility(studentId, requirementId);
        return ResponseEntity.ok(Map.of(
                "eligible", eligible,
                "message", eligible ? "You are eligible for this requirement" : "You don't have the required skills"
        ));
    }

    @GetMapping("/eligible-students/{requirementId}")
    public ResponseEntity<List<Student>> getEligibleStudents(@PathVariable Long requirementId) {
        return ResponseEntity.ok(requirementService.findEligibleStudents(requirementId));
    }

    @GetMapping("/eligible-for/{studentId}")
    public ResponseEntity<List<Requirement>> getEligibleRequirements(@PathVariable Long studentId) {
        return ResponseEntity.ok(requirementService.findEligibleRequirements(studentId));
    }

    @PutMapping("/close/{id}")
    public ResponseEntity<String> close(@PathVariable Long id) {
        requirementService.closeRequirement(id);
        return ResponseEntity.ok("Requirement Closed");
    }
}