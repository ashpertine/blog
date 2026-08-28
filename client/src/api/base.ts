type AppHttpMethod = "POST" | "GET" | "DELETE" | "PATCH"

export type responseData = {
  success: boolean,
  message: string | string[],
  details?: string[],
  token?: string,
  [additionalData: string]: unknown
}

export class FetchError extends Error {
  statusCode: number;
  details: string[] | null;
  constructor(response: Response, body: responseData | null) {
    if (body) super(String(body.message));
    else super(response.statusText);

    this.statusCode = response.status;
    this.details = body ? body.details ?? null : null;
  }

  toMessage() {
    return `Error ${this.statusCode}: ${this.message}`;
  }
}

export function fetchWithAuth(method: AppHttpMethod, url: string, data: Record<string, unknown> | null, jwt: string | null) {
  return fetch(url, {
    method: method,
    body: data ? JSON.stringify(data) : data,
    headers: {
      "Content-Type": "application/json",
      ...(jwt !== null && { "Authorization": `Bearer ${jwt}` })
    }
  }).then((response) => {
    return response.json().then(body => {
      if(response.status >= 400 && body.success === false) {
        throw new FetchError(response, body);
      }

      return body;
      }).catch(() =>{ throw new FetchError(response, null) });
  })
}

