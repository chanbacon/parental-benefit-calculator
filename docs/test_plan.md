# Test Plan

## Test Strategy

- Business logic is tested with unit test using JUnit
- API behaviour is tested with integration test using JUnit
- Critical user workflows are tested with end-to-end test using Playwright
- The goal is to catch defects at the lowest practical layer and avoid unnecessary duplication

## Test Coverage

### JUnit

#### Unit Tests

- Monthly salary cap application
- Daily rate calculation
- Monthly breakdown calculation
- Date boundary rules

#### Integration Tests

- Benefit calculation through API
- Benefit input retrieval through API

### Playwright

#### End-to-end Tests

- User calculation workflow
- Form validation
- Persistence and retrieval by ID

### What is not covered?

- Performance testing
- Security testing
- Cross-browser testing

## Test Cases

### E2E-01 User Calculation Workflow

- Objective: Verify that a user can calculate parental benefit and receive a valid result
- Preconditions: Application is running
- Test Data:
  - Salary: `3000`
  - Birthdate: `2026-01-01`
- Steps:
  1. Open the application.
  2. Entery salary `3000`.
  3. Enter birthdate `2026-01-01`.
  4. Click `Calculate`.
- Expected Results:
  1. The table contains a February row with:
     - Month = `2026-02`
     - Days = `28`
     - Payment = `2800.00`
  2. A retrieval code is displayed and clearly identified as a retrieval code
  3. No validation message is displayed.

### E2E-02 Form Validation (negative path)

- Objective: Verify that invalid input shows validation message and does not produce results.

#### E2E-02A: Fresh invalid input

- Preconditions:
  - Application opened
  - No prior calculations performed
- Test Data:
  - Salary: `-100`
  - Birthdate: `2026-01-01`
- Steps:
  1. Entery invalid salary `-100`.
  2. Enter birthdate `2026-01-01`.
  3. Click `Calculate`.

- Expected Results:
  1. Validation message is displayed.
  2. Calculation table is not displayed

#### E2E-02B: Invalid input after valid calculation

- Preconditions:
  - Application is open
  - A valid calculation has been performed (Salary: `3000`, Date: `2026-01-01`), and the breakdown table is visible.
- Steps:
  1. Change salary to `-100`.
  2. Click `Calculate`.

- Expected Results:
  1. Validation message is displayed.
  2. Previous calculation table is cleared.

#### E2E-03: Retrieval Flow

- Preconditions:
  - Application is open
  - A saved benefit input exists with retrieval code `1`:
    - Salary: `3000`
    - Birthdate: `2026-01-01`
- Test Data:
  - Retrieval code: `1`
- Steps:
  1. Enter retrieval code `1`.
  2. Click `Load`.
- Expected Results:
  1. The table contains a February row with:
     - Month = `2026-02`
     - Days = `28`
     - Payment (EUR) = `2800.00`
  2. A retrieval code is displayed and clearly identified as a retrieval code
  3. No validation message is displayed.
