import WebSocket, { WebSocketServer } from "ws";
import { httpServer } from "./src/http_server";
import { ActionType, FormLogin } from "@/src/type/types";
import { UserService } from "@/src/services/userService";
import { RoomService } from "@/src/services/roomService";
import { User, UserData } from "@/src/services/types";
import { GameService } from "@/src/services/gameService";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on("connection", (ws) => {
  console.log("New connection!", ws.protocol);

  const userService = new UserService();
  const roomService = new RoomService();
  const gameService = new GameService();
  let currentUser: UserData;

  ws.on("message", (message) => {
    console.log("Received: ", message.toString());
    const requestMsg: FormLogin = JSON.parse(message.toString());

    switch (requestMsg.type) {
      case ActionType.REG:
        const newUser = userService.createUser(requestMsg.data as string);
        const regInfo = {
          type: ActionType.REG,
          data: JSON.stringify(newUser),
          id: requestMsg.id,
        };

        ws.send(JSON.stringify(regInfo));

        wsServer.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            roomService.updateRoom(client);
            userService.updateWinners(client);
          }
        });

        currentUser = {
          name: newUser.name,
          index: (newUser as { name: string; index: string }).index,
        };

        return;
      case ActionType.CREATE_ROOM:
        const newRoom = roomService.createRoom(currentUser as UserData);

        const rooms = roomService.updateRoom(ws);

        console.dir("rooms", console.log(JSON.stringify(rooms, null, 4)));
        break;
      case ActionType.ADD_USER:
        roomService.addUserToRoom(
          (requestMsg.data as { indexRoom: string }).indexRoom,
          currentUser
        );

        const game = gameService.createGame(
          (requestMsg.data as { indexRoom: string }).indexRoom
        );

        wsServer.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            roomService.updateRoom(client);

            const createGameInfo = {
              type: ActionType.CREATE_GAME,
              data: JSON.stringify({
                idGame: game.gameId,
                idPlayer: currentUser.index,
              }),
              id: 0,
            };
            console.log("createGameInfo", createGameInfo);

            ws.send(JSON.stringify(createGameInfo));
          }
        });
        break;
      case ActionType.CREATE_GAME:
      case ActionType.UPDATE_ROOM:
      case ActionType.ADD_SHIPS:
      case ActionType.START_GAME:
      case ActionType.ATTACK:
      case ActionType.SINGLE_PLAY:
        break;
    }

    ws.on("error", (error) => {
      console.log(error);
    });
  });
});
