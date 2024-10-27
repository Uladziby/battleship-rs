import { RoomsData } from "@/src/services/types";

export class RoomService {
  rooms: RoomsData = [];

  updateRoom(websocket: unknown) {
    const rooms = this.rooms
      .filter((room) => room.roomUsers.length === 1)
      .map((room) => {
        return {
          roomId: room.roomId,
          roomUsers: room.roomUsers,
        };
      });

    return rooms;
  }
}
