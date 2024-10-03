export const isUserAuthorized = (pathName: string[], user_permission: number[], permissions: { [key: string]: number }) => {
  return pathName.some((eachPathname) => eachPathname.length > 0 && user_permission.includes(permissions[eachPathname]) === false);
};
