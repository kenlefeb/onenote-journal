interface OfficeError extends Error {
  debugInfo?: {
    message?: string;
    errorLocation?: string;
    code?: string;
  };
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const officeError = error as OfficeError;
    if (officeError.debugInfo) {
      const info = officeError.debugInfo;
      const parts = [info.code, info.message, info.errorLocation].filter(Boolean);
      return parts.length > 0 ? parts.join(" | ") : error.message;
    }
    return error.message;
  }
  return String(error);
}
