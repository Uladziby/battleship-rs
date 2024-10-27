import { ResponseLoginData, User } from "@/src/services/types";

export class UserService {
  users: User[] = [];

  createUser(data: string) {
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
      return existedUser;
    }

    const newUser: User = {
      name: parsedData.name,
      password: parsedData.password,
      id: this.users.length.toString(),
      wins: 0,
    };

    this.getUsers();

    this.addUser(newUser);

    return {
      name: newUser.name,
      index: newUser.id,
      error: false,
      message: "User created",
    };
  }

  addUser(user: User) {
    this.users.push(user);
  }

  getUsers() {
    console.log("Get users", this.users);
    return this.users;
  }

  getWins() {
    return this.users.map(({ name, wins }) => {
      return { name, wins };
    });
  }
}
