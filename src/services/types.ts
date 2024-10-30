import { ActionType } from "@/src/type/types";

export type User = {
  name: string;
  password: string;
  id: string;
  wins: number;
};

export type UserData = {
  name: string;
  userId: string | number;
};

export type ResponseLoginData = {
  name: string;
  index: string;
  error: boolean;
  message: string;
};

export type RequestUpdateRoom = {
  type: typeof ActionType.UPDATE_ROOM;
  data: RoomsData;
  id: number;
};

export type RoomsData = [
  {
    roomId: string | number;
    roomUsers: RoomUser[];
  }
];

export type RoomUser = {
  name: string;
  userId: string | number;
};
