package com.helmes.parental_benefit_calculator.repository;

import com.helmes.parental_benefit_calculator.entity.BenefitInput;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BenefitInputRepository extends JpaRepository<BenefitInput, Long> {
}