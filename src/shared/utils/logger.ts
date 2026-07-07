export const logger = {
  info: (context: Record<string, unknown>, message: string) => {
    console.log(JSON.stringify({ level: "INFO", message, ...context, timestamp: new Date().toISOString() }));
  },
  warn: (context: Record<string, unknown>, message: string) => {
    console.warn(JSON.stringify({ level: "WARN", message, ...context, timestamp: new Date().toISOString() }));
  },
  error: (context: Record<string, unknown>, message: string) => {
    console.error(JSON.stringify({ level: "ERROR", message, ...context, timestamp: new Date().toISOString() }));
  },
};
