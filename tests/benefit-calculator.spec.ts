import { test, expect, Locator } from "@playwright/test";

let salaryInput: Locator;
let birthDateInput: Locator;
let calculateButton: Locator;

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5500/");
  salaryInput = page.getByLabel("Gross Monthly Salary (EUR)");
  birthDateInput = page.getByLabel("Baby Birth Date");
  calculateButton = page.getByRole("button", { name: "Calculate" });
});

test("E2E-01: should calculate parental benefit breakdown for valid input", async ({
  page,
}) => {
  await salaryInput.fill("3000");
  await birthDateInput.fill("2026-01-01");
  await calculateButton.click();

  const table = page.locator("table");
  const februaryRow = table.locator("tr", {
    has: page.locator("td:first-child", { hasText: "2026-02" }),
  });
  const month = februaryRow.locator("td:first-child");
  const days = februaryRow.locator("td:nth-child(2)");
  const payment = februaryRow.locator("td:nth-child(3)");

  await expect(month).toBeVisible();
  await expect(month).toHaveText("2026-02");
  await expect(days).toHaveText("28");
  await expect(payment).toHaveText("2800.00");
  await expect(page.getByText(/Retrieval Code:\s*\d+/)).toBeVisible();
  await expect(page.locator("#validation-message")).not.toBeVisible();
});

test("E2E-02A: should show validation message for fresh invalid input", async ({
  page,
}) => {
  await salaryInput.fill("-100");
  await birthDateInput.fill("2026-01-01");
  await calculateButton.click();

  await expect(page.locator("#validation-message")).toBeVisible();
  await expect(
    page.getByText("Submit input to see the 12-month payment breakdown"),
  ).toBeVisible();
});

test("E2E-02B: should show validation message and clear results for invalid input after valid calculation", async ({
  page,
}) => {
  // pre-conditions
  await salaryInput.fill("3000");
  await birthDateInput.fill("2026-01-01");
  await calculateButton.click();

  const table = page.locator("table");
  const februaryRow = table.locator("tr", {
    has: page.locator("td:first-child", { hasText: "2026-02" }),
  });
  const month = februaryRow.locator("td:first-child");
  const days = februaryRow.locator("td:nth-child(2)");
  const payment = februaryRow.locator("td:nth-child(3)");

  await expect(month).toBeVisible();
  await expect(month).toHaveText("2026-02");
  await expect(days).toHaveText("28");
  await expect(payment).toHaveText("2800.00");
  await expect(page.getByText(/Retrieval Code:\s*\d+/)).toBeVisible();
  await expect(page.locator("#validation-message")).not.toBeVisible();

  // test
  await salaryInput.fill("-100");
  await calculateButton.click();

  // result
  await expect(page.locator("#validation-message")).toBeVisible();
  await expect(
    page.getByText("Submit input to see the 12-month payment breakdown"),
  ).toBeVisible();
});

test("E2E-03: should retrieve input and calculate parental benefit breakdown for valid retrieval code", async ({
  page,
}) => {
  // pre-conditions
  await salaryInput.fill("3000");
  await birthDateInput.fill("2026-01-01");
  await calculateButton.click();

  const table = page.locator("table");
  const februaryRow = table.locator("tr", {
    has: page.locator("td:first-child", { hasText: "2026-02" }),
  });
  const month = februaryRow.locator("td:first-child");
  const days = februaryRow.locator("td:nth-child(2)");
  const payment = februaryRow.locator("td:nth-child(3)");

  await expect(month).toBeVisible();
  await expect(month).toHaveText("2026-02");
  await expect(days).toHaveText("28");
  await expect(payment).toHaveText("2800.00");
  await expect(page.getByText(/Retrieval Code:\s*\d+/)).toBeVisible();
  await expect(page.locator("#validation-message")).not.toBeVisible();

  const codeText = await page.getByText(/Retrieval Code:/).textContent();
  const retrievalCode = codeText?.replace(/\D/g, "");

  await page.reload();

  // test
  await page.getByLabel("Or load by Retrieval Code").fill(retrievalCode!);
  await page.getByRole("button", { name: "Load" }).click();

  await expect(month).toBeVisible();
  await expect(month).toHaveText("2026-02");
  await expect(februaryRow).toBeVisible();
  await expect(days).toHaveText("28");
  await expect(payment).toHaveText("2800.00");
  await expect(page.getByText(/Retrieval Code:\s*\d+/)).toBeVisible();
  await expect(page.locator("#validation-message")).not.toBeVisible();
});
