export async function api(path: string, method = "GET", body?: unknown) {
  const form = body instanceof FormData;
  const response = await fetch("/api/v1" + path, {
    method,
    credentials: "same-origin",
    headers:
      method === "GET" || form ? {} : { "Content-Type": "application/json" },
    body: form ? body : body === undefined ? undefined : JSON.stringify(body),
  });
  const data = response.headers
    .get("content-type")
    ?.includes("application/json")
    ? await response.json()
    : null;
  if (!response.ok)
    throw new Error(data?.error || "Request failed. Please try again.");
  return data;
}
