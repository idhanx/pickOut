package com.example.PickOut.Model;

import javax.persistence.*;
import lombok.*;
import java.util.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String status = "OPEN";

    // Requirement → Many Skills
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "requirement_skills",
            joinColumns = @JoinColumn(name = "requirement_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @JsonIgnoreProperties("requirements")
    private Set<Skill> requiredSkills = new HashSet<>();

    // Many Requirements → One Student (who posted it)
    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties("skills")
    private Student student;
}