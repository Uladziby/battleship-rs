import { ResponseLoginData, UserType } from "@/src/services/types";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  users: UserType[] = [];

  createUser(data: string): ResponseLoginData {
    const parsedData = JSON.parse(data);
    const existedUser = this.users.find(
      (user) => user.name === parsedData.name
    );
    if (existedUser) {
      const isPasswordCorrect = existedUser.password === parsedData.password;

      if (!isPasswordCorrect) {
        console.log("Wrong password");

        return {
          name: existedUser.name,
          index: existedUser.id,
          error: true,
          message: "Wrong password",
        };
      }
      return {
        name: existedUser.name,
        index: existedUser.id,
        error: false,
        message: "User found",
      };
    }

    const newUser: UserType = {
      name: parsedData.name,
      password: parsedData.password,
      id: parseInt(uuidv4(), 16),
      wins: 0,
    };

    this.addUser(newUser);

    return {
      name: newUser.name,
      index: newUser.id,
      error: false,
      message: "User created",
    };
  }

  addUser(user: UserType) {
    this.users.push(user);
  }

  getUsers() {
    console.log("Get users", this.users);
    return this.users;
  }

  getUserByName(name: string): UserType | undefined {
    return this.users.find((user) => user.name === name);
  }

  getWins() {
    return this.users.map(({ name, wins }) => {
      return { name, wins };
    });
  }

  updateWinners(websocket: import("ws")) {
    const winners = this.getWins();
    const updatedWinners = {
      type: "update_winners",
      data: JSON.stringify(winners),
      id: 0,
    };

    websocket.send(JSON.stringify(updatedWinners));
  }
}
