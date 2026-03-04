package com.example.PickOut.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.PickOut.Model.*;
import com.example.PickOut.Repository.*;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SkillController {

    private final SkillRepository skillRepository;
    private final StudentRepository studentRepository;
    private final RequirementsRepository requirementRepository;

    @PostMapping
    public ResponseEntity<Skill> create(@RequestBody Skill skill) {
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getAll() {
        return ResponseEntity.ok(skillRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Skill> getById(@PathVariable Long id) {
        return ResponseEntity.ok(skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found")));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<String> delete(@PathVariable Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        // Remove skill from all students
        for (Student student : studentRepository.findAll()) {
            if (student.getSkills().remove(skill)) {
                studentRepository.save(student);
            }
        }

        // Remove skill from all requirements
        for (Requirement req : requirementRepository.findAll()) {
            if (req.getRequiredSkills().remove(skill)) {
                requirementRepository.save(req);
            }
        }

        skillRepository.deleteById(id);
        return ResponseEntity.ok("Skill Deleted");
    }
}