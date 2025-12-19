package com.nous.cohortservice.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nous.cohortservice.entity.Policy;

@Repository
public interface PolicyDao extends JpaRepository<Policy, Long> {
}
