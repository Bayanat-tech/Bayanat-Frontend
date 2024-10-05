import { AuthProps } from 'types/auth';

export const isUserAuthorized = (pathName: string[], user_permission: number[], permissions: AuthProps['permissions']) => {
  const result = pathName.some((eachPathname) => !user_permission.includes(permissions[eachPathname].serial_number));
  return result;
};
export const getPathNameList = (pathname: string) => {
  return pathname.split('/').filter(Boolean);
};
export const updatePath = (current_pathname: string, level: number, new_url_path: string) => {
  let currentPathParts = current_pathname.split('/').filter(Boolean);

  if (level <= 0) {
    console.log('Level must be greater than 0');
  }

  const adjustedLevel = level;

  if (adjustedLevel >= currentPathParts.length) {
    currentPathParts.push(...Array(adjustedLevel - currentPathParts.length + 1).fill(''));
  }

  currentPathParts = currentPathParts.slice(0, adjustedLevel).concat(new_url_path);

  return `/${currentPathParts.join('/')}`.replace(/\/+$/, '');
};
