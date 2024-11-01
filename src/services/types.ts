import { ActionType } from "@/src/type/types";

export type User = {
  name: string;
  password: string;
  id: string;
  wins: number;
};
export type UserData = {
  index: string | number;
  name: string;
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
  index: string | number;
};

export type Game = {
  gameId: string;
  roomId: string;
  players: any[];
  playerShips: any[];
};
