# [BUG-001 / E2E-02B] Calculation table not cleared after submitting invalid input

## Environment:

Windows 11, Playwright version 1.60.0 chromium test, main:f3cccafa0021fff8e98e68c9097c11e556e22ca3

## Severity:

Medium - Functional UI issue that presents misleading data to user

## Priority:

Medium - Fix required before next release to prevent degraded UX

## Description:

After a successful calculation with result table displayed, submitting an invalid input displays the validation error message but fails to clear the results table, leaving stale data visible to the user.

## Steps to Reproduce:

- Preconditions:
  - Application is open
  - A valid calculation has been performed (Salary: `3000`, Date: `2026-01-01`), and the breakdown table is visible.
- Steps:
  1. Change salary to `-100`.
  2. Click `Calculate`.

## Expected vs. Actual Result:

Expected:

1. Validation message is displayed.
2. Previous calculation table is cleared, and the default placeholder text (`Submit input to see the 12-month payment breakdown`) reappears.

Actual:

1. Validation message is displayed.
2. Previous calculation table is NOT cleared, and the default placeholder text fails to reappear.

## Automated Test Evidence:

```
  1) [chromium] › tests/benefit-calculator.spec.ts:47:5 › E2E-02B: should show validation message and clear results for invalid input after valid calculation

    Error: expect(locator).toBeVisible() failed

    Locator: getByText('Submit input to see the 12-month payment breakdown')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 5000ms
      - waiting for getByText('Submit input to see the 12-month payment breakdown')


      72 |   await expect(
      73 |     page.getByText("Submit input to see the 12-month payment breakdown"),
    > 74 |   ).toBeVisible();
         |     ^
      75 | });
      76 |
      77 | test("E2E-03: should retrieve input and calculate parental benefit breakdown for valid retrieval code", async ({
        at /mnt/c/Users/bacon/Kood/parental-benefit-calculator/tests/benefit-calculator.spec.ts:74:5

    Error Context: test-results/benefit-calculator-E2E-02B-e8485-put-after-valid-calculation-chromium/error-context.md

```
