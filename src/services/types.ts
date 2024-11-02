import { ActionType } from "@/src/type/types";

export type UserType = {
  name: string;
  password: string;
  id: number;
  wins: number;
};
export type UserData = {
  id: string | number;
  name: string;
};

export type ResponseLoginData = {
  name: string;
  index: string | number;
  error: boolean;
  message: string;
};

export type RequestUpdateRoom = {
  type: typeof ActionType.UPDATE_ROOM;
  data: RoomsData;
  id: number;
};

export type RoomType = {
  id: number;
  users: UserType[];
};
export type RoomsData = [
  {
    roomId: string | number;
    roomUsers: RoomUser[];
  }
];

export type RoomUser = {
  name: string;
  index: string | number;
};

export type Game = {
  gameId: string;
  roomId: string;
  players: any[];
  playerShips: any[];
};
