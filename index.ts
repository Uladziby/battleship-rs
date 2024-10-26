import { WebSocketServer } from "ws";
import { httpServer } from "./src/http_server";
import { ActionType, FormLogin } from "@/src/type/types";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on("connection", (ws) => {
  console.log("New connection!", ws.protocol);

  ws.on("message", (message) => {
    console.log("Received: ", message.toString());
    const requestMsg: FormLogin = JSON.parse(message.toString());

    switch (requestMsg.type) {
      case ActionType.REG:
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
