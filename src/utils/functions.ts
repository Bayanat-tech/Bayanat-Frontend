import { AuthProps } from 'types/auth';

export const isUserAuthorized = (pathName: string[], user_permission: number[], permissions: AuthProps['permissions']): boolean => {
  const userPermissionSet = new Set(user_permission);

  const result = pathName.some((eachPathname) => {
    const permission = permissions[eachPathname];

    if (permission && !userPermissionSet.has(permission.serial_number)) {
      return true;
    }

    if (permission?.children) {
      return Object.keys(permission.children).some((childKey) => {
        const childPermission = permission.children[childKey];
        return !userPermissionSet.has(childPermission.serial_number);
      });
    }

    return false;
  });

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
export const getAccessToken = () => {
  const accessToken = window.localStorage.getItem('serviceToken');
  if (accessToken !== null) {
    return accessToken;
  }
  return window.localStorage.getItem('serviceToken');
};
export const removeExtension = (fileName: string) => {
  return fileName.replace(/\.[^.]+$/, '');
};
