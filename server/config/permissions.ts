export const userPermissions: Record<string, string[]> = {
  "createPost": ["author", "admin"],
  "modifyOwnPost": ["author", "admin"],
  "modifyOtherPost": ["admin"],
  "addAuthorRole": ["admin"],
  "addAdminRole": ["admin"],
}