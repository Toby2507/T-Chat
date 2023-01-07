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
export interface stateInterface {
  user: mainUserInterface | null;
  accessToken: string | null;
  currentChat: EntityId | null;
  showChatBox: boolean;
  showProfile: boolean;
}

export interface mainUserInterface {
  profilePicture: string | null;
  _id: string;
  email: string;
  userName: string;
  verified: boolean;
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
  verified: boolean;
  messages: EntityId[];
  unread: EntityId[];
  blockedUsers?: string[];
  blockedMe: boolean;
  lastUpdated: number;
  isArchived: boolean;
  isMuted: boolean;
  isBlocked: boolean;
}
