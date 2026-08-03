export const userPermissions: Record<string, string[]> = {
  "createPost": ["author", "admin"],
  "modifyOwnPost": ["author", "admin"],
  "createComment": ["commenter", "admin"],
  "modifyOwnComment": ["commenter", "admin"],
  "modifyOtherPost": ["admin"],
  "modifyRoles": ["admin"],
}

export const userRoles = (() => {
  return Array.from(new Set(Object.values(userPermissions).reduce((acc, val) =>
    acc.concat(val)
  , [])))
})();