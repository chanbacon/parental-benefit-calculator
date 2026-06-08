import { BenefitService } from "./benefitService.js";
import type { BenefitResponse } from "./types.js";

const STORAGE_KEY = "parental-benefit:lastBenefitId";
const benefitService = new BenefitService();

const form = getRequiredElement<HTMLFormElement>("#benefit-form");
const salaryInput = getRequiredElement<HTMLInputElement>("#gross-salary");
const birthDateInput = getRequiredElement<HTMLInputElement>("#birth-date");
const validationMessageElement = getRequiredElement<HTMLParagraphElement>(
  "#validation-message",
);
const statusElement = getRequiredElement<HTMLParagraphElement>("#status");
const savedIdElement = getRequiredElement<HTMLParagraphElement>("#saved-id");
const statsElement = getRequiredElement<HTMLDivElement>("#stats");
const paymentsBody =
  getRequiredElement<HTMLTableSectionElement>("#payments-body");
const idInput = getRequiredElement<HTMLInputElement>("#id-input");
const loadByIdButton = getRequiredElement<HTMLButtonElement>("#load-by-id-btn");

init();

function init(): void {
  renderEmptyState();

  form.addEventListener("submit", onFormSubmit);
  loadByIdButton.addEventListener("click", onLoadByIdClick);

  const savedId = getSavedId();
  if (savedId) {
    idInput.value = String(savedId);
    setStatus(
      `Recent input saved with Retrieval Code (${savedId}). You can load it anytime.`,
    );
  }
}

async function onFormSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  setValidationMessage("");

  const salaryRaw = salaryInput.value.trim();
  const grossSalary = Number(salaryRaw);
  const birthDate = birthDateInput.value;

  if (!/^\d+(\.\d{1,2})?$/.test(salaryRaw)) {
    setValidationMessage(
      "Please enter a valid gross salary (up to 2 decimal places).",
    );
    return;
  }

  if (!Number.isFinite(grossSalary) || grossSalary <= 0) {
    setValidationMessage("Please enter a valid gross salary greater than 0.");
    return;
  }

  if (!birthDate) {
    setValidationMessage("Please select a valid birth date.");
    return;
  }

  setStatus("Calculating benefit...");

  try {
    // backend create call doubles as persistence, then we store id locally for resume.
    const result = await benefitService.createBenefitInput({
      grossSalary,
      birthDate,
    });
    saveId(result.id);
    idInput.value = String(result.id);

    renderResult(result);
    setValidationMessage("");
    setStatus(
      `Recent input saved with Retrival Code ${result.id}. You can load it anytime.`,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Calculation failed.";
    setStatus(message);
  }
}

async function onLoadByIdClick(): Promise<void> {
  setValidationMessage("");
  const id = Number(idInput.value);

  if (!Number.isInteger(id) || id <= 0) {
    setStatus("Enter a valid Retrieval Code.");
    return;
  }

  await loadAndRenderById(id);
}

async function loadAndRenderById(id: number): Promise<void> {
  setStatus(`Loading Retrieval Code #${id}...`);

  try {
    const result = await benefitService.getBenefitInputById(id);
    saveId(result.id);

    salaryInput.value = String(result.grossSalary);
    birthDateInput.value = result.birthDate;
    idInput.value = String(result.id);

    renderResult(result);
    setStatus(`Loaded input with Retrieval Code ${id}.`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load benefit input.";
    setStatus(message);
  }
}

function renderResult(result: BenefitResponse): void {
  savedIdElement.textContent = `Saved input with Retrieval Code: ${result.id}`;

  statsElement.innerHTML = [
    makeStatChip(`Gross salary: EUR ${formatMoney(result.grossSalary)}`),
    makeStatChip(`Capped salary: EUR ${formatMoney(result.cappedSalary)}`),
    makeStatChip(`Daily rate: EUR ${formatMoney(result.dailyRate)}`),
  ].join("");

  // month labels originate from backend, so escape to avoid accidental html injection.
  paymentsBody.innerHTML = result.monthlyPayments
    .map(
      (payment) => `
      <tr>
        <td>${escapeHtml(payment.month)}</td>
        <td>${payment.days}</td>
        <td>${formatMoney(payment.payment)}</td>
      </tr>
    `,
    )
    .join("");
}

function renderEmptyState(): void {
  savedIdElement.textContent = "";
  statsElement.innerHTML = "";
  paymentsBody.innerHTML = `
    <tr>
      <td colspan="3" class="empty">Submit input to see the 12-month payment breakdown.</td>
    </tr>
  `;
}

function setStatus(message: string): void {
  statusElement.textContent = message;
}

function setValidationMessage(message: string): void {
  validationMessageElement.textContent = message;
}

function formatMoney(value: number): string {
  return Number(value).toFixed(2);
}

function makeStatChip(text: string): string {
  return `<span class="stat-chip">${escapeHtml(text)}</span>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function saveId(id: number): void {
  localStorage.setItem(STORAGE_KEY, String(id));
}

function getSavedId(): number | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function getRequiredElement<T extends Element>(selector: string): T {
  // fail fast on missing markup to avoid silent null errors later.
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`App initialization failed: missing element ${selector}`);
  }

  return element;
}
