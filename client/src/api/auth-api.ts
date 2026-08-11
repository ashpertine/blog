import { fetchNoAuth, fetchWithAuth } from "./base"

export function loginUserApi(username: string, password: string) {
  return fetchNoAuth("POST", "/api/login", {username, password});
}

export function registerUserApi(username: string, password: string, confirmPassword: string) {
  return fetchNoAuth("POST", "/api/register", {username, password, confirmPassword});
}

export function getProfileApi(userJwt: string) {
  return fetchWithAuth("GET", "/api/profile", {}, userJwt);
}

export function getPermissionsApi(userJwt: string) {
  return fetchWithAuth("GET", "/api/profile/permissions", {}, userJwt);
}

export function setPermissionsApi(userId: number, roles: string[], userJwt: string) {
  return fetchWithAuth("PATCH", `/api/profile/${userId}/permissions`, { roles }, userJwt);
}