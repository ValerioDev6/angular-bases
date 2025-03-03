export interface ILoginResponse {
  user: User;
  access_token: string;
}

export interface User {
  id: number;
  email: string;
  avatar: null;
  roleId: number;
  roles: Roles;
}

export interface Permissions {
  id: number;
  action: string;
  objectId: number;
  objects: Roles;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  created_at: Date;
  updated_at: Date;
  permissions: Permissions;
}

export interface Roles {
  id: number;
  name: string;
  role_permissions?: RolePermission[];
}
