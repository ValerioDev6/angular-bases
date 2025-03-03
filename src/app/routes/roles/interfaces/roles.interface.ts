export interface IRolesResponse {
  info: Info;
  roles: Role[];
}

export interface Info {
  page: number;
  limit: number;
  total: number;
  next: string;
  prev: null;
}

export interface Role {
  id: number;
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
