package com.helmes.parental_benefit_calculator.controller;

import com.helmes.parental_benefit_calculator.dto.BenefitRequest;
import com.helmes.parental_benefit_calculator.dto.BenefitResponse;
import com.helmes.parental_benefit_calculator.service.BenefitService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/benefits")
@CrossOrigin(origins = "*")
@Validated
@Tag(name = "Benefits", description = "Parental benefit calculation API")
public class BenefitController {

    private final BenefitService benefitService;

    public BenefitController(BenefitService benefitService) {
        this.benefitService = benefitService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a benefit request and return calculated schedule")
    public BenefitResponse createBenefit(@Valid @RequestBody BenefitRequest request) {
        return benefitService.createBenefitInput(request);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Retrieve benefit data and return calculated schedule")
    public BenefitResponse getBenefitById(
            @Parameter(description = "ID of stored benefit data", example = "1") @PathVariable @Min(value = 1, message = "Id must be greater than 0") Long id) {
        return benefitService.getBenefitInputById(id);
    }
}