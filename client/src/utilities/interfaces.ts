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
  to?: string;
  from?: string;
}
export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  receive_msg: (data: messageInterface) => void;
}
export interface ClientToServerEvents {
  add_user: (userId: string) => void;
  send_msg: (data: messageInterface) => void;
  disconnect: () => void;
}

export interface currentChatInterface {
  id: EntityId | null;
  isGroup: boolean;
}

export interface stateInterface {
  user: mainUserInterface | null;
  accessToken: string | null;
  currentChat: currentChatInterface;
  showChatBox: boolean;
  showProfile: boolean;
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

export interface userInterface {
  profilePicture: string | null;
  _id: string;
  email: string;
  userName: string;
  groupColor: string;
  messages: EntityId[];
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

export interface groupInterface {
  profilePicture: string | null;
  _id: string;
  userName: string;
  description: string;
  messages: EntityId[];
  unread: EntityId[];
  members: EntityId[];
  admins: EntityId[];
  lastUpdated: number;
  isGroup: boolean;
  isArchived: boolean;
  isMuted: boolean;
}