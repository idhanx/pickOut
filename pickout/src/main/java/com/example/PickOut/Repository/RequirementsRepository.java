package com.example.PickOut.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.PickOut.Model.Requirement;
import java.util.List;

@Repository
public interface RequirementsRepository extends JpaRepository<Requirement, Long> {
    List<Requirement> findByStatus(String status);
    List<Requirement> findByStudentId(Long studentId);
}