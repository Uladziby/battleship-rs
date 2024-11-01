import { Game } from "@/src/services/types";
import { v4 as uuidv4 } from "uuid";

export class GameService {
  /*{
    type: "create_game", //send for both players in the room, after they are connected to the room
    data:
        {
            idGame: <number | string>,  
            idPlayer: <number | string>, 
        },
        id: 0,
    }
    */
  games: Game[] = [];

  createGame(indexRoom: string) {
    console.log("Game created");

    const newGame = {
      gameId: uuidv4(),
      roomId: indexRoom,
      players: [],
      playerShips: [],
    };

    this.games.push(newGame);

    return newGame;
  }
}
