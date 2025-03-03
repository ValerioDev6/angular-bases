export interface ICheckUserStatus {
  user: User;
  access_token: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  avatar: null;
  roleId: number;
  roles: Roles;
}

export interface Roles {
  name: string;
}
