import WebSocket, { WebSocketServer } from "ws";
import { httpServer } from "./src/http_server";
import { ActionType, FormLogin } from "@/src/type/types";
import { UserService } from "@/src/services/userService";
import { RoomService } from "@/src/services/roomService";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on("connection", (ws) => {
  console.log("New connection!", ws.protocol);

  const userService = new UserService();
  const roomService = new RoomService();

  ws.on("message", (message) => {
    console.log("Received: ", message.toString());
    const requestMsg: FormLogin = JSON.parse(message.toString());

    switch (requestMsg.type) {
      case ActionType.REG:
        const newUser = userService.createUser(requestMsg.data);
        const regInfo = {
          type: ActionType.REG,
          data: JSON.stringify(newUser),
          id: requestMsg.id,
        };

        ws.send(JSON.stringify(regInfo));

        wsServer.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const emptyRooms = roomService.updateRoom(client);
            console.log("emptyRooms", emptyRooms);
            //updateWinners(client);
          }
        });
        return;
      case ActionType.CREATE_ROOM:
      case ActionType.ADD_USER:
      case ActionType.CREATE_GAME:
      case ActionType.UPDATE_ROOM:
      case ActionType.ADD_SHIPS:
      case ActionType.START_GAME:
      case ActionType.ATTACK:
    }
  });
});
