type Fields = Record<string, unknown>;

function emit(level: "info" | "warn" | "error", message: string, fields?: Fields) {
  const line = { level, message, ...fields, time: new Date().toISOString() };
  if (level === "error") console.error(JSON.stringify(line));
  else if (level === "warn") console.warn(JSON.stringify(line));
  else console.log(JSON.stringify(line));
}

export const logger = {
  info: (message: string, fields?: Fields) => emit("info", message, fields),
  warn: (message: string, fields?: Fields) => emit("warn", message, fields),
  error: (message: string, fields?: Fields) => emit("error", message, fields),
};
