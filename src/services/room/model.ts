import { RoomType, UserType } from "@/src/services/types";

export class Room implements RoomType {
  id: number = 0;
  users: Array<UserType> = [];
}
