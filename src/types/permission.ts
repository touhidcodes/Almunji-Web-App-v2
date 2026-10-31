import { Resource, Action } from "./user";

export interface Permission {
  id: string;
  resource: Resource;
  action: Action;
  createdAt: Date;
}

export interface UserPermission {
  id: string;
  userId: string;
  permissionId: string;
  assignedBy?: string | null;
  assignedAt: Date;
}

export interface DecodedTokenWithPermissions {
  userId: string;
  email: string;
  role: string;
  permissions?: Permission[];
  exp?: number;
  iat?: number;
}
