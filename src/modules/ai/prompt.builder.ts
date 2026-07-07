import type { ClientCodeRequestPayload } from "@/services/ai-client";

export class PromptBuilder {
  buildGenerateRequestPrompt(promptText: string, locale: "pt-BR" | "en") {
    const outputLang = locale === "pt-BR" ? "Portuguese from Brazil" : "English";

    return [
      "You are apiFlash's HTTP request generator assistant.",
      "The user will describe an API call they want to configure.",
      "Generate the method, full URL, headers, query parameters, auth configurations, and JSON body templates.",
      "Always default to JSON body type if a body is generated.",
      "Respond strictly with a JSON object matching the requested schema.",
      `Ensure user instructions are parsed accurately into appropriate key-value headers. All instructions should be translated to ${outputLang} for placeholders if relevant.`,
      `Prompt: "${promptText}"`
    ].join("\n");
  }

  buildAnalyzeResponsePrompt(reqResData: Record<string, unknown>, locale: "pt-BR" | "en") {
    const langName = locale === "pt-BR" ? "Portuguese from Brazil" : "English";

    if (locale === "pt-BR") {
      return [
        "Você é o especialista de diagnóstico de APIs do apiFlash.",
        `Responda apenas em ${langName}.`,
        "Analise esta chamada de API (URL, método, status e payloads) e retorne um objeto JSON combinando perfeitamente com o esquema.",
        `URL do Request: ${reqResData.url}`,
        `Método: ${reqResData.method}`,
        `Status de Resposta: ${reqResData.responseStatus}`,
        `Headers do Request: ${reqResData.requestHeaders}`,
        `Corpo do Request: ${reqResData.requestBody}`,
        `Headers da Resposta: ${reqResData.responseHeaders}`,
        `Corpo da Resposta (Payload):`,
        reqResData.responseBody.slice(0, 10000), // Limit size sent
        "",
        "Tarefas do JSON:",
        "1. 'description': Explicação resumida do que o endpoint retornou.",
        "2. 'tsType': Uma declaração de interface ou tipo TypeScript correspondente ao JSON de resposta. Formate com quebras de linha reais \\n.",
        "3. 'securityReview': Lista de vulnerabilidades ou problemas observados (ex: falta de cabeçalhos de segurança CORS, tokens vazados, senhas em plaintext).",
        "4. 'riskLevel': Nível geral de risco de vazamento/configuração: 'low', 'medium' ou 'high'.",
      ].join("\n");
    }

    return [
      "You are apiFlash's API diagnostics expert.",
      `Reply only in ${langName}.`,
      "Analyze the HTTP call metadata below and return a JSON match for the schema.",
      `Request URL: ${reqResData.url}`,
      `Method: ${reqResData.method}`,
      `Response Status: ${reqResData.responseStatus}`,
      `Request Headers: ${reqResData.requestHeaders}`,
      `Request Body: ${reqResData.requestBody}`,
      `Response Headers: ${reqResData.responseHeaders}`,
      `Response Body (Payload):`,
      reqResData.responseBody.slice(0, 10000),
      "",
      "JSON Tasks:",
      "1. 'description': Brief explanation of what the payload represents.",
      "2. 'tsType': Complete TypeScript interface/type corresponding to the response payload. Format with line breaks \\n.",
      "3. 'securityReview': Bullet points of security leaks or concerns (e.g. leaked authorization headers, missing HSTS, CORS issues).",
      "4. 'riskLevel': Overall risk assessment: 'low', 'medium', or 'high'.",
    ].join("\n");
  }

  buildClientCodePrompt(reqData: ClientCodeRequestPayload, language: string) {
    return [
      "You are apiFlash's technical writer helper.",
      `Generate a code snippet to perform this HTTP request using: ${language}.`,
      `Request URL: ${reqData.url}`,
      `Method: ${reqData.method}`,
      `Headers: ${JSON.stringify(reqData.headers)}`,
      `Body: ${reqData.body}`,
      `Body Type: ${reqData.bodyType}`,
      "",
      "Ensure that the code is formatted beautifully with line breaks (using '\\n') and correct spacing. Return a JSON object with: { code: string }.",
    ].join("\n");
  }
}
