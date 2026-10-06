// Validates a `from` query param (the page a project/release modal was
// reached from) before using it as a navigation target. It comes from the
// URL, so it must be a same-site path — never an absolute URL or a
// protocol-relative one (`//evil.com`) that a browser would treat as
// external.
export function toSafeInternalPath(value: string | string[] | undefined, fallback: string): string {
  const path = Array.isArray(value) ? value[0] : value;
  if (path && path.startsWith("/") && !path.startsWith("//")) return path;
  return fallback;
}
