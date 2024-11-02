import { UserType } from "@/src/services/types";

export class User implements UserType {
  id: number;
  name: string;
  password: string;
  wins: number;

  constructor(data: string) {
    const { id, name, password, wins } = JSON.parse(data);
    this.id = id;
    this.name = name;
    this.password = password;
    this.wins = wins;
  }
}
