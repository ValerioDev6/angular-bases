
export interface IUsersResponse {
  info: Info;
  users: User[];
}

export interface Info {
  page: number;
  limit: number;
  total: number;
  next: string;
  prev: null;
}

export interface User {
  id: number;
  email: string;
  password: string;
  avatar: null | string;
  roleId: number;
  created_at: Date;
  updated_at: Date;
  roles: Roles;
}

export interface Roles {
  id: number;
  name: string;
}
