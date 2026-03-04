package com.example.PickOut.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.PickOut.Model.*;
import com.example.PickOut.Repository.*;

import javax.persistence.EntityManager;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;
    private final RequirementsRepository requirementRepository;
    private final EntityManager entityManager;

    public Student createStudent(Student student) {
        // Link skills properly
        if (student.getSkills() != null) {
            Set<Skill> managedSkills = student.getSkills().stream()
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
            student.setSkills(managedSkills);
        }
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);
        student.setName(studentDetails.getName());
        student.setDepartment(studentDetails.getDepartment());
        student.setEmail(studentDetails.getEmail());
        student.setPhone(studentDetails.getPhone());

        if (studentDetails.getSkills() != null) {
            Set<Skill> managedSkills = studentDetails.getSkills().stream()
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
            student.setSkills(managedSkills);
        }

        return studentRepository.save(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);

        // 1. Delete all requirements posted by this student
        List<Requirement> requirements = requirementRepository.findByStudentId(id);
        for (Requirement req : requirements) {
            req.getRequiredSkills().clear();
        }
        requirementRepository.saveAll(requirements);
        requirementRepository.flush();
        requirementRepository.deleteAll(requirements);
        requirementRepository.flush();

        // 2. Clear student's own skills (join table entries)
        student.getSkills().clear();
        studentRepository.saveAndFlush(student);

        // 3. Now safe to delete the student
        studentRepository.deleteById(id);
        studentRepository.flush();
    }
}