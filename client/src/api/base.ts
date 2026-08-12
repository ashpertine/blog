type AppHttpMethod = "POST" | "GET" | "DELETE" | "PATCH"

export function fetchNoAuth(method: AppHttpMethod, url: string, data: Record<string, unknown> | null) {
  return fetch(url, {
    method: method,
    body: data ? JSON.stringify(data) : data,
    headers: {
      "Content-Type": "application/json"
    }
  }).then((response) => {
    if(response.status >= 400) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    return response;
  }).then(response => {
    return response.json().then(body => {
      if(!body.success) throw new Error(`Error ${body.statusCode}: ${body.message}`)

      return body;
    })
  });
}

export function fetchWithAuth(method: AppHttpMethod, url: string, data: Record<string, unknown> | null, jwt: string) {
  return fetch(url, {
    method: method,
    body: data ? JSON.stringify(data) : data,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    }
  }).then((response) => {
    if(response.status >= 400) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    return response;
  }).then(response => {
    return response.json().then(body => {
      if(!body.success) throw new Error(`Error ${body.statusCode}: ${body.message}`)

      return body;
    })
  });
}