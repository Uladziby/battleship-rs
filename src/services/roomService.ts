import { RoomsData, UserData } from "@/src/services/types";
import { ActionType } from "@/src/type/types";
import { v4 as uuidv4 } from "uuid";

export class RoomService {
  rooms: RoomsData = [{ roomId: "0", roomUsers: [] }];

  createRoom({ index, name }: { index: string | number; name: string }) {
    const newRoom = {
      roomId: uuidv4(),
      roomUsers: [
        {
          index: index,
          name: name,
        },
      ],
    };

    this.rooms.push(newRoom);
    return newRoom;
  }

  updateRoom(websocket: import("ws")) {
    const rooms = this.rooms
      .filter((room) => room.roomUsers.length === 1)
      .map((room) => {
        return {
          roomId: room.roomId,
          roomUsers: room.roomUsers,
        };
      });

    const updatedRoomList = {
      type: ActionType.UPDATE_ROOM,
      data: JSON.stringify(rooms),
      id: 0,
    };

    console.log("listRoom", updatedRoomList);
    websocket.send(JSON.stringify(updatedRoomList));

    return rooms;
  }

  addUserToRoom(idRoom: string, { index, name }: UserData) {
    console.log("addUserToRoom", idRoom, index, name);
    const room = this.rooms.find((room) => room.roomId === idRoom);
    if (room) {
      room.roomUsers.push({ index, name });
    }
  }
}
