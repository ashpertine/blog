type AppHttpMethod = "POST" | "GET" | "DELETE" | "PATCH"

export function fetchNoAuth(method: AppHttpMethod, url: string, data: Record<string, unknown>) {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  }).then((response) => {
    response.json()
  }).catch(error => error)
}

export function fetchWithAuth(method: AppHttpMethod, url: string, data: Record<string, unknown>, jwt: string) {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    }
  }).then((response) => {
    response.json()
  }).catch(error => error)
}