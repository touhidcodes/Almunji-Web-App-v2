export const normalizeTags = (value: unknown): string[] => {
  let parsed = value;

  if (typeof parsed === "string") {
    const trimmed = parsed.trim();

    if (!trimmed) return [];

    try {
      const json: unknown = JSON.parse(trimmed);
      parsed = Array.isArray(json) ? json : trimmed.split(",");
    } catch {
      parsed = trimmed.split(",");
    }
  }

  if (!Array.isArray(parsed)) return [];

  return [
    ...new Set(
      parsed
        .filter((tag): tag is string => typeof tag === "string")
        .flatMap((tag) => tag.split(","))
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];
};
