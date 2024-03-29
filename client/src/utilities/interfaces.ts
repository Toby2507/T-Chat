import { EntityId } from "@reduxjs/toolkit";

export interface messageInterface {
  id: string,
  fromSelf: boolean,
  message: string;
  date: string;
  time: string;
  datetime: number;
  read: boolean;
  readers: string[];
  sender: string;
  isInformational: boolean;
  to?: string;
  from?: string;
}

export interface groupInterface {
  profilePicture: string | null;
  _id: string;
  userName: string;
  description: string;
  messages: { id: string, isInformational: boolean; }[];
  unread: EntityId[];
  members: EntityId[];
  admins: EntityId[];
  lastUpdated: number;
  isGroup: boolean;
  isArchived: boolean;
  isMuted: boolean;
  to?: string;
  by?: string;
}

export interface userInterface {
  profilePicture: string | null;
  _id: string;
  email: string;
  userName: string;
  groupColor: string;
  messages: { id: string, isInformational: boolean; }[];
  unread: EntityId[];
  blockedUsers?: string[];
  groups: string[];
  blockedMe: boolean;
  lastUpdated: number;
  isGroup: boolean;
  isArchived: boolean;
  isMuted: boolean;
  isBlocked: boolean;
}

export interface ServerToClientEvents {
  noArg: (data: mainUserInterface) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  new_user_created: (data: userInterface) => void;
  editted_user: (data: Partial<userInterface>) => void;
  receive_msg: (data: messageInterface) => void;
  added_to_group: (data: groupInterface) => void;
  removed_from_group: (data: { groupId: string, userId: string, to: string; }) => void;
  deleted_group: (data: Partial<groupInterface>) => void;
  editted_group: (data: Partial<groupInterface>) => void;
  admin_initiated: (data: { groupId: string, userId: string, to: string; }) => void;
  blocked_me: (data: { userId: string, block: boolean; }) => void;
  online_users: (onlineUsers: string[]) => void;
  deleted_account: (userId: string) => void;
}

export interface ClientToServerEvents {
  create_new_user: (data: userInterface) => void;
  edit_user: (data: Partial<userInterface>) => void;
  add_user: (userId: string) => void;
  send_msg: (data: messageInterface) => void;
  add_to_group: (data: groupInterface) => void;
  remove_from_group: (data: { groupId: string, userId: string, to: string; }) => void;
  delete_group: (data: Partial<groupInterface>) => void;
  edit_group: (data: Partial<groupInterface>) => void;
  admin_init: (data: { groupId: string, userId: string, to: string; }) => void;
  block_user: (data: { userId: string, block: boolean; }) => void;
  delete_account: (userId: string) => void;
}

export interface currentChatInterface {
  id: EntityId | null;
  isGroup: boolean;
}

export interface mainUserInterface {
  profilePicture: string | null;
  _id: string;
  email: string;
  userName: string;
  verified: boolean;
  isGroup: boolean;
  archivedChats: string[],
  mutedUsers: string[],
  blockedUsers: string[],
  groups: string[],
}

export interface stateInterface {
  user: mainUserInterface | null;
  accessToken: string | null;
  currentChat: currentChatInterface;
  showChatBox: boolean;
  showProfile: boolean;
  onlineUsers: string[];
}

export interface optionalInterface {
  profilePicture: string | null;
  _id: string;
  email: string;
  userName: string;
  verified?: boolean;
  isGroup: boolean;
  archivedChats?: string[],
  mutedUsers?: string[],
  blockedUsers?: string[],
  groups: string[],
}
