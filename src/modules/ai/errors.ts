export class AiUsageLimitError extends Error {
  constructor() {
    super("AI usage limit reached for today");
  }
}

export class AiConfigurationError extends Error {
  constructor() {
    super("Gemini API key is not configured");
  }
}

export class AiConcurrencyError extends Error {
  constructor() {
    super("Another AI operation is already in progress");
  }
}
