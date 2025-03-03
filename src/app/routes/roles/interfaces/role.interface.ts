export interface IRolResponse {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  action: string;
  objectId: number;
  objectName: string;
}

export enum ObjectName {
  Permissions = 'permissions',
  Roles = 'roles',
  Users = 'users',
}
