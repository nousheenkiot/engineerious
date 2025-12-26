package com.nous.cohortservice.repository;

import com.nous.cohortservice.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    boolean existsByFyDate(LocalDate fyDate);

    java.util.List<Policy> findByFyDate(LocalDate fyDate);
}