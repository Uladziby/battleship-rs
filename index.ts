import WebSocket, { WebSocketServer } from "ws";
import { httpServer } from "./src/http_server";
import { ActionType, FormLogin } from "@/src/type/types";
import { UserService } from "@/src/services/userService";
import { RoomService } from "@/src/services/room/roomService";
import { UserData, UserType } from "@/src/services/types";
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
  let currentUser: UserType | undefined;
  let messageData: any;

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

        currentUser = userService.getUserByName(newUser.name);

        break;
      case ActionType.CREATE_ROOM:
        let newRoom;

        if (currentUser) newRoom = roomService.createRoom(currentUser);

        const rooms = roomService.updateRoom(ws);

        console.dir("rooms", console.log(JSON.stringify(rooms, null, 4)));
        break;
      case ActionType.ADD_USER:
        messageData = JSON.parse(message.toString());
        if (currentUser) roomService.addUserToRoom(currentUser, messageData);

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
                idPlayer: currentUser!.id,
              }),
              id: 0,
            };

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
