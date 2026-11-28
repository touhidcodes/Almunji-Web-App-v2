import { isAxiosError } from "axios";

interface ApiErrorSource {
  path?: string | string[];
  message?: string;
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
          !!source.message.trim(),
      )
      .map((source) => source.message!.trim());

    if (messages.length) return messages.join(", ");
  }

  return typeof data.message === "string" && data.message.trim()
    ? data.message
    : undefined;
};

const getErrorMessage = (
  err: unknown,
  fallback = "Something went wrong!",
): string => {
  if (isAxiosError(err)) {
    const message = getApiErrorMessage(err.response?.data);

    if (message) return message;

    if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
      return "Request timed out. Please try again.";
    }

    if (!err.response) {
      return "Unable to connect to the server. Please check your internet connection.";
    }

    return fallback;
  }

  // Handle direct API response objects
  const message = getApiErrorMessage(err);

  if (message) return message;

  if (err instanceof Error) return err.message || fallback;

  if (typeof err === "string" && err.trim()) return err;

  return fallback;
};

export default getErrorMessage;
