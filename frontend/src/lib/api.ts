export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  data?: any,
  token?: string
) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData.message || "Request failed");
  return responseData;
}
