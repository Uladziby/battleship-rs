import { RoomsData } from "@/src/services/types";
import { v4 as uuidv4 } from "uuid";

export class RoomService {
  rooms: RoomsData = [{ roomId: "0", roomUsers: [] }];

  createRoom({ userId, name }: { userId: string | number; name: string }) {
    const newRoom = {
      roomId: uuidv4(),
      roomUsers: [
        {
          userId: userId,
          name: name,
        },
      ],
    };

    this.rooms.push(newRoom);
    return newRoom;
  }

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
