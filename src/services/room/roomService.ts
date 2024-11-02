import { Room } from "@/src/services/room/model";
import { RoomType, UserType, UserData } from "@/src/services/types";
import { ActionType } from "@/src/type/types";

export class RoomService {
  rooms: RoomType[] = [];

  createRoom(user: UserType) {
    const newRoom: Room = new Room();
    newRoom.id = this.getLastRoomId(this.rooms) + 1;
    newRoom.users.push(user);
    this.rooms.push(newRoom);

    const data = this.rooms.map(({ id, users }) => {
      return {
        roomId: id,
        roomUsers: users.map(({ name, id }) => ({ name, index: id })),
      };
    });

    return JSON.stringify({
      type: ActionType.UPDATE_ROOM,
      data: JSON.stringify(data),
      id: 0,
    });
  }

  updateRoom(websocket: import("ws")) {
    const rooms = this.rooms
      .filter((room) => room.users.length === 1)
      .map((room) => {
        return {
          roomId: room.id,
          roomUsers: room.users,
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

  getAvailableRooms(): string {
    const data = this.rooms.map((room) => {
      return {
        roomId: room.id,
        roomUsers: room.users.map(({ name, id }) => ({ name, index: id })),
      };
    });

    return JSON.stringify({
      type: "update_room",
      data: JSON.stringify(data),
      id: 0,
    });
  }

  addUserToRoom(user: UserType, message: string) {
    console.log("addUserToRoom", user);

    const data = JSON.parse(message);

    const room = this.rooms.find((room) => room.id === data.indexRoom);
    if (room) {
      if (room.users[0].id === user.id || room.users.length === 2) return;

      const roomIndex = this.getRoomIndexByUserId(user.id);
      if (roomIndex >= 0) {
        this.rooms.splice(roomIndex, 1);
      }
      room.users.push(user);
    }
  }

  getRoomIndexByUserId(userId: number | string): number {
    return this.rooms.findIndex((room) =>
      room.users.find(({ id }) => id === userId)
    );
  }

  getLastRoomId(allRooms: Array<Room>): number {
    return Math.max(-1, ...allRooms.map(({ id }) => +id));
  }
}
