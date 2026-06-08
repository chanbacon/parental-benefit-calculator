package com.helmes.parental_benefit_calculator.service;

import com.helmes.parental_benefit_calculator.dto.BenefitRequest;
import com.helmes.parental_benefit_calculator.dto.BenefitResponse;
import com.helmes.parental_benefit_calculator.dto.MonthlyPayment;
import com.helmes.parental_benefit_calculator.entity.BenefitInput;
import com.helmes.parental_benefit_calculator.exception.ResourceNotFoundException;
import com.helmes.parental_benefit_calculator.repository.BenefitInputRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BenefitService {

    private static final Logger log = LoggerFactory.getLogger(BenefitService.class);
    private final BenefitInputRepository benefitInputRepository;
    private final CalculationService calculationService;

    public BenefitService(BenefitInputRepository benefitRepository, CalculationService calculationService) {
        this.benefitInputRepository = benefitRepository;
        this.calculationService = calculationService;
    }

    public BenefitResponse createBenefitInput(BenefitRequest request) {
        log.info("Creating benefit input for salary {} and birth date {}", request.getGrossSalary(),
                request.getBirthDate());

        BenefitInput benefitInput = new BenefitInput();
        benefitInput.setGrossSalary(request.getGrossSalary());
        benefitInput.setBirthDate(request.getBirthDate());
        BenefitInput savedBenefitInput = benefitInputRepository.save(benefitInput);

        log.info("Benefit inputs saved with id {}", savedBenefitInput.getId());

        return mapToResponse(savedBenefitInput);
    }

    public BenefitResponse getBenefitInputById(Long id) {
        log.info("Fetching benefit input with id {}", id);

        BenefitInput benefitInput = benefitInputRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Benefit input not found with id: " + id));

        log.info("Benefit input found with id {}", id);
        return mapToResponse(benefitInput);
    }

    private BenefitResponse mapToResponse(BenefitInput benefitInput) {
        BigDecimal cappedSalary = calculationService.calculateCappedSalary(benefitInput.getGrossSalary());
        BigDecimal dailyRate = calculationService.calculateDailyRate(cappedSalary);

        List<MonthlyPayment> monthlyPayments = calculationService.calculateMonthlyPayments(
                dailyRate,
                benefitInput.getBirthDate());

        return new BenefitResponse(
                benefitInput.getId(),
                benefitInput.getGrossSalary(),
                benefitInput.getBirthDate(),
                cappedSalary,
                dailyRate,
                monthlyPayments);
    }
}