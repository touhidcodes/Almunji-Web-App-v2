import { isAxiosError } from "axios";

interface ApiErrorSource {
  path?: string | string[];
  message?: string;
}

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errorSources?: ApiErrorSource[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getApiErrorMessage = (data: unknown): string | undefined => {
  if (!isRecord(data)) return undefined;

  const errorSources = data.errorSources;

  if (Array.isArray(errorSources)) {
    const messages = errorSources
      .filter(
        (source): source is ApiErrorSource =>
          isRecord(source) &&
          typeof source.message === "string" &&
          source.message.trim().length > 0,
      )
      .map((source) => source.message!.trim());

    if (messages.length) {
      return messages.join(", ");
    }
  }

  return typeof data.message === "string" && data.message.trim()
    ? data.message
    : undefined;
};

const getErrorMessage = (
  err: unknown,
  fallback = "Something went wrong!",
): string => {
  // Axios errors
  if (isAxiosError<ApiErrorResponse>(err)) {
    const serverMessage = getApiErrorMessage(err.response?.data);

    if (serverMessage) return serverMessage;

    // Timeout errors
    if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
      return "Request timed out. Please try again.";
    }

    // Network errors
    if (!err.response) {
      return "Unable to connect to the server. Please check your internet connection.";
    }

    return err.response.statusText || fallback;
  }

  // Native JavaScript errors
  if (err instanceof Error) {
    return err.message || fallback;
  }

  // String errors
  if (typeof err === "string" && err.trim()) {
    return err;
  }

  // Other object errors
  if (isRecord(err) && typeof err.message === "string") {
    return err.message || fallback;
  }

  return fallback;
};

export default getErrorMessage;
