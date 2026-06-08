import type { BenefitRequest, BenefitResponse } from "./types.js";

export class BenefitService {
  private readonly apiBaseUrl: string;

  constructor(apiBaseUrl: string = "http://localhost:8080/api/benefits") {
    this.apiBaseUrl = apiBaseUrl;
  }

  async createBenefitInput(request: BenefitRequest): Promise<BenefitResponse> {
    // create endpoint persists input and returns calculated payment breakdown.
    const response = await fetch(this.apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    return this.parseResponse(response);
  }

  async getBenefitInputById(id: number): Promise<BenefitResponse> {
    const response = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: "GET",
    });

    return this.parseResponse(response);
  }

  private async parseResponse(response: Response): Promise<BenefitResponse> {
    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;

      try {
        // backend may send structured error payloads; prefer message when available.
        const errorPayload = await response.json();
        if (errorPayload?.message && typeof errorPayload.message === "string") {
          message = errorPayload.message;
        }
      } catch {
        // ignore json parse failures and use default message.
      }

      throw new Error(message);
    }

    return response.json() as Promise<BenefitResponse>;
  }
}
