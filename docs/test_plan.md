# Test Plan

## Test Strategy

- Business logic is tested with unit tests using JUnit
- API behaviour is tested with integration tests using JUnit
- Critical user workflows are tested with end-to-end tests using Playwright
- The goal is to catch defects at the lowest practical layer and avoid unnecessary duplication

## Test Coverage

### Unit Tests (JUnit)

- Monthly salary cap application
- Daily rate calculation
- Monthly breakdown calculation
- Date boundary rules

### Integration Tests (JUnit)

- Benefit calculation through API
- Benefit input retrieval through API

### End-to-end Tests (Playwright)

- User calculation workflow
- Form validation
- Persistence and retrieval by ID

### What is not covered?

- Performance testing
- Security testing
- Cross-browser testing

## Test Cases

### E2E-01 User Calculation Workflow

- Requirement: User can calculate parental benefit and receive a valid result.
- Preconditions: Application is opened.
- Test Data:
  - Salary: `3000`
  - Birth date: `2026-01-01`
- Steps:
  1. Entery salary `3000`.
  2. Enter birth date `2026-01-01`.
  3. Click `Calculate`.
- Expected Results:
  1. The table contains a February row with:
     - Month = `2026-02`
     - Days = `28`
     - Payment = `2800.00`
  2. A retrieval code is displayed and clearly identified as a retrieval code
  3. No validation message is displayed.

### E2E-02 Input Validation (negative path)

- Requirement: Invalid input shows validation message and does not produce calculation results.

#### E2E-02A: Fresh invalid input

- Preconditions:
  1. Application is opened
  2. No prior calculations performed
- Test Data:
  - Salary: `-100`
  - Birth date: `2026-01-01`
- Steps:
  1. Enter invalid salary `-100`.
  2. Enter birth date `2026-01-01`.
  3. Click `Calculate`.
- Expected Results:
  1. Validation message is displayed.
  2. Calculation table is not displayed, and the default placeholder text (`Submit input to see the 12-month payment breakdown`) reappears.

#### E2E-02B: Invalid input after previous valid calculation

- Preconditions:
  1. Application is opened
  2. A valid input is submitted (Salary: `3000`, Date: `2026-01-01`).
  3. A valid calculation has been performed with the calculation table is displayed.
- Steps:
  1. Change salary to `-100`.
  2. Click `Calculate`.
- Expected Results:
  1. Validation message is displayed.
  2. Previous calculation table is cleared, and the default placeholder text (`Submit input to see the 12-month payment breakdown`) reappears.

#### E2E-03: Calculation Retrieval Flow

- Requirement: User can retrieve previously calculated result using a unique retrieval code returned
- Preconditions:
  1. Application is opened.
  2. A valid input is submitted (Salary: `3000`, Date: `2026-01-01`).
  3. A valid calculation has been performed with a unique retrieval code dispalyed.
  4. The page is refreshed.
- Test Data:
  - Retrieval code returned by the application in precondition step 3.
- Steps:
  1. Enter retrieval code
  2. Click `Load`.
- Expected Results:
  1. The table contains a February row with:
     - Month = `2026-02`
     - Days = `28`
     - Payment (EUR) = `2800.00`
  2. No validation message is displayed.
