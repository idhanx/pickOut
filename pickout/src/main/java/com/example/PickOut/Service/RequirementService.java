package com.example.PickOut.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.PickOut.Model.*;
import com.example.PickOut.Repository.*;

@Service
@RequiredArgsConstructor
public class RequirementService {

    private final RequirementsRepository requirementRepository;
    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;

    public Requirement createRequirement(Requirement requirement, Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        requirement.setStudent(student);
        requirement.setStatus("OPEN");

        // Link skills properly
        if (requirement.getRequiredSkills() != null) {
            Set<Skill> managedSkills = requirement.getRequiredSkills().stream()
                    .map(skill -> {
                        if (skill.getId() != null) {
                            return skillRepository.findById(skill.getId())
                                    .orElseThrow(() -> new RuntimeException("Skill not found"));
                        } else if (skill.getName() != null) {
                            return skillRepository.findByName(skill.getName())
                                    .orElseGet(() -> skillRepository.save(skill));
                        }
                        return skill;
                    })
                    .collect(Collectors.toSet());
            requirement.setRequiredSkills(managedSkills);
        }

        return requirementRepository.save(requirement);
    }

    public List<Requirement> getAllRequirements() {
        return requirementRepository.findAll();
    }

    public List<Requirement> getOpenRequirements() {
        return requirementRepository.findByStatus("OPEN");
    }

    public Requirement getRequirementById(Long id) {
        return requirementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Requirement not found"));
    }

    public boolean checkEligibility(Long studentId, Long requirementId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Requirement requirement = requirementRepository.findById(requirementId)
                .orElseThrow(() -> new RuntimeException("Requirement not found"));

        // Check if student has ALL required skills
        return student.getSkills().containsAll(requirement.getRequiredSkills());
    }

    public List<Student> findEligibleStudents(Long requirementId) {
        Requirement requirement = getRequirementById(requirementId);
        List<Student> allStudents = studentRepository.findAll();

        return allStudents.stream()
                .filter(student -> student.getSkills().containsAll(requirement.getRequiredSkills()))
                .filter(student -> !student.getId().equals(requirement.getStudent().getId())) // Exclude requirement poster
                .collect(Collectors.toList());
    }

    public List<Requirement> findEligibleRequirements(Long studentId) {
        Student student = getStudentById(studentId);
        List<Requirement> openRequirements = getOpenRequirements();

        return openRequirements.stream()
                .filter(req -> student.getSkills().containsAll(req.getRequiredSkills()))
                .filter(req -> !req.getStudent().getId().equals(studentId)) // Exclude own requirements
                .collect(Collectors.toList());
    }

    public void closeRequirement(Long id) {
        Requirement requirement = getRequirementById(id);
        requirement.setStatus("CLOSED");
        requirementRepository.save(requirement);
    }

    private Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
}