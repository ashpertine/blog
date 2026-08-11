import { fetchNoAuth, fetchWithAuth } from "./base";

export function getAllPostsApi() {
  return fetchNoAuth("GET", "/api/posts", {});
}

export function getPostByIdApi(postId: number, userJwt: string) {
  return fetchWithAuth("GET", `/api/posts/${postId}`, {}, userJwt);
}

export function createPostApi(title: string, content: string, userJwt: string) {
  return fetchWithAuth("POST", `/api/posts`, {title, content}, userJwt);
}

export function updatePostApi(postId: number, title: string, content: string, userJwt: string) {
    return fetchWithAuth("PATCH", `/api/posts/${postId}`, {title, content}, userJwt);
}

export function updatePostStatusApi(postId: number, isPublic: boolean, userJwt: string) {
  return fetchWithAuth("PATCH", `/api/posts/${postId}`, {"is_public": isPublic}, userJwt);
}

export function deletePostStatusApi(postId: number, userJwt: string) {
  return fetchWithAuth("DELETE", `/api/posts/${postId}`, {}, userJwt);
}

export function getPostCommentsApi(postId: number) {
  return fetchNoAuth("GET", `/api/posts/${postId}/comments`, {});
}

export function createCommentApi(postId: number, parentCommentId: number | null, content: string, userJwt: string) {
  return parentCommentId === null ? fetchWithAuth("POST", `/api/posts/${postId}/comments`, { content }, userJwt) : 
       fetchWithAuth("POST", `/api/posts/${postId}/comments/${parentCommentId}`, { content }, userJwt);
}

export function updateCommentApi(commentId: number, content: string, userJwt: string) {
  return fetchWithAuth("PATCH", `/api/comments/${commentId}`, { content }, userJwt);
}

