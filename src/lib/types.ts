import { FieldValue, Timestamp } from "@firebase/firestore-types";

export type Item = {
  id: string;
  name: string;
  quantity: number;
  purchased: boolean;
  addedBy: string;
  // createdAt?: { nanoseconds: number; seconds: number };
  createdAt: Timestamp | FieldValue;
};

export type Items = Item[];

// map permissions so that i.e. Edit -> "edit"
export enum PermissionTypes {
  Edit = "edit",
  Delete = "delete",
}

export type Permissions = {
  [key: string]: PermissionTypes;
};

export type ShoppingList = {
  // createdAt?: { nanoseconds: number; seconds: number };
  createdAt: Timestamp | FieldValue;
  id: string;
  name: string;
  ownerId: string;
  permissions: Permissions;
  sharedWith: string[];
  items?: Items;
};

export type ShoppingLists = ShoppingList[];
