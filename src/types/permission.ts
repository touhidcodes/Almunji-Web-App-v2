import type { Resource, Action } from "./user";

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
export interface PermissionData {
  id: string;
  resource: Resource;
  action: Action;
  createdAt: Date;
}

export interface UserPermissionData {
  id: string;
  userId: string;
  permissionId: string;
  assignedBy?: string | null;
  assignedAt: Date;
  permission?: PermissionData | null;
}

export interface UserPermissionsResponse {
  permissions: PermissionData[];
}

export interface UserPermissionsResponse {
  permissions: Permission[];
}

export interface PermissionsResponse {
  permissions: Permission[];
}

export interface CreatePermissionPayload {
  resource: Resource;
  action: Action;
}

export interface AssignPermissionPayload {
  userId: string;
  permissionId: string;
}

export interface AssignBulkPermissionsPayload {
  userId: string;
  permissionIds: string[];
}

export interface RemovePermissionPayload {
  userId: string;
  permissionId: string;
}

export interface DeletePermissionPayload {
  id: string;
}

export interface DecodedTokenWithPermissions {
  userId: string;
  email: string;
  role: string;
  permissions?: Permission[];
  exp?: number;
  iat?: number;
}
