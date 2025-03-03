export interface IUserResponse {
  id: number;
  email: string;
  avatar: null;
  roles: Roles;
}

export interface Roles {
  name: string;
  role_permissions: RolePermission[];
}

export interface RolePermission {
  permissions: Permissions;
}

export interface Permissions {
  action: string;
  objects: Objects;
}

export interface Objects {
  name: string;
}
